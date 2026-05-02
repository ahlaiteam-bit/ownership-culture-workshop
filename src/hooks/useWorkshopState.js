import { useState, useCallback, useEffect } from 'react'
import { 
  saveUser, 
  getUser, 
  saveModuleResponses, 
  getModuleResponses, 
  generateReport, 
  getProgress,
  clearServerProgress
} from '../utils/appsScriptApi'

const STORAGE_KEY = 'ocw_state'
const EMAIL_KEY = 'ocw_email'

function loadLocalState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveLocalState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) {
    console.warn("Failed to save local state:", e)
  }
}

function createInitialState(profileInput) {
  let profile = profileInput;
  if (!profile || typeof profile !== 'object') {
     profile = { name: (typeof profileInput === 'string' ? profileInput : 'Guest') };
  }
  
  return {
    userName: profile.name || 'Guest',
    userEmail: profile.email || '',
    userProfile: profile,
    modules: {
      1: { status: 'open', answers: {}, report: null },
      2: { status: 'locked', answers: {}, report: null },
      3: { status: 'locked', answers: {}, report: null },
      4: { status: 'locked', answers: {}, report: null },
      5: { status: 'locked', answers: {}, report: null },
      6: { status: 'locked', answers: {}, report: null },
    },
  }
}

export function useWorkshopState() {
  const [state, setState] = useState(null)
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem(EMAIL_KEY))
  const [loading, setLoading] = useState(true)

  // 1. Initial Load from Apps Script or LocalStorage
  useEffect(() => {
    async function loadData() {
      if (!userEmail) {
        setLoading(false)
        return
      }

      try {
        // Try to load from Apps Script
        const result = await getUser(userEmail);
        
        if (result.user) {
          // User exists in Apps Script, reconstruct state from server truth
          const user = result.user;
          const newFetchedState = createInitialState(user.profile);
          newFetchedState.userName = user.name;
          newFetchedState.userEmail = user.email;
          
          user.completedModules?.forEach(moduleId => {
            if (newFetchedState.modules[moduleId]) {
              newFetchedState.modules[moduleId].status = 'completed';
              // NEW: Populate answers and report from server
              if (user.allResponses?.[moduleId]) {
                newFetchedState.modules[moduleId].answers = user.allResponses[moduleId].answers || {};
                newFetchedState.modules[moduleId].report = user.allResponses[moduleId].report || null;
              }
            }
          });
          
          // Also check for partial answers in the "open" module
          const nextModule = (user.completedModules?.length || 0) + 1;
          if (nextModule <= 6 && newFetchedState.modules[nextModule]) {
            newFetchedState.modules[nextModule].status = 'open';
            if (user.allResponses?.[nextModule]) {
              newFetchedState.modules[nextModule].answers = user.allResponses[nextModule].answers || {};
            }
          }
          
          setState(newFetchedState);
          saveLocalState(newFetchedState); // Ensure local is in sync with server truth
        } else {
          // No user data found on server (Email is new or deep-reset)
          // IF we have local data for this email but the server is empty, the server wins (wiping local)
          const local = loadLocalState();
          if (local && local.userEmail === userEmail) {
             // Server has no record of this user, but local does.
             // This means a Deep Reset likely happened on server. Clear local!
             localStorage.removeItem(STORAGE_KEY);
             setState(null);
          } else {
            setLoading(false);
          }
        }
      } catch (err) {
        console.error("Load error:", err);
        // Fallback to local storage
        setState(loadLocalState());
      } finally {
        setLoading(false);
      }
    }

    loadData()
  }, [userEmail])

  // 2. Save answers to Apps Script (background sync)
  const syncAnswersToServer = useCallback(async (email, moduleId, answers) => {
    try {
      const currentState = state;
      const userName = currentState?.userName || '';
      await saveModuleResponses(email, userName, moduleId, answers);
    } catch (err) {
      console.error("Failed to sync answers:", err);
      // Still save locally even if server fails
    }
  }, [state])

  // 3. Save user to Apps Script
  const initUser = useCallback((profile) => {
    const email = profile.email;
    
    localStorage.setItem(EMAIL_KEY, email);
    setUserEmail(email);
    
    const s = createInitialState(profile);
    setState(s);
    
    // Async: Save to Apps Script in background
    saveUser(email, profile.name, profile)
      .catch(err => console.error("Failed to save user:", err));
  }, [])

  // 4. Set individual answer
  const setAnswer = useCallback((moduleId, questionId, value) => {
    if (!state) return;
    
    const next = {
      ...state,
      modules: {
        ...state.modules,
        [moduleId]: {
          ...state.modules[moduleId],
          answers: { ...state.modules[moduleId].answers, [questionId]: value },
        },
      },
    };
    
    setState(next);
    saveLocalState(next);
    
    // Async: Sync to server
    syncAnswersToServer(userEmail, moduleId, next.modules[moduleId].answers)
      .catch(err => console.error("Sync failed:", err));
  }, [state, userEmail, syncAnswersToServer])

  // 5. Complete module and generate report
  const completeModule = useCallback(async (moduleId) => {
    if (!state || !userEmail) return;

    try {
      setLoading(true);
      
      // Call Apps Script to generate report
      const reportResult = await generateReport(userEmail, moduleId);
      
      if (!reportResult.success) {
        throw new Error("Failed to generate report");
      }

      const report = reportResult.report;
      
      // Update state
      const next = { ...state, modules: { ...state.modules } };
      next.modules[moduleId] = { 
        ...next.modules[moduleId], 
        status: 'completed', 
        report 
      };
      
      // Unlock next module
      const nextId = moduleId + 1;
      if (nextId <= 6 && next.modules[nextId].status === 'locked') {
        next.modules[nextId] = { ...next.modules[nextId], status: 'open' };
      }
      
      setState(next);
      saveLocalState(next);
      
      setLoading(false);
      return report;
    } catch (err) {
      console.error("Failed to complete module:", err);
      setLoading(false);
      throw err;
    }
  }, [state, userEmail])

  // 6. Get completed modules for progress
  const getCompletedModules = useCallback(async () => {
    if (!userEmail) return [];
    
    try {
      const result = await getProgress(userEmail);
      return result.completedModules || [];
    } catch (err) {
      console.error("Failed to get progress:", err);
      return [];
    }
  }, [userEmail])

  // 7. Save blueprint report locally
  const saveBlueprint = useCallback((report) => {
    if (!state) return;
    const next = { ...state, blueprint: report };
    setState(next);
    saveLocalState(next);
  }, [state])

  // 8. Sync state (from cheat code or elsewhere)
  const syncState = useCallback((newState, email) => {
    setState(newState);
    saveLocalState(newState);
    if (email) {
      localStorage.setItem(EMAIL_KEY, email);
      setUserEmail(email);
    }
  }, [])

  // 9. Reset session / Logout
  const resetSession = useCallback(async () => {
    const deepReset = confirm("Do you also want to clear your progress from the server (start completely fresh)?");
    
    if (deepReset && userEmail) {
      try {
        await clearServerProgress(userEmail);
      } catch (err) {
        console.error("Failed to clear server progress:", err);
      }
    }

    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(EMAIL_KEY);
    setState(null);
    setUserEmail(null);
    window.location.reload();
  }, [userEmail])

  const completedCount = state
    ? Object.values(state.modules).filter((m) => m.status === 'completed').length
    : 0

  return { 
    state, 
    loading, 
    initUser, 
    setAnswer, 
    completeModule, 
    getCompletedModules,
    saveBlueprint,
    syncState,
    resetSession,
    completedCount,
    userEmail
  }
}

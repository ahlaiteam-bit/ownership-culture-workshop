// APPS SCRIPT API INTEGRATION
// This file handles all communication with Google Apps Script backend

const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

// Helper function to call Apps Script
async function callAppsScript(action, payload) {
  try {
    console.log(`[API CALL] Action: ${action}`);
    console.log(`[API PAYLOAD]`, payload);
    
    const body = { action, ...payload };
    console.log(`[API BODY]`, body);
    
    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      mode: "cors",
      credentials: "omit", // Prevents browser cookies from messing with GAS
      body: JSON.stringify(body)
    });

    const result = await response.json();
    console.log(`[API RESPONSE]`, result);
    
    if (!result.success) {
      throw new Error(result.error || "Apps Script error");
    }
    
    return result;
  } catch (error) {
    console.error(`[API ERROR] (${action}):`, error);
    throw error;
  }
}

// ============= USER FUNCTIONS =============

export async function saveUser(userEmail, userName, userProfile) {
  return callAppsScript("saveUser", {
    userEmail,
    userName,
    userProfile
  });
}

export async function getUser(userEmail) {
  return callAppsScript("getUser", {
    userEmail
  });
}

// ============= MODULE RESPONSE FUNCTIONS =============

export async function saveModuleResponses(userEmail, userName, moduleNumber, answers) {
  return callAppsScript("saveModuleResponses", {
    userEmail,
    userName,
    moduleNumber,
    answers
  });
}

export async function getModuleResponses(userEmail, moduleNumber) {
  return callAppsScript("getModuleResponses", {
    userEmail,
    moduleNumber
  });
}

// ============= REPORT GENERATION =============

export async function generateReport(userEmail, moduleNumber) {
  return callAppsScript("generateReport", {
    userEmail,
    moduleNumber,
    openRouterKey: import.meta.env.VITE_OPENROUTER_API_KEY
  });
}

export async function generateBlueprint(userEmail) {
  return callAppsScript("generateBlueprint", { 
    userEmail,
    openRouterKey: import.meta.env.VITE_OPENROUTER_API_KEY
  })
}

export async function uploadBlueprintPdf(userEmail, base64Pdf, fileName) {
  return callAppsScript("uploadBlueprintPdf", { 
    userEmail, 
    base64Pdf,
    fileName
  });
}

// ============= PROGRESS TRACKING =============

export async function getProgress(userEmail) {
  return callAppsScript("getProgress", {
    userEmail
  });
}

export async function clearServerProgress(userEmail) {
  return callAppsScript("clearProgress", {
    userEmail
  });
}

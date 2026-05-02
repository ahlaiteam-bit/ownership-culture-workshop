const FOLDER_NAME = "Ownership Culture Blueprints";

// ---------------------------------------------------------
// INITIAL SETUP FUNCTION - RUN THIS ONCE MANUALLY
// ---------------------------------------------------------
function setupDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Setup Users Sheet
  let usersSheet = ss.getSheetByName("Users");
  if (!usersSheet) {
    usersSheet = ss.insertSheet("Users");
    usersSheet.appendRow([
      "Timestamp", "Name", "Email", "Mobile", "Company", "Role", "Department", 
      "Completed Modules", "Blueprint PDF Link"
    ]);
    usersSheet.getRange("A1:I1").setFontWeight("bold").setBackground("#f3f3f3");
    usersSheet.setFrozenRows(1);
  }

  // 2. Setup 6 Module Sheets
  for (let i = 1; i <= 6; i++) {
    let moduleSheet = ss.getSheetByName(`Module ${i}`);
    if (!moduleSheet) {
      moduleSheet = ss.insertSheet(`Module ${i}`);
      const headers = ["Timestamp", "Email"];
      for (let q = 1; q <= 18; q++) {
        headers.push(`Q${q}`);
      }
      moduleSheet.appendRow(headers);
      moduleSheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#f3f3f3");
      moduleSheet.setFrozenRows(1);
    }
  }
  
  // 3. Setup Drive Folder
  const folders = DriveApp.getFoldersByName(FOLDER_NAME);
  if (!folders.hasNext()) {
    DriveApp.createFolder(FOLDER_NAME);
  }
  
  Logger.log("Database and Drive folder setup complete!");
}

// ---------------------------------------------------------
// MAIN API ENDPOINT
// ---------------------------------------------------------
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;
    let result = { success: false, error: "Unknown action" };

    switch (action) {
      case "saveUser":
        result = saveUser(payload);
        break;
      case "getUser":
        result = getUser(payload);
        break;
      case "saveModuleResponses":
        result = saveModuleResponses(payload);
        break;
      case "getModuleResponses":
        result = getModuleResponses(payload);
        break;
      case "generateReport":
        result = generateReport(payload);
        break;
      case "generateBlueprint":
        result = generateBlueprint(payload);
        break;
      case "getProgress":
        result = getProgress(payload);
        break;
      case "clearProgress":
        result = clearProgress(payload);
        break;
      case "uploadBlueprintPdf":
        result = uploadBlueprintPdf(payload);
        break;
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ---------------------------------------------------------
// HANDLERS
// ---------------------------------------------------------

function saveUser(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("Users");
  if (!sheet) {
    setupDatabase();
    sheet = ss.getSheetByName("Users");
  }
  const data = sheet.getDataRange().getValues();
  const email = payload.userEmail;
  const profile = payload.userProfile;
  
  let rowIndex = -1;
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][2]).trim().toLowerCase() === String(email).trim().toLowerCase()) { // Email is column C (index 2)
      rowIndex = i + 1;
      break;
    }
  }

  if (rowIndex > -1) {
    // Update existing user profile (preserve completed modules and PDF link)
    sheet.getRange(rowIndex, 2).setValue(profile.name);
    sheet.getRange(rowIndex, 4).setValue(profile.mobile || "");
    sheet.getRange(rowIndex, 5).setValue(profile.company || "");
    sheet.getRange(rowIndex, 6).setValue(profile.role || "");
    sheet.getRange(rowIndex, 7).setValue(profile.department || "");
  } else {
    // Create new user
    sheet.appendRow([
      new Date(),
      profile.name,
      email,
      profile.mobile || "",
      profile.company || "",
      profile.role || "",
      profile.department || "",
      "[]", // Initial completed modules
      "" // Empty PDF link
    ]);
  }
  return { success: true };
}

function getUser(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("Users");
  if (!sheet) {
    setupDatabase();
    sheet = ss.getSheetByName("Users");
  }
  const data = sheet.getDataRange().getValues();
  const email = payload.userEmail;
  
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][2]).trim().toLowerCase() === String(email).trim().toLowerCase()) {
      let completedModules = [];
      try {
        completedModules = JSON.parse(data[i][7] || "[]");
      } catch(e) {}
      
      let allResponses = {};
      for (let m = 1; m <= 6; m++) {
        let mResp = getModuleResponses({ userEmail: email, moduleNumber: m });
        if (mResp.success) {
          allResponses[m] = { answers: mResp.answers, report: mResp.report };
        }
      }

      return { 
        success: true, 
        user: {
          name: data[i][1],
          email: data[i][2],
          profile: {
            name: data[i][1],
            email: data[i][2],
            mobile: data[i][3],
            company: data[i][4],
            role: data[i][5],
            department: data[i][6]
          },
          completedModules: completedModules,
          blueprintLink: data[i][8],
          allResponses: allResponses
        }
      };
    }
  }
  return { success: true, user: null }; // Not found
}

function saveModuleResponses(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let moduleSheet = ss.getSheetByName(`Module ${payload.moduleNumber}`);
  let usersSheet = ss.getSheetByName("Users");
  
  if (!moduleSheet || !usersSheet) {
    setupDatabase();
    moduleSheet = ss.getSheetByName(`Module ${payload.moduleNumber}`);
    usersSheet = ss.getSheetByName("Users");
  }

  // 1. Save answers
  const rowData = [new Date(), payload.userEmail];
  // Fill Q1 to Q18
  for (let q = 1; q <= 18; q++) {
    rowData.push(payload.answers[q] || "");
  }
  
  // Check if user already submitted this module, if so, update row, otherwise append
  const mData = moduleSheet.getDataRange().getValues();
  let mRowIndex = -1;
  for (let i = 1; i < mData.length; i++) {
    if (String(mData[i][1]).trim().toLowerCase() === String(payload.userEmail).trim().toLowerCase()) {
      mRowIndex = i + 1;
      break;
    }
  }
  
  if (mRowIndex > -1) {
    moduleSheet.getRange(mRowIndex, 1, 1, rowData.length).setValues([rowData]);
  } else {
    moduleSheet.appendRow(rowData);
  }

  // 2. Update user progress
  const uData = usersSheet.getDataRange().getValues();
  for (let i = 1; i < uData.length; i++) {
    if (String(uData[i][2]).trim().toLowerCase() === String(payload.userEmail).trim().toLowerCase()) {
      let completed = [];
      try { completed = JSON.parse(uData[i][7] || "[]"); } catch(e) {}
      if (!completed.includes(payload.moduleNumber)) {
        completed.push(payload.moduleNumber);
        usersSheet.getRange(i + 1, 8).setValue(JSON.stringify(completed));
      }
      break;
    }
  }

  return { success: true };
}

function getModuleResponses(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const moduleSheet = ss.getSheetByName(`Module ${payload.moduleNumber}`);
  if (!moduleSheet) return { success: true, answers: {} };

  const data = moduleSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][1]).trim().toLowerCase() === String(payload.userEmail).trim().toLowerCase()) {
      const answers = {};
      for (let q = 1; q <= 18; q++) {
        answers[q] = data[i][q + 1]; // Offset by 2 (Timestamp, Email)
      }
      const report = data[i][20] || null; // Column U is index 20
      return { success: true, answers: answers, report: report };
    }
  }
  return { success: true, answers: {}, report: null };
}

function generateReport(payload) {
  const responses = getModuleResponses(payload).answers;
  const user = getUser(payload).user;
  const userName = user ? user.name : "the user";

  const moduleTitles = {
    1: "Current Reality Scan",
    2: "Inner Patterns",
    3: "Professional Identity",
    4: "Goals and Priorities",
    5: "Belief and Behaviour Shift",
    6: "90 Day Growth Plan"
  };
  const moduleTitle = moduleTitles[payload.moduleNumber] || `Module ${payload.moduleNumber}`;

  const prompt = `You are an expert executive coach. Your client, ${userName}, has completed the "${moduleTitle}" module of a professional growth workshop.
Here are their answers:
${JSON.stringify(responses)}

Write a personalized, encouraging 3-paragraph report summarizing their insights. Address them directly by their name (e.g. "Dear ${userName}"). 
You MUST include a section titled "### Guidance" at the end with 2-3 bullet points of actionable advice based on their answers.`;

  const result = callOpenRouter(payload.openRouterKey, prompt);
  
  if (result.success) {
    // Save report to the module sheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let moduleSheet = ss.getSheetByName(`Module ${payload.moduleNumber}`);
    if (moduleSheet) {
      const data = moduleSheet.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][1]).trim().toLowerCase() === String(payload.userEmail).trim().toLowerCase()) {
          moduleSheet.getRange(i + 1, 21).setValue(result.report); // Save report to column U (index 20 / col 21)
          break;
        }
      }
    }
  }

  return result;
}

function generateBlueprint(payload) {
  const user = getUser(payload).user;
  const userName = user ? user.name : "the user";
  
  let allResponses = {};
  for (let m = 1; m <= 6; m++) {
    allResponses[`Module ${m}`] = getModuleResponses({ userEmail: payload.userEmail, moduleNumber: m }).answers;
  }

  const prompt = `You are an expert executive coach. Your client, ${userName}, has finished all 6 modules of a professional growth workshop.
Here are all their answers across the 6 modules:
${JSON.stringify(allResponses)}

Based on this complete profile, generate a comprehensive Professional Growth Blueprint for ${userName}. Address them directly.
You MUST format your response EXACTLY with these 12 headings (use exactly the format '### Section X: Title'):
### Section 1: Current Reality Summary
### Section 2: Top Strengths
### Section 3: Core Growth Areas
### Section 4: Inner Patterns to Break
### Section 5: Professional Identity Vision
### Section 6: Key Priorities
### Section 7: Behavioral Shifts
### Section 8: 90-Day Goals
### Section 9: Month 1 Action Plan
### Section 10: Month 2 Action Plan
### Section 11: Month 3 Action Plan
### Section 12: Long-Term Commitments

Fill each section with 1 to 2 paragraphs or bullet points of highly personalized, encouraging advice directly referencing their answers.`;

  const result = callOpenRouter(payload.openRouterKey, prompt);
  if (result.success) {
    return { success: true, blueprint: result.report };
  }
  return result;
}

function callOpenRouter(apiKey, prompt) {
  if (!apiKey) {
    return { success: false, error: "Missing OpenRouter API Key" };
  }

  const requestBody = {
    "model": "openai/gpt-4o-mini",
    "messages": [
      {"role": "system", "content": "You are a helpful, professional executive coaching assistant."},
      {"role": "user", "content": prompt}
    ]
  };

  const options = {
    "method": "post",
    "headers": {
      "Authorization": "Bearer " + apiKey,
      "Content-Type": "application/json"
    },
    "payload": JSON.stringify(requestBody),
    "muteHttpExceptions": true
  };

  try {
    const response = UrlFetchApp.fetch("https://openrouter.ai/api/v1/chat/completions", options);
    const code = response.getResponseCode();
    const json = JSON.parse(response.getContentText());
    
    if (code >= 200 && code < 300 && json.choices && json.choices.length > 0) {
      return { success: true, report: json.choices[0].message.content };
    } else {
      return { success: false, error: "AI Error: " + (json.error ? JSON.stringify(json.error) : response.getContentText()) };
    }
  } catch (e) {
    return { success: false, error: "Fetch error: " + e.toString() };
  }
}

function getProgress(payload) {
  const userResp = getUser(payload);
  if (userResp.user) {
    return { success: true, completedModules: userResp.user.completedModules };
  }
  return { success: true, completedModules: [] };
}

function clearProgress(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let usersSheet = ss.getSheetByName("Users");
  if (!usersSheet) {
    setupDatabase();
    usersSheet = ss.getSheetByName("Users");
  }
  const data = usersSheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][2]).trim().toLowerCase() === String(payload.userEmail).trim().toLowerCase()) {
      usersSheet.getRange(i + 1, 8).setValue("[]");
      usersSheet.getRange(i + 1, 9).setValue("");
      break;
    }
  }
  
  // Clear from module sheets
  for (let m = 1; m <= 6; m++) {
    const mSheet = ss.getSheetByName(`Module ${m}`);
    if (mSheet) {
      const mData = mSheet.getDataRange().getValues();
      for (let j = mData.length - 1; j >= 1; j--) {
        if (String(mData[j][1]).trim().toLowerCase() === String(payload.userEmail).trim().toLowerCase()) {
          mSheet.deleteRow(j + 1);
        }
      }
    }
  }
  
  return { success: true };
}

function uploadBlueprintPdf(payload) {
  // payload should have userEmail, base64Pdf, fileName
  try {
    const folders = DriveApp.getFoldersByName(FOLDER_NAME);
    let folder;
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(FOLDER_NAME);
    }

    // Decode base64
    const base64Data = payload.base64Pdf.split(',')[1] || payload.base64Pdf;
    const blob = Utilities.newBlob(Utilities.base64Decode(base64Data), 'application/pdf', payload.fileName);
    
    // Create file
    const file = folder.createFile(blob);
    
    // Optional: make it viewable by anyone with the link
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    const fileUrl = file.getUrl();

    // Save to Users sheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const usersSheet = ss.getSheetByName("Users");
    const data = usersSheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][2]).trim().toLowerCase() === String(payload.userEmail).trim().toLowerCase()) {
        usersSheet.getRange(i + 1, 9).setValue(fileUrl);
        break;
      }
    }

    return { success: true, url: fileUrl };
  } catch (err) {
    throw new Error("Failed to upload PDF: " + err.toString());
  }
}

// Required for CORS
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}

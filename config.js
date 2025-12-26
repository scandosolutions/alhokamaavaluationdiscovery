// ========================================
// Configuration File for Al-Hokamaa Evaluation System
// ========================================

const CONFIG = {
    // Google Sheets Configuration
    SPREADSHEET_ID: '1MySbmF_IA13IjtpCs2hRIFkJqWVGxRcdhiahvaEDXao',
    API_KEY: 'AIzaSyDzdM8JaUY5S_We3RN8eBdxUPFEBqtz9sA',
    SHEET_NAME: 'التقييمات', // Sheet name in Arabic
    
    // Google Apps Script Web App URL (CONFIGURED)
    APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbwDWw1Liu9rZXmufhhH6ab6gMUrqWAAU3HPPxBWAaOw15BNeX84IO38U4zdVICVrA-aJA/exec',
    
    // Fallback: Use FormSubmit.co (no setup required)
    USE_FORMSUBMIT: true, // Back to email submissions
    FORMSUBMIT_EMAIL: 'info@alhokamaa.com', // Email to receive submissions
    
    // Google Drive Configuration (for file uploads)
    DRIVE_FOLDER_ID: '', // Will be created dynamically or specified
    
    // API Endpoints
    SHEETS_API_BASE: 'https://sheets.googleapis.com/v4/spreadsheets',
    DRIVE_API_BASE: 'https://www.googleapis.com/upload/drive/v3/files',
    
    // Sheet Column Mapping (will be used to structure data)
    COLUMNS: [
        'timestamp',
        'companyName',
        'businessType',
        'establishmentDate',
        'mainAddress',
        'doc1',
        'doc2',
        'doc3',
        'doc4',
        'file1_url',
        'file2_url',
        'file3_url',
        'file4_url',
        'orgChart',
        'file5_url',
        'authorities',
        'decisionMaking',
        'accountingSystem',
        'accountingSystemOther',
        'auditedBudgets',
        'documentCycle',
        'liquidity',
        'supplyChain',
        'sops',
        'operationalChallenges',
        'itSystems',
        'dataProtection',
        'infrastructure',
        'permanentEmployees',
        'temporaryEmployees',
        'internalRegulations',
        'performanceEvaluation',
        'turnoverRate',
        'additionalNotes'
    ]
};

// Helper function to send data to Google Apps Script
async function sendToAppsScript(data) {
    if (!CONFIG.APPS_SCRIPT_URL || CONFIG.APPS_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
        throw new Error('Google Apps Script URL not configured');
    }
    
    const response = await fetch(CONFIG.APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Required for Apps Script
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    
    return { success: true };
}

// Helper function to send via FormSubmit (fallback)
async function sendViaFormSubmit(data) {
    const formData = new FormData();
    
    // Add all data as form fields
    Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
        }
    });
    
    const response = await fetch(`https://formsubmit.co/${CONFIG.FORMSUBMIT_EMAIL}`, {
        method: 'POST',
        body: formData
    });
    
    return response;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, sendToAppsScript, sendViaFormSubmit };
}

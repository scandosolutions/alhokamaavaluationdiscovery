// ========================================
// Configuration File for Al-Hokamaa Evaluation System
// ========================================

const CONFIG = {
    // Google Sheets Configuration
    SPREADSHEET_ID: '1MySbmF_IA13IjtpCs2hRIFkJqWVGxRcdhiahvaEDXao',
    API_KEY: 'AIzaSyDzdM8JaUY5S_We3RN8eBdxUPFEBqtz9sA',
    SHEET_NAME: 'التقييمات', // Sheet name in Arabic
    
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

// Helper function to get full API URL for sheets
function getSheetsUrl(action = 'append') {
    return `${CONFIG.SHEETS_API_BASE}/${CONFIG.SPREADSHEET_ID}/values/${CONFIG.SHEET_NAME}:${action}?valueInputOption=RAW&key=${CONFIG.API_KEY}`;
}

// Helper function to initialize sheet with headers
async function initializeSheet() {
    const headerUrl = `${CONFIG.SHEETS_API_BASE}/${CONFIG.SPREADSHEET_ID}/values/${CONFIG.SHEET_NAME}!A1:AH1?key=${CONFIG.API_KEY}`;
    
    try {
        // Check if headers exist
        const response = await fetch(headerUrl);
        const data = await response.json();
        
        if (!data.values || data.values.length === 0) {
            // Create headers in Arabic
            const headers = [
                'التاريخ والوقت',
                'اسم الشركة',
                'نوع النشاط',
                'تاريخ التأسيس',
                'العنوان الرئيسي',
                'السجل التجاري (نعم/لا)',
                'البطاقة الضريبية (نعم/لا)',
                'عقود الاستثمار (نعم/لا)',
                'التراخيص التشغيلية (نعم/لا)',
                'رابط السجل التجاري',
                'رابط البطاقة الضريبية',
                'رابط عقود الاستثمار',
                'رابط التراخيص',
                'هيكل تنظيمي معتمد',
                'رابط الهيكل التنظيمي',
                'أصحاب الصلاحيات',
                'اتخاذ القرارات الاستراتيجية',
                'النظام المحاسبي',
                'نظام محاسبي آخر',
                'ميزانيات مدققة',
                'الدورة المستندية',
                'السيولة المالية',
                'سلسلة التوريد',
                'أدلة السياسات SOPs',
                'التحديات التشغيلية',
                'البرامج والتقنيات',
                'حماية البيانات',
                'البنية التحتية',
                'عدد الموظفين الدائمين',
                'عدد الموظفين المؤقتين',
                'اللائحة الداخلية',
                'تقييم الأداء وسلم الرواتب',
                'نسبة دوران العمالة',
                'ملاحظات إضافية'
            ];
            
            // Append headers
            const appendUrl = `${CONFIG.SHEETS_API_BASE}/${CONFIG.SPREADSHEET_ID}/values/${CONFIG.SHEET_NAME}:append?valueInputOption=RAW&key=${CONFIG.API_KEY}`;
            
            await fetch(appendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    values: [headers]
                })
            });
            
            console.log('Sheet headers initialized successfully');
        }
    } catch (error) {
        console.error('Error initializing sheet:', error);
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, getSheetsUrl, initializeSheet };
}

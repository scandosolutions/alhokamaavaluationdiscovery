// ========================================
// Al-Hokamaa Evaluation Form - Main Application Logic
// ========================================

let currentSection = 1;
const totalSections = 6;
let uploadedFiles = {};

// ========== Initialization ==========
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    updateProgress();
    handleConditionalFields();
    checkConfiguration();
});

// Check if configuration is set up
function checkConfiguration() {
    const banner = document.getElementById('infoBanner');
    const bannerText = document.getElementById('bannerText');
    
    if (CONFIG.USE_FORMSUBMIT) {
        console.log('✅ Using FormSubmit.co as backend (no setup required)');
        console.log('📧 Submissions will be sent to:', CONFIG.FORMSUBMIT_EMAIL);
        bannerText.textContent = 'النظام جاهز! البيانات ستُرسل إلى البريد الإلكتروني: ' + CONFIG.FORMSUBMIT_EMAIL;
        banner.style.display = 'block';
    } else if (CONFIG.APPS_SCRIPT_URL && CONFIG.APPS_SCRIPT_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
        console.log('✅ Using Google Apps Script as backend');
        bannerText.textContent = 'متصل بـ Google Sheets مباشرة';
        banner.style.display = 'block';
    } else {
        console.warn('⚠️ No backend configured! Please set up Google Apps Script or enable FormSubmit in config.js');
        bannerText.textContent = '⚠️ لم يتم إعداد النظام بعد. راجع GOOGLE_APPS_SCRIPT_SETUP.md';
        banner.style.background = '#FFF9E6';
        banner.style.borderColor = '#ffc107';
        banner.style.display = 'block';
    }
}

// ========== Event Listeners Setup ==========
function setupEventListeners() {
    // Navigation buttons
    document.getElementById('nextBtn').addEventListener('click', nextSection);
    document.getElementById('prevBtn').addEventListener('click', prevSection);
    document.getElementById('evaluationForm').addEventListener('submit', handleSubmit);
    
    // File input handlers
    setupFileInputs();
    
    // Conditional field handlers
    document.getElementById('accountingSystem').addEventListener('change', handleConditionalFields);
    
    // Auto-save functionality (optional)
    setInterval(autoSave, 60000); // Auto-save every minute
}

// ========== File Input Handlers ==========
function setupFileInputs() {
    for (let i = 1; i <= 5; i++) {
        const fileInput = document.getElementById(`file${i}`);
        if (fileInput) {
            fileInput.addEventListener('change', function(e) {
                handleFileSelection(e, i);
            });
        }
    }
}

function handleFileSelection(event, fileNumber) {
    const file = event.target.files[0];
    const fileNameSpan = document.getElementById(`fileName${fileNumber}`);
    
    if (file) {
        // Store file temporarily
        uploadedFiles[`file${fileNumber}`] = file;
        
        // Display file name
        fileNameSpan.textContent = file.name;
        fileNameSpan.style.color = 'var(--success)';
        
        // Update checkbox if exists
        const checkbox = document.getElementById(`doc${fileNumber}`);
        if (checkbox) {
            checkbox.checked = true;
        }
    } else {
        fileNameSpan.textContent = '';
        delete uploadedFiles[`file${fileNumber}`];
    }
}

// ========== Navigation Functions ==========
function nextSection() {
    if (validateCurrentSection()) {
        if (currentSection < totalSections) {
            // Hide current section
            document.querySelector(`.form-section[data-section="${currentSection}"]`).classList.remove('active');
            
            // Mark current step as completed
            document.querySelector(`.step[data-step="${currentSection}"]`).classList.add('completed');
            
            // Move to next section
            currentSection++;
            
            // Show next section
            document.querySelector(`.form-section[data-section="${currentSection}"]`).classList.add('active');
            
            // Update active step
            updateActiveStep();
            
            // Update UI
            updateProgress();
            updateButtons();
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
}

function prevSection() {
    if (currentSection > 1) {
        // Hide current section
        document.querySelector(`.form-section[data-section="${currentSection}"]`).classList.remove('active');
        
        // Move to previous section
        currentSection--;
        
        // Show previous section
        document.querySelector(`.form-section[data-section="${currentSection}"]`).classList.add('active');
        
        // Update active step
        updateActiveStep();
        
        // Update UI
        updateProgress();
        updateButtons();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function updateActiveStep() {
    // Remove active from all steps
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Add active to current step
    document.querySelector(`.step[data-step="${currentSection}"]`).classList.add('active');
}

function updateProgress() {
    const progressPercentage = (currentSection / totalSections) * 100;
    document.getElementById('progressFill').style.width = progressPercentage + '%';
}

function updateButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    // Show/hide previous button
    prevBtn.style.display = currentSection === 1 ? 'none' : 'inline-flex';
    
    // Show/hide next and submit buttons
    if (currentSection === totalSections) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-flex';
    } else {
        nextBtn.style.display = 'inline-flex';
        submitBtn.style.display = 'none';
    }
}

// ========== Validation ==========
function validateCurrentSection() {
    const currentSectionElement = document.querySelector(`.form-section[data-section="${currentSection}"]`);
    const requiredFields = currentSectionElement.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        // Remove previous error states
        field.classList.remove('error');
        const existingError = field.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Check if field is empty
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
            
            // Add error message
            const errorMsg = document.createElement('span');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'هذا الحقل مطلوب';
            field.parentElement.appendChild(errorMsg);
        }
    });
    
    if (!isValid) {
        // Scroll to first error
        const firstError = currentSectionElement.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    return isValid;
}

// ========== Conditional Fields ==========
function handleConditionalFields() {
    const accountingSystem = document.getElementById('accountingSystem').value;
    const otherField = document.getElementById('accountingSystemOther');
    
    if (accountingSystem === 'other') {
        otherField.style.display = 'block';
        otherField.required = true;
    } else {
        otherField.style.display = 'none';
        otherField.required = false;
        otherField.value = '';
    }
}

// ========== Form Submission ==========
async function handleSubmit(event) {
    event.preventDefault();
    
    if (!validateCurrentSection()) {
        return;
    }
    
    // Show loading state
    const submitBtn = document.getElementById('submitBtn');
    const submitText = submitBtn.querySelector('.submit-text');
    const submitLoader = submitBtn.querySelector('.submit-loader');
    
    submitBtn.disabled = true;
    submitText.style.display = 'none';
    submitLoader.style.display = 'inline-block';
    
    try {
        // Step 1: Upload files to Google Drive (if any)
        const fileUrls = await uploadFilesToDrive();
        
        // Step 2: Collect form data
        const formData = collectFormData(fileUrls);
        
        // Step 3: Send to Google Sheets
        await sendToGoogleSheets(formData);
        
        // Step 4: Show success message
        showSuccessMessage();
        
    } catch (error) {
        console.error('Submission error:', error);
        alert('حدث خطأ أثناء إرسال الاستبيان. يرجى المحاولة مرة أخرى.');
        
        // Reset button state
        submitBtn.disabled = false;
        submitText.style.display = 'inline';
        submitLoader.style.display = 'none';
    }
}

function collectFormData(fileUrls) {
    const form = document.getElementById('evaluationForm');
    const formData = new FormData(form);
    
    // Create data object with descriptive keys
    const data = {
        '_subject': 'استبيان تقييم شركة جديد - ' + formData.get('companyName'),
        'timestamp': new Date().toLocaleString('ar-EG'),
        'companyName': formData.get('companyName'),
        'businessType': formData.get('businessType'),
        'establishmentDate': formData.get('establishmentDate'),
        'mainAddress': formData.get('mainAddress'),
        'doc1': formData.get('doc1') ? 'نعم' : 'لا',
        'doc2': formData.get('doc2') ? 'نعم' : 'لا',
        'doc3': formData.get('doc3') ? 'نعم' : 'لا',
        'doc4': formData.get('doc4') ? 'نعم' : 'لا',
        'file1_url': fileUrls.file1 || '',
        'file2_url': fileUrls.file2 || '',
        'file3_url': fileUrls.file3 || '',
        'file4_url': fileUrls.file4 || '',
        'orgChart': formData.get('orgChart'),
        'file5_url': fileUrls.file5 || '',
        'authorities': formData.get('authorities'),
        'decisionMaking': formData.get('decisionMaking'),
        'accountingSystem': formData.get('accountingSystem'),
        'accountingSystemOther': formData.get('accountingSystemOther') || '',
        'auditedBudgets': formData.get('auditedBudgets'),
        'documentCycle': formData.get('documentCycle'),
        'liquidity': formData.get('liquidity'),
        'supplyChain': formData.get('supplyChain'),
        'sops': formData.get('sops'),
        'operationalChallenges': formData.get('operationalChallenges'),
        'itSystems': formData.get('itSystems'),
        'dataProtection': formData.get('dataProtection'),
        'infrastructure': formData.get('infrastructure'),
        'permanentEmployees': formData.get('permanentEmployees'),
        'temporaryEmployees': formData.get('temporaryEmployees'),
        'internalRegulations': formData.get('internalRegulations'),
        'performanceEvaluation': formData.get('performanceEvaluation'),
        'turnoverRate': formData.get('turnoverRate'),
        'additionalNotes': formData.get('additionalNotes') || ''
    };
    
    return data;
}

async function sendToGoogleSheets(formDataObject) {
    // Try Google Apps Script first (if configured)
    if (!CONFIG.USE_FORMSUBMIT && CONFIG.APPS_SCRIPT_URL && CONFIG.APPS_SCRIPT_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
        try {
            await sendToAppsScript(formDataObject);
            return { success: true, method: 'apps-script' };
        } catch (error) {
            console.error('Apps Script failed, falling back to FormSubmit:', error);
        }
    }
    
    // Use FormSubmit as fallback or primary method
    if (CONFIG.USE_FORMSUBMIT) {
        const response = await sendViaFormSubmit(formDataObject);
        if (response.ok || response.status === 0) { // status 0 is ok for form redirects
            return { success: true, method: 'formsubmit' };
        }
        throw new Error('Failed to send data via FormSubmit');
    }
    
    throw new Error('No backend service configured');
}

// ========== File Upload to Google Drive ==========
async function uploadFilesToDrive() {
    const fileUrls = {};
    
    // Note: Direct file upload to Google Drive requires OAuth2 authentication
    // For now, we'll create placeholder URLs
    // In production, you would need to:
    // 1. Implement Google OAuth2 authentication
    // 2. Use Google Drive API with proper credentials
    // 3. Upload files and get shareable links
    
    for (const [key, file] of Object.entries(uploadedFiles)) {
        if (file) {
            // Placeholder: In production, upload to Google Drive
            // For now, we'll store file info as a note
            fileUrls[key] = `[ملف مرفق: ${file.name} (${formatFileSize(file.size)})]`;
            
            // TODO: Implement actual Google Drive upload
            // const driveUrl = await uploadToDrive(file);
            // fileUrls[key] = driveUrl;
        }
    }
    
    return fileUrls;
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// ========== Success Message ==========
function showSuccessMessage() {
    document.querySelector('.form-container').style.display = 'none';
    document.querySelector('.progress-container').style.display = 'none';
    document.getElementById('successMessage').style.display = 'block';
}

// ========== Auto-save (Optional) ==========
function autoSave() {
    const formData = new FormData(document.getElementById('evaluationForm'));
    const dataObject = Object.fromEntries(formData.entries());
    
    // Save to localStorage
    localStorage.setItem('evaluationFormDraft', JSON.stringify({
        section: currentSection,
        data: dataObject,
        timestamp: new Date().toISOString()
    }));
}

// Load saved draft on page load
function loadDraft() {
    const draft = localStorage.getItem('evaluationFormDraft');
    if (draft) {
        const { section, data, timestamp } = JSON.parse(draft);
        
        // Ask user if they want to restore
        const restore = confirm('تم العثور على نسخة محفوظة من الاستبيان. هل تريد استكمالها؟');
        
        if (restore) {
            // Restore form data
            Object.entries(data).forEach(([key, value]) => {
                const field = document.querySelector(`[name="${key}"]`);
                if (field) {
                    field.value = value;
                }
            });
            
            // Jump to saved section
            if (section > 1) {
                currentSection = section;
                document.querySelector('.form-section.active').classList.remove('active');
                document.querySelector(`.form-section[data-section="${currentSection}"]`).classList.add('active');
                updateActiveStep();
                updateProgress();
                updateButtons();
            }
        } else {
            localStorage.removeItem('evaluationFormDraft');
        }
    }
}

// Check for draft on load
window.addEventListener('load', loadDraft);

// Clear draft on successful submission
function clearDraft() {
    localStorage.removeItem('evaluationFormDraft');
}

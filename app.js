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
    
    console.log('✅ Email submission system ready');
    console.log('📧 Submissions will be sent to:', CONFIG.FORMSUBMIT_EMAIL);
    bannerText.textContent = 'النظام جاهز! البيانات والمرفقات ستُرسل إلى البريد الإلكتروني: ' + CONFIG.FORMSUBMIT_EMAIL;
    banner.style.display = 'block';
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
        // Send to email with attachments
        await sendViaEmail();
        
        // Show success message
        showSuccessMessage();
        clearDraft();
        
    } catch (error) {
        console.error('Submission error:', error);
        alert('حدث خطأ أثناء إرسال الاستبيان. يرجى المحاولة مرة أخرى.');
        
        // Reset button state
        submitBtn.disabled = false;
        submitText.style.display = 'inline';
        submitLoader.style.display = 'none';
    }
}

async function sendViaEmail() {
    const form = document.getElementById('evaluationForm');
    const formData = new FormData(form);
    
    // Create a new FormData with proper structure for FormSubmit
    const emailFormData = new FormData();
    
    // Add subject
    emailFormData.append('_subject', 'استبيان تقييم شركة جديد - ' + formData.get('companyName'));
    
    // Add all form fields with Arabic labels
    emailFormData.append('التاريخ_والوقت', new Date().toLocaleString('ar-EG'));
    emailFormData.append('اسم_الشركة', formData.get('companyName') || '');
    emailFormData.append('نوع_النشاط', formData.get('businessType') || '');
    emailFormData.append('تاريخ_التأسيس', formData.get('establishmentDate') || '');
    emailFormData.append('العنوان_الرئيسي', formData.get('mainAddress') || '');
    
    // Section 1: Documents
    emailFormData.append('السجل_التجاري', formData.get('doc1') ? 'نعم' : 'لا');
    emailFormData.append('البطاقة_الضريبية', formData.get('doc2') ? 'نعم' : 'لا');
    emailFormData.append('عقود_الاستثمار', formData.get('doc3') ? 'نعم' : 'لا');
    emailFormData.append('التراخيص_التشغيلية', formData.get('doc4') ? 'نعم' : 'لا');
    
    // Add file attachments
    for (const [key, file] of Object.entries(uploadedFiles)) {
        if (file) {
            emailFormData.append('attachment', file, file.name);
        }
    }
    
    // Section 2: Organizational Structure
    emailFormData.append('هيكل_تنظيمي_معتمد', formData.get('orgChart') || '');
    emailFormData.append('أصحاب_الصلاحيات', formData.get('authorities') || '');
    emailFormData.append('اتخاذ_القرارات', formData.get('decisionMaking') || '');
    
    // Section 3: Financial
    emailFormData.append('النظام_المحاسبي', formData.get('accountingSystem') || '');
    if (formData.get('accountingSystemOther')) {
        emailFormData.append('نظام_محاسبي_آخر', formData.get('accountingSystemOther'));
    }
    emailFormData.append('ميزانيات_مدققة', formData.get('auditedBudgets') || '');
    emailFormData.append('الدورة_المستندية', formData.get('documentCycle') || '');
    emailFormData.append('السيولة_المالية', formData.get('liquidity') || '');
    
    // Section 4: Operations
    emailFormData.append('سلسلة_التوريد', formData.get('supplyChain') || '');
    emailFormData.append('أدلة_السياسات', formData.get('sops') || '');
    emailFormData.append('التحديات_التشغيلية', formData.get('operationalChallenges') || '');
    
    // Section 5: IT Systems
    emailFormData.append('البرامج_والتقنيات', formData.get('itSystems') || '');
    emailFormData.append('حماية_البيانات', formData.get('dataProtection') || '');
    emailFormData.append('البنية_التحتية', formData.get('infrastructure') || '');
    
    // Section 6: HR
    emailFormData.append('عدد_الموظفين_الدائمين', formData.get('permanentEmployees') || '');
    emailFormData.append('عدد_الموظفين_المؤقتين', formData.get('temporaryEmployees') || '');
    emailFormData.append('اللائحة_الداخلية', formData.get('internalRegulations') || '');
    emailFormData.append('تقييم_الأداء', formData.get('performanceEvaluation') || '');
    emailFormData.append('نسبة_دوران_العمالة', formData.get('turnoverRate') || '');
    
    if (formData.get('additionalNotes')) {
        emailFormData.append('ملاحظات_إضافية', formData.get('additionalNotes'));
    }
    
    // Send to FormSubmit
    const response = await fetch(CONFIG.FORMSUBMIT_URL, {
        method: 'POST',
        body: emailFormData
    });
    
    // FormSubmit redirects on success, so any response is considered success
    return { success: true };
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

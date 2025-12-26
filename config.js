// ========================================
// Configuration File for Al-Hokamaa Evaluation System
// Email-Based Submission System
// ========================================

const CONFIG = {
    // Email Configuration
    FORMSUBMIT_EMAIL: 'info@alhokamaa.com', // Email to receive submissions
    FORMSUBMIT_URL: 'https://formsubmit.co/info@alhokamaa.com',
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG };
}

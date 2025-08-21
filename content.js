// content.js - Basic job tracker (no ES6 modules)

class JobTracker {
    constructor() {
        this.isVisible = false;
        this.init();
    }

    init() {
        // Only add button if we're on a job site
        if (this.isJobSite()) {
            this.createTrackButton();
        }
    }

    isJobSite() {
        const hostname = window.location.hostname.toLowerCase();
        const jobSites = ['linkedin.com', 'indeed.com', 'glassdoor.com', 'monster.com'];
        return jobSites.some(site => hostname.includes(site));
    }

    createTrackButton() {
        // Don't create if button already exists
        if (document.getElementById('job-tracker-btn')) {
            return;
        }

        const button = document.createElement('button');
        button.id = 'job-tracker-btn';
        button.innerHTML = '📝 Track Job';
        button.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        background: #4285f4;
        color: white;
        border: none;
        padding: 12px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transition: all 0.3s ease;
        `;

        button.addEventListener('click', () => this.handleTrackJob());
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.05)';
            button.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
        });
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        });

        document.body.appendChild(button);
        console.log('✅ Job tracker button added');
    }

    async handleTrackJob() {
        const button = document.getElementById('job-tracker-btn');
        button.innerHTML = '⏳ Tracking...';
        button.disabled = true;

        try {
            // Extract job data
            const jobData = this.extractJobData();
            console.log('Job data extracted:', jobData);

            // Send to background script for Sheets integration
            chrome.runtime.sendMessage({
                action: 'saveJobData',
                jobData: jobData
            }, (response) => {
                if (response && response.success) {
                    this.showMessage(`✅ Saved: ${jobData.title} at ${jobData.company}`, 'success');
                    button.innerHTML = '✅ Saved!';
                } else {
                    this.showMessage(`❌ Error saving to sheets`, 'error');
                    button.innerHTML = '❌ Error';
                }
            });

        } catch (error) {
            console.error('Error tracking job:', error);
            this.showMessage(`❌ Error: ${error.message}`, 'error');
            button.innerHTML = '❌ Error';
        }

        // Reset button after delay
        setTimeout(() => {
            button.innerHTML = '📝 Track Job';
            button.disabled = false;
        }, 3000);
    }

    extractJobData() {
        const hostname = window.location.hostname.toLowerCase();

        if (hostname.includes('linkedin')) {
            return this.extractLinkedInData();
        } else if (hostname.includes('indeed')) {
            return this.extractIndeedData();
        } else {
            return this.extractGenericData();
        }
    }

    extractLinkedInData() {
        return {
            title: document.querySelector('.job-details-jobs-unified-top-card__job-title' )?.textContent?.trim() || 'Unknown Title',
            company: document.querySelector('.job-details-jobs-unified-top-card__company-name')?.textContent?.trim() || 'Unknown Company',
            url: window.location.href,
            site: 'LinkedIn'
        };
    }

    extractIndeedData() {
        return {
            title: document.querySelector('[data-testid="jobsearch-JobInfoHeader-title"]')?.textContent?.trim() || 'Unknown Title',
            company: document.querySelector('[data-testid="inlineHeader-companyName"]')?.textContent?.trim() || 'Unknown Company',
            url: window.location.href,
            site: 'Indeed'
        };
    }

    extractGenericData() {
        // Try common selectors
        const title = document.querySelector('h1')?.textContent?.trim() || 'Unknown Title';
        const company = document.title.split(' - ')[1] || 'Unknown Company';

        return {
            title: title.substring(0, 100), // Limit length
            company: company.substring(0, 100),
            url: window.location.href,
            site: window.location.hostname
        };
    }

    showMessage(text, type) {
        const message = document.createElement('div');
        message.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        z-index: 10001;
        padding: 12px 16px;
        border-radius: 6px;
        color: white;
        font-size: 14px;
        font-weight: bold;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        background: ${type === 'success' ? '#4caf50' : '#f44336'};
        `;
        message.textContent = text;

        document.body.appendChild(message);

        setTimeout(() => {
            if (message.parentNode) {
                document.body.removeChild(message);
            }
        }, 3000);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new JobTracker());
} else {
    new JobTracker();
}

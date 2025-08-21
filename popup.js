// popup.js - Options popup functionality

class OptionsPopup {
    constructor() {
        this.init();
    }

    async init() {
        // Load current settings
        await this.loadCurrentSettings();

        // Setup event listeners
        document.getElementById('saveBtn').addEventListener('click', () => this.saveSettings());
        document.getElementById('testBtn').addEventListener('click', () => this.testConnection());
        document.getElementById('helpLink').addEventListener('click', (e) => {
            e.preventDefault();
            this.showHelp();
        });

        // Auto-save on Enter key
        document.getElementById('sheetId').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.saveSettings();
            }
        });
    }

    async loadCurrentSettings() {
        try {
            const result = await chrome.storage.sync.get('sheetId');
            if (result.sheetId) {
                document.getElementById('sheetId').value = result.sheetId;
                document.getElementById('currentSheetId').textContent = result.sheetId;
                document.getElementById('currentSheet').style.display = 'block';
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

    async saveSettings() {
        const sheetId = document.getElementById('sheetId').value.trim();
        const saveBtn = document.getElementById('saveBtn');

        if (!sheetId) {
            this.showStatus('Please enter a Sheet ID', 'error');
            return;
        }

        // Validate sheet ID format (Google Sheets IDs are alphanumeric with hyphens/underscores)
        if (!this.isValidSheetId(sheetId)) {
            this.showStatus('Invalid Sheet ID format', 'error');
            return;
        }

        // Show loading state
        saveBtn.textContent = 'Saving...';
        saveBtn.disabled = true;

        try {
            // Save to Chrome storage
            await chrome.storage.sync.set({ sheetId: sheetId });

            // Update UI
            document.getElementById('currentSheetId').textContent = sheetId;
            document.getElementById('currentSheet').style.display = 'block';

            this.showStatus('Settings saved successfully!', 'success');

        } catch (error) {
            console.error('Error saving settings:', error);
            this.showStatus('Error saving settings', 'error');
        } finally {
            // Reset button
            saveBtn.textContent = 'Save Settings';
            saveBtn.disabled = false;
        }
    }

    async testConnection() {
        const sheetId = document.getElementById('sheetId').value.trim();
        const testBtn = document.getElementById('testBtn');

        if (!sheetId) {
            this.showStatus('Please enter a Sheet ID first', 'error');
            return;
        }

        // Show loading state
        testBtn.textContent = 'Testing...';
        testBtn.disabled = true;

        try {
            // Send test message to background script
            const response = await chrome.runtime.sendMessage({
                action: 'testConnection',
                sheetId: sheetId
            });

            if (response && response.success) {
                this.showStatus('✅ Connection successful!', 'success');
            } else {
                this.showStatus('❌ Connection failed: ' + (response?.error || 'Unknown error'), 'error');
            }

        } catch (error) {
            console.error('Error testing connection:', error);
            this.showStatus('❌ Test failed: ' + error.message, 'error');
        } finally {
            // Reset button
            testBtn.textContent = 'Test Connection';
            testBtn.disabled = false;
        }
    }

    isValidSheetId(sheetId) {
        // Google Sheets IDs are typically 44 characters, alphanumeric with hyphens and underscores
        const pattern = /^[a-zA-Z0-9_-]{30,50}$/;
        return pattern.test(sheetId);
    }

    showStatus(message, type) {
        const statusDiv = document.getElementById('status');
        statusDiv.textContent = message;
        statusDiv.className = `status ${type} show`;

        // Hide after 3 seconds
        setTimeout(() => {
            statusDiv.classList.remove('show');
        }, 3000);
    }

    showHelp() {
        alert(`To find your Google Sheets ID:

            1. Open your Google Sheet
            2. Look at the URL in your browser
            3. Copy the long ID between "/d/" and "/edit"

            Example:
            https://docs.google.com/spreadsheets/d/1Rkddcxs28pRSJ3S3wC0--AueWg6_ufjQjPCePl98mPM/edit

            The ID is: 1Rkddcxs28pRSJ3S3wC0--AueWg6_ufjQjPCePl98mPM`);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new OptionsPopup());
} else {
    new OptionsPopup();
}

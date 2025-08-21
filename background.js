console.log('Background script loaded');

class GoogleSheetsService {
    constructor() {
        // Remove hardcoded sheet ID - now loaded from storage
        this.spreadsheetId = null;
        this.sheetsApiBase = 'https://sheets.googleapis.com/v4/spreadsheets';
        this.accessToken = null;
    }

    async getSheetId() {
        if (this.spreadsheetId) {
            return this.spreadsheetId;
        }

        try {
            const result = await chrome.storage.sync.get('sheetId');
            if (result.sheetId) {
                this.spreadsheetId = result.sheetId;
                return this.spreadsheetId;
            } else {
                // Fallback to your original sheet ID if nothing stored
                this.spreadsheetId = '1Rkddcxs28pRSJ3S3wC0--AueWg6_ufjQjPCePl98mPM';
                return this.spreadsheetId;
            }
        } catch (error) {
            // Use fallback on error
            this.spreadsheetId = '1Rkddcxs28pRSJ3S3wC0--AueWg6_ufjQjPCePl98mPM';
            return this.spreadsheetId;
        }
    }

    async getAuthToken() {
        return new Promise((resolve, reject) => {
            chrome.identity.getAuthToken({ interactive: true }, (token) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message || 'Auth failed'));
                } else if (token) {
                    this.accessToken = token;
                    resolve(token);
                } else {
                    reject(new Error('No token received'));
                }
            });
        });
    }

    async getFirstSheetName() {
        const response = await fetch(`${this.sheetsApiBase}/${this.spreadsheetId}`, {
            headers: { 'Authorization': `Bearer ${this.accessToken}` }
        });
        const data = await response.json();
        return data.sheets[0].properties.title;
    }

    async addJobData(jobData) {
        try {
            // Get sheet ID from storage
            const sheetId = await this.getSheetId();

            if (!this.accessToken) {
                await this.getAuthToken();
            }

            if (sheetId) {
                this.spreadsheetId = sheetId;
            }

            // Format data for the specific columns in your sheet
            // Date|Role|Company|Application Status|Location|Cover Letter|App URL|Internal Contact|Email
            const currentDate = new Date().toLocaleDateString('en-US'); // M/D/YYYY format
            const rowData = [
                currentDate,           // Date
                jobData.title || '',   // Role (fixed: was jobData.role)
                jobData.company || '', // Company
                'Applied',            // Application Status
                '',                   // Location (empty)
                '',                   // Cover Letter (empty)
                jobData.url || '',    // App URL
                '',                   // Internal Contact (empty)
                ''                    // Email (empty)
            ];

            const sheetName = await this.getFirstSheetName();
            const response = await fetch(
                `${this.sheetsApiBase}/${this.spreadsheetId}/values/${sheetName}:append?valueInputOption=USER_ENTERED`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        values: [rowData]
                    })
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Sheets API error: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            return result;

        } catch (error) {
            throw error;
        }
    }

    async testConnection(customSheetId = null) {
        try {
            // Use custom sheet ID if provided (from popup test), otherwise get from storage
            const sheetId = customSheetId || await this.getSheetId();

            // Get auth token
            if (!this.accessToken) {
                await this.getAuthToken();
            }

            // Test by getting sheet metadata
            const response = await fetch(
                `${this.sheetsApiBase}/${sheetId}?fields=properties.title`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`
                    }
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Connection test failed: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            return { success: true, title: result.properties.title };

        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

// Listen for messages from content script and popup
chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
    if (request.action === 'saveJobData') {
        const sheetsService = new GoogleSheetsService();

        sheetsService.addJobData(request.jobData)
            .then((result) => {
                sendResponse({ success: true });
            })
            .catch((error) => {
                sendResponse({ success: false, error: error.message });
            });

        return true; // Keep message channel open for async response
    }

    if (request.action === 'testConnection') {
        const sheetsService = new GoogleSheetsService();

        sheetsService.testConnection(request.sheetId)
            .then((result) => {
                sendResponse(result);
            })
            .catch((error) => {
                sendResponse({ success: false, error: error.message });
            });

        return true; // Keep message channel open for async response
    }
});

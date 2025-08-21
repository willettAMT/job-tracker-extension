console.log('Background script loaded');

class GoogleSheetsService {
    constructor() {
        // Remove hardcoded sheet ID - now loaded from storage
        this.spreadsheetId = null;
        this.sheetsApiBase = 'https://sheets.googleapis.com/v4/spreadsheets';
        this.accessToken = null;
        console.log('GoogleSheetsService created');
    }

    async getSheetId() {
        if (this.spreadsheetId) {
            return this.spreadsheetId;
        }

        try {
            const result = await chrome.storage.sync.get('sheetId');
            if (result.sheetId) {
                this.spreadsheetId = result.sheetId;
                console.log('Sheet ID loaded from storage:', this.spreadsheetId);
                return this.spreadsheetId;
            } else {
                // Fallback to your original sheet ID if nothing stored
                this.spreadsheetId = '1Rkddcxs28pRSJ3S3wC0--AueWg6_ufjQjPCePl98mPM';
                console.log('Using fallback sheet ID:', this.spreadsheetId);
                return this.spreadsheetId;
            }
        } catch (error) {
            console.error('Error getting sheet ID:', error);
            // Use fallback on error
            this.spreadsheetId = '1Rkddcxs28pRSJ3S3wC0--AueWg6_ufjQjPCePl98mPM';
            return this.spreadsheetId;
        }
    }

    async getAuthToken() {
        console.log('Getting auth token...');
        return new Promise((resolve, reject) => {
            chrome.identity.getAuthToken({ interactive: true }, (token) => {
                console.log('Auth token response:', token ? 'SUCCESS' : 'FAILED');
                if (chrome.runtime.lastError) {
                    console.error('Auth error:', chrome.runtime.lastError);
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
        console.log('Adding job data:', jobData);

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

            console.log('Formatted row data:', rowData);

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

            console.log('Sheets API response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Sheets API error response:', errorText);
                throw new Error(`Sheets API error: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            console.log('Sheets API success result:', result);
            return result;

        } catch (error) {
            console.error('Error in addJobData:', error);
            throw error;
        }
    }

    async testConnection(customSheetId = null) {
        console.log('Testing connection...');

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
            console.log('✅ Connection test successful:', result.properties.title);
            return { success: true, title: result.properties.title };

        } catch (error) {
            console.error('❌ Connection test failed:', error);
            return { success: false, error: error.message };
        }
    }
}

// Listen for messages from content script and popup
chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
    console.log('Background received message:', request);

    if (request.action === 'saveJobData') {
        console.log('Processing saveJobData request');
        const sheetsService = new GoogleSheetsService();

        sheetsService.addJobData(request.jobData)
            .then((result) => {
                console.log('✅ Successfully saved to sheets:', result);
                sendResponse({ success: true });
            })
            .catch((error) => {
                console.error('❌ Error saving to sheets:', error);
                sendResponse({ success: false, error: error.message });
            });

        return true; // Keep message channel open for async response
    }

    if (request.action === 'testConnection') {
        console.log('Processing testConnection request');
        const sheetsService = new GoogleSheetsService();

        sheetsService.testConnection(request.sheetId)
            .then((result) => {
                console.log('Connection test result:', result);
                sendResponse(result);
            })
            .catch((error) => {
                console.error('Connection test error:', error);
                sendResponse({ success: false, error: error.message });
            });

        return true; // Keep message channel open for async response
    }
});

console.log('Background script message listener ready');

// background.js - Add debugging
console.log('Background script loaded');

class GoogleSheetsService {
    constructor() {
        this.spreadsheetId = '1Rkddcxs28pRSJ3S3wC0--AueWg6_ufjQjPCePl98mPM';
        this.sheetsApiBase = 'https://sheets.googleapis.com/v4/spreadsheets';
        this.accessToken = null;
        console.log('GoogleSheetsService created');
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

    // Add this to your GoogleSheetsService class
    async addJobData(jobData) {
        console.log('Adding job data:', jobData);

        try {
            if (!this.accessToken) {
                await this.getAuthToken();
            }

            // Format data for the specific columns in your sheet
            // Date|Role|Company|Application Status|Location|Cover Letter|App URL|Internal Contact|Email
            const currentDate = new Date().toLocaleDateString('en-US'); // M/D/YYYY format
            const rowData = [
                currentDate,           // Date
                jobData.title || '',    // Role  
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

    formatJobData(jobData) {
        // Format to match your exact columns: Date, Role, Company, Application Status, Location, Cover Letter, App URL, Internal Contact, Email
        const today = new Date().toLocaleDateString('en-US'); // Matches your 8/17/2025 format
        return [
            today,                                    // Date
            jobData.title || 'Unknown Role',          // Role
            jobData.company || 'Unknown Company',     // Company  
            'Applied',                                // Application Status
            '',                                       // Location (empty for now)
            '',                                       // Cover Letter (empty for now)
            jobData.url || window.location.href,     // App URL
            '',                                       // Internal Contact (empty for now)
            ''                                        // Email (empty for now)
        ];
    }

    async findNextEmptyRow(sheetName = 'Sheet1') {
        const range = `${sheetName}!A:A`;
        const url = `${this.sheetsApiBase}/${this.spreadsheetId}/values/${range}`;

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to read sheet: ${response.statusText}`);
        }

        const data = await response.json();
        const values = data.values || [];

        // Return next empty row (accounting for header row)
        return values.length + 1;
    }

    async writeToSheet(rowData, rowNumber, sheetName = 'Sheet1') {
        const range = `${sheetName}!A${rowNumber}:I${rowNumber}`; // A to I for all 9 columns
        const url = `${this.sheetsApiBase}/${this.spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED`;

        const body = {
            values: [rowData]
        };

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to write to sheet: ${response.statusText} - ${errorText}`);
        }

        return response.json();
    }

    async testConnection() {
        try {
            await this.getAuthToken();
            const nextRow = await this.findNextEmptyRow();
            console.log('✅ Sheets connection test successful. Next row:', nextRow);
            return true;
        } catch (error) {
            console.error('❌ Sheets connection test failed:', error);
            return false;
        }
    }
    // Add this method to find the first sheet:
    async getFirstSheetName() {
        const response = await fetch(`${this.sheetsApiBase}/${this.spreadsheetId}`, {
            headers: { 'Authorization': `Bearer ${this.accessToken}` }
        });
        const data = await response.json();
        return data.sheets[0].properties.title;
    }
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
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
});

console.log('Background script message listener ready');

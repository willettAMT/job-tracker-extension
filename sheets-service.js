// sheets-service.js - Google Sheets integration (no ES6 modules)

class GoogleSheetsService {
  constructor() {
    this.spreadsheetId = '1Rkddcxs28pRSJ3S3wC0--AueWg6_ufjQjPCePl98mPM';
    this.sheetsApiBase = 'https://sheets.googleapis.com/v4/spreadsheets';
    this.accessToken = null;
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

  async addJobData(jobData) {
    try {
      // Get auth token if we don't have one
      if (!this.accessToken) {
        await this.getAuthToken();
      }

      // Format data for sheets
      const formattedData = this.formatJobData(jobData);
      
      // Find next empty row
      const nextRow = await this.findNextEmptyRow();
      
      // Write to sheets
      const result = await this.writeToSheet(formattedData, nextRow);
      
      console.log('✅ Successfully added to Google Sheets:', result);
      return { success: true, row: nextRow };
      
    } catch (error) {
      console.error('❌ Error adding to Google Sheets:', error);
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
}

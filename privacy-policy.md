# Privacy Policy for Job Tracker Chrome Extension

**Last Updated: August 20, 2025**

## Overview

Job Tracker is a Chrome extension that helps users track job applications by capturing job details from job listing websites and saving them directly to the user's personal Google Sheets. This privacy policy explains how we handle your data.

## Data We Collect

### Website Content
- **Job titles** - Extracted from job listing pages when you click "Track Job"
- **Company names** - Extracted from job listing pages when you click "Track Job"  
- **Job URLs** - The web address of the job listing page
- **Application date** - Automatically generated timestamp when you track a job

### User Configuration
- **Google Sheets ID** - Stored locally in your browser to remember which spreadsheet to use
- **Extension preferences** - Settings stored locally in your browser

### Web Activity
- **Click events** - When you click the "Track Job" button (not shared externally)

## What We Don't Collect

We do **NOT** collect:
- Personal identifying information (name, email, address)
- Passwords or login credentials
- Financial information
- Health information
- Personal communications
- Location data
- Browsing history beyond job pages you actively track

## How We Use Your Data

### Primary Purpose
All collected data serves one purpose: organizing your job applications in your personal Google Sheets.

### Data Flow
1. You click "Track Job" on a job listing page
2. Extension extracts job title, company, and URL from that page
3. Data is sent directly to YOUR Google Sheets via Google's API
4. No data is sent to our servers or any third parties

## Data Storage and Security

### Local Storage
- Your Google Sheets ID is stored locally in your browser using Chrome's storage API
- This data syncs across your Chrome browsers when signed into the same Google account
- No data is stored on external servers by us

### Google Integration
- We use Google's official OAuth 2.0 authentication
- Job data is saved directly to your personal Google Sheets
- We never store or access your Google account credentials
- Your Google data remains under your control in your Google account

## Data Sharing

### Third Parties
We do **NOT**:
- Sell your data to anyone
- Share your data with advertising companies
- Transfer your data to data brokers
- Use your data for any purpose other than the extension's core functionality

### Google Services
- Your job tracking data goes directly to your Google Sheets
- This uses Google's official APIs under your authorization
- Google's privacy policy governs how Google handles this data
- You can revoke the extension's access to Google Sheets at any time

## Your Rights and Controls

### Data Control
- **Access**: View all tracked data in your own Google Sheets
- **Modification**: Edit or delete data directly in your Google Sheets
- **Export**: Download your data from Google Sheets in various formats
- **Deletion**: Remove data by deleting rows in your Google Sheets

### Extension Control
- **Uninstall**: Remove the extension to stop all data collection
- **Permissions**: Revoke Google Sheets access in your Google Account settings
- **Configuration**: Change or clear your stored Google Sheets ID anytime

## Changes to This Policy

We may update this privacy policy from time to time. When we do:
- The "Last Updated" date will be revised
- Significant changes will be communicated through the Chrome Web Store
- Continued use of the extension constitutes acceptance of the updated policy

## Contact Information

If you have questions about this privacy policy or the Job Tracker extension:

- **GitHub Issues**: [Create an issue on our repository]
- **Email**: [Your email address if you want to provide one]

## Compliance

This extension and privacy policy comply with:
- Chrome Web Store Developer Program Policies
- Google API Services User Data Policy
- General Data Protection Regulation (GDPR) principles
- California Consumer Privacy Act (CCPA) principles

## Technical Details

### Permissions Explained
- **identity**: Required for Google OAuth authentication
- **storage**: Required to remember your Google Sheets ID
- **activeTab**: Required to read job details from current page
- **sheets.googleapis.com**: Required to save data to your Google Sheets

### Data Retention
- Job data: Stored indefinitely in your Google Sheets (under your control)
- Configuration data: Stored until you uninstall the extension or clear Chrome data
- We do not retain any data on external servers

---

*By using the Job Tracker extension, you acknowledge that you have read and agree to this privacy policy.*

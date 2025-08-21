# 📝 Job Tracker Chrome Extension

**Never lose track of your job applications again!** 

This Chrome extension automatically captures job details from LinkedIn, Indeed, and other job sites, saving them directly to your personal Google Sheets with just one click.

![Job Tracker Demo](https://img.shields.io/badge/Status-Active-brightgreen) ![Chrome Web Store](https://img.shields.io/badge/Chrome-Extension-blue)

## 🚀 Quick Start

### 1. Install the Extension
- Download from the Chrome Web Store (link coming soon)
- Or install manually (see Development section below)

### 2. Set Up Your Google Sheets
1. **Create a new Google Sheet** or use an existing one
2. **Copy the Sheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit
   ```
3. **Set up headers** (optional but recommended):
   ```
   Date | Role | Company | Application Status | Location | Cover Letter | App URL | Internal Contact | Email
   ```

### 3. Configure the Extension
1. **Click the extension icon** in your Chrome toolbar
2. **Paste your Google Sheets ID** in the settings popup
3. **Click "Save Settings"**
4. **Test the connection** with the "Test Connection" button
5. **Authorize with Google** when prompted

### 4. Start Tracking Jobs! 🎉
1. **Visit any job site** (LinkedIn, Indeed, etc.)
2. **Find a job you want to track**
3. **Click the "📝 Track Job" button** that appears
4. **Check your Google Sheets** - new row added automatically!

## ✨ Features

### 🎯 **One-Click Tracking**
- Floating "📝 Track Job" button appears on job sites
- Instantly captures job title, company, and URL
- Automatically adds date and "Applied" status

### 🌐 **Multi-Site Support**
- **LinkedIn** - Full job details extraction
- **Indeed** - Job title and company capture
- **Glassdoor, Monster** - Generic extraction
- **Any job site** - Falls back to page title detection

### 📊 **Smart Data Organization**
- Automatically formatted for easy tracking
- Consistent date format (MM/DD/YYYY)
- Ready-to-use columns for additional notes
- Direct links back to original job postings

### 🔄 **Sync Everywhere**
- Configure once, works on all your Chrome browsers
- Settings sync across devices with Chrome account
- Your data stays in your own Google Sheets

### 🔒 **Privacy First**
- Your data goes directly to YOUR Google Sheets
- No external servers or data collection
- Official Google OAuth - no password storage
- You control everything

## 📋 What Gets Tracked

| Column | Description | Example |
|--------|-------------|---------|
| **Date** | When you tracked the job | 8/20/2025 |
| **Role** | Job title/position | Software Engineer |
| **Company** | Company name | Google |
| **Application Status** | Auto-set to "Applied" | Applied |
| **Location** | Empty (you can fill) | San Francisco, CA |
| **Cover Letter** | Empty (you can fill) | ✓ |
| **App URL** | Direct link to job posting | https://... |
| **Internal Contact** | Empty (you can fill) | John Smith |
| **Email** | Empty (you can fill) | john@company.com |

## 🛠️ Setup Guide

### Google Sheets Preparation

**Option 1: Use Template** (Recommended)
```
Date | Role | Company | Application Status | Location | Cover Letter | App URL | Internal Contact | Email
```

**Option 2: Custom Setup**
- Use any Google Sheet structure
- Extension writes to the first available row
- Data goes in columns A-I

### Finding Your Google Sheets ID

1. **Open your Google Sheet**
2. **Look at the URL**: `https://docs.google.com/spreadsheets/d/1Abc123.../edit`
3. **Copy the long ID** between `/d/` and `/edit`
4. **That's your Sheet ID!**

### Common Setup Issues

**❌ "Unable to parse range: Sheet1"**
- **Solution**: Your sheet tab isn't named "Sheet1"
- The extension auto-detects the first sheet name
- No action needed - this is normal!

**❌ "Auth failed"**
- **Solution**: Try the "Test Connection" button first
- Make sure you authorize with the same Google account
- Check that your Google account has access to the sheet

**❌ "Extension icon missing"**
- **Solution**: Pin the extension to your toolbar
- Go to Chrome extensions → Click the puzzle piece → Pin Job Tracker

## 🎮 How to Use

### Basic Workflow
1. **Job hunting on LinkedIn/Indeed**
2. **See interesting position**
3. **Click "📝 Track Job" button**
4. **Continue browsing** (data auto-saved!)
5. **Review applications in Google Sheets**

### Pro Tips
- **Track early and often** - Even for jobs you're "just considering"
- **Use the extra columns** for notes, contacts, and follow-up dates
- **Filter your sheet** by Application Status to see what needs action
- **Share the sheet** with career counselors or mentors for feedback

## 🤔 FAQ

### **Q: Does this work on mobile?**
A: This is a Chrome extension, so it only works on desktop Chrome browsers. Your Google Sheets data is accessible on mobile though!

### **Q: Can I use multiple Google Sheets?**
A: Currently, one sheet per Chrome browser. You can change the Sheet ID anytime in settings.

### **Q: What if I already have data in my sheet?**
A: No problem! The extension adds new rows without touching existing data.

### **Q: Does this work with private/incognito browsing?**
A: Extensions are disabled in incognito by default. You can enable it in Chrome extension settings if needed.

### **Q: Can I customize what data gets captured?**
A: Currently, the extension captures job title, company, URL, and date. Future versions may add customization options.

### **Q: Is my data secure?**
A: Yes! Data goes directly from your browser to your Google Sheets. We never see or store your information.

## 🚨 Troubleshooting

### Extension Not Working
1. **Check if extension is enabled**: `chrome://extensions/`
2. **Refresh the job site page**
3. **Try the "Test Connection" in settings**
4. **Check Chrome console** for error messages

### Button Not Appearing
1. **Make sure you're on a supported job site**
2. **Refresh the page**
3. **Check if you're logged into the job site**
4. **Try disabling other extensions** that might interfere

### Data Not Saving
1. **Verify your Google Sheets ID** is correct
2. **Test the connection** in extension settings
3. **Check your Google Sheets permissions**
4. **Make sure the sheet isn't protected/read-only**

## 🛡️ Privacy & Security

- **No data collection** - Everything stays between you and Google
- **Official Google APIs** - Uses standard OAuth 2.0 authentication
- **Open source** - Code is available for review
- **No tracking** - We don't know what jobs you're applying to
- **Your control** - Revoke access anytime in Google Account settings

## 🔧 Development

Want to modify or contribute? Here's how to set up the development version:

### Install from Source
1. **Clone this repository**
2. **Open Chrome** → `chrome://extensions/`
3. **Enable Developer Mode** (top right toggle)
4. **Click "Load unpacked"** → Select the extension folder
5. **Follow setup instructions above**

### File Structure
```
job-tracker/
├── manifest.json          # Extension configuration
├── background.js           # Google Sheets integration
├── content.js             # Job site data extraction
├── popup.html             # Settings interface
├── popup.js               # Settings functionality
└── README.md              # This file
```

## 🤝 Contributing

Found a bug? Want to add support for a new job site? 

1. **Open an issue** describing the problem or feature request
2. **Fork the repository** and make your changes
3. **Test thoroughly** on multiple job sites
4. **Submit a pull request** with a clear description

## 📝 License

MIT License - feel free to use, modify, and distribute!

## 🙏 Support

If this extension helps your job search, consider:
- ⭐ **Starring this repository**
- 📝 **Leaving a Chrome Web Store review**
- 🐛 **Reporting bugs** to help improve it
- 💡 **Suggesting new features**

---

**Happy job hunting! 🎯 May your applications be organized and your offers be plentiful!**

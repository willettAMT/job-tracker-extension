document.addEventListener('DOMContentLoaded', () => {
    const authBtn = document.getElementById('authBtn');
    const result = document.getElementById('result');

    authBtn.addEventListener('click', () => {
        result.textContent = 'Testing...';
        result.className = '';

      chrome.identity.getAuthToken({ 
          interactive: true,
          scopes: ['openid']
      }, (token) => {
          if (chrome.runtime.lastError) {
              result.textContent = `❌ FAILED: ${chrome.runtime.lastError.message}`;
              result.className = 'error';
              console.error('Auth error:', chrome.runtime.lastError);
          } else if (token) {
              result.textContent = `✅ SUCCESS! Token: ${token.substring(0, 20)}...`;
              result.className = 'success';
              console.log('Auth success! Token:', token);
          } else {
              result.textContent = '❌ FAILED: No token received';
              result.className = 'error';
          }
      });
  });
});

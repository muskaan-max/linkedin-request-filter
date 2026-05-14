document.getElementById('acceptBtn').addEventListener('click', () => {
  const keywords = document.getElementById('keywords').value
    .split(',')
    .map(k => k.trim().toLowerCase())
    .filter(k => k.length > 0);

  const minMutual = parseInt(document.getElementById('minMutual').value) || 0;

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: 'acceptRequests',
      keywords,
      minMutual
    });
    document.getElementById('status').innerText = 'Accepting... check your LinkedIn page!';
  });
});

document.getElementById('ignoreBtn').addEventListener('click', () => {
  const confirmed = confirm('Are you sure? This will ignore ALL remaining requests on the page.');
  if (!confirmed) return;

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: 'ignoreAll'
    });
    document.getElementById('status').innerText = 'Ignoring... check your LinkedIn page!';
  });
});
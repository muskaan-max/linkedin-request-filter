chrome.runtime.onMessage.addListener((message) => {
  const { action, keywords, minMutual } = message;

  if (action === 'acceptRequests') {
    let processed = new Set();
    let totalAccepted = 0;

    function processCurrentCards() {
      const buttons = [...document.querySelectorAll('button')].filter(btn =>
        btn.innerText.trim() === 'Accept' && !processed.has(btn)
      );

      buttons.forEach((btn, i) => {
        processed.add(btn);
        const card = btn.closest('li') || btn.parentElement?.parentElement?.parentElement;
        if (!card) return;

        const cardText = card.innerText.toLowerCase();
        const mutualMatch = cardText.match(/(\d+)\s+other mutual/);
        const mutualCount = mutualMatch ? parseInt(mutualMatch[1]) + 1 :
                            cardText.includes('is a mutual connection') ? 1 : 0;

        const keywordMatch = keywords.some(k => cardText.includes(k.toLowerCase()));

        if (keywordMatch || mutualCount >= minMutual) {
          setTimeout(() => btn.click(), totalAccepted * 800);
          totalAccepted++;
        }
      });
    }

    function scrollAndProcess() {
      processCurrentCards();
      window.scrollBy(0, 1000);

      setTimeout(() => {
        const atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 200;
        if (!atBottom) {
          scrollAndProcess();
        } else {
          setTimeout(() => alert(`All done! Accepted ${totalAccepted} requests total.`), 2000);
        }
      }, 2000);
    }

    scrollAndProcess();
  }

  if (action === 'ignoreAll') {
    let totalIgnored = 0;

    const ignoreButtons = [...document.querySelectorAll('button')].filter(btn =>
      btn.innerText.trim() === 'Ignore'
    );

    ignoreButtons.forEach((btn, i) => {
      setTimeout(() => {
        btn.click();
        totalIgnored++;
      }, i * 800);
    });

    setTimeout(() => {
      alert(`Ignored ${totalIgnored} requests on this page. Scroll down and repeat if needed.`);
    }, ignoreButtons.length * 800 + 500);
  }
});
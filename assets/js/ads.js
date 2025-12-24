(function () {
  let retryTimer = null;

  function pushVisibleAds() {
    if (typeof adsbygoogle === 'undefined') {
      scheduleRetry();
      return;
    }

    const ads = document.querySelectorAll('ins.adsbygoogle');
    let needsRetry = false;

    ads.forEach((ad) => {
      if (ad.dataset.adsbygoogleStatus) return;
      if (ad.offsetWidth === 0 || ad.offsetHeight === 0) {
        needsRetry = true;
        return;
      }

      try {
        (adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.log('AdSense push error:', err);
      }
    });

    if (needsRetry) {
      scheduleRetry();
    }
  }

  function scheduleRetry() {
    if (retryTimer) return;
    retryTimer = setTimeout(() => {
      retryTimer = null;
      pushVisibleAds();
    }, 1000);
  }

  window.addEventListener('load', pushVisibleAds);
  document.addEventListener('DOMContentLoaded', pushVisibleAds);
  window.addEventListener('resize', scheduleRetry);
})();

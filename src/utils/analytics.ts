
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const trackEvent = (eventName: string, parameters: Record<string, any> = {}): void => {
  // Check if user has given consent for analytics
  const consent = localStorage.getItem("cookieConsent");
  
  if (consent === "accepted" && typeof window !== "undefined" && window.gtag) {
    console.log("Tracking GA4 event:", eventName, parameters);
    window.gtag("event", eventName, parameters);
  } else {
    console.log("Analytics tracking skipped (no consent or GA4 not loaded):", eventName, parameters);
  }
};

// Initialize GA4 with consent
export const initializeAnalytics = (): void => {
  if (typeof window !== "undefined") {
    // Add GA4 script
    const script1 = document.createElement("script");
    script1.async = true;
    script1.src = "https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID";
    document.head.appendChild(script1);

    const script2 = document.createElement("script");
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('consent', 'default', {
        'analytics_storage': 'denied'
      });
      gtag('config', 'GA_MEASUREMENT_ID');
    `;
    document.head.appendChild(script2);
    
    // Set up gtag function
    window.gtag = function(...args: any[]) {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push(arguments);
    };
  }
};

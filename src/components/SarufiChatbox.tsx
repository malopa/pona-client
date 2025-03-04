import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    botId: number;
  }
}

export default function SarufiChatbox() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    // Only run once
    if (scriptLoaded.current) return;
    scriptLoaded.current = true;

    // Create a separate container outside React's control
    const chatboxContainer = document.createElement('div');
    chatboxContainer.id = 'sarufi-chatbox';
    document.body.appendChild(chatboxContainer);

    // Set bot ID
    window.botId = 1700;

    // Load styles
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = 'https://cdn.jsdelivr.net/gh/flexcodelabs/sarufi-chatbox/example/vanilla-js/style.css';
    document.head.appendChild(style);

    // Load script with proper async handling
    const loadScript = async () => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://cdn.jsdelivr.net/gh/flexcodelabs/sarufi-chatbox/example/vanilla-js/script.js';
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    // Load script and handle errors
    loadScript().catch(error => {
      console.error('Failed to load Sarufi chatbox:', error);
    });

    // Cleanup function
    return () => {
      const chatbox = document.getElementById('sarufi-chatbox');
      if (chatbox) {
        chatbox.remove();
      }
      const scripts = document.querySelectorAll('script[src*="sarufi-chatbox"]');
      scripts.forEach(script => script.remove());
      const styles = document.querySelectorAll('link[href*="sarufi-chatbox"]');
      styles.forEach(style => style.remove());
    };
  }, []);

  // Return an empty div as a mounting point
  return <div ref={containerRef} />;
}
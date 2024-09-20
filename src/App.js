import React, { useEffect } from 'react';
import HomePage from './Pages/HomePage';

const App = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then((registration) => {
            console.log('ServiceWorker registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('ServiceWorker registration failed: ', registrationError);
          });
      });
    }
  }, []);

  return (
    <div>
      <HomePage />
    </div>
  );
};

export default App;

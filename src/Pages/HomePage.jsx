import React from 'react';

const HomePage = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to the Homepage</h1>
      <button onClick={() => window.open('myapp://homepage')}>
        Open Android App
      </button>
    </div>
  );
};

export default HomePage;

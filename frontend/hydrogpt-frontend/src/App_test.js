import React, { useState, useEffect } from 'react';

// Simple test component to check if the main App.js has syntax issues
function TestApp() {
  const [test, setTest] = useState('Working');
  
  return (
    <div>
      <h1>Syntax Test: {test}</h1>
      <p>If you see this, the basic React syntax is working.</p>
    </div>
  );
}

export default TestApp;
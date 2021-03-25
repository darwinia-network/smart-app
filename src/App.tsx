import React, { useState } from 'react';
import './App.scss';
import logo from './logo.svg';

function App() {
  const [name, setName] = useState('Learn React');
  return (
    <div className="App">
      <header className="App-header">
        <img
          src={logo}
          onClick={() => {
            setName('React');
          }}
          className="App-logo"
          alt="logo"
        />
        <p className="text-green-400">
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a className="App-link" href="https://reactjs.or" target="_blank" rel="noopener noreferrer">
          {name}
        </a>
      </header>
    </div>
  );
}

export default App;

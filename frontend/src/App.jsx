import React from 'react';
import './App.css';
import './components/Debt.css';
import Debt from "./components/Debt";
import Image from './assets/images/ice-background.png';

function App() {
    return (
        <div id="App" style={{ backgroundImage: `url(${Image})` }}>
            <h2>My Debt</h2>
            <Debt />
        </div>
    )
}

export default App

import React from 'react';
import './App.css';
import './components/Debt.css';
import Debt from "./components/Debt";

function App() {
    return (
        <div id="App">
            <h2>My Debt From Smallest to Largest</h2>
            <Debt />
        </div>
    )
}

export default App

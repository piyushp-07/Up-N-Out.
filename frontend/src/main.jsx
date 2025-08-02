// frontend/src/main.jsx (After correction)
import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/index.css' // This line imports your CSS
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
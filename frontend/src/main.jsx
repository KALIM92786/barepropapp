import React from 'react'
import ReactDOM from 'react-dom/client'
import { Dashboard } from './Dashboard.jsx'
import './index.css'

// Hardcoded account ID for demo purposes. In production, this would come from the auth context/URL.
const DEMO_ACCOUNT_ID = 1; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Dashboard accountId={DEMO_ACCOUNT_ID} />
  </React.StrictMode>,
)
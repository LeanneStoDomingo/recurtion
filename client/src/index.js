import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { TokenProvider } from './utils/TokenContext';

ReactDOM.render(
    <React.StrictMode>
        <TokenProvider>
            <App />
        </TokenProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

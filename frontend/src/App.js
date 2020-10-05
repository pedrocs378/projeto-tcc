import React, { useEffect } from 'react'

import Routes from './routes';

import './global.css'
import api from './services/api';

function App() {

    useEffect(() => {
        window.setInterval(() => {
            api
                .post('/crawler')
        }, 3600000)
    }, [])

    return (
        <Routes />
    )
}

export default App
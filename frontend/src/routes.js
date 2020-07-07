import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Home from './pages/Home'
import SearchResults from './pages/SearchResults'

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/search/:query?" component={SearchResults} />
            </Switch>
        </BrowserRouter>
    )
}
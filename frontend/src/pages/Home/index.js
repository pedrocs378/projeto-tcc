import React from 'react'
import { useHistory } from 'react-router-dom'

import './styles.css'

import SearchBar from '../../components/SearchBar'

export default function Search() {
    const history = useHistory()

    function handleSearch() {
        history.push('/search')
    }

    return (
        <div id="page-home">
            <div className="content">
                <main>
                    <div className="search-group">
                        <h1>Google</h1>
                        <SearchBar hiddenButton />
                        <input type="button" id="btn-search" value="Pesquisar" onClick={handleSearch} />
                    </div>
                </main>
            </div>
        </div>
    )
}
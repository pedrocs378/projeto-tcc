import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

import './styles.css'

import SearchBar from '../../components/SearchBar'

export default function Search() {
    const [text, setText] = useState("")
    const history = useHistory()

    function handleSearch() {
        if (text) {
            const textToSearch = text.split(' ').join('+')
            history.push('/search/' + textToSearch)
        }
    }

    function handleSetText(event) {
        setText(event.target.value)
    }

    return (
        <div id="page-home">
            <div className="content">
                <main>
                    <div className="search-group">
                        <h1>Google</h1>
                        <SearchBar hiddenButton onChange={handleSetText} />
                        <input type="button" id="btn-search" value="Pesquisar" onClick={handleSearch} />
                    </div>
                </main>
            </div>
        </div>
    )
}
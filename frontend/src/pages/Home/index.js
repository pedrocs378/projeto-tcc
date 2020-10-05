import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

import SearchBar from '../../components/SearchBar'
import Footer from '../../components/Footer'

import './styles.css'

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
            <main className="search-group">
                <h1>Search Engine</h1>
                <SearchBar hiddenButton onChange={handleSetText} />
                <input type="button" name="btnK" className="button" value="Pesquisar" onClick={handleSearch} />
            </main>
            <Footer />
        </div>
    )
}
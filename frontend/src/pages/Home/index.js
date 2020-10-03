import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import './styles.css'

import SearchBar from '../../components/SearchBar'
import api from '../../services/api'

export default function Search() {
    const [text, setText] = useState("")
    const history = useHistory()

    /*	
    useEffect(() => {
        api.post('/crawler')
    }, [])
    */

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
        </div>
    )
}
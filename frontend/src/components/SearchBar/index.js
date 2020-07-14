import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'

import './styles.css'

export default function SearchBar(props) {
    const [text, setText] = useState("")
    const history = useHistory()

    function onPressEnter(event) {
        if(event.which === 13) {
            handleSearch()
        }
    }

    function handleDigit(event) {
        if (props.onChange) {
            props.onChange(event)
        }
        setText(event.target.value)
    } 

    function handleSearch() {
        if (text) {
            const textToSearch = text.split(' ').join('+')
            history.push('/search/' + textToSearch)
        }
    }

    return (
        <div className="box-search">
            <div className={ props.hiddenIcon ? "icon-hidden" : "icon-search" }>
                <FiSearch size={16} color="#9AA0A6" />
            </div>
            <div className="search-term">
                { props.value ? 
                    <input 
                        type="text" 
                        id="search" 
                        value={props.value} 
                        onChange={handleDigit} 
                        onKeyPress={onPressEnter} 
                    /> : 
                    <input 
                        type="text" 
                        id="search" 
                        placeholder="Digite Algo..." 
                        onChange={handleDigit} 
                        onKeyPress={onPressEnter} 
                    />
                }          
            </div>
            <div className={ props.hiddenButton ? "icon-hidden" : "icon-button" }>
                <button onClick={handleSearch}>
                    <span>
                        <FiSearch size={18} color="#4285f4" />
                    </span>
                </button>
            </div>
        </div>
    )
}
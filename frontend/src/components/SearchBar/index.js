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
            if (textToSearch === props.params) {
                window.location.reload(false)
            } else {
                history.push('/search/' + textToSearch)
            }
        }
    }

    return (
        <div className="box-search">
            <div 
                className={ props.hiddenIcon ? "icon-hidden" : "icon-search" }
                style={ !props.hiddenIcon ? { marginLeft: -10 } : null }
            >
                <FiSearch size={16} color="#9AA0A6" />
            </div>
            <div className="search-term" style={ !props.hiddenIcon ? { marginLeft: -50 } : null }  >  
                <input 
                    type="text" 
                    name="search" 
                    autoFocus
                    autoComplete="off"
                    title="Pesquisar"
                    placeholder="Digite Algo..." 
                    value={text}
                    onChange={handleDigit} 
                    onKeyPress={onPressEnter} 
                />         
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
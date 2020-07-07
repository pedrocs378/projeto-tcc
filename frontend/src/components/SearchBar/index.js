import React from 'react'
import { FiSearch } from 'react-icons/fi'

import './styles.css'

export default function SearchBar(props) {

    function onPressEnter(event) {
        if(event.which === 13) {
            props.onChange(13)
        }
    }

    function handleDigit(event) {
        props.onChange(event)
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
                <button>
                    <span>
                        <FiSearch size={18} color="#4285f4" />
                    </span>
                </button>
            </div>
        </div>
    )
}
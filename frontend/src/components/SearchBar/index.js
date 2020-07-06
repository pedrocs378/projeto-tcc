import React from 'react'
import { useHistory } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'

import './styles.css'

export default function SearchBar(props) {
    const history = useHistory()

    function onPressEnter(event) {
        if(event.which === 13) {
            history.push('/search')
        }
    }

    return (
        <div className="box-search">
            <div className={ props.hiddenIcon ? "icon-hidden" : "icon-search" }>
                <FiSearch size={16} color="#9AA0A6" />
            </div>
            <div className="search-term">
                <input type="text" name="search" id="search" placeholder="Digite Algo..." onKeyPress={onPressEnter} />
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
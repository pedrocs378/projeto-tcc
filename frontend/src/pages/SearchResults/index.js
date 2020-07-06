import React from 'react'
import { useHistory } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'

import './styles.css'

import SearchBar from '../../components/SearchBar'

export default function SearchResults() {
    const history = useHistory()


    return (
        <div id="results-container">
            <div id="menubar">
                <div className="arrow-left-icon">
                    <span>
                        <button onClick={() => history.push('/')}>
                            <FiArrowLeft size={25} />
                        </button>
                    </span>
                </div>
                <div className="searchbar">
                    <SearchBar hiddenIcon />
                </div>
            </div>
            <div id="separator" />
            <div id="resultsbar">
                <div className="results">
                    <ul>
                        <li>
                            <a href="http://www.google.com.br">
                                <cite>
                                    http://www.google.com.br
                                </cite>
                                <h3>Titulo</h3>
                            </a>               
                            <span>Descrição</span>
                        </li>
                        <li>
                            <a href="http://www.google.com.br">
                                <cite>
                                    http://www.google.com.br
                                </cite>
                                <h3>Titulo</h3>
                            </a>               
                            <span>Descrição</span>
                        </li>
                        <li>
                            <a href="http://www.google.com.br">
                                <cite>
                                    http://www.google.com.br
                                </cite>
                                <h3>Titulo</h3>
                            </a>               
                            <span>Descrição</span>
                        </li>
                        <li>
                            <a href="http://www.google.com.br">
                                <cite>
                                    http://www.google.com.br
                                </cite>
                                <h3>Titulo</h3>
                            </a>               
                            <span>Descrição</span>
                        </li>
                        <li>
                            <a href="http://www.google.com.br">
                                <cite>
                                    http://www.google.com.br
                                </cite>
                                <h3>Titulo</h3>
                            </a>               
                            <span>Descrição</span>
                        </li>
                        <li>
                            <a href="http://www.google.com.br">
                                <cite>
                                    http://www.google.com.br
                                </cite>
                                <h3>Titulo</h3>
                            </a>               
                            <span>Descrição</span>
                        </li>
                        <li>
                            <a href="http://www.google.com.br">
                                <cite>
                                    http://www.google.com.br
                                </cite>
                                <h3>Titulo</h3>
                            </a>               
                            <span>Descrição</span>
                        </li>
                        
                    </ul>
                </div>
            </div>
        </div>
    )
}
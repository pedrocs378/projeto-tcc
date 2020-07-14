import React, { useEffect, useState, useRef } from 'react'
import { MemoryRouter, Route } from 'react-router'
import { useHistory } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import Pagination from '@material-ui/lab/Pagination'
import PaginationItem from '@material-ui/lab/PaginationItem'

import './styles.css'

import Results from '../../components/Results/'
import SearchBar from '../../components/SearchBar'
import SearchNotFound from '../../components/SearchNotFound'

const results = [
    {
        id: 0,
        url: 'http://www.google.com',
        title: 'Google',
        desc: 'Search the worlds information, including webpages, images, videos and more.'
    },
    {
        id: 1,
        url: 'https://www.uol.com.br',
        title: 'UOL - O melhor conteúdo',
        desc: 'Search the worlds information, including webpages, images, videos and more.'
    },
    {
        id: 2,
        url: 'http://www.correios.com.br/',
        title: 'Correios: encomendas, rastreamento, telegramas, cep, cartas ...',
        desc: 'Search the worlds information, including webpages, images, videos and more.'
    },
    {
        id: 3,
        url: 'https://www.androidpolice.com',
        title: 'Android Police - Android news, reviews, apps, games, phones ...',
        desc: 'Search the worlds information, including webpages, images, videos and more.'
    },
    {
        id: 4,
        url: 'https://www.americanas.com.br/',
        title: 'Americanas - Tudo. A toda hora. Em qualquer lugar.',
        desc: 'Search the worlds information, including webpages, images, videos and more.'
    },
    
]

export default function SearchResults(props) {
    const [text, setText] = useState("")
    const [page, setPage] = useState(1)
    const [pageResults, setPageResults] = useState([])

    const history = useHistory()
    
    const cont = useRef(0)
    useEffect(() => {
        if (results.length > 0) {
            let page = 1
            const pageResultsAux = []
            for (let i = 0; i < results.length; i++) {
                pageResultsAux[i] = results[i]
                pageResultsAux[i].page = page
                cont.current++
                if (cont.current === 10) {
                    cont.current = 0
                    page++
                }
            }
            pageResultsAux.totalPages = page
            setPageResults(pageResultsAux)
        }
    }, [cont])

    useEffect(() => {
        const textToSearch = props.match.params.query
        if (text === textToSearch) {
            setText(textToSearch)
        }
    }, [text, props.match.params.query])

    function handlePageChange(event, page) {
        setPage(page)
    }

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
                    <SearchBar hiddenIcon 
                        value={text.includes('+') ? text.split('+').join(' ') : text} 
                    />
                </div>
            </div>
            <div id="separator" />
            <div id="resultsbar">
                {
                    results.length > 0 ? 
                    <Results page={page} pageResults={pageResults} /> : 
                    <SearchNotFound 
                        value={props.match.params.query.includes('+') ? props.match.params.query.split('+').join(' ') : props.match.params.query}
                    />
                }             
            </div>
            
            
            <div className="pagination">
                { results.length > 0 ? 
                    <MemoryRouter initialEntries={['/search']} initialIndex={0}>
                        <Route>                                                      
                            <Pagination 
                                count={pageResults.totalPages}
                                page={page}
                                onChange={handlePageChange}
                                color="primary" 
                                renderItem={(item) => (
                                    <PaginationItem 
                                        // component={Link}
                                        // to={'/search/'+text.split(' ').join('+') + '/' + item.page}
                                        {...item}
                                    />
                                )}
                            />                                                      
                        </Route>
                    </MemoryRouter> : 
                    <Pagination style={{display: 'none'}} color="primary" /> 
                }           
            </div>
        </div>
    )
}
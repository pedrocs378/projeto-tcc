import React, { useEffect, useState } from 'react'
import ReactLoading from 'react-loading'
import { MemoryRouter, Route } from 'react-router'
import { Link } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import Pagination from '@material-ui/lab/Pagination'
import PaginationItem from '@material-ui/lab/PaginationItem'

import './styles.css'

import Results from '../../components/Results/'
import SearchBar from '../../components/SearchBar'
import SearchNotFound from '../../components/SearchNotFound'

import api from '../../services/api'

// const results = [
//     {
//         id: 0,
//         url: 'http://www.google.com',
//         title: 'Google',
//         desc: 'Search the worlds information, including webpages, images, videos and more.'
//     },
//     {
//         id: 1,
//         url: 'https://www.uol.com.br',
//         title: 'UOL - O melhor conteúdo',
//         desc: 'Search the worlds information, including webpages, images, videos and more.'
//     },
//     {
//         id: 2,
//         url: 'http://www.correios.com.br/',
//         title: 'Correios: encomendas, rastreamento, telegramas, cep, cartas ...',
//         desc: 'Search the worlds information, including webpages, images, videos and more.'
//     },
//     {
//         id: 3,
//         url: 'https://www.androidpolice.com',
//         title: 'Android Police - Android news, reviews, apps, games, phones ...',
//         desc: 'Search the worlds information, including webpages, images, videos and more.'
//     },
//     {
//         id: 4,
//         url: 'https://www.americanas.com.br/',
//         title: 'Americanas - Tudo. A toda hora. Em qualquer lugar.',
//         desc: 'Search the worlds information, including webpages, images, videos and more.'
//     },
    
// ]

export default function SearchResults(props) {
    const [page, setPage] = useState(1)
    const [loaded, setLoaded] = useState(true)
    const [results, setResults] = useState([])
    const [time, setTime] = useState(0)
    
    useEffect(() => {
        async function loadResults() {
            const timer = setInterval(updateTimer, 1)

            setLoaded(false)
            const { data } = await api.get('/search?q=' + props.match.params.query)
            setResults(data)
            setLoaded(true)

            clearInterval(timer)
        }

        function updateTimer() {
            setTime(t => t + 1)
        }
        loadResults()
    }, [props.match.params.query])

    function handlePageChange(event, page) {
        setPage(page)
    }

    return (
        <div id="results-container">
            <header id="menubar">
                <div className="arrow-left-icon">
                    <Link className="button" to="/">
                        <FiArrowLeft size={25} color="black" />
                    </Link>
                </div>
                <SearchBar hiddenIcon />    
                { !loaded 
                    ? <ReactLoading className="loading" type="spinningBubbles" color="gray" height={35} width={35} /> 
                    : null 
                } 
            </header>
            <div id="separator" />  
            { loaded ? 
                <main id="resultsbar">
                    {
                        results.length > 0
                            ? <Results page={page} pageResults={results.dataSearched} time={time/1000} />
                            : <SearchNotFound
                                value={props.match.params.query.includes('+') ? props.match.params.query.split('+').join(' ') : props.match.params.query}
                            />
                    }
                    { 
                        results.length > 0 
                            ? <MemoryRouter initialEntries={['/search']} initialIndex={0}>
                                <Route>
                                    <Pagination
                                        className="pagination"
                                        count={results.totalPages}
                                        page={page}
                                        onChange={handlePageChange}
                                        color="primary"
                                        renderItem={(item) => (
                                            <PaginationItem
                                                component={Link}
                                                to={'/search/' + props.match.params.query.split(' ').join('+') + '/' + item.page}
                                                {...item}
                                            />
                                        )}
                                    />
                                </Route>
                            </MemoryRouter> 
                            : <Pagination style={{ display: 'none' }} />
                    }
                </main> 
                : null
            }
            
        </div>
    )
}
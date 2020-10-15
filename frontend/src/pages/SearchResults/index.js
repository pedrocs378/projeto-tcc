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
import Footer from '../../components/Footer'

import api from '../../services/api'

export default function SearchResults(props) {
    const [page, setPage] = useState(1)
    const [loaded, setLoaded] = useState(true)
    const [results, setResults] = useState([])
    const [time, setTime] = useState(0)
    
    useEffect(() => {
        async function loadResults() {
            const timer = setInterval(updateTimer, 1)
            setTime(0)
            setLoaded(false)

            const { data } = await api.get('/search?q=' + props.match.params.query)
            console.log(data.dataSearched)
            setResults(data)

            setLoaded(true)
            setPage(1)

            clearInterval(timer)
        }

        function updateTimer() {
            setTime(t => t + 1)
        }
        loadResults()
    }, [props.match.params.query])

    return (
        <div id="results-container">
            <header className="menubar">
                <div className="arrow-left-icon">
                    <Link className="button" to="/">
                        <FiArrowLeft size={25} color="black" />
                    </Link>
                </div>
                <SearchBar hiddenIcon params={props.match.params.query} />    
                { !loaded 
                    ? <ReactLoading className="loading" type="spinningBubbles" color="gray" height={35} width={35} /> 
                    : null 
                } 
            </header>  
            <main className={loaded ? "resultsbar" : "nocontent"}>
                { loaded ? 
                    <div>
                        {
                            results.length > 0
                                ? <Results 
                                    page={page} 
                                    pageResults={results.dataSearched} 
                                    time={time / 1000} 
                                    search={props.match.params.query} 
                                />
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
                                            onChange={(e, page) => setPage(page)}
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
                    </div> 
                    : null
                }
            </main>
            <Footer className="footer" />
        </div>
    )
}
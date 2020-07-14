import React, { useEffect, useState } from 'react'
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
        url: 'https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwi_6cufsbnqAhUhJLkGHQADCQYQFjABegQIARAB&url=https%3A%2F%2Fwww.google.com%2F%3Fhl%3Dpt_br&usg=AOvVaw2LUYq2HB3rrKwdSYM0-Zvl',
        title: 'Google',
        desc: 'Pesquisa · Imagens · Maps · Play · YouTube · Notícias · Gmail · Drive · Mais · Agenda · Tradutor · Google Mobile · Livros · Shopping · Blogger · Fotos · Vídeos ...'
    },
    {
        id: 2,
        url: 'https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwi_6cufsbnqAhUhJLkGHQADCQYQFjACegQIBBAB&url=https%3A%2F%2Fadssettings.google.com%2Fauthenticated%3Fhl%3Dpt-BR&usg=AOvVaw2sfhum3LHP2y7HNo5K3aXV',
        title: 'Fazer login nas Contas do Google',
        desc: 'Use sua Conta do Google. E-mail ou telefone. Esqueceu seu e-mail? Digite o texto que você ouve ou vê. Não está no seu computador? Use o modo visitante ...'
    },
    {
        id: 3,
        url: 'https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwi_6cufsbnqAhUhJLkGHQADCQYQFjADegQIBRAB&url=https%3A%2F%2Fmyaccount.google.com%2Fintro%3Fhl%3Dpt-BR&usg=AOvVaw2hauLPVV_ljaApq6-LF-mM',
        title: 'Conta do Google',
        desc: 'Quando você faz login na sua Conta do Google, pode ver e gerenciar suas ... de privacidade para ajudar o Google a atender melhor suas necessidades.'
    },
    {
        id: 4,
        url: 'https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwi_6cufsbnqAhUhJLkGHQADCQYQFjAEegQIEBAB&url=https%3A%2F%2Fcanaltech.com.br%2Fapps%2Fgoogle-play-store-recebe-novos-detalhes-visuais-nos-menus-de-categorias-167575%2F&usg=AOvVaw2OxvbZf1pJfGdlKnnZrf7b',
        title: 'Google Play Store recebe novos detalhes visuais nos menus ...',
        desc: 'Os aplicativos do Google constantemente mudam de visual em testes que, não raro, limitam-se a apenas uma pequena parcela de celulares ...'
    },
    {
        id: 5,
        url: 'https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwi_6cufsbnqAhUhJLkGHQADCQYQFjAFegQIBhAB&url=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dcom.google.android.googlequicksearchbox%26hl%3Dpt_BR&usg=AOvVaw2WpR3TC46VcEl0-jbbq1oo',
        title: 'Google',
        desc: 'Site da Google'
    },
    {
        id: 6,
        url: 'http://play.google.com/store',
        title: 'Google',
        desc: 'Site da Google'
    },
    {
        id: 7,
        url: 'http://www.google.com',
        title: 'Google',
        desc: 'Site da Google'
    },
    {
        id: 8,
        url: 'http://www.google.com',
        title: 'Google',
        desc: 'Site da Google'
    },
    {
        id: 9,
        url: 'http://www.google.com',
        title: 'Google',
        desc: 'Site da Google'
    },
    {
        id: 10,
        url: 'http://www.google.com',
        title: 'Google',
        desc: 'Site da Google'
    },
    {
        id: 11,
        url: 'http://www.google.com',
        title: 'Google',
        desc: 'Site da Google'
    },
    {
        id: 12,
        url: 'https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwi_6cufsbnqAhUhJLkGHQADCQYQFjAEegQIEBAB&url=https%3A%2F%2Fcanaltech.com.br%2Fapps%2Fgoogle-play-store-recebe-novos-detalhes-visuais-nos-menus-de-categorias-167575%2F&usg=AOvVaw2OxvbZf1pJfGdlKnnZrf7b',
        title: 'Google Play Store recebe novos detalhes visuais nos menus ...',
        desc: 'Os aplicativos do Google constantemente mudam de visual em testes que, não raro, limitam-se a apenas uma pequena parcela de celulares ...'
    },
    {
        id: 13,
        url: 'https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwi_6cufsbnqAhUhJLkGHQADCQYQFjAEegQIEBAB&url=https%3A%2F%2Fcanaltech.com.br%2Fapps%2Fgoogle-play-store-recebe-novos-detalhes-visuais-nos-menus-de-categorias-167575%2F&usg=AOvVaw2OxvbZf1pJfGdlKnnZrf7b',
        title: 'Google Play Store recebe novos detalhes visuais nos menus ...',
        desc: 'Os aplicativos do Google constantemente mudam de visual em testes que, não raro, limitam-se a apenas uma pequena parcela de celulares ...'
    },
    
]

export default function SearchResults(props) {
    const [text, setText] = useState("")
    const [page, setPage] = useState(1)
    const [pageResults, setPageResults] = useState([])

    const history = useHistory()
    
    let cont = 0
    useEffect(() => {
        if (results.length > 0) {
            let page = 1
            const pageResultsAux = []
            for (let i = 0; i < results.length; i++) {
                pageResultsAux[i] = results[i]
                pageResultsAux[i].page = page
                cont++
                if (cont === 10) {
                    cont = 0
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
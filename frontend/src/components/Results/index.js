import React from 'react'

import './styles.css'

export default function Results(props) {

    return (
        <div className="results">
            <ul>
                {
                    props.pageResults.map(result => {
                        return (
                            result.page === props.page ?
                                <li key={result.id}>
                                    <a href={result.url}>
                                        <cite>
                                            {result.url.split('/')[2]}
                                        </cite>
                                        <h3>{result.title}</h3>
                                    </a>               
                                    <span>{result.desc}</span>
                                </li> : null 
                        )
                    })
                }                                                           
            </ul>
        </div>
    )
}
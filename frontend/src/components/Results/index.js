import React from 'react'

import './styles.css'

export default function Results({ pageResults, page }) {

    return (
        <div className="results">
            <ul>
                {
                    pageResults.map(result => {
                        return (
                            result.pages === page ?                             
                                <li key={result._id}>
                                    <a href={result.url}>
                                        <cite>
                                            {result.host}
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
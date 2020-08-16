import React from 'react'

import './styles.css'

export default function Results({ pageResults, page, time }) {


    function handleConvertNumber(number) {
        return number.toLocaleString('pt-BR')
    }

    function handleConvertTime(value) {
        return value.toFixed(2)
    }

    return (
        <div className="results">
            <p>Found {handleConvertNumber(pageResults.length)} results ({handleConvertTime(time)} seconds) </p>
            <ul>
                {
                    pageResults.map(result => {
                        return (
                            result.page === page ?                             
                                <li key={result._id}>
                                    <a href={result.url}>
                                        <cite>
                                            {result.host}
                                        </cite>
                                        <h3>{result.title}</h3>
                                    </a>    
                                    <span>
                                        {result.textInfo}
                                        {/* {result.textInfo.substring(0, result.textInfo.indexOf(result.tags))}
                                        <strong>
                                            {result.textInfo.substring(result.textInfo.indexOf(result.tags), result.textInfo.indexOf(result.tags) + result.tags.length)}
                                        </strong>
                                        {result.textInfo.substring(result.textInfo.indexOf(result.tags) + result.tags.length)} */}
                                    </span>
                                </li> : null 
                        )                       
                    })
                }                                                           
            </ul>
        </div>
    )
}
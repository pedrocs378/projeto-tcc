import React from 'react'

import './styles.css'

export default function Results({ pageResults, page, time, search }) {
    function handleConvertNumber(number) {
        return number.toLocaleString('pt-BR')
    }

    function handleConvertTime(value) {
        return value.toFixed(2)
    }

    function handleConvertTitle(strTitle) {
        const phrase = strTitle.split(' ')
        const length = strTitle.split(' ').length
        let newString = ""

        if (length > 10) {    
            for (let i = 0; i < 9; i++) {
                newString = newString + ' ' + phrase[i]
            }
            newString = newString + " ..."

            return newString
        } else {
            return strTitle
        }
    }

    function handleSetDescription(textInfo) {
        const textInfoArr = textInfo.split(' ')
        const searchArr = search.split('+')
        console.log(textInfoArr)

        const newDescription = textInfoArr
            .map(word => {
                for (let i = 0; i < searchArr.length; i++) {
                    if (word.toLowerCase() === searchArr[i].toLowerCase()) {
                        return `///${word}///`
                    } else {
                        return word
                    }
                }
            })
            .join(' ') 

        return (
            <span>
                {
                    newDescription
                        .split('///')
                        .map((word, index) => {
                            return (
                                index % 2 !== 0
                                    ? <strong key={Math.random()}>{word}</strong>
                                    : word
                            )
                        })
                }
            </span>
        )
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
                                    <a target="_blank" rel="noopener noreferrer" href={result.url}>
                                        <cite>
                                            {result.host}
                                        </cite>
                                        <h3>
                                            { handleConvertTitle(result.title) }
                                        </h3>
                                    </a>   
                                    {handleSetDescription(result.textInfo)}
                                </li> : null 
                        )                       
                    })
                }                                                           
            </ul>
        </div>
    )
}
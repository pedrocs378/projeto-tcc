import React from 'react'

import './styles.css'

export default function SearchNotFound(props) {

    return (
        <div className="warning-card">
            <p>
                Sua pesquisa: "<em>{props.value}</em>" não encontrou nenhum resultado correspondente.
            </p>
        </div>
    )
}
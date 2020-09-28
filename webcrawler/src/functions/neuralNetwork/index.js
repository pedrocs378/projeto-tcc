
class NetworkController {

    constructor(pA, pB, pAB, pD, alpha, beta, phase){
        this._pA = pA
        this._pB = pB
        this._pAB = pAB
        this._pD = pD
        this._alpha = alpha
        this._beta = beta
        this._phase = phase
        this._wAB = [] //Linhas A X Linhas B
        this._posiK = [] //Linhas B
        this._K = 0
		this._ya = [] //Linhas A X Colunas A
		this._yb = [] //Linhas B X Colunas B
		this._yd = [] //Linhas A X Linhas B
		this._mt = [] //Linhas A X Linhas B (WAB)
		this._ybd = [] //Linhas A X Linhas B (WAB)
		this._wBD = [] //Tamanho de B
		this._end = [] //Linhas de B (vetor)
    }

    initVariables() {
        const rowsInput = this._complementA.length
        const rowsOutput = this._complementB.length

        const colsBOutput = this._complementB[0].length

        this._wAB = new Array(rowsInput).fill(undefined)
        for (let i = 0; i < rowsInput; i++) {
            this._wAB[i] = new Array(rowsOutput).fill(1)
        }

        this._ya = new Array(rowsInput).fill(undefined)
        for (let i = 0; i < rowsInput; i++) {
            this._ya[i] = new Array(rowsOutput).fill(0)
        }

        this._yb = new Array(rowsOutput).fill(undefined)
        for (let i = 0; i < rowsOutput; i++) {
            this._yb[i] = new Array(colsBOutput).fill(0)
        }

        this._yd = new Array(rowsInput).fill(undefined)
        for (let i = 0; i < rowsInput; i++) {
            this._yd[i] = new Array(rowsOutput).fill(0)
        }

        this._mt = new Array(rowsInput).fill(undefined)
        for (let i = 0; i < rowsInput; i++) {
            this._mt[i] = new Array(rowsOutput).fill(0)
        }

        this._ybd = new Array(rowsInput).fill(undefined)
        for (let i = 0; i < rowsInput; i++) {
            this._ybd[i] = new Array(rowsOutput).fill(0)
        }
    }

    setInputValues(data, rows, cols) {
        let newInput = new Array(rows).fill(undefined)

        for (let i = 0; i < rows; i++) {
            newInput[i] = new Array(cols).fill(0)
        }

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                newInput[i][j] = data[i]
            }
		}
		
        this._input = newInput  
    }

    get getInputValues() {
        return this._input
    }

    setOutputValues(data, rows, cols) {
        let newOutput = new Array(rows).fill(undefined)

        for (let i = 0; i < rows; i++) {
            newOutput[i] = new Array(cols).fill(0)
        }

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                newOutput[i][j] = data[j]
            }
        }

        this._output = newOutput
    }

    get getOutputValues() {
        return this._output
	}
	
	/**
	 * @param {Array} input
	 */
	set complementA(input) {
		this._complementA = input
	}

	get complementA() {
		return this._complementA
	}

	/**
	 * @param {Array} input
	 */
	set complementB(input) {
		this._complementB = input
	}

	get complementB() {
		return this._complementB
    }
    
    /**
	 * @param {Array} input
	 */
	set complementD(input) {
		this._complementD = input
	}

	get complementD() {
		return this._complementD
	}

    /**
     * @param {Array} weight
     */
    set weightInput(weight) {
        this._wInput = weight
    }

    get weightInput() {
        return this._wInput
    }

    /**
     * @param {Array} weight
     */
    set weightOutput(weight) {
        this._wOutput = weight
    }

    get weightOutput() {
        return this._wOutput
	}

    inicializaValores(nmroLinhas, nmroColunas, valor) {
        let entrada

        if (nmroLinhas === 0) {

            entrada = new Array(nmroColunas)

            for (let i = 0; i < nmroColunas; i++) {
                entrada[i] = new Array(nmroColunas)
            }

            for (let i = 0; i < nmroColunas; i++) {
                entrada[i] = valor
            }

        }
        else {
            entrada = new Array(nmroLinhas)

            for (let i = 0; i < nmroLinhas; i++) {
                entrada[i] = new Array(nmroColunas)
            }

            for (let i = 0; i < nmroLinhas; i++) {
                for (let j = 0; j < nmroColunas; j++) {
                    entrada[i][j] = valor
                }
            }
        }

        return entrada
    }

    realizaComplemento(entrada, nmroLinhas, nmroColunas) {

        let aux
        let complemento

        //Vetor
        if (nmroLinhas === 0) {

            //Inicializa matriz com linhas da quantidade de colunas do vetor original
            complemento = new Array(nmroColunas)

            for (let i = 0; i < nmroColunas; i++) {
                complemento[i] = new Array(2)
            }

            aux = new Array(nmroColunas)

            for (let i = 0; i < nmroColunas; i++) {
                aux[i] = 1 - entrada[i]
            }

            nmroLinhas = nmroColunas
            for (let i = 0; i < nmroLinhas; i++) {
                for (let j = 0; j < 2; j++) {
                    if (j === 0) {
                        complemento[i][j] = entrada[i]
                    } else {
                        complemento[i][j] = aux[i]
                    }
                }
            }
        }
        else { //Matriz
            complemento = new Array(nmroLinhas)

            for (let i = 0; i < nmroLinhas; i++) {
                complemento[i] = new Array(nmroColunas * 2)
            }

            aux = new Array(nmroLinhas)

            for (let i = 0; i < nmroLinhas; i++) {
                aux[i] = new Array(nmroColunas)
            }

            for (let i = 0; i < nmroLinhas; i++) {
                for (let j = 0; j < nmroColunas; j++) {
                    aux[i][j] = 1 - entrada[i][j]
                }
            }

            for (let i = 0; i < nmroLinhas; i++) {
                for (let j = 0; j < nmroColunas; j++) {
                    complemento[i][j] = entrada[i][j]
                }
            }

            for (let i = 0; i < nmroLinhas; i++) {
                for (let j = (nmroColunas * 2) / 2; j < nmroColunas * 2; j++) {
                    complemento[i][j] = aux[i][j - ((nmroColunas * 2) / 2)]
                }
            }
        }

        return complemento
    }

    normalizaDados(entrada, nmroLinhas, nmroColunas) {

        let total = 0
        let normaliza = false

        //Vetor
        if (nmroLinhas === 0) {
            for (let i = 0; i < nmroColunas; i++) {
                if (entrada[i] < 0 || entrada[i] > 1) {
                    normaliza = true
                }
                total += entrada[i]
            }
            if (normaliza) {
                for (let i = 0; i < nmroColunas; i++) {
                    entrada[i] /= total
                }
            }
        }
        else { //Matriz
            for (let i = 0; i < nmroLinhas; i++) {
                for (let j = 0; j < nmroColunas; j++) {
                    if (entrada[i][j] < 0 || entrada[i][j] > 1) {
                        normaliza = true
                    }
                    total += entrada[i][j]
                }
            }
            if (normaliza) {
                for (let i = 0; i < nmroLinhas; i++) {
                    for (let j = 0; j < nmroColunas; j++) {
                        entrada[i][j] /= total
                    }
                }
            }
        }

        return entrada
    }

	somaColunas(linha, entrada, nmroColunas) {

		let soma = 0

		for (let i = 0; i < Array.length; i++) {
			for (let j = 0; j < nmroColunas; j++) {
				soma += entrada[linha][j]
			}
		}

		return soma
	}

	criaCategorias(entrada, peso, linha, nmroLinhas, nmroColunas) {

		let matrizCat = this.inicializaValores(nmroLinhas, nmroColunas, 0)

		for (let i = 0; i < nmroLinhas; i++) {
			for (let j = 0; j < nmroColunas; j++) {
				if (entrada[linha][j] < peso[i][j]) {
					matrizCat[i][j] = entrada[linha][j]
				} else {
					matrizCat[i][j] = peso[i][j]
				}
			}
		}

		let somaColunasMat = this.inicializaValores(nmroLinhas, 0, 0)

		for (let i = 0; i < nmroLinhas; i++) {
			somaColunasMat[i] = this.somaColunas(i, matrizCat, nmroColunas)
		}

		let somaPeso = this.inicializaValores(nmroLinhas, 0, 0)

		for (let i = 0; i < nmroLinhas; i++) {
			somaPeso[i] = this.somaColunas(i, peso, nmroColunas)
		}

		let categorias = this.inicializaValores(nmroLinhas, 0, 0)

		for (let i = 0; i < nmroLinhas; i++) {
			categorias[i] = somaColunasMat[i] / (this._alpha + somaPeso[i])
		}

		return categorias

	}

	vigilanciaAuxiliar(entrada, peso, nmroLinhas, nmroColunas) {

		let vigilancia = this.inicializaValores(nmroLinhas, nmroColunas, 0)

		for (let i=0; i<nmroLinhas; i++){
            for (let j = 0; j < nmroColunas; j++) {
                if (entrada[i][j] < peso[i][j]) {
                    vigilancia[i][j] = entrada[i][j]
                } else {
                    vigilancia[i][j] = peso[i][j]
                }
            }
        }

		return vigilancia
	}

	realizaTesteDeVigilancia(entrada, peso, linha, catVencedora, nmroLinhas, nmroColunas) {

		let matrizVig = this.inicializaValores(nmroLinhas, nmroColunas, 0)

		for (let i = 0; i < nmroLinhas; i++) {
			for (let j = 0; j < nmroColunas; j++) {
				if (entrada[catVencedora][j] < peso[catVencedora][j]) {
					matrizVig[linha][j] = entrada[catVencedora][j]
				} else {
					matrizVig[linha][j] = peso[catVencedora][j]
				}
			}
		}

		let somaVigilancia = this.inicializaValores(nmroLinhas, nmroColunas, 0)
		let somaEntrada = this.inicializaValores(nmroLinhas, nmroColunas, 0)

		for (let i = 0; i < nmroLinhas; i++) {
			somaVigilancia[i] = this.somaColunas(i, matrizVig, nmroColunas)
			somaEntrada[i] = this.somaColunas(i, entrada, nmroColunas)
		}

		let testeDeVigilancia = this.inicializaValores(nmroLinhas, nmroColunas, 0)

		for (let i = 0; i < nmroLinhas; i++) {
			testeDeVigilancia[i] = somaVigilancia[i] / somaEntrada[i]
		}

		return testeDeVigilancia
	}


	criaMatrizMatchTracking(entrada, peso, catVencedora, linha, nmroLinhas, nmroColunas) {

		let matrizMatch = this.inicializaValores(nmroLinhas, nmroColunas, 0)

		for (let i = 0; i < nmroLinhas; i++) {
			for (let j = 0; j < nmroColunas; j++) {
				if (entrada[linha][j] < peso[catVencedora][j]) {
					matrizMatch[linha][j] = entrada[linha][j]
				} else {
					matrizMatch[linha][j] = peso[catVencedora][j]
				}
			}
		}

		return matrizMatch
	}

	realizaMatchTracking(entrada, peso, linha, catVencedora, nmroLinhas, nmroColunas) {

		let matrizMatch = this.inicializaValores(nmroLinhas, nmroColunas, 0)

		for (let i = 0; i < nmroLinhas; i++) {
			for (let j = 0; j < nmroColunas; j++) {
				if (entrada[linha][j] < peso[catVencedora][j]) {
					matrizMatch[linha][j] = entrada[linha][j]
				} else {
					matrizMatch[linha][j] = peso[catVencedora][j]
				}
			}
		}

		let somaColMatch = this.inicializaValores(nmroLinhas, nmroColunas, 0)
		let somaColEntrada = this.inicializaValores(nmroLinhas, nmroColunas, 0)

		for (let i = 0; i < nmroLinhas; i++) {
			somaColMatch[i] = this.somaColunas(i, matrizMatch, nmroColunas)
			somaColEntrada[i] = this.somaColunas(i, entrada, nmroColunas)
		}

		let resMatchTracking = this.inicializaValores(nmroLinhas, nmroColunas, 0)

		for (let i = 0; i < nmroLinhas; i++) {
			resMatchTracking[i] = somaColMatch[i] / somaColEntrada[i]
		}

		return resMatchTracking
	}

	retornaCategoriaVencedora(Categorias) {

		let maior = Math.max(...Categorias)
		let catVencedora = Categorias.indexOf(maior)

		return catVencedora
    }

	atualizaPeso(peso, vigilancia, catVencedora, linha, nmroColunas) {
        let newWeight = peso

		for (let j = 0; j < nmroColunas; j++) {
            newWeight[catVencedora][j] = (this._beta * vigilancia[linha][j]) + ((1 - this._beta) * peso[catVencedora][j])
        }
        
        return newWeight
	}

	atualizaPesoInterArt(peso, catVencedoraA, catVencedoraB, vetorK, linha, nmroColunas) {

		for (let j = 0; j < nmroColunas; j++) {
			peso[catVencedoraA][j] = 0
		}

		catVencedoraB = vetorK[linha]
		peso[catVencedoraA][catVencedoraB] = 1

		return peso
	}

	criaMatrizDeAtividades(entrada, catVencedora, linha) {

		entrada[linha][catVencedora] = 1

		return entrada
	}

	criaMatrizDeAtividadesInterArt(entrada, peso, linha, nmroColunas) {

		let mtInterArt = this.inicializaValores(nmroColunas, nmroColunas, 0)

		for (let j = 0; j < nmroColunas; j++) {
			mtInterArt[linha][j] = entrada[linha][j] * peso[linha][j]
		}

		return mtInterArt
	}

	verificaConhecimento(entrada, linha, nmroColunas) {

		let fim = this.inicializaValores(0, nmroColunas, 0)

		for (let j = 0; j < nmroColunas; j++) {
			if (entrada[linha][j] === 1) {
				fim[linha] = j
				continue
			}
		}

		return fim
	}

	criaMatrizDeDiagnostico(peso, conhecimento, nmroLinhas, nmroColunas) {

		let mtDiagnostico = this.inicializaValores(nmroLinhas, nmroColunas, 0)

		for (let i = 0; i < nmroLinhas; i++) {
			for (let j = 0; j < nmroColunas; j++) {
				mtDiagnostico[i][j] = peso[conhecimento[i]][j]
			}
		}

		return mtDiagnostico
	}

	verificaRessonancia(diagnostico, peso, nmroLinhas, nmroColunas) {

		let ressonacia = this.inicializaValores(nmroLinhas, nmroColunas, 0)

		for (let i = 0; i < nmroLinhas; i++) {
			for (let j = 0; j < nmroColunas; j++) {
				if (diagnostico[i][j] === peso[i][j]) {
					ressonacia[i] = 1
				}
			}
		}

		return ressonacia
	}

    artB() {

		console.log("_______________ ART B _______________")
		
		const rowsOutput = this._complementB.length
		const colsOutput = this._complementB[0].length
		
        const output = this._complementB

        const colsYBOutput = this._complementB[0].length

        for (let i = 0; i < rowsOutput; i++) {

            let wB = this._wOutput

            //Cria categorias
			let Tb = this.criaCategorias(output, wB, i, rowsOutput, colsOutput)
            console.log("Categorias B criadas: ")
            console.log(Tb)

			//Retorna maior categoria
			this._K = this.retornaCategoriaVencedora(Tb)
			console.log("Categoria vencedora " + i + ": " + this._K)

			//Envia valor de K para o Art A
			this._posiK[i] = this._K

            //Teste de vigilancia
			let tVigilanciaB = this.realizaTesteDeVigilancia(output, wB, i, this._K, rowsOutput, colsOutput)
            console.log("Teste de vigilancia B " + i + ": " + tVigilanciaB)

            while (tVigilanciaB[i] <= this._pB) {

                //Recria categorias
                Tb[this._K] = 0
				this.valueK = this.retornaCategoriaVencedora(Tb)
				console.log("Nova categoria vencedora B " + i + ": " + this._K)

                //Vigilancia final
				tVigilanciaB = this.realizaTesteDeVigilancia(output, wB, i, this._K, rowsOutput, colsOutput)
                console.log("Novo teste de vigilancia " + i + ": " + tVigilanciaB)

            }//Fim While

            //Vigilancia para atualizar pesos (AND)
            let andB = this.vigilanciaAuxiliar(output, wB, rowsOutput, colsOutput)
            
            //Atualiza o peso Wb
            this._wOutput = this.atualizaPeso(wB, andB, this._K, i, colsOutput)

            //Matriz de Atividades B
			let ybAux = this.criaMatrizDeAtividades(this._yb, this._K, i)

			for (let j = 0; j < colsYBOutput; j++) {
                this._yb[i][j] = ybAux[i][j]
            }

        }//Fim for

        console.log('\n')
        console.log("_______________ SAÍDA B: _______________")
        console.log("Saida desejada: ")
        console.log(this._complementB)
        console.log("Matriz de Atividades B:")
        console.log(this._yb)
        console.log('\n')

        return this._wOutput
    }

    artA() {

		console.log("_______________ ART A _______________")

		const rowsInput = this._complementA.length
		const colsInput = this._complementA[0].length

		const input = this._complementA
		
        for (let i = 0; i < rowsInput; i++) {

			const wA = this._wInput

			const rowsWAB = this._wAB.length
			const colsWAB = this._wAB[0].length
			const wAB = this._wAB

            //Categorias
			let Ta = this.criaCategorias(input, wA, i, rowsInput, colsInput)
            console.log("Categorias criadas A: ")
            console.log(Ta)

            //Encontra maior categoria
			let J = this.retornaCategoriaVencedora(Ta)
            console.log("Categoria vencedora A " + i + ": " + J)

            //Teste de vigilancia
			let tVigilanciaA = this.realizaTesteDeVigilancia(input, wA, i, J, rowsInput, colsInput)
            console.log("Teste de vigilancia A " + i + ": " + tVigilanciaA)

            //Match tracking
			let mtAux = this.criaMatrizMatchTracking(this._yb, wAB, J, i, rowsWAB, colsWAB)

            //Salva matriz do mt
            for (let x = 0; x < rowsWAB; x++) {
                for (let j = 0; j < colsWAB; j++) {
                    this._mt[i][j] = mtAux[i][j]
                }
            }

			let validaMatch = this.realizaMatchTracking(this._yb, wAB, i, J, rowsWAB, colsWAB)
            console.log("Match tracking " + i + ": " + validaMatch)

            //Valida o Match Tracking
            while (validaMatch[i] <= this._pAB) {

                //Categorias
                Ta[J] = 0
				J = this.retornaCategoriaVencedora(Ta)
                console.log("Nova categoria vencedora A " + i + ": " + J)

                //Teste de vigilancia
				tVigilanciaA = this.realizaTesteDeVigilancia(input, wA, i, J, rowsInput, colsInput)
                console.log("Novo teste de vigilancia A " + i + ": " + tVigilanciaA)

                //Valida Vigilancia
                while (tVigilanciaA[i] <= this._pA) {

                    //Recria categorias
                    Ta[J] = 0
					J = this.retornaCategoriaVencedora(Ta)
                    console.log("Nova categoria vencedora " + i + ": " + J)

                    //Teste Vigilancia
					tVigilanciaA = this.realizaTesteDeVigilancia(input, wA, i, J, rowsInput, colsInput)
                    console.log("Valida teste de vigilancia A" + i + ": " + tVigilanciaA)

                }//Fim While Vigilancia

                //Refaz o match tracking
				mtAux = this.criaMatrizMatchTracking(this._yb, wAB, J, i, rowsWAB, colsWAB)

                for (let x = 0; x < rowsWAB; x++) {
                    for (let j = 0; j < colsWAB; j++) {
                        this._mt[i][j] = mtAux[i][j]
                    }
                }

				validaMatch = this.realizaMatchTracking(this._yb, wAB, i, J, rowsWAB, colsWAB)
                console.log("Valida match tracking " + i + ": " + validaMatch)

            }//Fim do while Match

            //Teste de vigilancia auxiliar para atualizar o peso
			let andA = this.vigilanciaAuxiliar(input, wA, rowsInput, colsInput)

            //Atualiza o peso Wa
			this._wInput = this.atualizaPeso(wA, andA, J, i, colsInput)

            //Matriz de atividades A
			let yaAux = this.criaMatrizDeAtividades(this._ya, J, i)

			for (let j = 0; j < colsInput; j++) {
                this._ya[i][j] = yaAux[i][j]
            }

            //Atualiza Peso Inter Art
			this._wAB = this.atualizaPesoInterArt(wAB, J, this._K, this._posiK, i, colsWAB)

        }//Fim for

        console.log('\n')
        console.log("_______________ SAÍDA A: _______________")
        console.log("Entrada A: ")
        console.log(this._complementA)
        console.log("Match Tracking:")
        console.log(this._mt)
        console.log("WAB Atualizado: ")
        console.log(this._wAB)
        console.log("Matriz de Atividades A:")
        console.log(this._ya)
        console.log('\n')

		return this._wInput
    }

    diagnostico() {

		console.log("_______________ DIAGNÓSTICO _______________")
		
		const inputD = this._complementD
		const rowsInputD = this._complementD.length
		const colsInputD = this._complementD[0].length

		const wOutput = this._wOutput
		const rowsOutput = this._complementB.length
		const colsOutput = this._complementB[0].length

		const colsWAB = this._wAB[0].length

        for (let i = 0; i < rowsInputD; i++) {

            const wA = this._wInput
            
            //Categorias
            let Td = this.criaCategorias(inputD, wA, i, rowsInputD, colsInputD)
            console.log("Categorias criadas D: ")
            console.log(Td)

            //Encontra categoria vencedora
			let D = this.retornaCategoriaVencedora(Td)
            console.log("Categoria vencedora D " + i + ": " + D)

            //Realiza Vigilancia
            let tVigilanciaD = this.realizaTesteDeVigilancia(inputD, wA, i, D, rowsInputD, colsInputD)
            console.log("Teste de vigilancia D " + i + ": " + tVigilanciaD)

            //Valida Vigilancia
            while (tVigilanciaD[i] <= this._pD) {

                //Recria categorias
                Td[D] = 0
				D = this.retornaCategoriaVencedora(Td)
                console.log("Nova categoria vencedora D" + i + ": " + D)

                tVigilanciaD = this.realizaTesteDeVigilancia(inputD, wA, i, D, rowsInputD, colsInputD)
                console.log("Valida teste de vigilancia D" + i + ": " + tVigilanciaD)

            }//Fim While Vigilancia

            //Matriz de atividades (Ressonância) D
			let ydAux = this.criaMatrizDeAtividades(this._yd, D, i)

			for (let j = 0; j < colsInputD; j++) {
                this._yd[i][j] = ydAux[i][j]
            }

            //Matriz de Atividades inter art 
			let ybdAux = this.criaMatrizDeAtividadesInterArt(this._yd, this._wAB, i, colsWAB)

			for (let j = 0; j < colsWAB; j++) {
                this._ybd[i][j] = ybdAux[i][j]
            }

            //Verifica o conhecimento da rede
			fimAux = this.verificaConhecimento(this._ybd, i, colsWAB)
            this._end[i] = fimAux[i]

        }//Fim do for

        //Matriz de diagnóstico
		this._wBD = this.criaMatrizDeDiagnostico(wOutput, this._end, rowsOutput, colsOutput)

        //Verifica ressonância (Categorias validadas)
		let ressonacia = this.verificaRessonancia(this._wBD, wOutput, rowsOutput, colsOutput)

        console.log('\n')
        console.log("_______________ SAÍDA D: _______________")
        console.log("Entrada D:")
        console.log(this._complementD)
        console.log("Matriz de atividades D:")
        console.log(this._yd)
        console.log("Matriz de atividades Inter Art D:")
        console.log(this._ybd)
        console.log("Matriz de diagnóstico D:")
		console.log(this._wBD)
        console.log("Categoria(s) com ressonância:")
        console.log(ressonacia)
    }


}

module.exports = NetworkController

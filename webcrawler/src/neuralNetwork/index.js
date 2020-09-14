const Url = require('../models/Url')
const { json } = require('express')
const entrada = []

module.exports = async () => {

	const dados = await Url.find({}, '-_id tagsWithoutStopwords.value')
	const tags = dados.map(tag => tag.tagsWithoutStopwords)
	const valor = tags.map((tag) => { return tag.map(({ value }) => value) })

	//entrada.push(valor)
	//console.log(valor)
}	

	
//_______________ Funções da Rede _______________//

function normalizaDados(entrada, nmroLinhas, nmroColunas) {

	let total = 0
	let normaliza = false

	//Vetor
	if (nmroLinhas === 0) {
		for (let i = 0; i < nmroColunas; i++) {
			if (entrada[i] < 0 || entrada[i] > 1){
				normaliza = true
			}
			total += entrada[i]
		}
		if (normaliza){
			for (let i = 0; i < nmroColunas; i++) {
				entrada[i] /= total
			}
		}
	} 
	else{ //Matriz
		for (let i = 0; i < nmroLinhas; i++) {
			for (let j = 0; j < nmroColunas; j++){
				if (entrada[i][j] < 0 || entrada[i][j] > 1){
					normaliza = true	
				}
				total += entrada[i][j]
			}
		}
		if (normaliza){
			for (let i = 0; i < nmroLinhas; i++) {
				for (let j = 0; j < nmroColunas; j++) {
					entrada[i][j] /= total
				}
			}
		}
	}

	return entrada
}

function realizaComplemento(entrada, nmroLinhas, nmroColunas){

	let aux
	let complemento

	//Vetor
	if (nmroLinhas === 0){

		//Inicializa matriz com linhas da quantidade de colunas do vetor original
		complemento = new Array(nmroColunas)

		for(let i=0; i<nmroColunas; i++){
			complemento[i] = new Array(2)
		}
		
		aux = new Array(nmroColunas)

		for (let i=0; i<nmroColunas; i++){
			aux[i] = 1 - entrada[i]
		}

		nmroLinhas = nmroColunas
		for (let i=0; i<nmroLinhas; i++){
			for(let j=0; j<2; j++){
				if(j === 0){
					complemento[i][j] = entrada[i]
				}else{
					complemento[i][j] = aux[i]
				}
			}
		}
	}
	else{ //Matriz
		complemento = new Array(nmroLinhas) 

		for(let i=0; i<nmroLinhas; i++){
			complemento[i] = new Array(nmroColunas*2)
		}
		
		aux = new Array(nmroLinhas) 

		for(let i=0; i<nmroLinhas; i++){
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
			for (let j = (nmroColunas*2)/2; j < nmroColunas*2; j++) {
				complemento[i][j] = aux[i][j-((nmroColunas*2)/2)]
			}
		}
	}

	return complemento
}

function somaColunas(linha, entrada, nmroColunas) {

	let soma = 0

	for (let i = 0; i < Array.length; i++) {
		for (let j = 0; j < nmroColunas; j++) {
			soma += entrada[linha][j]
		}
	}

	return soma
}

function CriaCategorias(entrada, peso, linha, nmroLinhas, nmroColunas) {

	//Verifica dimensão correta
	if (nmroColunas === 2) {
		var matrizCat = [[0, 0], [0, 0], [0, 0]]
	} else {
		var matrizCat = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
	}

	for (let i = 0; i < nmroLinhas; i++) {
		for (let j = 0; j < nmroColunas; j++) {
			if (entrada[linha][j] < peso[i][j]) {
				matrizCat[i][j] = entrada[linha][j]
			} else {
				matrizCat[i][j] = peso[i][j]
			}
		}
	}

	let somaColunasMat = [0, 0, 0]

	for (let i = 0; i < nmroLinhas; i++) {
		somaColunasMat[i] = somaColunas(i, matrizCat, nmroColunas)
	}

	let somaPeso = [0, 0, 0]

	for (let i = 0; i < nmroLinhas; i++) {
		somaPeso[i] = somaColunas(i, peso, nmroColunas)
	}

	let categorias = [0, 0, 0]

	for (let i = 0; i < nmroLinhas; i++) {
		categorias[i] = somaColunasMat[i] / (alfa + somaPeso[i])
	}

	return categorias

}

function realizaTesteDeVigilancia(entrada, peso, linha, catVencedora, nmroLinhas, nmroColunas) {

	//Verifica dimensão correta
	if(nmroColunas === 2){
		var matrizVig = [[0, 0], [0, 0], [0, 0]]
	}else{
		var matrizVig = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
	}

	for (let i = 0; i < nmroLinhas; i++) {
		for (let j = 0; j < nmroColunas; j++) {
			if (entrada[catVencedora][j] < peso[catVencedora][j]) {
				matrizVig[linha][j] = entrada[catVencedora][j]
			} else {
				matrizVig[linha][j] = peso[catVencedora][j]
			}
		}
	}

	let somaVigilancia = [0, 0, 0], somaEntrada = [0, 0, 0]

	for (let i = 0; i < nmroLinhas; i++) {
		somaVigilancia[i] = somaColunas(i, matrizVig, nmroColunas)
		somaEntrada[i] = somaColunas(i, entrada, nmroColunas)
	}

	let testeDeVigilancia = [0, 0, 0]

	for (let i = 0; i < nmroLinhas; i++) {
		testeDeVigilancia[i] = somaVigilancia[i] / somaEntrada[i]
	}

	return testeDeVigilancia
}

function realizaMatchTracking(entrada, peso, linha, catVencedora, nmroLinhas, nmroColunas) {

	let matrizMatch = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]

	for (let i = 0; i < nmroLinhas; i++) {
		for (let j = 0; j < nmroColunas; j++) {
			if (entrada[linha][j] < peso[catVencedora][j]) {
				matrizMatch[linha][j] = entrada[linha][j]
			} else {
				matrizMatch[linha][j] = peso[catVencedora][j]
			}
		}
	}

	let somaColMatch = [0, 0, 0]
	let somaColEntrada = [0, 0, 0]

	for (let i = 0; i < nmroLinhas; i++) {
		somaColMatch[i] = somaColunas(i, matrizMatch, nmroColunas)
		somaColEntrada[i] = somaColunas(i, entrada, nmroColunas)
	}

	let resMatchTracking = [0, 0, 0]

	for (let i = 0; i < nmroLinhas; i++) {
		resMatchTracking[i] = somaColMatch[i] / somaColEntrada[i]
	}

	return resMatchTracking
}

//_______________ Variáveis de Controle da Rede _______________//

var i = 0, j = 0
const pa = 0.95, pb = 1, pab = 0.95
const alfa = 0.1, beta = 1
var fase = 0 //Treinamento

//_______________ Preparação ART B _______________//

var nmroLinhasB = 0, nmroColunasB = 3
var nmroLinhasWB = 3, nmroColunasWB = 2

var wb = [[1, 1], [1, 1], [1, 1]] //Peso
var b = [1, 0, 1] //Entrada 
var yb = [[0, 0, 0], [0, 0, 0], [0, 0, 0]] //Matriz de atividades

//Normalização (caso valores < 0 ou > 1)
normalizaDados(b, nmroLinhasB, nmroColunasB)

//Complemento (1 - b)
var complementoB = realizaComplemento(b, nmroLinhasB, nmroColunasB)

//_______________ Preparação ART A _______________//

var nmroLinhasA = 3, nmroColunasA = 2
var nmroLinhasWA = 3, nmroColunasWA = 4
var nmroLinhasWAB = 3, nmroColunasWAB = 3

var wa = [[1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1]] //Peso 
var a = [[1, 0], [0, 1], [0.5, 0.5]] //Entrada 
var wab = [[1, 1, 1], [1, 1, 1], [1, 1, 1]] //Peso Inter Art
var ya = [[0, 0, 0], [0, 0, 0], [0, 0, 0]] //Matriz de atividades 

//Normalização (caso valores < 0 ou > 1)
normalizaDados(a, nmroLinhasA, nmroColunasA)

//Complemento (1 - a)
var complementoA = realizaComplemento(a, nmroLinhasA, nmroColunasA)

//console.log("_______________ ART B _______________")
 
let Tb = [0, 0, 0] //Vetor de categorias
var posiK = [0, 0, 0] //Vetor de categoria vencedora auxiliar
let x = 0, y = 0, k = 0

for (i = 0; i < 3; i++) {

	//Categorias
	Tb = CriaCategorias(complementoB, wb, i, nmroLinhasWB, nmroColunasWB)
	//console.log("Categorias criadas: ")
	//console.log(Tb)

	//Encontra categoria vencedora
	let maiorB = Math.max(...Tb)
	var K = Tb.indexOf(maiorB)
	//console.log("Categoria Vencedora K (" + i + "): " + K)

	//Envia valor de K para o Art A
	posiK[i] = K

	//Teste de vigilancia
	let vigilanciaB = [[0, 0], [0, 0], [0, 0]]

	for (j = 0; j < 2; j++) {
		if (complementoB[K][j] < wb[K][j]) {
			vigilanciaB[i][j] = complementoB[K][j]
		} else {
			vigilanciaB[i][j] = wb[K][j]
		}
	}

	tVigilanciaB = realizaTesteDeVigilancia(complementoB, wb, i, K, nmroLinhasWB, nmroColunasWB)
	//console.log("Teste de vigilancia " + i + ": " + tVigilanciaB)

	//Valida vigilancia
	while (tVigilanciaB[i] < pb) {

		//Recria categorias
		Tb[K] = 0
		maiorB = Math.max(...Tb)
		K = Tb.indexOf(maiorB)
		//console.log("Nova categoria vencedora K (" + i + "): " + K)

		//Teste de vigilancia
		for (j = 0; j < 2; j++) {
			if (complementoB[K][j] < wb[K][j]) {
				vigilanciaB[i][j] = complementoB[K][j]
			} else {
				vigilanciaB[i][j] = wb[K][j]
			}
		}

		tVigilanciaB = realizaTesteDeVigilancia(complementoB, wb, i, K, nmroLinhasWB, nmroColunasWB)
		//console.log("Novo teste de vigilancia " + i + ": " + tVigilanciaB)

	}//Fim While

	//Atualiza o peso Wb
	for (j = 0; j < 2; j++) {
		wb[K][j] = beta * vigilanciaB[i][j] + (1 - beta) * wb[K][j]
	}

	//Matriz de Atividades B
	yb[i][K] = 1

	//Zera categorias
	Tb = []

}//Fim for art B

console.log("Entrada B: ")
console.log(complementoB)
console.log("WB Atualizado: ")
console.log(wb)
console.log("Matriz de Atividades B:")
console.log(yb)
console.log('\n')

console.log("_______________ ART A _______________")

let Ta = [0, 0, 0]
let J = 0
let maiorA = 0
let vigilanciaA = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
var mt = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
let validaMatch = [0, 0, 0]
let tVigilanciaA = [0, 0, 0]

for (i = 0; i < 3; i++) {

	//Categorias
	Ta = CriaCategorias(complementoA, wa, i, nmroLinhasWA, nmroColunasWA)
	//console.log("Categorias criadas A: ")
	//console.log(Ta)

	//Encontra maior categoria
	maiorA = Math.max(...Ta)
	J = Ta.indexOf(maiorA)
	//console.log("Categoria vencedora J (" + i + "): " + J)

	//Teste de vigilancia auxiliar para atualizar o peso
	for (j = 0; j < 4; j++) {
		if (complementoA[J][j] < wa[J][j]) {
			vigilanciaA[i][j] = complementoA[J][j]
		} else {
			vigilanciaA[i][j] = wa[J][j]
		}
	}

	//Teste de vigilancia
	tVigilanciaA = realizaTesteDeVigilancia(complementoA, wa, i, J, nmroLinhasWA, nmroColunasWA)
	//console.log("Teste de vigilancia A " + i + ": " + tVigilanciaA)

	//Match tracking
	for (x = 0; x < 3; x++) {
		for (j = 0; j < 3; j++) {
			if (yb[x][j] < wab[J][j]) {
				mt[x][j] = yb[x][j]
			} else {
				mt[x][j] = wab[J][j]
			}
		}
	}

	validaMatch = realizaMatchTracking(yb, wab, i, J, nmroLinhasWAB, nmroColunasWAB)
	//console.log("Match tracking " + i + ": " + validaMatch)

	//Valida o Match Tracking
	while (validaMatch[i] < pab) {

		//Categorias
		Ta[J] = 0
		maiorA = Math.max(...Ta)
		J = Ta.indexOf(maiorA)
		//console.log("Nova categoria vencedora J (" + i + "): " + J)

		//Teste de vigilancia
		tVigilanciaA = realizaTesteDeVigilancia(complementoA, wa, i, J, nmroLinhasWA, nmroColunasWA)
		//console.log("Novo teste de vigilancia A " + i + ": " + tVigilanciaA)

		//Valida Vigilancia
		while (tVigilanciaA[i] < pa) {

			//Recria categorias
			Ta[J] = 0
			maiorA = Math.max(...Ta)
			J = Ta.indexOf(maiorA)
			//console.log("Nova categoria vencedora J (" + i + "): " + J)

			//Teste Vigilancia
			tVigilanciaA = realizaTesteDeVigilancia(complementoA, wa, i, J, nmroLinhasWA, nmroColunasWA)
			//console.log("Valida teste de vigilancia A" + i + ": " + tVigilanciaA)

		}//Fim While Vigilancia

		//Refaz o match tracking
		mt = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]

		for (x = 0; x < 3; x++) {
			for (j = 0; j < 3; j++) {
				if (yb[x][j] < wab[J][j]) {
					mt[x][j] = yb[x][j]
				} else {
					mt[x][j] = wab[J][j]
				}
			}
		}

		validaMatch = realizaMatchTracking(yb, wab, i, J, nmroLinhasWAB, nmroColunasWAB)
		//console.log("Valida match tracking " + i + ": " + validaMatch)

	}//Fim do while Match

	//Atualiza o peso Wa
	for (j = 0; j < 4; j++) {
		wa[J][j] = beta * vigilanciaA[i][j] + (1 - beta) * wa[J][j]
	}

	//Matriz de atividades A
	ya[i][J] = 1

	//Atualiza Peso Inter Art
	for (j = 0; j < 3; j++) {
		wab[J][j] = 0
	}
	K = posiK[i] //Obtém valores de K de art B
	wab[J][K] = 1

	//Zera categorias
	Ta = []

}//Fim for art A

console.log("Entrada A: ")
console.log(complementoA)
console.log("Match Tracking:")
console.log(mt)
console.log("WA Atualizado: ")
console.log(wa)
console.log("WAB Atualizado: ")
console.log(wab)
console.log("Matriz de Atividades A:")
console.log(ya)
console.log('\n')


//_______________ DIAGNOSTICO _______________//

fase = 0 //Ativa diagnostico caso 1

var nmroLinhasD = 3, nmroColunasD = 2

var pd = 0.5
var d = [[1, 1], [0.5, 1], [0.2, 0.9]]
var yd = [[0, 0, 0], [0, 0, 0], [0, 0, 0]] //Matriz de atividades D
var ybd = [[0, 0, 0], [0, 0, 0], [0, 0, 0]] //Matriz de atividades Inter Art
var wbd = [[0, 0], [0, 0], [0, 0]] //Matriz de conhecimento da rede
let Td = [0, 0, 0]
var fim = [0, 0, 0]
var tVigilanciaD = [0, 0, 0]

if (fase === 1) {

	console.log("_______________ DIAGNÓSTICO _______________")

	//Normalização (caso valores < 0 ou > 1)
	normalizaDados(d, nmroLinhasD, nmroColunasD)

	//Complemento (1 - d)
	var complementoD = realizaComplemento(d, nmroLinhasD, nmroColunasD)

	for (i = 0; i < 3; i++) {

		//Categorias
		Td = CriaCategorias(complementoD, wa, i, nmroLinhasWA, nmroColunasWA)
		//console.log("Categorias criadas D: ")
		//console.log(Td)

		//Encontra categoria vencedora
		let maiorD = Math.max(...Td)
		let D = Td.indexOf(maiorD)
		//console.log("Categoria vencedora D (" + i + "): " + D)

		//Teste de vigilancia
		let vigilanciaD = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]

		for (j = 0; j < 4; j++) {
			if (complementoD[D][j] < wa[D][j]) {
				vigilanciaD[i][j] = complementoD[D][j]
			} else {
				vigilanciaD[i][j] = wa[D][j]
			}
		}

		tVigilanciaD = realizaTesteDeVigilancia(complementoD, wa, i, D, nmroLinhasWA, nmroColunasWA)
		//console.log("Teste de vigilancia D " + i + ": " + tVigilanciaD)

		//Valida Vigilancia
		while (tVigilanciaD[i] < pd) {

			//Recria categorias
			Td[D] = 0
			maiorD = Math.max(...Td)
			D = Td.indexOf(maiorD)
			//console.log("Nova categoria vencedora D (" + i + "): " + D)

			//Teste Vigilancia
			for (j = 0; j < 4; j++) {
				if (complementoD[D][j] < wa[D][j]) {
					vigilanciaD[i][j] = complementoD[D][j]
				} else {
					vigilanciaD[i][j] = wa[D][j]
				}
			}

			tVigilanciaD = realizaTesteDeVigilancia(complementoD, wa, i, D, nmroLinhasWA, nmroColunasWA)
			//console.log("Valida teste de vigilancia D" + i + ": " + tVigilanciaD)

		}//Fim While Vigilancia

		//Matriz de atividades (Ressonância) D
		yd[i][D] = 1

		//Matriz de Atividades inter art 
		for (j = 0; j < 3; j++) {
			ybd[i][j] = yd[i][j] * wab[i][j]
		}

		//Verifica o conhecimento da rede
		for (j = 0; j < 3; j++) {
			if (ybd[i][j] === 1) {
				fim[i] = j
				continue
			}
		}

		//Zera categorias
		Td = []

	}//Fim do for fase

	//Cria matriz de diagnóstico
	for (x = 0; x < 3; x++) {
		for (j = 0; j < 2; j++) {
			wbd[x][j] = wb[fim[x]][j]
		}
	}

	//Verifica ressonância (Saídas válidas da rede)
	var ressonacia = [0, 0, 0]

	for (x = 0; x < 3; x++) {
		for (j = 0; j < 2; j++) {
			if (wbd[x][j] === wb[x][j]) {
				ressonacia[x] = 1
			}
		}
	}
	/*
	console.log("Entrada D:")
	console.log(complementoD)
	console.log("Matriz de atividades D:")
	console.log(yd)
	console.log("Matriz de atividades Inter Art D:")
	console.log(ybd)
	console.log("Matriz de diagnóstico D:")
	console.log(wbd)
	console.log("Categorias com ressonância:")
	console.log(ressonacia)*/

}//Fim da fase
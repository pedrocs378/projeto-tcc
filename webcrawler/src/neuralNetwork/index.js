/*
const Url = require('../models/Url')
const Network = require('../models/Network')

module.exports = async (req, res) => {

	// const dados = await Url.find({}, '-_id tagsWithoutStopwords.value')
	// const tags = dados.map(tag => tag.tagsWithoutStopwords)
	// const valor = tags.map((tag) => { return tag.map(({ value }) => value) })

	const url = 'www.teste.com.br'
	const output = [
		[0,1,2],
		[3,4,5],
		[6,7,8],
	]
	const weight = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
	]

	const response = await Network.create({
		url,
		output,
		weight
	})

	return res.json(response)
 
}*/	

/*
//_______________ Controle da Rede _______________//

var i = 0
var j = 0
var pa = 0.95
var pb = 0.9 
var pab = 0.9
var pd = 0.45
var alfa = 0.1
var beta = 1
var fase = 0
var epsilon = 0.01

																			
 var b2 = [
	[
	   0.851,  0.761, 0.1601,  0.947,  0.654,  0.258, 0.1166,  0.743,
	   0.267,  0.764,  0.435,  0.431,  0.432, 0.1446,   0.61,   0.52,
	   0.549,  0.717,  0.953, 0.1317,  0.735,  0.858, 0.1162,  0.875,
	   0.104,  0.651,   0.99, 0.1582, 0.1283,  0.723,   0.76, 0.1022,
	   0.1091,   0.53,  0.866,  0.529, 0.1162, 0.1211,  0.736,  0.104,
	   0.863,  0.533,  0.429,  0.316,  0.757,  0.981,  0.766,  0.109,
	   0.843,  0.862,  0.537,  0.964, 0.1054,  0.426, 0.1072, 0.1399,
	   0.102, 0.1078,  0.752, 0.1088,   0.87, 0.1253,  0.632,  0.865,
	   0.407,   0.66, 0.1067, 0.1075,  0.943, 0.1507, 0.1168,  0.878,
	   0.661,   0.54,  0.854,  0.872, 0.1033,  0.618,  0.886, 0.1295,
	  0.1183, 0.1398,  0.831,  0.415,  0.876,  0.742,  0.118,  0.126,
	   0.727, 0.1491,  0.635,  0.411, 0.1051, 0.1154,  0.941,  0.855],
	[
	   0.851,  0.761, 0.1601,  0.947,  0.654,  0.258, 0.1166,  0.743,
	   0.267,  0.764,  0.435,  0.431,  0.432, 0.1446,   0.61,   0.52,
	   0.549,  0.717,  0.953, 0.1317,  0.735,  0.858, 0.1162,  0.875,
	   0.104,  0.651,   0.99, 0.1582, 0.1283,  0.723,   0.76, 0.1022,
	  0.1091,   0.53,  0.866,  0.529, 0.1162, 0.1211,  0.736,  0.104,
	   0.863,  0.533,  0.429,  0.316,  0.757,  0.981,  0.766,  0.109,
	   0.843,  0.862,  0.537,  0.964, 0.1054,  0.426, 0.1072, 0.1399,
	   0.102, 0.1078,  0.752, 0.1088,   0.87, 0.1253,  0.632,  0.865,
	   0.407,   0.66, 0.1067, 0.1075,  0.943, 0.1507, 0.1168,  0.878,
	   0.661,   0.54,  0.854,  0.872, 0.1033,  0.618,  0.886, 0.1295,
	  0.1183, 0.1398,  0.831,  0.415,  0.876,  0.742,  0.118,  0.126,
	   0.727, 0.1491,  0.635,  0.411, 0.1051, 0.1154,  0.941,  0.855],
	[
	   0.851,  0.761, 0.1601,  0.947,  0.654,  0.258, 0.1166,  0.743,
	   0.267,  0.764,  0.435,  0.431,  0.432, 0.1446,   0.61,   0.52,
	   0.549,  0.717,  0.953, 0.1317,  0.735,  0.858, 0.1162,  0.875,
	   0.104,  0.651,   0.99, 0.1582, 0.1283,  0.723,   0.76, 0.1022,
	  0.1091,   0.53,  0.866,  0.529, 0.1162, 0.1211,  0.736,  0.104,
	   0.863,  0.533,  0.429,  0.316,  0.757,  0.981,  0.766,  0.109,
	   0.843,  0.862,  0.537,  0.964, 0.1054,  0.426, 0.1072, 0.1399,
	   0.102, 0.1078,  0.752, 0.1088,   0.87, 0.1253,  0.632,  0.865,
	   0.407,   0.66, 0.1067, 0.1075,  0.943, 0.1507, 0.1168,  0.878,
	   0.661,   0.54,  0.854,  0.872, 0.1033,  0.618,  0.886, 0.1295,
	  0.1183, 0.1398,  0.831,  0.415,  0.876,  0.742,  0.118,  0.126,
	   0.727, 0.1491,  0.635,  0.411, 0.1051, 0.1154,  0.941,  0.855]
  ]


//var b = [ [0.5, 0.6], [0.9, 0.7], [0.1, 0.3], [0.896, 0.150] ]
//var b = [[0.5, 0.6, 0.7], [0.5, 0.6, 0.7], [0.5, 0.6, 0.7], [0.5, 0.6, 0.7]]

var b = [1, 0, 1]

normalizaDados(b, 0, b.length)
var complementoB = realizaComplemento(b, 0, b.length)

var nmroLinhasB = complementoB.length, nmroColunasB = complementoB[0].length
var nmroLinhasMatAtvdadeB = complementoB.length, nmroColunasMatAtvdadeB = complementoB[0].length + 1

var wb = inicializaValores(complementoB.length, complementoB[0].length, 1) 
var yb = inicializaValores(nmroLinhasMatAtvdadeB, nmroColunasMatAtvdadeB, 0)
var posiK = inicializaValores(0, b.length, 0) 
var K 

artB(complementoB, wb, pb, beta, nmroLinhasB, nmroColunasB)

//_______________ Art A _______________//

//var a2 = [ [ 0.865 ], [ 0.746 ], [ 0.952 ] ]

var a = [[1, 0], [0, 1], [0.5, 0.5]] 

normalizaDados(a, a.length, a[0].length)
var complementoA = realizaComplemento(a, a.length, a[0].length)

var nmroLinhasMatAtvdadeA = complementoA.length, nmroColunasMatAtvdadeA = complementoA[0].length
var nmroLinhasWAB = complementoA.length, nmroColunasWAB = complementoB.length
var nmroLinhasA = complementoA.length, nmroColunasA = complementoA[0].length

var wa = inicializaValores(complementoA.length, complementoA[0].length, 1) 
var wab = inicializaValores(nmroLinhasWAB, nmroColunasWAB, 1)
var ya = inicializaValores(nmroLinhasMatAtvdadeA, nmroColunasMatAtvdadeA, 0)
var mt = inicializaValores(nmroLinhasWAB, nmroColunasWAB, 0) 
var J

artA(complementoA, wa, pa, beta, nmroLinhasA, nmroColunasA)

//_______________ Dados diagnóstico _______________//

var d = [[1, 1], [0.5, 1], [0.2, 0.9]] 

normalizaDados(d, d.length, d[0].length)
var complementoD = realizaComplemento(d, d.length, d[0].length)

var nmroLinhasMatAtvdadeD = complementoD.length, nmroColunasMatAtvdadeD = complementoD[0].length
var nmroLinhasD = complementoD.length, nmroColunasD = complementoD[0].length

var yd = inicializaValores(nmroLinhasMatAtvdadeD, nmroColunasMatAtvdadeD, 0) //Matriz de atividades D
var ybd = inicializaValores(nmroLinhasWAB, nmroColunasWAB, 0) //Matriz de atividades Inter Art
var wbd = inicializaValores(nmroLinhasB, nmroColunasB, 0) //Matriz de conhecimento da rede
var fim = inicializaValores(0, nmroLinhasB, 0) //Vetor auxiliar de conhecimento
var D 

Diagnostico(complementoD, wa, pd, nmroLinhasD, nmroColunasD)

//_______________ FUNÇÕES _______________//

function inicializaValores(nmroLinhas, nmroColunas, valor){

	let entrada

	if (nmroLinhas === 0){

		entrada = new Array(nmroColunas)

		for(let i=0; i<nmroColunas; i++){
			entrada[i] = new Array(nmroColunas)
		}

		for(let i=0; i<nmroColunas; i++){
			entrada[i] = valor
		}
	}
	else
	{
		entrada = new Array(nmroLinhas)

		for(let i=0; i<nmroLinhas; i++){
			entrada[i] = new Array(nmroColunas)
		}

		for(let i=0; i<nmroLinhas; i++){
			for(let j=0; j<nmroColunas; j++){
				entrada[i][j] = valor
			}
		}
	}

	return entrada
}

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

function criaCategorias(entrada, peso, linha, nmroLinhas, nmroColunas) {

	let matrizCat = inicializaValores(nmroLinhas, nmroColunas, 0)

	for (let i = 0; i < nmroLinhas; i++) {
		for (let j = 0; j < nmroColunas; j++) {
			if (entrada[linha][j] < peso[i][j]) {
				matrizCat[i][j] = entrada[linha][j]
			} else {
				matrizCat[i][j] = peso[i][j]
			}
		}
	}

	let somaColunasMat = inicializaValores(0, nmroColunas, 0)

	for (let i = 0; i < nmroLinhas; i++) {
		somaColunasMat[i] = somaColunas(i, matrizCat, nmroColunas)
	}

	let somaPeso = inicializaValores(0, nmroColunas, 0)

	for (let i = 0; i < nmroLinhas; i++) {
		somaPeso[i] = somaColunas(i, peso, nmroColunas)
	}

	let categorias = inicializaValores(0, nmroLinhas, 0)

	for (let i = 0; i < nmroLinhas; i++) {
		categorias[i] = somaColunasMat[i] / (alfa + somaPeso[i])
	}

	return categorias
}

function realizaAndMinimo(entrada, peso, linha, catVencedora, nmroLinhas, nmroColunas){

	var and = inicializaValores(nmroLinhas, nmroColunas, 0)

	for (let j = 0; j < nmroColunas; j++) {
		if (entrada[linha][j] < peso[catVencedora][j]) {
			and[linha][j] = entrada[linha][j]
		} else {
			and[linha][j] = peso[catVencedora][j]
		}
	}

	return and
}

function realizaTesteDeVigilancia(entrada, peso, linha, catVencedora, nmroLinhas, nmroColunas) {

	matrizVig = inicializaValores(nmroLinhas, nmroColunas, 0)

	for (let j = 0; j < nmroColunas; j++) {
		if (entrada[linha][j] < peso[catVencedora][j]) {
			matrizVig[linha][j] = entrada[linha][j]
		} else {
			matrizVig[linha][j] = peso[catVencedora][j]
		}
	}

	let somaVigilancia = inicializaValores(0, nmroLinhas , 0)
	let somaEntrada = inicializaValores(0, nmroLinhas, 0)

	for (let i = 0; i < nmroLinhas; i++) {
		somaVigilancia[i] = somaColunas(i, matrizVig, nmroColunas)
		somaEntrada[i] = somaColunas(i, entrada, nmroColunas)
	}

	let testeDeVigilancia = inicializaValores(nmroLinhas, 0, 0)

	for (let i = 0; i < nmroLinhas; i++) {
		testeDeVigilancia[i] = somaVigilancia[i] / somaEntrada[i]
	}

	return testeDeVigilancia
}

function criaMatrizMatchTracking(entrada, peso, catVencedora, linha, nmroLinhas, nmroColunas){

	let matrizMatch = inicializaValores(nmroLinhas, nmroColunas, 0)

	for (let j = 0; j < nmroColunas; j++) {
		if (entrada[linha][j] < peso[catVencedora][j]) {
			matrizMatch[linha][j] = entrada[linha][j]
		} else {
			matrizMatch[linha][j] = peso[catVencedora][j]
		}
	}

	return matrizMatch
}

function realizaMatchTracking(entrada, peso, linha, catVencedora, nmroLinhas, nmroColunas) {

	let matrizMatch = inicializaValores(nmroLinhas, nmroColunas, 0)

	for (let j = 0; j < nmroColunas; j++) {
		if (entrada[linha][j] < peso[catVencedora][j]) {
			matrizMatch[linha][j] = entrada[linha][j]
		} else {
			matrizMatch[linha][j] = peso[catVencedora][j]
		}
	}

	let somaColMatch = inicializaValores(nmroLinhas, nmroColunas, 0)
	let somaColEntrada = inicializaValores(nmroLinhas, nmroColunas, 0)

	for (let i = 0; i < nmroLinhas; i++) {
		somaColMatch[i] = somaColunas(i, matrizMatch, nmroColunas)
		somaColEntrada[i] = somaColunas(i, entrada, nmroColunas)
	}

	let resMatchTracking = inicializaValores(nmroLinhas, nmroColunas, 0)

	for (let i = 0; i < nmroLinhas; i++) {
		resMatchTracking[i] = somaColMatch[i] / somaColEntrada[i]
	}

	return resMatchTracking
}

function retornaCategoriaVencedora(Categorias){

	let maior = Math.max(...Categorias)
	let catVencedora = Categorias.indexOf(maior)

	return catVencedora
}

function atualizaPeso(peso, beta, and, catVencedora, linha, nmroColunas){

	for(let j=0; j<nmroColunas; j++){
		peso[catVencedora][j] = beta * and[linha][j] + (1 - beta) * peso[catVencedora][j] 
	}

	return peso
}

function atualizaPesoInterArt(peso, catVencedoraA, catVencedoraB, vetorK, linha, nmroColunas){

	for(let j=0; j<nmroColunas; j++){
		peso[catVencedoraA][j] = 0
	}

	catVencedoraB = vetorK[linha]
	peso[catVencedoraA][catVencedoraB] = 1

	return peso
}

function criaMatrizDeAtividades(entrada, catVencedora, linha){

	entrada[linha][catVencedora] = 1

	return entrada
}

function criaMatrizDeAtividadesInterArt(entrada, peso, linha, nmroColunas){

	let mtInterArt = inicializaValores(nmroColunas, nmroColunas, 0)

	for(let j=0; j<nmroColunas; j++){
		mtInterArt[linha][j] = entrada[linha][j] * peso[linha][j]
	}

	return mtInterArt
}

function verificaConhecimento(entrada, linha, nmroColunas){

	let fim = inicializaValores(0, nmroColunas, 0)

	for(let j=0; j<nmroColunas; j++){
		if(entrada[linha][j] === 1){
			fim[linha] = j
			continue
		}
	}

	return fim
}

function criaMatrizDeDiagnostico(peso, conhecimento, nmroLinhas, nmroColunas){

	let mtDiagnostico = inicializaValores(nmroLinhas, nmroColunas, 0)

	for(let i=0; i<nmroLinhas; i++){
		for(let j=0; j<nmroColunas; j++){
			mtDiagnostico[i][j] = peso[conhecimento[i]][j]
		}
	}

	return mtDiagnostico
}

function verificaRessonancia(diagnostico, peso, nmroLinhas, nmroColunas){

	let ressonacia = inicializaValores(nmroLinhas, nmroColunas, 0)

	for(let i=0; i<nmroLinhas; i++){
		for(let j=0; j<nmroColunas; j++){
			if(diagnostico[i][j] === peso[i][j]){
				ressonacia[i] = 1
			}
		}
	}

	return ressonacia
}

function criaMatrizInterArtAux(matrizInter, matrizAtividadeD, nmroLinhas, nmroColunas){

	let novoYbd = inicializaValores(nmroLinhas, nmroColunas, 0)

	for(let i=0; i<nmroLinhas; i++){
		for(let j=0; j<nmroColunas; j++){
			novoYbd[i][j] = matrizInter[i][j] * matrizAtividadeD[i][j]
		}
	}

	return novoYbd
}

function saidaDiagnostico(pesoB, entrada, saidaDesejada, novoYbd, wbd, nmroLinhas, nmroColunas){

	//pega B sem complemento
	let tamanho = pesoB[0].length / 2
	let linhasA = inicializaValores(0, entrada.length, 0)

	for(let i=0; i<nmroLinhas; i++){
		for(let j=0; j<nmroLinhas; j++){
			if(novoYbd[i][j] === 1){
				linhasA[i] = j
			}
		}
	}

	for(let i=0; i<nmroLinhas; i++){
		for(let j=0; j<nmroColunas; j++){
			wbd[i][j] = saidaDesejada[linhasA[i]][tamanho]
		}
	}

	return wbd
}

function artB(saidaDesejada, wb, pb, beta, nmroLinhasB, nmroColunasB){

	console.log("_______________ ART B _______________")

	for(let i=0; i<nmroLinhasB; i++){

		//Cria categorias
		var Tb = criaCategorias(saidaDesejada, wb, i, nmroLinhasB, nmroColunasB)
		console.log("Categorias B criadas: ")
		console.log(Tb)

		//Retorna maior categoria
		K = retornaCategoriaVencedora(Tb)
		console.log("Categoria vencedora " + i + ": " + K)

		//Envia valor de K para o Art A
		posiK[i] = K

		//Teste de vigilancia
		var tVigilanciaB = realizaTesteDeVigilancia(saidaDesejada, wb, i, K, nmroLinhasB, nmroColunasB)
		console.log("Teste de vigilancia B " + i + ": " + tVigilanciaB)

		while (tVigilanciaB[i] <= pb) {

			//Recria categorias
			Tb[K] = 0
			K = retornaCategoriaVencedora(Tb)
			console.log("Nova categoria vencedora B " + i + ": " + K)
	
			//Vigilancia final
			tVigilanciaB = realizaTesteDeVigilancia(saidaDesejada, wb, i, K, nmroLinhasB, nmroColunasB)
			console.log("Novo teste de vigilancia " + i + ": " + tVigilanciaB)
	
		}//Fim While

		//(AND)
		var and = realizaAndMinimo(saidaDesejada, wb, i, K, nmroLinhasB, nmroColunasB)

		//Atualiza o peso Wb
		wb = atualizaPeso(wb, beta, and, K, i, nmroColunasB)

		//Matriz de Atividades B
		var ybAux = criaMatrizDeAtividades(yb, K, i)

		for(let j=0; j<nmroColunasMatAtvdadeB; j++){
			yb[i][j] = ybAux[i][j]
		}

	}//Fim for

	console.log('\n')
	console.log("_______________ SAÍDA B: _______________")
	console.log("Saida Desejada: ")
	console.log(complementoB)
	console.log("WB Atualizado: ")
	console.log(wb)
	console.log("Matriz de Atividades B:")
	console.log(yb)
	//console.log("Matriz de Vigilancia B:")
	//console.log(and)
	console.log('\n')

	//return wb
}

function artA(entrada, wa, pa, beta, nmroLinhasA, nmroColunasA){

	console.log("_______________ ART A _______________")

	let paIni = pa

	for(let i=0; i<nmroLinhasA; i++){

		//Categorias
		var Ta = criaCategorias(entrada, wa, i, nmroLinhasA, nmroColunasA)
		console.log("Categorias criadas A: ")
		console.log(Ta)

		//Encontra maior categoria
		J = retornaCategoriaVencedora(Ta)
		console.log("Categoria vencedora A " + i + ": " + J)

		//Match tracking
		var mtAux = criaMatrizMatchTracking(yb, wab, J, i, nmroLinhasWAB, nmroColunasWAB)

		//Salva matriz do mt
		for (let x = 0; x < nmroLinhasWAB; x++) {
			for (j = 0; j < nmroColunasWAB; j++) {
				mt[i][j] = mtAux[i][j]
			}
		}

		//Teste de vigilancia
		var tVigilanciaA = realizaTesteDeVigilancia(entrada, wa, i, J, nmroLinhasA, nmroColunasA)
		console.log("Teste de vigilancia A " + i + ": " + tVigilanciaA)

		var validaMatch = realizaMatchTracking(yb, wab, i, J, nmroLinhasWAB, nmroColunasWAB)
		console.log("Match tracking " + i + ": " + validaMatch)

		//Teste de vigilancia auxiliar para atualizar o peso
		var andA = realizaAndMinimo(entrada, wa, i, J, nmroLinhasA, nmroColunasA)

		//Adaptação
		let soma = 0
		soma = somaColunas(i, complementoA, nmroColunasA)
		//console.log("Soma = " +soma)
		let somaVig = 0
		somaVig = somaColunas(i, andA, nmroColunasA)
		//console.log("SomaVig = " + somaVig)

		pa = (somaVig / soma) + epsilon
		//console.log("pA:" + pa)

		//Valida o Match Tracking
		while (validaMatch[i] <= pab) {

			//Categorias
			Ta[J] = 0
			J = retornaCategoriaVencedora(Ta)
			console.log("Nova categoria vencedora A " + i + ": " + J)

			//Teste de vigilancia
			tVigilanciaA = realizaTesteDeVigilancia(entrada, wa, i, J, nmroLinhasA, nmroColunasA)
			console.log("Novo teste de vigilancia A " + i + ": " + tVigilanciaA)

			//Valida Vigilancia
			while (tVigilanciaA[i] <= pa) {

				//Recria categorias
				Ta[J] = 0
				J = retornaCategoriaVencedora(Ta)
				console.log("Nova categoria vencedora " + i + ": " + J)

				//Teste Vigilancia
				tVigilanciaA = realizaTesteDeVigilancia(entrada, wa, i, J, nmroLinhasA, nmroColunasA)
				console.log("Valida teste de vigilancia A" + i + ": " + tVigilanciaA)

			}//Fim While Vigilancia

			//Refaz o match tracking
			mtAux = criaMatrizMatchTracking(yb, wab, J, i, nmroLinhasWAB, nmroColunasWAB)

			for (let x = 0; x < nmroLinhasWAB; x++) {
				for (j = 0; j < nmroColunasWAB; j++) {
					mt[i][j] = mtAux[i][j]
				}
			}

			validaMatch = realizaMatchTracking(yb, wab, i, J, nmroLinhasWAB, nmroColunasWAB)
			console.log("Valida match tracking " + i + ": " + validaMatch)

		}//Fim do while Match

		//Atualiza o peso Wa
		wa = atualizaPeso(wa, beta, andA, J, i, nmroColunasA)

		//Matriz de atividades A
		var yaAux = criaMatrizDeAtividades(ya, J, i)

		for(let j=0; j<nmroColunasMatAtvdadeA; j++){
			ya[i][j] = yaAux[i][j]
		}

		//Atualiza Peso Inter Art
		wab = atualizaPesoInterArt(wab, J, K, posiK, i, nmroColunasWAB)

		pa = paIni

	}//Fim for

	console.log('\n')
	console.log("_______________ SAÍDA A: _______________")
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

	//return wa
}

function Diagnostico(entrada, wa, pd, nmroLinhas, nmroColunas){

	console.log("_______________ DIAGNÓSTICO _______________")

	for (i = 0; i < nmroLinhas; i++) {

		//Categorias
		var Td = criaCategorias(entrada, wa, i, nmroLinhas, nmroColunas)
		console.log("Categorias criadas D: ")
		console.log(Td)

		//Encontra categoria vencedora
		D = retornaCategoriaVencedora(Td)
		console.log("Categoria vencedora D " + i + ": " + D)

		//Realiza Vigilancia
		tVigilanciaD = realizaTesteDeVigilancia(entrada, wa, i, D, nmroLinhas, nmroColunas)
		console.log("Teste de vigilancia D " + i + ": " + tVigilanciaD)

		//Valida Vigilancia
		while (tVigilanciaD[i] <= pd) {

			//Recria categorias
			Td[D] = 0
			D = retornaCategoriaVencedora(Td)
			console.log("Nova categoria vencedora D" + i + ": " + D)

			tVigilanciaD = realizaTesteDeVigilancia(entrada, wa, i, D, nmroLinhas, nmroColunas)
			console.log("Valida teste de vigilancia D" + i + ": " + tVigilanciaD)

		}//Fim While Vigilancia

		//Matriz de atividades (Ressonância) D
		var ydAux = criaMatrizDeAtividades(yd, D, i)

		for(j=0; j<nmroColunasMatAtvdadeD; j++){
			yd[i][j] = ydAux[i][j]
		}

		//Matriz de Atividades inter art 
		var ybdAux = criaMatrizDeAtividadesInterArt(yd, wab, i, nmroColunasWAB)

		for (j = 0; j < nmroColunasWAB; j++) {
			ybd[i][j] = ybdAux[i][j]
		}

		//Verifica o conhecimento da rede
		fimAux = verificaConhecimento(ybd, i, nmroColunasWAB)
		fim[i] = fimAux[i]

	}//Fim do for

	//Matriz de diagnóstico
	wbd = criaMatrizDeDiagnostico(wb, fim, nmroLinhasB, nmroColunasB)

	//Verifica ressonância (Categorias validadas)
	var ressonacia = verificaRessonancia(wbd, wb, nmroLinhasB, nmroColunasB)

	var novoYbd = criaMatrizInterArtAux(wab, yd, nmroLinhasWAB, nmroColunasWAB)	

	var saida = saidaDiagnostico(wb, complementoA, complementoB, novoYbd, wbd, nmroLinhas, nmroColunas)
	
	console.log('\n')
	console.log("_______________ SAÍDA D: _______________")
	console.log("Entrada D:")
	console.log(complementoD)
	console.log("Matriz de atividades D:")
	console.log(yd)
	console.log("Matriz de atividades Inter Art D:")
	console.log(ybd)
	console.log("Matriz de diagnóstico D:")
	console.log(wbd)
	console.log("Categoria(s) com ressonância:")
	console.log(ressonacia)
	console.log("YBD:")
	console.log(novoYbd)
	console.log("Saída do diagnóstico:")
	console.log(saida)
}*/
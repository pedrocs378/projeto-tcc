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

}	

//_______________ Controle da Rede _______________//

var i = 0
var j = 0
var pa = 0.95
var pb = 1 
var pab = 0.95
var pd = 0.5
var alfa = 0.1
var beta = 1
var fase = 0

//_______________ Dados Art B _______________//

var nmroLinhasInicialB = 0, nmroColunasInicialB = 3
var nmroLinhasB = nmroColunasInicialB, nmroColunasB = 2
var nmroLinhasMatAtvdade = 3, nmroColunasMatAtvdade = 3

var b = [1, 0, 1] //Saida desejada
var wb = inicializaValores(nmroLinhasB, nmroColunasB, 1) 
var yb = inicializaValores(nmroLinhasMatAtvdade, nmroColunasMatAtvdade, 0) //Matriz de atividades 
var posiK = inicializaValores(0, nmroLinhasB, 0) //Vetor auxiliar de envio de categoria Ativa B para A
var K 

normalizaDados(b, nmroLinhasInicialB, nmroColunasInicialB)
var complementoB = realizaComplemento(b, nmroLinhasInicialB, nmroColunasInicialB)


//_______________ Dados Art A _______________//

var nmroLinhasInicialA = 3, nmroColunasInicialA = 2 
var nmroLinhasA = 3, nmroColunasA = 4 
var nmroLinhasWAB = 3, nmroColunasWAB = 3 //Tamanho da matriz inter art (NaXNb)


var a = [[1, 0], [0, 1], [0.5, 0.5]] //Entrada 
var wa = inicializaValores(nmroLinhasA, nmroColunasA, 1) 
var wab = inicializaValores(nmroLinhasWAB, nmroColunasWAB, 1) //Peso Inter Art
var ya = inicializaValores(nmroLinhasMatAtvdade, nmroColunasMatAtvdade, 0) //Matriz de atividades 
var mt = inicializaValores(nmroLinhasWAB, nmroColunasWAB, 0) //Match Tracking auxiliar
var J

normalizaDados(a, nmroLinhasInicialA, nmroColunasInicialA)
var complementoA = realizaComplemento(a, nmroLinhasInicialA, nmroColunasInicialA)

//_______________ Dados diagnóstico _______________//
var nmroLinhasInicialD = 3, nmroColunasInicialD = 2

var d = [[1, 1], [0.5, 1], [0.2, 0.9]] 
var yd = inicializaValores(nmroLinhasMatAtvdade, nmroColunasMatAtvdade, 0) //Matriz de atividades D
var ybd = inicializaValores(nmroLinhasWAB, nmroColunasWAB, 0) //Matriz de atividades Inter Art
var wbd = inicializaValores(nmroLinhasB, nmroColunasB, 0) //Matriz de conhecimento da rede
var fim = inicializaValores(0, nmroLinhasB, 0) //Vetor auxiliar de conhecimento
var D //Vetor de categorias D

normalizaDados(d, nmroLinhasInicialD, nmroColunasInicialD)
var complementoD = realizaComplemento(d, nmroLinhasInicialD, nmroColunasInicialD)

//_______________ Chamada das funções _______________//

if (complementoB.length != complementoA.length){
	if (complementoA.length < complementoB.length){
		complementoA = normalizaTamanho(complementoA, complementoB)
	}else{
		complementoB = normalizaTamanho(complementoA, complementoB)
	}
}

//artB(complementoB, wb, pb, beta, complementoB.length, complementoB[0].length)
//artA(complementoA, wa, pa, beta, complementoA.length, complementoA[0].length)
//Diagnostico(complementoD, wa, pd, complementoD.length, complementoD[0].length)

//_______________ FUNÇÕES _______________//

function normalizaTamanho(entrada, saida){

	let tamEntrada = entrada.length
	let tamSaida = saida.length
	let novo

	if (tamEntrada < tamSaida){
		novo = inicializaValores(tamSaida, entrada[0].length, 0.1)

		for(let i=0; i<tamEntrada; i++){
			for(let j=0; j<entrada[0].length; j++){
				novo[i][j] = entrada[i][j]
			}
		}
	}

	if (tamEntrada > tamSaida){
		novo = inicializaValores(tamEntrada, saida[0].length, 0.1)

		for(let i=0; i<tamSaida; i++){
			for(let j=0; j<saida[0].length; j++){
				novo[i][j] = saida[i][j]
			}
		}
	}

	return novo
}

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
	else{
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

	let somaColunasMat = inicializaValores(nmroLinhas, 0, 0)

	for (let i = 0; i < nmroLinhas; i++) {
		somaColunasMat[i] = somaColunas(i, matrizCat, nmroColunas)
	}

	let somaPeso = inicializaValores(nmroLinhas, 0, 0)

	for (let i = 0; i < nmroLinhas; i++) {
		somaPeso[i] = somaColunas(i, peso, nmroColunas)
	}

	let categorias = inicializaValores(nmroLinhas, 0, 0)

	for (let i = 0; i < nmroLinhas; i++) {
		categorias[i] = somaColunasMat[i] / (alfa + somaPeso[i])
	}

	return categorias

}

function vigilanciaAuxiliar(entrada, peso, linha, catVencedora, nmroLinhas, nmroColunas){

	var vigilancia = inicializaValores(nmroLinhas, nmroColunas, 0)

	for (let j = 0; j < nmroColunas; j++) {
		if (entrada[catVencedora][j] < peso[catVencedora][j]) {
			vigilancia[linha][j] = entrada[catVencedora][j]
		} else {
			vigilancia[linha][j] = peso[catVencedora][j]
		}
	}

	return vigilancia
}

function realizaTesteDeVigilancia(entrada, peso, linha, catVencedora, nmroLinhas, nmroColunas) {

	matrizVig = inicializaValores(nmroLinhas, nmroColunas, 0)

	for (let i = 0; i < nmroLinhas; i++) {
		for (let j = 0; j < nmroColunas; j++) {
			if (entrada[catVencedora][j] < peso[catVencedora][j]) {
				matrizVig[linha][j] = entrada[catVencedora][j]
			} else {
				matrizVig[linha][j] = peso[catVencedora][j]
			}
		}
	}

	let somaVigilancia = inicializaValores(nmroLinhas, nmroColunas, 0)
	let somaEntrada = inicializaValores(nmroLinhas, nmroColunas, 0)

	for (let i = 0; i < nmroLinhas; i++) {
		somaVigilancia[i] = somaColunas(i, matrizVig, nmroColunas)
		somaEntrada[i] = somaColunas(i, entrada, nmroColunas)
	}

	let testeDeVigilancia = inicializaValores(nmroLinhas, nmroColunas, 0)

	for (let i = 0; i < nmroLinhas; i++) {
		testeDeVigilancia[i] = somaVigilancia[i] / somaEntrada[i]
	}

	return testeDeVigilancia
}

function validaTesteDeVigilancia(linha, entrada, peso, vigilancia, rho,  categorias, catVencedora, nmroLinhas, nmroColunas){

	while(vigilancia[linha] < rho){

		categorias[catVencedora] = 0
		let novaCatVencedora = retornaCategoriaVencedora(categorias)
		console.log("Nova categoria vencedora (" + linha + "): " + novaCatVencedora)

		//let tvAux = vigilanciaAuxiliar(entrada, peso, linha, catVencedora, nmroColunas)

		let validaVigi = realizaTesteDeVigilancia(entrada, peso, linha, catVencedora, nmroLinhas, nmroColunas)
		console.log("Novo teste de vigilancia " + linha + ": " + validaVigi)
	}

	return vigilancia
}

function criaMatrizMatchTracking(entrada, peso, catVencedora, linha, nmroLinhas, nmroColunas){

	let matrizMatch = inicializaValores(nmroLinhas, nmroColunas, 0)

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

function realizaMatchTracking(entrada, peso, linha, catVencedora, nmroLinhas, nmroColunas) {

	let matrizMatch = inicializaValores(nmroLinhas, nmroColunas, 0)

	for (let i = 0; i < nmroLinhas; i++) {
		for (let j = 0; j < nmroColunas; j++) {
			if (entrada[linha][j] < peso[catVencedora][j]) {
				matrizMatch[linha][j] = entrada[linha][j]
			} else {
				matrizMatch[linha][j] = peso[catVencedora][j]
			}
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

function atualizaPeso(peso, beta, vigilancia, catVencedora, linha, nmroColunas){

	for(let j=0; j<nmroColunas; j++){
		peso[catVencedora][j] = beta * vigilancia[linha][j] + (1 - beta) * peso[catVencedora][j] 
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

		//Vigilancia para atualizar pesos (AND)
		var vigilanciaAuxB = vigilanciaAuxiliar(saidaDesejada, wb, i, K, nmroLinhasB, nmroColunasB)
		var vigilanciaB = inicializaValores(nmroLinhasB, nmroColunasB, 0)
		
		for(j=0; j<nmroColunasB; j++){
			vigilanciaB[i][j] = vigilanciaAuxB[i][j] 
		}

		//Teste de vigilancia
		var tVigilanciaB = realizaTesteDeVigilancia(saidaDesejada, wb, i, K, nmroLinhasB, nmroColunasB)
		console.log("Teste de vigilancia B " + i + ": " + tVigilanciaB)

		while (tVigilanciaB[i] < pb) {

			//Recria categorias
			Tb[K] = 0
			K = retornaCategoriaVencedora(Tb)
			console.log("Nova categoria vencedora B " + i + ": " + K)
	
			//Teste de vigilancia auxiliar peso
			vigilanciaAuxB = vigilanciaAuxiliar(saidaDesejada, wb, i, K, nmroColunasB)
	
			for(j=0; j<nmroColunasB; j++){
				vigilanciaB[i][j] = vigilanciaAuxB[i][j] 
			}
	
			//Vigilancia final
			tVigilanciaB = realizaTesteDeVigilancia(saidaDesejada, wb, i, K, nmroLinhasB, nmroColunasB)
			console.log("Novo teste de vigilancia " + i + ": " + tVigilanciaB)
	
		}//Fim While

		//Atualiza o peso Wb
		wb = atualizaPeso(wb, beta, vigilanciaB, K, i, nmroColunasB)

		//Matriz de Atividades B
		var ybAux = criaMatrizDeAtividades(yb, K, i)

		for(let j=0; j<nmroColunasMatAtvdade; j++){
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
	console.log('\n')

	return wb
}

function artA(entrada, wa, pa, beta, nmroLinhasA, nmroColunasA){

	console.log("_______________ ART A _______________")

	for(let i=0; i<nmroLinhasA; i++){

		//Categorias
		var Ta = criaCategorias(entrada, wa, i, nmroLinhasA, nmroColunasA)
		console.log("Categorias criadas A: ")
		console.log(Ta)

		//Encontra maior categoria
		J = retornaCategoriaVencedora(Ta)
		console.log("Categoria vencedora A " + i + ": " + J)

		//Teste de vigilancia auxiliar para atualizar o peso
		var vigilanciaAuxA = vigilanciaAuxiliar(entrada, wa, i, J, nmroLinhasA, nmroColunasA)
		var vigilanciaA = inicializaValores(nmroLinhasA, nmroColunasA, 0)

		for(j=0; j<nmroColunasA; j++){
			vigilanciaA[i][j] = vigilanciaAuxA[i][j] 
		}

		//Teste de vigilancia
		var tVigilanciaA = realizaTesteDeVigilancia(entrada, wa, i, J, nmroLinhasA, nmroColunasA)
		console.log("Teste de vigilancia A " + i + ": " + tVigilanciaA)

		//Match tracking
		var mtAux = criaMatrizMatchTracking(yb, wab, J, i, nmroLinhasWAB, nmroColunasWAB)

		//Salva matriz do mt
		for (let x = 0; x < nmroLinhasWAB; x++) {
			for (j = 0; j < nmroColunasWAB; j++) {
				mt[i][j] = mtAux[i][j]
			}
		}

		var validaMatch = realizaMatchTracking(yb, wab, i, J, nmroLinhasWAB, nmroColunasWAB)
		console.log("Match tracking " + i + ": " + validaMatch)

		//Valida o Match Tracking
		while (validaMatch[i] < pab) {

			//Categorias
			Ta[J] = 0
			J = retornaCategoriaVencedora(Ta)
			console.log("Nova categoria vencedora A " + i + ": " + J)

			//Teste de vigilancia
			tVigilanciaA = realizaTesteDeVigilancia(entrada, wa, i, J, nmroLinhasA, nmroColunasA)
			console.log("Novo teste de vigilancia A " + i + ": " + tVigilanciaA)

			//Valida Vigilancia
			while (tVigilanciaA[i] < pa) {

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
		wa = atualizaPeso(wa, beta, vigilanciaA, J, i, nmroColunasA)

		//Matriz de atividades A
		var yaAux = criaMatrizDeAtividades(ya, J, i)
		//Provavelmente o tamanho é 4x4 *
		for(let j=0; j<nmroColunasMatAtvdade; j++){
			ya[i][j] = yaAux[i][j]
		}

		//Atualiza Peso Inter Art
		wab = atualizaPesoInterArt(wab, J, K, posiK, i, nmroColunasWAB)

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

	return wa
}

function Diagnostico(entrada, wa, pd, nmroLinhasA, nmroColunasA){

	console.log("_______________ DIAGNÓSTICO _______________")

	for (i = 0; i < nmroLinhasA; i++) {

		//Categorias
		var Td = criaCategorias(entrada, wa, i, nmroLinhasA, nmroColunasA)
		console.log("Categorias criadas D: ")
		console.log(Td)

		//Encontra categoria vencedora
		D = retornaCategoriaVencedora(Td)
		console.log("Categoria vencedora D " + i + ": " + D)

		//Teste de vigilancia
		var vigilanciaD = inicializaValores(nmroLinhasA, nmroColunasA, 0)
		var vigilanciaAuxD = vigilanciaAuxiliar(entrada, wa, i, D, nmroColunasA)

		for (j = 0; j < nmroColunasA; j++) {
			vigilanciaD[i][j] = vigilanciaAuxD[i][j]
		}

		//Realiza Vigilancia
		tVigilanciaD = realizaTesteDeVigilancia(entrada, wa, i, D, nmroLinhasA, nmroColunasA)
		console.log("Teste de vigilancia D " + i + ": " + tVigilanciaD)

		//Valida Vigilancia
		while (tVigilanciaD[i] < pd) {

			//Recria categorias
			Td[D] = 0
			D = retornaCategoriaVencedora(Td)
			console.log("Nova categoria vencedora D" + i + ": " + D)

			//Teste Vigilancia
			vigilanciaAuxD =  vigilanciaAuxiliar(entrada, wa, i, D, nmroColunasA)

			for (j = 0; j < nmroColunasA; j++) {
				vigilanciaD[i][j] = vigilanciaAuxD[i][j]
			}

			tVigilanciaD = realizaTesteDeVigilancia(entrada, wa, i, D, nmroLinhasA, nmroColunasA)
			console.log("Valida teste de vigilancia D" + i + ": " + tVigilanciaD)

		}//Fim While Vigilancia

		//Matriz de atividades (Ressonância) D
		var ydAux = criaMatrizDeAtividades(yd, D, i)

		for(j=0; j<nmroColunasMatAtvdade; j++){
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
}
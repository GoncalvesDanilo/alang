# alang

This repository contains the source code for a programming language developed as part of a successful thesis project. The language incorporates cutting-edge features such as functional paradigms, dynamic typing, and a syntax inspired by TypeScript.

The project's main goals were to create a programming language that combines practicality, readability, and expressiveness while offering an intuitive programming experience.

## Sample Code

```
imprimir('--==Calculadora==--')
imprimir()

funcao realizarOperacao(valor1, valor2, operador) {
  se (operador === '+') {
    retornar valor1 + valor2
  } senao se (operador === '-') {
    retornar valor1 - valor2
  } senao se (operador === '*') {
    retornar valor1 * valor2
  } senao se (operador === '/') {
    retornar valor1 / valor2
  } senao se (operador === '%') {
    retornar valor1 % valor2
  } senao {
    retornar 'Operação Inválida'
  }
}

var operador = ' '
var valor1
var valor2
var valor1Convertido
var valor2Convertido

enquanto(operador) {
  operador = ler('Digite a operação (+,-,*,/,%):')
  valor1 = ler('Digite o primeiro valor:')
  valor2 = ler('Digite o segundo valor:')

  imprimir()

  se (valor1 && valor2) {
    valor1Convertido = converterParaNumero(valor1)
    valor2Convertido = converterParaNumero(valor2)

    imprimir('Resultado:', realizarOperacao(
      valor1Convertido,
      valor2Convertido,
      operador
    ))
    imprimir()
  } senao {
    imprimir('Valores Inválidos')
    imprimir()
  }
}
```

## Usage

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.0.4. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

References
- https://github.com/tlaceby/guide-to-interpreters-series
- https://accu.org/journals/overload/26/145/balaam_2510/
- https://www.techtarget.com/searchapparchitecture/definition/parser
- https://dev.to/balapriya/abstract-syntax-tree-ast-explained-in-plain-english-1h38
- https://github.com/acornjs/acorn

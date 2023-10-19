import {
  Statement,
  Program,
  Expression,
  BinaryExpression,
  NumericLiteral,
  Identifier,
  NullLiteral,
} from './ast';
import { Token, TokenType, tokenize } from './lexer';

export default class Parser {
  private tokens: Token[] = [];

  private notEOF(): boolean {
    return this.tokens[0].type !== TokenType.EOF;
  }

  private at(): Token {
    return this.tokens[0];
  }

  private eat(): Token {
    const previous = this.tokens.shift() as Token;
    return previous;
  }

  private expect(tokenType: TokenType, error: string): Token {
    const previous = this.tokens.shift() as Token;
    if (previous.type !== tokenType || !previous) {
      throw new Error(
        `Parser Error: ${error} \n - Expected: ${tokenType} \n - Got: ${previous.type}`
      );
    }

    return previous;
  }

  public createAST(sourceCode: string): Program {
    this.tokens = tokenize(sourceCode);

    const program: Program = {
      type: 'Program',
      body: [],
    };

    while (this.notEOF()) {
      program.body.push(this.parseStatement());
    }

    return program;
  }

  private parseStatement(): Statement {
    // skip to parse expression
    return this.parseExpression();
  }

  private parseExpression(): Expression {
    return this.parseAdditiveExpression();
  }

  private parseAdditiveExpression() {
    let left = this.parseMultiplicativeExpression();

    while (this.at().value === '+' || this.at().value === '-') {
      const operator = this.eat().value;
      const right = this.parseMultiplicativeExpression();
      left = {
        type: 'BinaryExpression',
        left,
        right,
        operator,
      } as BinaryExpression;
    }

    return left;
  }

  private parseMultiplicativeExpression(): Expression {
    let left = this.parsePrimaryExpression();

    while (
      this.at().value === '*' ||
      this.at().value === '/' ||
      this.at().value === '%'
    ) {
      const operator = this.eat().value;
      const right = this.parsePrimaryExpression();
      left = {
        type: 'BinaryExpression',
        left,
        right,
        operator,
      } as BinaryExpression;
    }

    return left;
  }

  private parsePrimaryExpression(): Expression {
    const tokenType = this.at().type;

    switch (tokenType) {
      // user defined values
      case TokenType.Identifier:
        return { type: 'Identifier', symbol: this.eat().value } as Identifier;

      case TokenType.Null:
        this.eat();
        return { type: 'NullLiteral', value: 'null' } as NullLiteral;

      // constants and numeric constants
      case TokenType.Number:
        return {
          type: 'NumericLiteral',
          value: parseFloat(this.eat().value),
        } as NumericLiteral;

      // grouping expressions
      case TokenType.OpenParen: {
        this.eat();
        const value = this.parseExpression();
        this.expect(
          TokenType.CloseParen,
          'Unexpected token found inside parenthesised expression. Expected closing parenthesis.'
        );
        return value;
      }

      default:
        console.error('Unexpected token found while parsing', this.at());
        process.exit();
    }
  }
}

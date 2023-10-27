import {
  Statement,
  Program,
  Expression,
  BinaryExpression,
  NumericLiteral,
  Identifier,
  VariableDeclaration,
  AssignmentExpression,
  Property,
  ObjectLiteral,
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
      throw `Parser Error: ${error} \n - Expected: ${tokenType} \n - Got: ${previous.type}`;
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
    switch (this.at().type) {
      case TokenType.Var:
      case TokenType.Const:
        return this.parseVariableDeclaration();
      default:
        return this.parseExpression();
    }
  }

  private parseVariableDeclaration(): Statement {
    const isConstant = this.eat().type === TokenType.Const;
    const identifier = this.expect(
      TokenType.Identifier,
      'Expected identifier on variable declaration.'
    ).value;

    if (this.at().type === TokenType.Semicolon) {
      this.eat();
      if (isConstant) throw 'Must assign value to constant value';

      return {
        type: 'VariableDeclaration',
        constant: false,
        identifier,
      } as VariableDeclaration;
    }

    this.expect(TokenType.Equals, 'Expected equals token on variable declaration.');

    const declaration = {
      type: 'VariableDeclaration',
      identifier,
      value: this.parseExpression(),
      constant: isConstant,
    } as VariableDeclaration;

    this.expect(
      TokenType.Semicolon,
      'Variable declaration statment must end with semicolon.'
    );

    return declaration;
  }

  private parseExpression(): Expression {
    return this.parseAssignmentExpression();
  }

  private parseAssignmentExpression(): Expression {
    const left = this.parseObjectExpression();

    if (this.at().type === TokenType.Equals) {
      this.eat();
      const value = this.parseAssignmentExpression();
      return {
        value,
        assignee: left,
        type: 'AssignmentExpression',
      } as AssignmentExpression;
    }

    return left;
  }

  private parseObjectExpression(): Expression {
    if (this.at().type !== TokenType.OpenBraces) {
      return this.parseAdditiveExpression();
    }

    this.eat();
    const properties = new Array<Property>();

    while (this.notEOF() && this.at().type !== TokenType.CloseBraces) {
      const key = this.expect(TokenType.Identifier, 'Expect key on Object Literal').value;

      if (this.at().type === TokenType.Comma) {
        this.eat();
        properties.push({ type: 'Property', key } as Property);
        continue;
      } else if (this.at().type === TokenType.CloseBraces) {
        properties.push({ type: 'Property', key } as Property);
        continue;
      }

      this.expect(
        TokenType.Colon,
        'Expected colon following identifier on Object Literal'
      );

      const value = this.parseExpression();
      properties.push({ type: 'Property', key, value });

      if (this.at().type !== TokenType.CloseBraces) {
        this.expect(
          TokenType.Comma,
          'Expected comma or closing brace following property'
        );
      }
    }

    this.expect(TokenType.CloseBraces, 'Expect closing brace on Object Literal');
    return { type: 'ObjectLiteral', properties } as ObjectLiteral;
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

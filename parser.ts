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
  MemberExpression,
  CallExpression,
  FunctionDeclaration,
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
      case TokenType.Function:
        return this.parseFunctionDeclaration();
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

  private parseFunctionDeclaration(): Statement {
    this.eat();
    const name = this.expect(
      TokenType.Identifier,
      'Expected Identifier on Function declaration'
    ).value;

    const args = this.parseArguments();
    let parameters: Identifier[] = [];
    for (const arg of args) {
      if (arg.type !== 'Identifier')
        throw 'Expect parameters names to be of type string on Function declaration';
      parameters.push(arg as Identifier);
    }

    this.expect(TokenType.OpenBraces, 'Expected function body following declaration');

    let body: Statement[] = [];
    while (this.at().type !== TokenType.CloseBraces && this.notEOF()) {
      body.push(this.parseStatement());
    }

    this.expect(TokenType.CloseBraces, 'Expected Closing Brace on Function declaration');

    const func = {
      type: 'FunctionDeclaration',
      name,
      parameters,
      body,
    } as FunctionDeclaration;

    return func;
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
    let left = this.parseCallMemberExpression();

    while (
      this.at().value === '*' ||
      this.at().value === '/' ||
      this.at().value === '%'
    ) {
      const operator = this.eat().value;
      const right = this.parseCallMemberExpression();
      left = {
        type: 'BinaryExpression',
        left,
        right,
        operator,
      } as BinaryExpression;
    }

    return left;
  }

  private parseCallMemberExpression(): Expression {
    const member = this.parseMemberExpression();

    if (this.at().type === TokenType.OpenParen) {
      return this.parseCallExpression(member);
    }

    return member;
  }

  private parseCallExpression(caller: Expression): Expression {
    let callExpression = {
      type: 'CallExpression',
      caller,
      arguments: this.parseArguments(),
    } as CallExpression;

    if (this.at().type === TokenType.OpenParen) {
      callExpression = this.parseCallExpression(callExpression) as CallExpression;
    }

    return callExpression;
  }

  private parseArguments(): Expression[] {
    this.expect(TokenType.OpenParen, 'Expected open paranthesis on Call Expression');
    let args: Expression[];

    if (this.at().type === TokenType.CloseParen) {
      args = [];
    } else {
      args = this.parseArgumentsList();
    }

    this.expect(TokenType.CloseParen, 'Expected closing paranthesis on Call Expression');
    return args;
  }

  private parseArgumentsList(): Expression[] {
    const args = [this.parseAssignmentExpression()];

    while (this.at().type === TokenType.Comma && this.notEOF()) {
      this.eat();
      args.push(this.parseAssignmentExpression());
    }

    return args;
  }

  private parseMemberExpression(): Expression {
    let object = this.parsePrimaryExpression();

    while (
      this.at().type === TokenType.Dot ||
      this.at().type === TokenType.OpenBrackets
    ) {
      const operator = this.eat();
      let property: Expression;
      let computed: boolean;

      if (operator.type === TokenType.Dot) {
        computed = false;

        property = this.parsePrimaryExpression();
        if (property.type !== 'Identifier') {
          throw 'Expected Identifier after dot on Member Expression';
        }
      } else {
        computed = true;
        property = this.parseExpression();
        this.expect(
          TokenType.CloseBrackets,
          'Expected closing bracket on computed Member Expression'
        );
      }

      object = {
        type: 'MemberExpression',
        property,
        object,
        computed,
      } as MemberExpression;
    }

    return object;
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

export type NodeType =
  // Statements
  | 'Program'
  | 'VariableDeclaration'
  // Expressions
  | 'Identifier'
  | 'BinaryExpression'
  | 'CallExpression'
  | 'UnaryExpression'
  | 'NumericLiteral'
  | 'ArrayLiteral'
  | 'ObjectLiteral'
  | 'BooleanLiteral'
  | 'StringLiteral';

export interface Statement {
  type: NodeType;
}

export interface Program extends Statement {
  type: 'Program';
  body: Statement[];
}

export interface VariableDeclaration extends Statement {
  type: 'VariableDeclaration';
  constant: boolean;
  identifier: string;
  value?: Expression;
}

export interface Expression extends Statement {}

export interface BinaryExpression extends Expression {
  type: 'BinaryExpression';
  left: Expression;
  right: Expression;
  operator: string;
}

export interface Identifier extends Expression {
  type: 'Identifier';
  symbol: string;
}

export interface NumericLiteral extends Expression {
  type: 'NumericLiteral';
  value: number;
}

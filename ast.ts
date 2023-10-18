export type NodeType =
  | 'Program'
  | 'Identifier'
  | 'BinaryExpression'
  | 'CallExpression'
  | 'UnaryExpression'
  | 'NumericLiteral'
  | 'ArrayLiteral'
  | 'ObjectLiteral'
  | 'BooleanLiteral'
  | 'StringLiteral'
  | 'NullLiteral';

export interface Statement {
  type: NodeType;
}

export interface Program extends Statement {
  type: 'Program';
  body: Statement[];
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

export interface NullLiteral extends Expression {
  type: 'NullLiteral';
  value: 'null';
}

export type NodeType =
  // Statements
  | 'Program'
  | 'VariableDeclaration'
  // Expressions
  | 'BinaryExpression'
  | 'AssignmentExpression'
  | 'CallExpression'
  | 'UnaryExpression'
  // Literals
  | 'Identifier'
  | 'Property'
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

export interface AssignmentExpression extends Expression {
  type: 'AssignmentExpression';
  assignee: Expression;
  value: Expression;
}

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

export interface Property extends Expression {
  type: 'Property';
  key: string;
  value?: Expression;
}

export interface ObjectLiteral extends Expression {
  type: 'ObjectLiteral';
  properties: Property[];
}

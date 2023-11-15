export type NodeType =
  // Statements
  | 'Program'
  | 'VariableDeclaration'
  | 'FunctionDeclaration'
  | 'ReturnStatement'
  | 'IfStatement'
  | 'WhileStatement'
  // Expressions
  | 'BinaryExpression'
  | 'BooleanExpression'
  | 'AssignmentExpression'
  | 'CallExpression'
  | 'MemberExpression'
  // Literals
  | 'Identifier'
  | 'Property'
  | 'NumericLiteral'
  | 'ArrayLiteral'
  | 'ObjectLiteral'
  | 'BooleanLiteral'
  | 'StringLiteral';

// Statements

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

export interface FunctionDeclaration extends Statement {
  type: 'FunctionDeclaration';
  name: string;
  parameters: Identifier[];
  body: Statement[];
}

export interface ReturnStatement extends Statement {
  type: 'ReturnStatement';
  value?: Expression;
}

export interface IfStatement extends Statement {
  type: 'IfStatement';
  condition: Expression;
  body: Statement[];
  elseBody?: Statement[];
}

export interface WhileStatement extends Statement {
  type: 'WhileStatement';
  condition: Expression;
  body: Statement[];
}

// Expressions

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

export interface BooleanExpression extends Expression {
  type: 'BooleanExpression';
  left: Expression;
  right?: Expression;
  operator?: string;
}

export interface CallExpression extends Expression {
  type: 'CallExpression';
  caller: Expression;
  arguments: Expression[];
}

export interface MemberExpression extends Expression {
  type: 'MemberExpression';
  object: Expression;
  property: Expression;
  computed: boolean;
}

// Literals

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

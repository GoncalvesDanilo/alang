import {
  AssignmentExpression,
  BinaryExpression,
  BooleanExpression,
  CallExpression,
  FunctionDeclaration,
  Identifier,
  IfStatement,
  MemberExpression,
  NumericLiteral,
  ObjectLiteral,
  Program,
  Statement,
  StringLiteral,
  VariableDeclaration,
} from '../ast';
import {
  evaluateIdentifier,
  evaluateBinaryExpression,
  evaluateAssignmentExpression,
  evaluateObject,
  evaluateCallExpression,
  evaluateMemberExpression,
  evaluateBooleanExpression,
} from './eval/expressions';
import { Environment } from './environment';
import { RuntimeValue, NumberValue, StringValue } from './values';
import {
  evaluateFunctionDeclaration,
  evaluateIfStatement,
  evaluateProgram,
  evaluateVariableDeclaration,
} from './eval/statements';

export function evaluate(astNode: Statement, env: Environment): RuntimeValue {
  switch (astNode.type) {
    // Handle Expressions
    case 'NumericLiteral':
      return {
        value: (astNode as NumericLiteral).value,
        type: 'number',
      } as NumberValue;
    case 'StringLiteral':
      return {
        value: (astNode as StringLiteral).value,
        type: 'string',
      } as StringValue;
    case 'Identifier':
      return evaluateIdentifier(astNode as Identifier, env);
    case 'ObjectLiteral':
      return evaluateObject(astNode as ObjectLiteral, env);
    case 'MemberExpression':
      return evaluateMemberExpression(astNode as MemberExpression, env);
    case 'CallExpression':
      return evaluateCallExpression(astNode as CallExpression, env);
    case 'AssignmentExpression':
      return evaluateAssignmentExpression(astNode as AssignmentExpression, env);
    case 'BooleanExpression':
      return evaluateBooleanExpression(astNode as BooleanExpression, env);
    case 'BinaryExpression':
      return evaluateBinaryExpression(astNode as BinaryExpression, env);

    // Handle Statements
    case 'Program':
      return evaluateProgram(astNode as Program, env);
    case 'VariableDeclaration':
      return evaluateVariableDeclaration(astNode as VariableDeclaration, env);
    case 'FunctionDeclaration':
      return evaluateFunctionDeclaration(astNode as FunctionDeclaration, env);
    case 'IfStatement':
      return evaluateIfStatement(astNode as IfStatement, env);

    default:
      console.error(
        'This AST Node has not yet been setup for interpretation.\n',
        astNode
      );
      process.exit();
  }
}

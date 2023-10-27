import {
  AssignmentExpression,
  BinaryExpression,
  Identifier,
  NumericLiteral,
  ObjectLiteral,
  Program,
  Statement,
  VariableDeclaration,
} from '../ast';
import {
  evaluateIdentifier,
  evaluateBinaryExpression,
  evaluateAssignmentExpression,
  evaluateObject,
} from './eval/expressions';
import { Environment } from './environment';
import { RuntimeValue, NumberValue } from './values';
import { evaluateProgram, evaluateVariableDeclaration } from './eval/statements';

export function evaluate(astNode: Statement, env: Environment): RuntimeValue {
  switch (astNode.type) {
    // Handle Expressions
    case 'NumericLiteral':
      return {
        value: (astNode as NumericLiteral).value,
        type: 'number',
      } as NumberValue;
    case 'Identifier':
      return evaluateIdentifier(astNode as Identifier, env);
    case 'ObjectLiteral':
      return evaluateObject(astNode as ObjectLiteral, env);
    case 'AssignmentExpression':
      return evaluateAssignmentExpression(astNode as AssignmentExpression, env);
    case 'BinaryExpression':
      return evaluateBinaryExpression(astNode as BinaryExpression, env);

    // Handle Statements
    case 'Program':
      return evaluateProgram(astNode as Program, env);
    case 'VariableDeclaration':
      return evaluateVariableDeclaration(astNode as VariableDeclaration, env);

    default:
      console.error('This AST Node has not yet been setup for interpretation.', astNode);
      process.exit();
  }
}

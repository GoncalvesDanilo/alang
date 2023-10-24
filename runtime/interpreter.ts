import {
  BinaryExpression,
  Identifier,
  NumericLiteral,
  Program,
  Statement,
  VariableDeclaration,
} from '../ast';
import { RuntimeValue, NumberValue } from './values';
import { Environment } from './environment';
import { evaluateIdentifier, evaluateBinaryExpression } from './eval/expressions';
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

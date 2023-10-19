import { RuntimeValue, NumberValue, MakeNull } from './values';
import { BinaryExpression, Identifier, NumericLiteral, Program, Statement } from './ast';
import { Environment } from './environment';

function evaluateProgram(program: Program, env: Environment): RuntimeValue {
  let lastEvaluated: RuntimeValue = MakeNull();
  for (const statement of program.body) {
    lastEvaluated = evaluate(statement, env);
  }
  return lastEvaluated;
}

function evaluateNumericBinaryExpression(
  leftHandSide: NumberValue,
  rightHandSide: NumberValue,
  operation: string
): NumberValue {
  let result: number;
  if (operation === '+') {
    result = leftHandSide.value + rightHandSide.value;
  } else if (operation === '-') {
    result = leftHandSide.value - rightHandSide.value;
  } else if (operation === '*') {
    result = leftHandSide.value * rightHandSide.value;
  } else if (operation === '/') {
    // TODO: Check for division by 0
    result = leftHandSide.value / rightHandSide.value;
  } else {
    result = leftHandSide.value % rightHandSide.value;
  }

  return { type: 'number', value: result };
}

function evaluateBinaryExpression(
  binaryExpression: BinaryExpression,
  env: Environment
): RuntimeValue {
  const leftHandSide = evaluate(binaryExpression.left, env);
  const rightHandSide = evaluate(binaryExpression.right, env);

  if (leftHandSide.type === 'number' && rightHandSide.type === 'number') {
    return evaluateNumericBinaryExpression(
      leftHandSide as NumberValue,
      rightHandSide as NumberValue,
      binaryExpression.operator
    );
  }

  return MakeNull();
}

function evaluateIdentifier(identifier: Identifier, env: Environment): RuntimeValue {
  const variable = env.lookupVariable(identifier.symbol);
  return variable;
}

export function evaluate(astNode: Statement, env: Environment): RuntimeValue {
  switch (astNode.type) {
    case 'NumericLiteral':
      return {
        value: (astNode as NumericLiteral).value,
        type: 'number',
      } as NumberValue;
    case 'Identifier':
      return evaluateIdentifier(astNode as Identifier, env);
    case 'BinaryExpression':
      return evaluateBinaryExpression(astNode as BinaryExpression, env);
    case 'Program':
      return evaluateProgram(astNode as Program, env);

    default:
      console.error('This AST Node has not yet been setup for interpretation.', astNode);
      process.exit();
  }
}

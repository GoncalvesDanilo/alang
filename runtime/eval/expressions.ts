import { BinaryExpression, Identifier } from '../../ast';
import { Environment } from '../environment';
import { evaluate } from '../interpreter';
import { NumberValue, RuntimeValue, MakeNull } from '../values';

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

export function evaluateBinaryExpression(
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

export function evaluateIdentifier(
  identifier: Identifier,
  env: Environment
): RuntimeValue {
  const variable = env.lookupVariable(identifier.symbol);
  return variable;
}

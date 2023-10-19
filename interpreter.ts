import { RuntimeValue, NumberValue, NullValue } from './values';
import { BinaryExpression, NumericLiteral, Program, Statement } from './ast';

function evaluateProgram(program: Program): RuntimeValue {
  let lastEvaluated: RuntimeValue = { type: 'null', value: 'null' } as NullValue;
  for (const statement of program.body) {
    lastEvaluated = evaluate(statement);
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

function evaluateBinaryExpression(binaryExpression: BinaryExpression): RuntimeValue {
  const leftHandSide = evaluate(binaryExpression.left);
  const rightHandSide = evaluate(binaryExpression.right);

  if (leftHandSide.type === 'number' && rightHandSide.type === 'number') {
    return evaluateNumericBinaryExpression(
      leftHandSide as NumberValue,
      rightHandSide as NumberValue,
      binaryExpression.operator
    );
  }

  return { type: 'null', value: 'null' } as NullValue;
}

export function evaluate(astNode: Statement): RuntimeValue {
  switch (astNode.type) {
    case 'NumericLiteral':
      return {
        value: (astNode as NumericLiteral).value,
        type: 'number',
      } as NumberValue;
    case 'NullLiteral':
      return {
        value: 'null',
        type: 'null',
      } as NullValue;
    case 'BinaryExpression':
      return evaluateBinaryExpression(astNode as BinaryExpression);
    case 'Program':
      return evaluateProgram(astNode as Program);

    default:
      console.error('This AST Node has not yet been setup for interpretation.', astNode);
      process.exit();
  }
}

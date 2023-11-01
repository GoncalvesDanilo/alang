import {
  AssignmentExpression,
  BinaryExpression,
  CallExpression,
  Identifier,
  ObjectLiteral,
} from '../../ast';
import { Environment } from '../environment';
import { evaluate } from '../interpreter';
import { NumberValue, RuntimeValue, MakeNull, ObjectValue, NativeFunctionValue } from '../values';

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

export function evaluateAssignmentExpression(
  assignment: AssignmentExpression,
  env: Environment
): RuntimeValue {
  if (assignment.assignee.type !== 'Identifier')
    throw `Cannot assign value to ${assignment.assignee}. Only Identifiers`;

  const variableName = (assignment.assignee as Identifier).symbol;
  return env.assignVariable(variableName, evaluate(assignment.value, env));
}

export function evaluateIdentifier(
  identifier: Identifier,
  env: Environment
): RuntimeValue {
  const variable = env.lookupVariable(identifier.symbol);
  return variable;
}

export function evaluateObject(obj: ObjectLiteral, env: Environment): RuntimeValue {
  const object = { type: 'object', properties: new Map() } as ObjectValue;
  for (const { key, value } of obj.properties) {
    let runtimeValue: RuntimeValue;
    if (!value) {
      runtimeValue = env.lookupVariable(key);
    } else {
      runtimeValue = evaluate(value, env);
    }

    object.properties.set(key, runtimeValue);
  }

  return object;
}

export function evaluateCallExpression(
  callExpression: CallExpression,
  env: Environment
): RuntimeValue {
  const args = callExpression.arguments.map((argument) => evaluate(argument, env));
  const func = evaluate(callExpression.caller, env);

  if (func.type !== 'native-function') {
    throw 'Cannot call identifier that is not a function' + JSON.stringify(func);
  }

  const result = (func as NativeFunctionValue).call(args, env);
  return result;
}

import {
  AssignmentExpression,
  BinaryExpression,
  BooleanExpression,
  CallExpression,
  Identifier,
  MemberExpression,
  ObjectLiteral,
  ReturnStatement,
} from '../../ast';
import { Environment } from '../environment';
import { evaluate } from '../interpreter';
import { ConvertToString, GetRuntimeValue } from '../native/utils';
import {
  NumberValue,
  RuntimeValue,
  MakeNull,
  ObjectValue,
  NativeFunctionValue,
  FunctionValue,
  StringValue,
  MakeBoolean,
} from '../values';
import { evaluateCodeBlock } from './statements';

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

function evaluateStringBinaryExpression(
  leftHandSide: StringValue,
  rightHandSide: StringValue,
  operation: string
): StringValue {
  let result: string = '';
  if (operation === '+') {
    result = leftHandSide.value + rightHandSide.value;
  }

  return { type: 'string', value: result };
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
  } else if (leftHandSide.type === 'string' || rightHandSide.type === 'string') {
    return evaluateStringBinaryExpression(
      leftHandSide as StringValue,
      rightHandSide as StringValue,
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

export function evaluateMemberExpression(
  memberExpression: MemberExpression,
  env: Environment
): RuntimeValue {
  const objectValue = evaluate(memberExpression.object, env);
  if (objectValue.type !== 'object')
    throw 'Cannot get member from variable that is not a object';

  let propertyValue: string;
  if (memberExpression.computed) {
    propertyValue = ConvertToString(evaluate(memberExpression.property, env));
  } else {
    propertyValue = (memberExpression.property as Identifier).symbol;
  }

  const memberValue = (objectValue as ObjectValue).properties.get(propertyValue);

  if (!memberValue) {
    return MakeNull();
  }

  return memberValue;
}

export function evaluateCallExpression(
  callExpression: CallExpression,
  env: Environment
): RuntimeValue {
  const args = callExpression.arguments.map((argument) => evaluate(argument, env));
  const func = evaluate(callExpression.caller, env);

  if (func.type === 'native-function') {
    return (func as NativeFunctionValue).call(args, env);
  } else if (func.type === 'function') {
    const functionValue = func as FunctionValue;
    const scope = new Environment(env);

    if (functionValue.parameters.length !== args.length) {
      throw (
        `Function call expression expected ${functionValue.parameters.length} ` +
        `arguments but got ${args.length}`
      );
    }

    for (let index = 0; index < functionValue.parameters.length; index++) {
      const variableName = functionValue.parameters[index].symbol;
      scope.declareVariable(variableName, args[index], true);
    }

    const result = evaluateCodeBlock(functionValue.body, scope);

    return result;
  }

  throw 'Cannot call identifier that is not a function\n' + JSON.stringify(func, null, 2);
}

export function evaluateBooleanExpression(
  booleanExpression: BooleanExpression,
  env: Environment
): RuntimeValue {
  const left = evaluate(booleanExpression.left, env);
  const leftValue = GetRuntimeValue(left);

  let right: RuntimeValue | undefined;
  let rightValue;
  if (booleanExpression.right) {
    right = evaluate(booleanExpression.right, env);
    rightValue = GetRuntimeValue(right);
  }

  if (right && rightValue && leftValue !== null) {
    switch (booleanExpression.operator) {
      case '==':
        return MakeBoolean(leftValue == rightValue);
      case '===':
        return MakeBoolean(leftValue === rightValue && left.type === right.type);
      case '!=':
        return MakeBoolean(leftValue != rightValue);
      case '!==':
        return MakeBoolean(leftValue !== rightValue && left.type !== right.type);
      case '>':
        return MakeBoolean(leftValue > rightValue);
      case '>=':
        return MakeBoolean(leftValue >= rightValue);
      case '<':
        return MakeBoolean(leftValue < rightValue);
      case '<=':
        return MakeBoolean(leftValue <= rightValue);
      case '&&':
        return MakeBoolean(leftValue && rightValue ? true : false);
      case '||':
        return MakeBoolean(leftValue || rightValue ? true : false);
      case undefined:
        return MakeBoolean(leftValue ? true : false);
      default:
        throw `Cannot evaluate operator ${booleanExpression.operator} on boolean expression`;
    }
  } else {
    return MakeBoolean(leftValue ? true : false);
  }
}

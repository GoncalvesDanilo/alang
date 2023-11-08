import { Identifier, Statement } from '../ast';
import { Environment } from './environment';

export type ValueType =
  | 'boolean'
  | 'null'
  | 'number'
  | 'object'
  | 'native-function'
  | 'function';

export interface RuntimeValue {
  type: ValueType;
}

export interface NullValue extends RuntimeValue {
  type: 'null';
  value: null;
}

export function MakeNull(): NullValue {
  return { type: 'null', value: null };
}

export interface NumberValue extends RuntimeValue {
  type: 'number';
  value: number;
}

export function MakeNumber(number: number = 0): NumberValue {
  return { type: 'number', value: number };
}

export interface ObjectValue extends RuntimeValue {
  type: 'object';
  properties: Map<string, RuntimeValue>;
}

export interface BooleanValue extends RuntimeValue {
  type: 'boolean';
  value: boolean;
}

export function MakeBoolean(bool: boolean = true): BooleanValue {
  return { type: 'boolean', value: bool };
}

export interface Variable {
  value: RuntimeValue;
  constant: boolean;
}

export function MakeVariable(value: RuntimeValue, constant: boolean): Variable {
  return { value, constant };
}

export type FunctionCall = (args: RuntimeValue[], env: Environment) => RuntimeValue;

export interface NativeFunctionValue extends RuntimeValue {
  type: 'native-function';
  call: FunctionCall;
}

export function MakeNativeFunction(call: FunctionCall) {
  return { type: 'native-function', call } as NativeFunctionValue;
}

export interface FunctionValue extends RuntimeValue {
  type: 'function';
  name: string;
  parameters: Identifier[];
  declarationEnvironment: Environment;
  body: Statement[];
}

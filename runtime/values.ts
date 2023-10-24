export type ValueType = 'boolean' | 'null' | 'number';

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

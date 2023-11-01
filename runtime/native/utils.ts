import {
  BooleanValue,
  NativeFunctionValue,
  NumberValue,
  ObjectValue,
  RuntimeValue,
} from '../values';

const ConvertToString = (runtimeValue: RuntimeValue): string => {
  switch (runtimeValue.type) {
    case 'boolean':
      return String((runtimeValue as BooleanValue).value);
    case 'number':
      return (runtimeValue as NumberValue).value.toString();
    case 'null':
      return 'null';
    case 'object':
      return JSON.stringify((runtimeValue as ObjectValue).properties);
    case 'native-function':
      return (runtimeValue as NativeFunctionValue).call.toString();
    default:
      throw `RuntimeValue of type ${runtimeValue.type} cannot be converted to string`;
  }
};

export { ConvertToString };

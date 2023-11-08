import {
  BooleanValue,
  FunctionValue,
  NativeFunctionValue,
  NumberValue,
  ObjectValue,
  RuntimeValue,
} from '../values';

const GetRuntimeValue = (runtimeValue: RuntimeValue) => {
  switch (runtimeValue.type) {
    case 'boolean':
      return (runtimeValue as BooleanValue).value;
    case 'number':
      return (runtimeValue as NumberValue).value;
    case 'object':
      const objProperties = (runtimeValue as ObjectValue).properties;
      let contentObject: Record<string, any> = {};
      objProperties.forEach((prop, key) => (contentObject[key] = GetRuntimeValue(prop)));
      return contentObject;
    case 'null':
      return 'null';
    case 'native-function':
      return (runtimeValue as NativeFunctionValue).call;
    case 'function':
      return (runtimeValue as FunctionValue).name;
    default:
      throw `Cannot get runtime value of type ${runtimeValue.type}`;
  }
};

const ConvertToString = (runtimeValue: RuntimeValue): string => {
  switch (runtimeValue.type) {
    case 'boolean':
      return String(GetRuntimeValue(runtimeValue));
    case 'number':
      return GetRuntimeValue(runtimeValue).toString();
    case 'null':
      return 'null';
    case 'object':
      return JSON.stringify(GetRuntimeValue(runtimeValue), null, 2);
    case 'native-function':
      return GetRuntimeValue(runtimeValue).toString();
    case 'function':
      return `function<${GetRuntimeValue(runtimeValue)}>`;
    default:
      throw `RuntimeValue of type ${runtimeValue.type} cannot be converted to string`;
  }
};

export { ConvertToString };

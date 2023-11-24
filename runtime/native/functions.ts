import {
  MakeNativeFunction,
  MakeNull,
  MakeNumber,
  MakeString,
  RuntimeValue,
} from '../values';
import { ConvertToString, GetRuntimeValue } from './utils';

const imprimir = MakeNativeFunction((args, _) => {
  const content: string = args.map((arg) => ConvertToString(arg)).join(' ');
  console.log(content);
  return MakeNull();
});

const ler = MakeNativeFunction((args, _) => {
  const message = args[0] ? ConvertToString(args[0]) : '>';
  const defaultValue = args[1] ? ConvertToString(args[1]) : '';
  const value = prompt(message);
  const stringValue = value || defaultValue || '';
  return MakeString(stringValue);
});

const converterParaNumero = MakeNativeFunction((args, _) => {
  const value = GetRuntimeValue(args[0]);
  const numberValue = Number(value);
  if (isNaN(numberValue)) {
    return MakeNull();
  } else {
    return MakeNumber(numberValue);
  }
});

export const nativeFunctions: Array<{ identifier: string; value: RuntimeValue }> = [
  {
    identifier: 'imprimir',
    value: imprimir,
  },
  {
    identifier: 'ler',
    value: ler,
  },
  {
    identifier: 'converterParaNumero',
    value: converterParaNumero,
  },
];

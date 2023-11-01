import { MakeNativeFunction, MakeNull, RuntimeValue } from '../values';
import { ConvertToString } from './utils';

const imprimir = MakeNativeFunction((args, _) => {
  const content: string = args.map((arg) => ConvertToString(arg)).join(' ');
  console.log(content);
  return MakeNull();
});

export const nativeFunctions: Array<{ identifier: string; value: RuntimeValue }> = [
  {
    identifier: 'imprimir',
    value: imprimir,
  },
];

import { MakeBoolean, MakeNull, RuntimeValue } from '../values';

const defaultGlobalConstants: Array<{ identifier: string; value: RuntimeValue }> = [
  {
    identifier: 'true',
    value: MakeBoolean(true),
  },
  {
    identifier: 'false',
    value: MakeBoolean(false),
  },
  {
    identifier: 'null',
    value: MakeNull(),
  },
];

export { defaultGlobalConstants };

import { MakeVariable, RuntimeValue, Variable } from './values';

export class Environment {
  private parent?: Environment;
  private variables: Map<string, Variable>;

  constructor(parent?: Environment) {
    this.parent = parent;
    this.variables = new Map();
  }

  public declareVariable(
    variableName: string,
    value: RuntimeValue,
    constant: boolean
  ): RuntimeValue {
    if (this.variables.has(variableName))
      throw `Cannot declare variable '${variableName}'. Variable was previously declared`;

    this.variables.set(variableName, MakeVariable(value, constant));
    return value;
  }

  public assignVariable(variableName: string, value: RuntimeValue): RuntimeValue {
    const env = this.resolve(variableName);
    const variable = env.variables.get(variableName) as Variable;
    if (variable.constant) throw `Cannot reassign value to constant '${variableName}'.`;
    env.variables.set(variableName, MakeVariable(value, false));
    return value;
  }

  public lookupVariable(variableName: string): RuntimeValue {
    const env = this.resolve(variableName);
    const variable = env.variables.get(variableName) as Variable;
    return variable.value;
  }

  public resolve(variableName: string): Environment {
    if (this.variables.has(variableName)) return this;

    if (!this.parent) throw `Cannot resolve '${variableName}'. Variable does not exist`;

    return this.parent.resolve(variableName);
  }
}

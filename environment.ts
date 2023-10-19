import { RuntimeValue } from './values';

export class Environment {
  private parent?: Environment;
  private variables: Map<string, RuntimeValue>;

  constructor(parent?: Environment) {
    this.parent = parent;
    this.variables = new Map();
  }

  public declareVariable(variableName: string, value: RuntimeValue): RuntimeValue {
    if (this.variables.has(variableName))
      throw `Cannot declare variable '${variableName}'. Variable was previously declared`;

    this.variables.set(variableName, value);
    return value;
  }

  public assignVariable(variableName: string, value: RuntimeValue): RuntimeValue {
    const env = this.resolve(variableName);
    env.variables.set(variableName, value);
    return value;
  }

  public lookupVariable(variableName: string): RuntimeValue {
    const env = this.resolve(variableName);
    return env.variables.get(variableName) as RuntimeValue;
  }

  public resolve(variableName: string): Environment {
    if (this.variables.has(variableName)) return this;

    if (!this.parent) throw `Cannot resolve ${variableName}. Variable does not exist`;

    return this.parent.resolve(variableName);
  }
}

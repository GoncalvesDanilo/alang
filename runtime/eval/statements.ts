import { Program, VariableDeclaration } from '../../ast';
import { Environment } from '../environment';
import { evaluate } from '../interpreter';
import { RuntimeValue, MakeNull } from '../values';

export function evaluateProgram(program: Program, env: Environment): RuntimeValue {
  let lastEvaluated: RuntimeValue = MakeNull();
  for (const statement of program.body) {
    lastEvaluated = evaluate(statement, env);
  }
  return lastEvaluated;
}

export function evaluateVariableDeclaration(
  declaration: VariableDeclaration,
  env: Environment
): RuntimeValue {
  const value = declaration.value ? evaluate(declaration.value, env) : MakeNull();
  return env.declareVariable(declaration.identifier, value, declaration.constant);
}

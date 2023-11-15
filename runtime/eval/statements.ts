import {
  FunctionDeclaration,
  IfStatement,
  Program,
  ReturnStatement,
  Statement,
  VariableDeclaration,
} from '../../ast';
import { Environment } from '../environment';
import { evaluate } from '../interpreter';
import { RuntimeValue, MakeNull, FunctionValue, BooleanValue } from '../values';

export function evaluateProgram(program: Program, env: Environment): RuntimeValue {
  const programOutput = evaluateCodeBlock(program.body, env);
  return programOutput;
}

export function evaluateVariableDeclaration(
  declaration: VariableDeclaration,
  env: Environment
): RuntimeValue {
  const value = declaration.value ? evaluate(declaration.value, env) : MakeNull();
  return env.declareVariable(declaration.identifier, value, declaration.constant);
}

export function evaluateFunctionDeclaration(
  functionDeclaration: FunctionDeclaration,
  env: Environment
): RuntimeValue {
  const func = {
    type: 'function',
    name: functionDeclaration.name,
    parameters: functionDeclaration.parameters,
    body: functionDeclaration.body,
    declarationEnvironment: env,
  } as FunctionValue;

  return env.declareVariable(functionDeclaration.name, func, true);
}

export function evaluateIfStatement(
  ifStatement: IfStatement,
  env: Environment
): RuntimeValue {
  const conditionResult = evaluate(ifStatement.condition, env) as BooleanValue;

  let result: RuntimeValue = MakeNull();
  if (conditionResult.value) {
    result = evaluateCodeBlock(ifStatement.body, env);
  } else if (ifStatement.elseBody) {
    result = evaluateCodeBlock(ifStatement.elseBody, env);
  }

  return result;
}

export function evaluateCodeBlock(
  codeBlock: Statement[],
  scope: Environment
): RuntimeValue {
  let result: RuntimeValue = MakeNull();

  for (const statement of codeBlock) {
    if (statement.type === 'ReturnStatement') {
      const returnExpression = (statement as ReturnStatement).value;
      if (returnExpression) result = evaluate(returnExpression, scope);
      break;
    } else if (statement.type === 'IfStatement') {
      result = evaluate(statement, scope);
      break;
    }
    evaluate(statement, scope);
  }

  return result;
}

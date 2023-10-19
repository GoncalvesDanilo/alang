import { Environment } from './environment';
import { evaluate } from './interpreter';
import Parser from './parser';
import { MakeBoolean, MakeNull } from './values';

const repl = () => {
  const parser = new Parser();
  const env = new Environment();
  env.declareVariable('null', MakeNull())
  env.declareVariable('true', MakeBoolean(true))
  env.declareVariable('false', MakeBoolean(false))
  console.log('Alang Repl v0.0');

  while (true) {
    const input = prompt('> ');

    if (!input || input === 'exit') process.exit();

    const program = parser.createAST(input);
    const result = evaluate(program, env);

    console.dir(result, { depth: null });
  }
};

repl();

import { Environment } from './runtime/environment';
import { evaluate } from './runtime/interpreter';
import Parser from './parser';

const repl = () => {
  const parser = new Parser();
  const env = new Environment();
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

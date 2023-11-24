import { Environment } from './runtime/environment';
import { evaluate } from './runtime/interpreter';
import Parser from './parser';

const run = async (fileName: string) => {
  const parser = new Parser();
  const env = new Environment();

  const inputFile = Bun.file(fileName);
  const inputText = await inputFile.text();

  const program = parser.createAST(inputText);
  evaluate(program, env);
}

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

// repl();
run('./calculadora.a');

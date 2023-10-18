import Parser from './parser';

const repl = () => {
  const parser = new Parser();
  console.log('Alang Repl v0.0');

  while (true) {
    const input = prompt('> ');

    if (!input || input === 'exit') process.exit();

    const program = parser.createAST(input);
    console.dir(program, { depth: null });
  }
};

repl();

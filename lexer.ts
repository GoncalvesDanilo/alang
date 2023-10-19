export enum TokenType {
  // literal types
  Number,
  Identifier,

  // keywords
  Let,

  // operatiors
  BinaryOperator,
  Equals,

  // grouping
  OpenParen,
  CloseParen,

  // end of file
  EOF,
}

export type Token = {
  type: TokenType;
  value: string;
};

const KEYWORDS: Record<string, TokenType> = {
  let: TokenType.Let,
};

const isAlpha = (char: string): boolean => {
  return char.toUpperCase() !== char.toLowerCase();
};

const isSkippable = (char: string): boolean => {
  return char === ' ' || char === '\t' || char === '\n';
};

const isInteger = (str: string) => {
  const c = str.charCodeAt(0);
  const bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)];
  return c >= bounds[0] && c <= bounds[1];
};

const token = (type: TokenType, value: string = ''): Token => {
  return { type, value };
};

export const tokenize = (sourceCode: string): Token[] => {
  const tokens: Token[] = [];
  const src = sourceCode.split('');

  while (src.length) {
    if (src[0] === '(') {
      tokens.push(token(TokenType.OpenParen, src.shift()));
    } else if (src[0] === ')') {
      tokens.push(token(TokenType.CloseParen, src.shift()));
    } else if (
      src[0] === '+' ||
      src[0] === '-' ||
      src[0] === '*' ||
      src[0] === '/' ||
      src[0] === '%'
    ) {
      tokens.push(token(TokenType.BinaryOperator, src.shift()));
    } else if (src[0] === '=') {
      tokens.push(token(TokenType.Equals, src.shift()));
    } else {
      // Handle multicharacter tokens
      if (isInteger(src[0])) {
        let num = '';
        while (src.length > 0 && isInteger(src[0])) {
          num += src.shift();
        }

        // append new numeric token.
        tokens.push(token(TokenType.Number, num));
      } else if (isAlpha(src[0])) {
        // Handle Identifier & Keyword Tokens.
        let ident = '';
        while (src.length > 0 && isAlpha(src[0])) {
          ident += src.shift();
        }

        // CHECK FOR RESERVED KEYWORDS
        const reserved = KEYWORDS[ident];
        // If value is not undefined then the identifier is
        // reconized keyword
        if (typeof reserved === 'number') {
          tokens.push(token(reserved, ident));
        } else {
          // Unreconized name must mean user defined symbol.
          tokens.push(token(TokenType.Identifier, ident));
        }
      } else if (isSkippable(src[0])) {
        // Skip uneeded chars.
        src.shift();
      } // Handle unreconized characters.
      // TODO: Impliment better errors and error recovery.
      else {
        console.error(
          'Unreconized character found in source: ',
          src[0].charCodeAt(0),
          src[0]
        );
        process.exit();
      }
    }
  }

  tokens.push(token(TokenType.EOF, 'EOF'));
  return tokens;
};
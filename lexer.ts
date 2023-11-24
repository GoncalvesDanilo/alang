export enum TokenType {
  // literal types
  Number,
  String,
  Identifier,

  // keywords
  Var,
  Const,
  Function,
  If,
  Else,
  While,
  Return,
  Continue,
  Break,

  // operatiors
  BinaryOperator,
  EqualityOperator,
  RelationalOperator,
  LogicalOperator,
  Equals,
  Semicolon,
  Colon,
  Comma,
  Dot,

  // grouping
  OpenParen,
  CloseParen,
  OpenBraces,
  CloseBraces,
  OpenBrackets,
  CloseBrackets,

  // end of file
  EOF,
}

export type Token = {
  type: TokenType;
  value: string;
};

const KEYWORDS: Record<string, TokenType> = {
  var: TokenType.Var,
  const: TokenType.Const,
  funcao: TokenType.Function,
  retornar: TokenType.Return,
  se: TokenType.If,
  senao: TokenType.Else,
  enquanto: TokenType.While,
  continuar: TokenType.Continue,
  parar: TokenType.Break,
};

const isAlpha = (char: string): boolean => {
  return char.toUpperCase() !== char.toLowerCase();
};

const isInteger = (str: string) => {
  const c = str.charCodeAt(0);
  const bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)];
  return c >= bounds[0] && c <= bounds[1];
};

const isSkippable = (char: string): boolean => {
  return char === ' ' || char === '\t' || char === '\n';
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
    } else if (src[0] === '{') {
      tokens.push(token(TokenType.OpenBraces, src.shift()));
    } else if (src[0] === '}') {
      tokens.push(token(TokenType.CloseBraces, src.shift()));
    } else if (src[0] === '[') {
      tokens.push(token(TokenType.OpenBrackets, src.shift()));
    } else if (src[0] === ']') {
      tokens.push(token(TokenType.CloseBrackets, src.shift()));
    } else if (
      src[0] === '+' ||
      src[0] === '-' ||
      src[0] === '*' ||
      src[0] === '/' ||
      src[0] === '%'
    ) {
      tokens.push(token(TokenType.BinaryOperator, src.shift()));
    } else if (src[0] === '=') {
      let tokenValue = src.shift() as string; // =
      if (src[0] === '=') {
        tokenValue += src.shift(); // ==
        if (src[0] === '=') {
          tokenValue += src.shift(); // ===
          tokens.push(token(TokenType.EqualityOperator, tokenValue));
          continue;
        }
        tokens.push(token(TokenType.EqualityOperator, tokenValue));
        continue;
      }
      tokens.push(token(TokenType.Equals, tokenValue));
    } else if (src[0] === '!') {
      let tokenValue = src.shift() as string; // !
      // @ts-expect-error
      if (src[0] === '=') {
        tokenValue += src.shift(); // !=
        if (src[0] === '=') {
          tokenValue += src.shift(); // !==
          tokens.push(token(TokenType.EqualityOperator, tokenValue));
          continue;
        }
        tokens.push(token(TokenType.EqualityOperator, tokenValue));
        continue;
      }
      tokens.push(token(TokenType.LogicalOperator, tokenValue));
    } else if (src[0] === '>') {
      let tokenValue = src.shift() as string; // >
      // @ts-expect-error
      if (src[0] === '=') {
        tokenValue += src.shift(); // >=
        tokens.push(token(TokenType.RelationalOperator, tokenValue));
        continue;
      }
      tokens.push(token(TokenType.RelationalOperator, tokenValue));
    } else if (src[0] === '<') {
      let tokenValue = src.shift() as string; // <
      // @ts-expect-error
      if (src[0] === '=') {
        tokenValue += src.shift(); // <=
        tokens.push(token(TokenType.RelationalOperator, tokenValue));
        continue;
      }
      tokens.push(token(TokenType.RelationalOperator, tokenValue));
    } else if (src[0] === '&') {
      let tokenValue = src.shift() as string; // &
      if (src[0] === '&') {
        tokenValue += src.shift(); // &&
        tokens.push(token(TokenType.LogicalOperator, tokenValue));
        continue;
      }
      tokens.push(token(TokenType.LogicalOperator, tokenValue));
    } else if (src[0] === '|') {
      let tokenValue = src.shift() as string; // |
      if (src[0] === '|') {
        tokenValue += src.shift(); // ||
        tokens.push(token(TokenType.LogicalOperator, tokenValue));
        continue;
      }
      tokens.push(token(TokenType.LogicalOperator, tokenValue));
    } else if (src[0] === ';') {
      tokens.push(token(TokenType.Semicolon, src.shift()));
    } else if (src[0] === ':') {
      tokens.push(token(TokenType.Colon, src.shift()));
    } else if (src[0] === ',') {
      tokens.push(token(TokenType.Comma, src.shift()));
    } else if (src[0] === '.') {
      tokens.push(token(TokenType.Dot, src.shift()));
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
        let identifier = '';
        while (src.length > 0 && (isAlpha(src[0]) || isInteger(src[0]))) {
          identifier += src.shift();
        }

        // CHECK FOR RESERVED KEYWORDS
        const reserved = KEYWORDS[identifier];
        // If value is not undefined then the identifier is
        // reconized keyword
        if (typeof reserved === 'number') {
          tokens.push(token(reserved, identifier));
        } else {
          // Unreconized name must mean user defined symbol.
          tokens.push(token(TokenType.Identifier, identifier));
        }
      } else if (src[0] === "'" || src[0] === '"') {
        // Handle String Literals
        let quote: string = src.shift() as string;
        let string = '';
        while (src.length > 0 && src[0] !== quote) {
          string += src.shift();
        }
        src.shift();

        tokens.push(token(TokenType.String, string));
      } else if (isSkippable(src[0])) {
        // Skip uneeded chars.
        src.shift();
      } else {
        // Handle unreconized characters.
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

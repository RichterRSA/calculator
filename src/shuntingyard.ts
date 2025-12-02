import {
  FunctionToken,
  LParenToken,
  MinusToken,
  MultiplyToken,
  NumberToken,
  OperatorToken,
  PlusToken,
  RParenToken,
  type Token,
} from "./token";

function insertImplicitMultiplication(tokens: Token[]): Token[] {
  const result: Token[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    result.push(token);

    if (i < tokens.length - 1) {
      const next = tokens[i + 1];

      const shouldInsertMultiply =
        (token instanceof NumberToken && next instanceof LParenToken) ||
        (token instanceof NumberToken && next instanceof FunctionToken) ||
        (token instanceof RParenToken && next instanceof LParenToken) ||
        (token instanceof RParenToken && next instanceof NumberToken) ||
        (token instanceof RParenToken && next instanceof FunctionToken);

      if (shouldInsertMultiply) {
        result.push(new MultiplyToken());
      }
    }
  }

  return result;
}

function validateSyntax(tokens: Token[]): string | null {
  let parenCount = 0;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token instanceof LParenToken) {
      parenCount++;
    } else if (token instanceof RParenToken) {
      parenCount--;
      if (parenCount < 0) {
        return "Syntax Error";
      }
    }

    if (
      token instanceof OperatorToken &&
      !(token instanceof LParenToken) &&
      !(token instanceof RParenToken) &&
      !(token instanceof MinusToken)
    ) {
      const next = i + 1 < tokens.length ? tokens[i + 1] : null;
      if (
        next instanceof OperatorToken &&
        !(next instanceof LParenToken) &&
        !(next instanceof RParenToken) &&
        !(next instanceof MinusToken)
      ) {
        return "Syntax Error";
      }
    }
  }

  if (parenCount !== 0) {
    return "Syntax Error";
  }

  return null;
}

function preprocessMinusSigns(tokens: Token[]): Token[] {
  const result: Token[] = [];
  let i = 0;

  while (i < tokens.length) {
    const token = tokens[i];

    if (token instanceof MinusToken) {
      let minusCount = 0;
      let j = i;
      while (j < tokens.length && tokens[j] instanceof MinusToken) {
        minusCount++;
        j++;
      }
      const isBeforeNumber =
        j < tokens.length && tokens[j] instanceof NumberToken;

      const isUnaryContext =
        result.length === 0 ||
        result[result.length - 1] instanceof OperatorToken ||
        result[result.length - 1] instanceof LParenToken;

      if (isBeforeNumber && isUnaryContext) {
        const number = tokens[j] as NumberToken;
        if (minusCount % 2 === 1) {
          result.push(new NumberToken(-number.value));
        } else {
          result.push(new NumberToken(number.value));
        }
        i = j + 1;
      } else {
        if (minusCount % 2 === 1) {
          result.push(new MinusToken());
        } else {
          result.push(new PlusToken());
        }
        i = j;
      }
    } else {
      result.push(token);
      i++;
    }
  }

  return result;
}

export function process(tokens: Token[]) {
  tokens = insertImplicitMultiplication(tokens);
  tokens = preprocessMinusSigns(tokens);

  var outputQueue: Token[] = [];
  var operatorStack: (OperatorToken | FunctionToken)[] = [];
  while (tokens.length > 0) {
    const token = tokens.shift();
    if (token instanceof NumberToken) {
      outputQueue.push(token);
    } else if (token instanceof FunctionToken) {
      operatorStack.push(token);
    } else if (token instanceof LParenToken) {
      operatorStack.push(token);
    } else if (token instanceof RParenToken) {
      while (
        operatorStack.length > 0 &&
        !(operatorStack[operatorStack.length - 1] instanceof LParenToken)
      ) {
        outputQueue.push(operatorStack.pop()!);
      }
      operatorStack.pop();
    } else if (token instanceof OperatorToken) {
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1] instanceof OperatorToken &&
        (operatorStack[operatorStack.length - 1] as OperatorToken).precedence >=
          token.precedence
      ) {
        outputQueue.push(operatorStack.pop()!);
      }
      operatorStack.push(token);
    }
  }

  while (operatorStack.length > 0) {
    let op = operatorStack.pop();
    outputQueue.push(op!);
  }

  return outputQueue;
}

export function calculate(tokens: Token[]): number | string {
  const syntaxError = validateSyntax(tokens);
  if (syntaxError) {
    return syntaxError;
  }

  var output_queue = process(tokens);
  var stack: number[] = [];
  while (output_queue.length > 0) {
    const token = output_queue.shift();
    if (token instanceof NumberToken) {
      stack.push(token.value);
    } else if (token instanceof FunctionToken) {
      const a = stack.pop();
      if (a === undefined) {
        return NaN;
      }
      stack.push(token.evaluateUnary(a));
    } else if (token instanceof OperatorToken) {
      const b = stack.pop();
      const a = stack.pop();
      if (a === undefined || b === undefined) {
        return NaN;
      }
      stack.push(token.evaluate(a, b));
    }
  }
  if (stack.length !== 1) return NaN;
  return stack.pop()!;
}

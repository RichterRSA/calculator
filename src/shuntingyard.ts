import {
  LParenToken,
  MinusToken,
  NumberToken,
  OperatorToken,
  PlusToken,
  RParenToken,
  type Token,
} from "./token";

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
  tokens = preprocessMinusSigns(tokens);

  var outputQueue: Token[] = [];
  var operatorStack: OperatorToken[] = [];
  while (tokens.length > 0) {
    const token = tokens.shift();
    if (token instanceof NumberToken) {
      outputQueue.push(token);
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
        operatorStack[operatorStack.length - 1].precedence >= token.precedence
      ) {
        outputQueue.push(operatorStack.pop()!);
      }
      operatorStack.push(token);
    }
  }

  // move remaining operators to the output queue
  while (operatorStack.length > 0) {
    let op = operatorStack.pop();
    outputQueue.push(op!);
  }

  return outputQueue;
}

export function calculate(tokens: Token[]): number {
  var output_queue = process(tokens);
  var stack: number[] = [];
  while (output_queue.length > 0) {
    const token = output_queue.shift();
    if (token instanceof NumberToken) {
      stack.push(token.value);
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

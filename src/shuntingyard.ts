import {
  LParenToken,
  NumberToken,
  OperatorToken,
  RParenToken,
  type Token,
} from "./token";

export function process(tokens: Token[]) {
  var output_queue: Token[] = [];
  var operator_stack: OperatorToken[] = [];
  while (tokens.length > 0) {
    const token = tokens.shift();
    if (token instanceof NumberToken) {
      output_queue.push(token);
    } else if (token instanceof LParenToken) {
      operator_stack.push(token);
    } else if (token instanceof RParenToken) {
      while (
        operator_stack.length > 0 &&
        !(operator_stack[operator_stack.length - 1] instanceof LParenToken)
      ) {
        output_queue.push(operator_stack.pop()!);
      }
      operator_stack.pop();
    } else if (token instanceof OperatorToken) {
      while (
        operator_stack.length > 0 &&
        operator_stack[operator_stack.length - 1].precedence >= token.precedence
      ) {
        output_queue.push(operator_stack.pop()!);
      }
      operator_stack.push(token);
    }
  }

  // move remaining operators to the output queue
  while (operator_stack.length > 0) {
    let op = operator_stack.pop();
    output_queue.push(op!);
  }

  return output_queue;
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

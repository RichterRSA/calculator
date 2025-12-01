export class Token {}

export class NumberToken extends Token {
  value: number;

  constructor(value: number) {
    super();
    this.value = value;
  }

  toString(): string {
    return this.value.toString();
  }
}

export class OperatorToken extends Token {
  operator: string;
  precedence: number;

  constructor(operator: string, precedence: number) {
    super();
    this.operator = operator;
    this.precedence = precedence;
  }

  evaluate(_a: number, _b: number): number {
    throw new Error("Not implemented");
  }

  toString(): string {
    return this.operator;
  }
}

export class LParenToken extends OperatorToken {
  constructor() {
    super("(", 0);
  }
}

export class RParenToken extends OperatorToken {
  constructor() {
    super(")", 0);
  }
}

export class PlusToken extends OperatorToken {
  constructor() {
    super("+", 1);
  }

  evaluate(a: number, b: number): number {
    return a + b;
  }
}

export class MinusToken extends OperatorToken {
  constructor() {
    super("-", 1);
  }

  evaluate(a: number, b: number): number {
    return a - b;
  }
}

export class MultiplyToken extends OperatorToken {
  constructor() {
    super("*", 2);
  }

  evaluate(a: number, b: number): number {
    return a * b;
  }
}

export class DivideToken extends OperatorToken {
  constructor() {
    super("/", 2);
  }

  evaluate(a: number, b: number): number {
    return a / b;
  }
}

export class PowerToken extends OperatorToken {
  constructor() {
    super("^", 3);
  }

  evaluate(a: number, b: number): number {
    return Math.pow(a, b);
  }
}

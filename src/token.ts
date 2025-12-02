export class Token {
  isFunction(): boolean {
    return false;
  }
}

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

  toString(): string {
    return "&minus;";
  }
}

export class MultiplyToken extends OperatorToken {
  constructor() {
    super("*", 2);
  }

  evaluate(a: number, b: number): number {
    return a * b;
  }

  toString(): string {
    return "&times;";
  }
}

export class DivideToken extends OperatorToken {
  constructor() {
    super("/", 2);
  }

  evaluate(a: number, b: number): number {
    return a / b;
  }

  toString(): string {
    return "&divide;";
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

export class FunctionToken extends Token {
  name: string;

  constructor(name: string) {
    super();
    this.name = name;
  }

  isFunction(): boolean {
    return true;
  }

  evaluateUnary(_a: number): number {
    throw new Error("Not implemented");
  }

  toString(): string {
    return this.name;
  }
}

export class SqrtToken extends FunctionToken {
  constructor() {
    super("√");
  }

  evaluateUnary(a: number): number {
    return Math.sqrt(a);
  }
}

export class SinToken extends FunctionToken {
  constructor() {
    super("sin");
  }

  evaluateUnary(a: number): number {
    return Math.sin(a);
  }
}

export class CosToken extends FunctionToken {
  constructor() {
    super("cos");
  }

  evaluateUnary(a: number): number {
    return Math.cos(a);
  }
}

export class TanToken extends FunctionToken {
  constructor() {
    super("tan");
  }

  evaluateUnary(a: number): number {
    return Math.tan(a);
  }
}

export class Token {}

export class NumberToken extends Token {
  value: number;

  constructor(value: number) {
    super();
    this.value = value;
  }

  toString(): string {
    return `NumberToken(${this.value})`;
  }
}

export class OperatorToken extends Token {
  operator: string;

  constructor(operator: string) {
    super();
    this.operator = operator;
  }

  toString(): string {
    return `OperatorToken(${this.operator})`;
  }
}

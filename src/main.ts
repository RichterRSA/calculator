import { calculate } from "./shuntingyard";
import {
  DivideToken,
  LParenToken,
  MinusToken,
  MultiplyToken,
  NumberToken,
  OperatorToken,
  PlusToken,
  PowerToken,
  RParenToken,
  Token,
} from "./token";

var token_list: Token[] = [];
var input: string = "";

function enter_number(key: string) {
  input += key;
  update_display();
  animateButton(key);
}

function enter_operator(key: string) {
  // Special handling for minus sign - check if it's unary (negative) or binary (subtraction)
  if (key === "-") {
    const isUnary = isUnaryMinus();
    if (isUnary) {
      // Treat as negative sign, add to input
      input += "-";
      update_display();
      return;
    }
  }

  // if there is a number still in the input, add it
  // to the stack
  cleanInput();
  switch (key) {
    case "+":
      token_list.push(new PlusToken());
      break;
    case "-":
      token_list.push(new MinusToken());
      break;
    case "*":
      token_list.push(new MultiplyToken());
      break;
    case "/":
      token_list.push(new DivideToken());
      break;
    case "(":
      token_list.push(new LParenToken());
      break;
    case ")":
      token_list.push(new RParenToken());
      break;
    case "^":
      token_list.push(new PowerToken());
      break;
    default:
      throw new Error(`Invalid operator: ${key}`);
  }

  update_display();
  animateButton(key);
}

function isUnaryMinus(): boolean {
  // Minus is unary if:
  // 1. At the start (no tokens and no input)
  // 2. After an operator (except right paren)
  // 3. After a left paren
  // 4. Currently typing a number and input is empty or only has minus signs

  // If we're already typing a number, it's not unary
  if (input.length > 0) {
    return false;
  }

  // No tokens yet - it's unary (start of expression)
  if (token_list.length === 0) {
    return true;
  }

  const lastToken = token_list[token_list.length - 1];

  // After a number or right paren, it's binary subtraction
  if (lastToken instanceof NumberToken || lastToken instanceof RParenToken) {
    return false;
  }

  // After any other operator or left paren, it's unary
  return true;
}

function cleanInput() {
  if (input.length > 0) {
    let value = parseFloat(input);
    token_list.push(new NumberToken(value));
    input = "";
  }
}

function enter_equals() {
  cleanInput();

  console.log("Tokens:");
  for (let i = 0; i < token_list.length; i++) {
    console.log(token_list[i].toString());
  }

  var result: number = calculate(token_list);
  console.log("Result:", result);

  // Reset token list for next calculation
  input = result.toString();
  update_display();
  animateButton("Enter");
}

function update_display() {
  var display = document.getElementById("display");
  var text = "";
  for (let i = 0; i < token_list.length; i++) {
    text += token_list[i].toString();
  }
  text += input;
  if (text.length === 0) text = "0";
  if (display) {
    display.innerText = text;
  }
}

function enter_clear() {
  input = "";
  token_list = [];
  update_display();
  animateButton("Escape");
}

function enter_back() {
  if (input.length > 0) {
    input = input.slice(0, -1);
    update_display();
  } else {
    var last = token_list[token_list.length - 1];
    if (last instanceof NumberToken) {
      if (isNaN(last.value)) {
        input = "";
      } else {
        input = last.value.toString();
        input = input.slice(0, -1);
      }
    }
    token_list.pop();
    update_display();
  }
  animateButton("Backspace");
}

function animateButton(key: string) {
  // Find the button element with the matching data-key attribute
  const button = document.querySelector(
    `.calculator-button[data-key="${key}"]`,
  ) as HTMLElement;

  if (button) {
    // Add the 'pressed' class
    button.classList.add("pressed");

    // Remove the class after a short delay
    setTimeout(() => {
      button.classList.remove("pressed");
    }, 100);
  }
}

// Keyboard event listener
document.addEventListener("keydown", (event: KeyboardEvent) => {
  const key = event.key;

  // Numbers and decimal point
  if (/^[0-9.]$/.test(key)) {
    enter_number(key);
    event.preventDefault();
  }
  // Operators
  else if (["+", "-", "*", "/", "(", ")", "^"].includes(key)) {
    enter_operator(key);
    event.preventDefault();
  }
  // Enter or equals
  else if (key === "Enter" || key === "=") {
    enter_equals();
    event.preventDefault();
  }
  // Backspace
  else if (key === "Backspace") {
    enter_back();
    event.preventDefault();
  }
  // Delete or Escape for clear
  else if (key === "Delete" || key === "Escape") {
    enter_clear();
    event.preventDefault();
  }
});

// Expose functions to global scope for onclick handlers
(window as any).enter_number = enter_number;
(window as any).enter_operator = enter_operator;
(window as any).enter_equals = enter_equals;
(window as any).enter_clear = enter_clear;
(window as any).enter_back = enter_back;

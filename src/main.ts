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
}

function enter_operator(key: string) {
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
  token_list = [new NumberToken(result)];
  update_display();
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
}

function enter_back() {
  if (input.length > 0) {
    input = input.slice(0, -1);
    update_display();
  } else {
    var last = token_list[token_list.length - 1];
    if (last instanceof NumberToken) {
      input = last.value.toString();
      input = input.slice(0, -1);
    }
    token_list.pop();
    update_display();
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

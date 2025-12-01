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
  if (display) {
    display.textContent = text;
  }
}

// Expose functions to global scope for onclick handlers
(window as any).enter_number = enter_number;
(window as any).enter_operator = enter_operator;
(window as any).enter_equals = enter_equals;

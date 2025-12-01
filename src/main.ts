import { NumberToken, OperatorToken, Token } from "./token";

var token_list: Token[] = [];
var input: string = "";

function enter_number(key: string) {
  input += key;
}

function enter_operator(key: string) {
  // if there is a number still in the input, add it
  // to the stack
  cleanInput();
  token_list.push(new OperatorToken(key));
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
}

// Expose functions to global scope for onclick handlers
(window as any).enter_number = enter_number;
(window as any).enter_operator = enter_operator;
(window as any).enter_equals = enter_equals;

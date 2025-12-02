import { calculate } from "./shuntingyard";
import {
  CosToken,
  DivideToken,
  LParenToken,
  MinusToken,
  MultiplyToken,
  NumberToken,
  PlusToken,
  PowerToken,
  RParenToken,
  SinToken,
  SqrtToken,
  TanToken,
  Token,
} from "./token";

var tokenList: Token[] = [];
var input: string = "";

function enterNumber(key: string) {
  input += key;
  updateDisplay();
  animateButton(key);
}

function enterOperator(key: string) {
  // if there is a number still in the input, add it
  // to the stack
  cleanInput();
  switch (key) {
    case "+":
      tokenList.push(new PlusToken());
      break;
    case "-":
      tokenList.push(new MinusToken());
      break;
    case "*":
      tokenList.push(new MultiplyToken());
      break;
    case "/":
      tokenList.push(new DivideToken());
      break;
    case "(":
      tokenList.push(new LParenToken());
      break;
    case ")":
      tokenList.push(new RParenToken());
      break;
    case "^":
      tokenList.push(new PowerToken());
      break;
    default:
      throw new Error(`Invalid operator: ${key}`);
  }

  updateDisplay();
  animateButton(key);
}

function enterFunction(func: string) {
  cleanInput();
  switch (func) {
    case "sqrt":
      tokenList.push(new SqrtToken());
      break;
    case "sin":
      tokenList.push(new SinToken());
      break;
    case "cos":
      tokenList.push(new CosToken());
      break;
    case "tan":
      tokenList.push(new TanToken());
      break;
    default:
      throw new Error(`Invalid function: ${func}`);
  }
  tokenList.push(new LParenToken());
  updateDisplay();
}

function cleanInput() {
  if (input.length > 0) {
    let value = parseFloat(input);
    tokenList.push(new NumberToken(value));
    input = "";
  }
}

function enterEquals() {
  cleanInput();

  var result: number | string = calculate(tokenList);

  if (typeof result === "string") {
    input = result;
  } else {
    input = result.toString();
  }
  tokenList = [];
  updateDisplay();
  animateButton("Enter");
}

function updateDisplay() {
  var display = document.getElementById("display");
  var text = "";
  for (let i = 0; i < tokenList.length; i++) {
    text += tokenList[i].toString();
  }
  text += input;
  if (input === "NaN") {
    text = "Error";
    input = "";
  }
  if (input === "Syntax Error") {
    text = "Syntax Error";
    input = "";
  }
  if (text.length === 0) text = "0";
  if (display) {
    display.innerHTML = text;
  }
}

function enterClear() {
  input = "";
  tokenList = [];
  updateDisplay();
  animateButton("Escape");
}

function enterBack() {
  if (input.length > 0) {
    input = input.slice(0, -1);
    updateDisplay();
  } else if (tokenList.length > 0) {
    var last = tokenList[tokenList.length - 1];
    if (last instanceof NumberToken) {
      if (isNaN(last.value)) {
        input = "";
      } else {
        input = last.value.toString();
        input = input.slice(0, -1);
      }
      tokenList.pop();
    } else if (
      last instanceof LParenToken &&
      tokenList.length >= 2 &&
      tokenList[tokenList.length - 2].isFunction()
    ) {
      tokenList.pop();
      tokenList.pop();
    } else {
      tokenList.pop();
    }
    updateDisplay();
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
    enterNumber(key);
    event.preventDefault();
  }
  // Operators
  else if (["+", "-", "*", "/", "(", ")", "^"].includes(key)) {
    enterOperator(key);
    event.preventDefault();
  }
  // Enter or equals
  else if (key === "Enter" || key === "=") {
    enterEquals();
    event.preventDefault();
  }
  // Backspace
  else if (key === "Backspace") {
    enterBack();
    event.preventDefault();
  }
  // Delete or Escape for clear
  else if (key === "Delete" || key === "Escape") {
    enterClear();
    event.preventDefault();
  }
});

(window as any).enterNumber = enterNumber;
(window as any).enterOperator = enterOperator;
(window as any).enterFunction = enterFunction;
(window as any).enterEquals = enterEquals;
(window as any).enterClear = enterClear;
(window as any).enterBack = enterBack;

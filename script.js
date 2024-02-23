
const display = document.querySelector(".display");
const editControlBtns = document.querySelector(".edit-controls");
const calcControlBtns = document.querySelector(".calculation-controls");

let operators = ["*", "/", "+", "-"];
let displayValue = "";
let displayNums = [];
let displayOpers = [];
let result = 0;

addEventListenersToChildren(editControlBtns);
addEventListenersToChildren(calcControlBtns);
roundCorners("inherit");

//* --- FUNCTIONS ---
// Adds an event listener to each child
function addEventListenersToChildren(parent) {
    Array.from(parent.children).forEach((child) => {
        child.addEventListener("click", () => updateDisplay(child.textContent));
    });
}

// Function to push a number/operator to the display element
function updateDisplay(value) {
    if (value == "Clear") {
        clearDisplay();
        return
    } else if (value == "Backspace") {
        backspaceDisplay();
        return
    }

    // Returns if the length exceeds 10
    if (displayValue.length > 10) {
        return
    }

    // Update the calculation values and output the result
    if (value === "=") {
        getResult();

        // Update display with result
        displayValue = Math.round(result*1000)/1000;
        display.textContent = displayValue;
        return;
    }
    // Replace 0 or ERROR with an empty string
    if (parseInt(displayValue) == 0 || displayValue === "ERROR") {
        displayValue = "";
    }

    displayValue += value;
    display.textContent = displayValue;
}

// Function to clear display
function clearDisplay() {
    displayValue = "0";
    display.textContent = displayValue;
}

// Function to delete the last index of the display
function backspaceDisplay() {
    displayValue = displayValue.slice(0, -1);
    if (!displayValue) {
        displayValue = "0";
    }
    display.textContent = displayValue;
}

// Function to return the result
function getResult() {
    // Update displayNums and displayOpers arrays
    updateDisplayNums();
    if (updateDisplayOpers() === "ERROR") {
        displayError();
        return;
    }
    
    // Perform multiplication and division operations first
    for (let i = 0; i < displayOpers.length; i++) {
        if (displayOpers[i] === "*" || displayOpers[i] === "/") {
            let var1 = displayNums[i];
            let var2 = displayNums[i + 1];
            let oper = displayOpers[i];
            let result = operate(var1, var2, oper);
            
            if (result == "ERROR") {
                displayError();
                return;
            }
            
            // Replace operated numbers and operator
            displayNums.splice(i, 2, result);
            displayOpers.splice(i, 1);
            // Adjust index to account for removed elements
            i--;
        }
    }
    
    // Perform addition and subtraction operations
    result = displayNums[0]; // Initialize result with the first number
    for (let i = 0; i < displayOpers.length; i++) {
        let var1 = result;
        let var2 = displayNums[i + 1];
        let oper = displayOpers[i];
        result = operate(var1, var2, oper);
    }
    return result;
}

function displayError() {
    displayValue, result = "ERROR";
    display.textContent = displayValue;
}

// Function to Update the displayNum array value
function updateDisplayNums() {
    // Escape special characters before joining
    let escapedOperators = operators.map(operator => operator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    let operatorsRegex = new RegExp(escapedOperators.join("|"), "g");

    displayNums = displayValue.split(operatorsRegex);
    displayNums = displayNums.map((val) => Number(val));
}

// Function to Update the displayOper array value
function updateDisplayOpers() {
    displayOpers = displayValue.split(/\d/g);

    // Remove empty slots
    displayOpers = displayOpers.filter((str) => str !== "");

    for (let i = 0; i < displayOpers.length; i++) {
        if (displayOpers[i].length > 1) {
            return "ERROR";
        }
    }
    return 0;
}

// Function to calculate two numbers depending on their operator
function operate(var1, var2, oper) {
    switch (oper) {
        case "+":
            return add(var1, var2);
        case "-":
            return substract(var1, var2);
        case "*":
            return multiply(var1, var2);
        case "/":
            return divide(var1, var2);
    }
}

function add(a, b) {
    return a + b;
}

function substract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    // Ensure that b is not equal to 0
    if (b === 0) return "ERROR";
    return a/b;
}

// Function to round the corners of the numpad
function roundCorners(value) {
    calcControlBtns.querySelector("#topLeft").style.borderTopLeftRadius = value;
    calcControlBtns.querySelector("#topRight").style.borderTopRightRadius = value;
    calcControlBtns.querySelector("#bottomLeft").style.borderBottomLeftRadius = value;
    calcControlBtns.querySelector("#bottomRight").style.borderBottomRightRadius = value;
}

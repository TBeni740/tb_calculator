var operands = ['', ''];
var currentOperand = 0;

var operator = null;
var isFloat = false;

var isErrorJumped = false;

const numbersElements = document.getElementsByClassName("numbers-button");
const simpleActionsElemnents = document.getElementsByClassName("simple-actions-button");
const advancedActionsElemnents = document.getElementsByClassName("advenced-actions-button");

const userInput = document.getElementById("userInput");
const action = document.getElementById("action");

const errorWindow = document.getElementById("error-window");

function throwError(error) {
    if (!isErrorJumped) {
        isErrorJumped = true
        $("#error-window h5").text(`${error}`);
        $("#error-window").slideDown(); 
        setTimeout(() => {
            $("#error-window").slideUp(); 
            isErrorJumped = false;
        }, 4000);
    }
}

function isNumeric(value) {
    return /^-?\d+\.?\d*$/.test(value);
}

function remove() {
    operands[currentOperand] = operands[currentOperand].slice(0, operands[currentOperand].length-1) || '';
    userInput.innerHTML = (operands[currentOperand].length > 0) ? `<h5>${operands[currentOperand]}</h5>`: `<h5>0</h5>`;
}

function cleanAll(htmlToo) {
    operands = ['', ''];
    currentOperand = 0;
    operator = null;
    isFloat = false;
    if (htmlToo) {
        action.innerHTML = ``;
        userInput.innerHTML = `<h5>0</h5>`;
    }
}

function cleanAction() {
    operands[currentOperand] = '';
    userInput.innerHTML = `<h5>0</h5>`;
}

function add() {
    let result = (!isFloat) ? parseInt(operands[0]) + parseInt(operands[1]) : parseFloat(operands[0]) + parseFloat(operands[1]);
    action.innerHTML = `<h5>${operands[0]} + ${operands[1]} = </h5>`
    cleanAll(false);

    return result;
}

function substract() {
    let result = (!isFloat) ? parseInt(operands[0]) - parseInt(operands[1]) : parseFloat(operands[0]) - parseFloat(operands[1]);
    action.innerHTML = `<h5>${operands[0]} - ${operands[1]} = </h5>`
    cleanAll(false);

    return result;
}

function duplicate() {
    let result = (!isFloat) ? parseInt(operands[0]) * parseInt(operands[1]) : parseFloat(operands[0]) * parseFloat(operands[1]);
    action.innerHTML = `<h5>${operands[0]} * ${operands[1]} = </h5>`
    cleanAll(false);

    return result;
}

function divide() {
    let result = false;
    if (operands[1] == '0') {
        throwError('Cannot divide by zero!')
        cleanAll(true);
    } else {
        result = (!isFloat) ? parseInt(operands[0]) / parseInt(operands[1]) : parseFloat(operands[0]) / parseFloat(operands[1]);
        action.innerHTML = `<h5>${operands[0]} / ${operands[1]} = </h5>`
        cleanAll(false);
    }

    return result;
}

function square() {
    let result = false;
    if (operands[0] < '0') {
        throwError("Cannot use sqrt function on negative number.");
        cleanAll(true);
    } else {
        result = (!isFloat) ? Math.sqrt(parseInt(operands[0])) : Math.sqrt(parseFloat(operands[0]));
        action.innerHTML = `<h5><i class="fas fa-square-root-alt"></i>(${operands[0]}) = </h5>`
        cleanAll(false);
    }

    return result;
}

function pow() {
    let result = (!isFloat) ? Math.pow(parseInt(operands[0]), 2) : Math.pow(parseFloat(operands[0]), 2);
    action.innerHTML = `<h5>${operands[0]}^2 = </h5>`
    cleanAll(false);

    return result;
}

function percentage() {
    let result = false;
    if (operands[1] == '0') {
        throwError('Cannot get number percentage from zero!')
        cleanAll(true);
    } else {
        result = (!isFloat) ? `${(parseInt(operands[0]) / parseInt(operands[1])) * 100}%` : `${(parseFloat(operands[0]) / parseFloat(operands[1])) * 100}%`;
        action.innerHTML = `<h5>${operands[0]} of ${operands[1]} = </h5>`
        cleanAll(false);
    }

    return result;
}

const actionsArray = {
    "remove": ['', remove],
    "clean all": ['', cleanAll], 
    "clean action": ['', cleanAction],
    "percentage": ['of', percentage],
    "square": ['', square],
    "pow": ['', pow],
    "+": ['+', add],
    "-": ['-', substract],
    "*": ['*', duplicate],
    "/": ['/', divide], 
}

window.addEventListener('message', function (event) {
    let message = event.data;
    if (message.state === true) {
        $('#calculator').slideDown();
        userInput.innerHTML = `<h5>0</h5>`;
    } else if (message.state === false) {
        cleanAll(true)
        $('#calculator').slideUp();
    }
})

for (let i = 0; i < numbersElements.length; i++) {
    numbersElements[i].addEventListener('click', () => {
        if (operands[currentOperand].length < 9) {
            let value = numbersElements[i].innerHTML.split(">")[1].split("<")[0];
            if (isNumeric(value)) {
                operands[currentOperand] = `${operands[currentOperand]}${value}`;
                userInput.innerHTML = `<h5>${operands[currentOperand]}</h5>`;
            } else if (value == '+/-') {
                operands[currentOperand] = (operands[currentOperand].length === 0) ? `-` : (!isFloat) ? `${parseInt(operands[currentOperand]) * (-1)}` : `${parseFloat(operands[currentOperand]) * (-1)}`;
                userInput.innerHTML = `<h5>${operands[currentOperand]}</h5>`;
            } else if (value == '.') {
                operands[currentOperand] = (operands[currentOperand].length > 0) ? `${operands[currentOperand]}.` : `0.`;
                userInput.innerHTML = `<h5>${operands[currentOperand]}</h5>`;
                isFloat = true;
            }
        } else {
            throwError("You have entered the maximum amount of numbers.");
        }
    })
}

for (let i = 0; i < simpleActionsElemnents.length; i++) {
    simpleActionsElemnents[i].addEventListener('click', () => {
        let value = simpleActionsElemnents[i].getAttribute('data-action');
        if (value !== "=" && operator === null) {
            operands[currentOperand] = (isNumeric(operands[currentOperand])) ? operands[currentOperand] : (operands[currentOperand] == '-') ? '-1': '0';
            operator = value;
            userInput.innerHTML = ``;
            action.innerHTML = `<h5>${operands[currentOperand]} ${actionsArray[operator][0]}</h5>`
            currentOperand = 1;
        } else if (value === "=") {
            operands[currentOperand] = (isNumeric(operands[currentOperand])) ? operands[currentOperand] : (operands[currentOperand] == '-') ? '-1': '0';
            let result = operator !== null ? actionsArray[operator][1](): false;
            if (result !== false) {
                result = (`${result}`.length > 9) ? `${result}`.slice(0, 9) : result;
                userInput.innerHTML = `<h5>${result}</h5>`;
            }
        }
    })
}

for (let i = 0; i < advancedActionsElemnents.length; i++) {
    advancedActionsElemnents[i].addEventListener('click', () => {
        let value = advancedActionsElemnents[i].getAttribute('data-action');
        if (value != "clean action" && value != "clean all" && value != "remove" && operator === null) {
            operands[currentOperand] = (isNumeric(operands[currentOperand])) ? operands[currentOperand] : (operands[currentOperand] == '-') ? '-1': '0';
            if (value == "pow" || value == "square") {
                let result = actionsArray[value][1]();
                if (result !== false) {
                    result = (`${result}`.length > 9) ? `${result}`.slice(0, 9) : result;
                    userInput.innerHTML = `<h5>${result}</h5>`;
                }
            } else {
                operator = value;
                action.innerHTML = `<h5>${operands[currentOperand]} ${actionsArray[operator][0]}</h5>`
                currentOperand = 1;
            }
        } else {
            actionsArray[value][1](true);
        }
    })
}

$("#calculator-offButton").click(function() {
    fetch("https://tb_calculator/turn_off_calcualtor", {
        method: "POST"
    });
})

document.onkeyup = function(data) {
    if (data.which == 27) {
        fetch("https://tb_calculator/turn_off_calcualtor", {
            method: "POST"
        });
    };
}
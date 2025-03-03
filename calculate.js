const fomula = document.getElementById('fomula');
let logicFomula = "";
let arrayNumber = [];
let arrayOperator = [];
const resultText = document.getElementById('resultText');
const buttons = document.getElementsByClassName('btn');
const buttonsArray = [...buttons];

buttonsArray.forEach(element => {
    element.addEventListener('click', () => {
        let value = element.innerHTML;
        console.log(`버튼 클릭: ${value}`);
        handleButtonClick(value);
    })
});

window.addEventListener('keydown', (event) => { // 키보드 입력 이벤트
    const key = event.key;
    switch (key) {
        case "Enter":
        case "=":
            calculateResult();
            break;
        case "Escape":
        case "Delete":
            clear();
            break;
        case "/":
            operate("/");
            break;
        case "*":
            operate("*");
            break;
        case "-":
            operate("-");
            break;
        case "+":
            operate("+");
            break;
        case "Backspace":
            backSpace();
            break;
        case ".":
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
            insertNumber(key);
            break;
        default:
            break;
    }
});

function clear() {  // AC 기능
    fomula.value = "";
    arrayNumber = [];
    arrayOperator = [];
    resultText.innerHTML = "0";
    logicFomula = "";
    console.log(`초기화 완료`);
}

function operate(operator) {    // 연산자 입력 기능
    if (fomula.value === "") {
        console.log("맨 처음에는 연산자 입력 불가.");
        return;
    }

    const trimmedFormula = fomula.value.trim(); // 마지막 문자열 찾기 위해 공백 다 지움
    const lastChar = trimmedFormula.slice(-1);

    if (lastChar === "+" || lastChar === "–" || lastChar === "×" || lastChar === "÷") {
        console.log("연산자 뒤에 바로 연산자 입력 불가능");
        return;
    }

    arrayNumber.push(logicFomula);
    fomula.value += ` ${operator === "/" ? "÷" : operator === "*" ? "×" : operator} `;  // 형태 변환을 위한 삼항 연산자
    logicFomula = "";
    arrayOperator.push(operator);
}

function insertNumber(value) {  // 숫자 입력 기능
    if (value === ".") {
        handleDot();
        return;
    }
    logicFomula += value;
    fomula.value += value;
}

function handleDot() {  // 소수점 기능
    if (logicFomula === "") {
        console.log("맨처음에 . 찍을 수 없습니다.")
        return;
    }
    const trimmedFormula = fomula.value.trim();
    const lastChar = trimmedFormula.slice(-1);

    if (lastChar === "+" || lastChar === "–" || lastChar === "×" || lastChar === "÷") {
        console.log("연산자 뒤에 바로 . 을 찍을 수 없습니다.")
        return;
    }
    if (logicFomula.includes(".")) {
        return;
    }
    logicFomula += ".";
    fomula.value += ".";
}

function backSpace() {  // 백스페이스 기능
    logicFomula = logicFomula.slice(0, -1);
    fomula.value = fomula.value.slice(0, -1);
    if (fomula.value === "") {
        resultText.innerHTML = "0";
    }
}

function calculateResult() {    // 계산 기능
    arrayNumber.push(logicFomula);

    if (arrayNumber.length - 1 !== arrayOperator.length) {
        alert("계산식을 다시 확인해주세요.");
        clear();
        return;
    }

    const finalResult = calculate(arrayNumber, arrayOperator);

    if (finalResult === undefined) {
        return;
    }

    resultText.innerHTML = finalResult;
    logicFomula = "";
    arrayNumber = [];
    arrayOperator = [];
    fomula.value = "";
}

const calculate = (numbers, operators) => { // 계산 로직 기능
    let newNumbers = [...numbers].map(Number);  // 저장된 숫자들을 map에 새로 저장
    let newOperators = [...operators];  // 저장된 연산자들을 새로 저장

    while (newOperators.includes("*") || newOperators.includes("/")) {  // 저장한 연산자에 곱하기와 나누기가 하나라도 남아있는 동안 계속 반복
        const multiplyDivideIndex = newOperators.findIndex(op => op === "*" || op === "/"); // 곱하기나 나누기가 있는 인덱스를 찾음
        const num1 = newNumbers[multiplyDivideIndex];
        const num2 = newNumbers[multiplyDivideIndex + 1];
        const operator = newOperators[multiplyDivideIndex];

        let intermediateResult;
        if (operator === "*") {
            intermediateResult = num1 * num2;
        } else {
            if (num2 === 0) {
                alert("0으로는 나눌 수 없습니다.");
                clear();
                return undefined;
            }
            intermediateResult = num1 / num2;
        }
        newNumbers.splice(multiplyDivideIndex, 2, intermediateResult);  // 계산이 끝나면 계산된 배열은 삭제
        newOperators.splice(multiplyDivideIndex, 1);    // 계산이 끝나면 계산된 배열은 삭제
    }

    while (newOperators.length > 0) {   // 덧셈 뺄셈 로직
        const num1 = newNumbers[0];
        const num2 = newNumbers[1];
        const operator = newOperators[0];
        let intermediateResult;
        if (operator === "+") {
            intermediateResult = num1 + num2;
        } else {
            intermediateResult = num1 - num2;
        }
        newNumbers.splice(0, 2, intermediateResult);
        newOperators.splice(0, 1);
    }
    return newNumbers[0];
};

function handleButtonClick(value){
    switch (value) {
        case "=":
            calculateResult();
            break;
        case "AC":
            clear();
            break;
        case "÷":
            operate("/");
            break;
        case "×":
            operate("*");
            break;
        case "–":
            operate("-");
            break;
        case "+":
            operate("+");
            break;
        case "&lt;":
            backSpace();
            break;
        default:
            insertNumber(value);
            break;
    }
}

class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.clear();
  }

  clear() {
    this.currentOperand = '';
    this.previousOperand = '';
    this.operation = undefined;
  }

  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
  }

  opposite() {
    this.currentOperand *= -1;
  }

  round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
  }

  appendNumber(number) {
    if (number === '.' && this.currentOperand.includes('.')) {
      return;
    };
    
    this.currentOperand = this.currentOperand.toString() + number.toString();
  }

  chooseOperation(operation) {
    if (this.currentOperand === '') {
      return;
    };
    
    if (this.previousOperand !== '') {
      this.compute()
    };

    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = '';
  }

  chooseMemoryOperation(operation) {
    let flag;
    let memoryValue;

    if (operation === 'MS') {
      if (this.currentOperand === '') {
        return;
      };

      memoryValue = +(this.currentOperand);
      flag = true;
      localStorage.setItem('flag', JSON.stringify(flag));
      localStorage.setItem('memoryValue', JSON.stringify(memoryValue));
    }

    if (operation === 'MC') {
      memoryValue = 0;
      flag = false;
      localStorage.setItem('flag', JSON.stringify(flag));
      localStorage.setItem('memoryValue', JSON.stringify(memoryValue));
    }

    if (operation === 'MR') {
      memoryValue = +(localStorage.getItem('memoryValue'));
      this.currentOperand = memoryValue;
      this.getDisplayNumber(this.currentOperand);
    }

    if (operation === 'M+') {
      if (this.currentOperand === '') {
        return;
      };

      memoryValue = +(localStorage.getItem('memoryValue'));
      memoryValue += Number(this.currentOperand);
      localStorage.setItem('memoryValue', JSON.stringify(memoryValue));
    }

    if (operation === 'M-') {
      if (this.currentOperand === '') {
        return;
      };

      memoryValue = +(localStorage.getItem('memoryValue'));
      memoryValue -= Number(this.currentOperand);
      localStorage.setItem('memoryValue', JSON.stringify(memoryValue));
    } 
  }

  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);

    if (isNaN(prev) || isNaN(current)) return;

    switch (this.operation) {
      case '+':
        computation = this.round((prev + current), 8);
        break;
      case '-':
        computation = this.round((prev - current), 8);
        break;
      case '*':
        computation = this.round((prev * current), 8);
        break;
      case '/':
        computation = this.round((prev / current), 8);
        break;
      default:
        return;
    };

    this.currentOperand = computation;
    this.operation = undefined;
    this.previousOperand = '';
  }

  getDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];
    let integerDisplay;
    
    if (isNaN(integerDigits)) {
      integerDisplay = '';
    } else {
      integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 })
    };

    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`
    } else {
      return integerDisplay;
    };
  }

  updateDisplay() {
    this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);

    if (this.operation != null) {
      this.previousOperandTextElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
    } else {
      this.previousOperandTextElement.innerText = '';
    };
  }
}

const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const oppositeButton = document.querySelector('[data-opposite]');
const allClearButton = document.querySelector('[data-all-clear]');
const memoryButtons = document.querySelectorAll('[data-memory]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);


numberButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
  })
});

operationButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
  })
});

memoryButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.chooseMemoryOperation(button.innerText);
    calculator.updateDisplay();
  })
});

equalsButton.addEventListener('click', button => {
  calculator.compute();
  calculator.updateDisplay();
});

allClearButton.addEventListener('click', button => {
  calculator.clear();
  calculator.updateDisplay();
});

deleteButton.addEventListener('click', button => {
  calculator.delete();
  calculator.updateDisplay();
});

oppositeButton.addEventListener('click', button => {
  calculator.opposite();
  calculator.updateDisplay();
});
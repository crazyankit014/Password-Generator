const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-length]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|;:"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
// set password  length from slider value

function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  // shadow
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
  return getRndInteger(0, 9);
}
function generateLowerCase() {
  return String.fromCharCode(getRndInteger(97, 123));
}

function generateUpperCase() {
  return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol() {
  const randNum = getRndInteger(0, symbols.length);
  return symbols.charAt(randNum);
}

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;

  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#F00");
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "Copied";
  } catch (e) {
    copyMsg.innerText = "Failed";
  }
  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

function shufflePassword(array) {
     // fisher yates METHOD USED FOR SHUFFLE THE PASSWORD

     for(let i=array.length-1;i>0;i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] =  array[j];
        array[j]= temp;
     }

     let str ="";
     array.forEach((el) => (str += el));
     return str;
}

function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });

  //   special condition
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});
inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

copyBtn.addEventListener("click", () => {
  console.log("Copy button clicked");
  if (passwordDisplay.value) {
    console.log("Copying content...");
    copyContent();
  }
});

generateBtn.addEventListener("click", () => {
  //    none of the checked box are selected

  if (checkCount == 0) return;

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  // remove old password
  password = "";

  // let's put the stuff mentioned by checkboxes

  //   if (uppercaseCheck.checked) {
  //     password = password + generateUpperCase();
  //   }

  //   if (lowercaseCheck.checked) {
  //     password = password + generateLowerCase();
  //   }

  //   if (symbolsCheck.checked) {
  //     password = password + generateSymbol();
  //   }

  //   if (numbersCheck.checked) {
  //     password = password + generateRandomNumber();
  //   }
  let funArr = [];

  if (uppercaseCheck.checked) funArr.push(generateUpperCase);
  if (lowercaseCheck.checked) funArr.push(generateLowerCase);
  if (numbersCheck.checked) funArr.push(generateRandomNumber);
  if (symbolsCheck.checked) funArr.push(generateSymbol);

   // compulsory addition 

    for(let i=0;i<funArr.length;i++)
    {
        password = password + funArr[i]();
    }
  

    // remaining addition 

    for(let i=0;i<passwordLength-funArr.length;i++)
    {
        let randIndex = getRndInteger(0, funArr.length);
        password += funArr[randIndex]();
    }

    // shuffle the password 


    password = shufflePassword(password.split(''));

     // show in UI
     passwordDisplay.value = password;
     calcStrength();
});


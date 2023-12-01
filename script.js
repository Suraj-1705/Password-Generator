const inputSlider = document.querySelector("[data-lengthSlider]");

const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");

const copyBtn = document.querySelector("[data-copy]");

const copyMsg = document.querySelector("[data-copyMsg]");

const uppercaseCheck = document.querySelector("#uppercase");

const lowercaseCheck = document.querySelector("#lowercase");

const numberCheck = document.querySelectorAll("#number");

const symbolsCheck = document.querySelector("#symbols");

const indicator = document.querySelector("[data-indicator]");

const generateBtn = document.querySelector(".generateBtn");

const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';
console.log("hii");
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
// set strength color  to gray

setIndicator("#ccc");


// set passwordlength     --to reflect password length in UI
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundColor = ((passwordLength - min)*100/(max - min)) + "%100";

}


function setIndicator(color){
     indicator.style.backgroundColor = color;
     indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min,max){
  return Math.floor(Math.random() * (max - min)) + min

}
 
function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode( getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode( getRndInteger(65,91));
}

function generateSymbol(){
    const randNum = getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numberCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum|| hasSym) && passwordLength >= 8){
        setIndicator("#0fff1e");
    }
    else if(
        (hasLower || hasUpper) && 
        (hasNum || hasSym) &&
        passwordLength >= 6
    ){
        setIndicator("#0f78ff");
    }
    else{
        setIndicator("#ff1e0f")
    }
}


 async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e) {
        copyMsg.innerText = "failed";
    }
   copyMsg.classList.add("active");

   setTimeout( () => {
    copyMsg.classList.remove("active");
   },2000);

}


// SHUFFLING THE PASSWORD
function shufflePassword(array){

    //Fisher Yates Method
    for(let i = array.length - 1; i>0; i--){
        //RANDOM J, FIND OUT USING RANDOM FUNCTION
        const j = Math.floor(Math.random() * (i+1));
        //SWAP NUMBER AT I INDEX AND J INDEX
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}



function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
        checkCount++;
    });

    //special condition
    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
    console.log("chekc")
}


allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change' , handleCheckBoxChange);
})

//  EVENT LISTNER ON SLIDER
inputSlider.addEventListener( 'input' , (e) => {
    passwordLength = e.target.value;
    handleSlider();
})


copyBtn.addEventListener('click' , () => {
    if(passwordDisplay.value) 
    copyContent();
})

// GENERATE PASSWORD BUTTON 
generateBtn.addEventListener( 'click', () => {

    //none of the checkbox are selected
    if(checkCount == 0) 
    return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    // lets start the journey to find new password
    
    //remove old password
    password = "";

    //let's put the stuff mentioned by check boxes

    // if(uppercaseCheck.checked) {
    //     password = password + generateUpperCase();
    // }

    // if(lowercaseCheck.checked) {
    //     password = password + generateLowerCase();
    // }

    // if(numbercaseCheck.checked) {
    //     password = password + generateNumberCase();
    // }

    // if(symbolcaseCheck.checked) {
    //     password = password + generateSymbolCase();
    // }

    let funArry = [];

    if(uppercaseCheck.checked){
        funArry.push(generateUpperCase);
    }

    if(lowercaseCheck.checked){
        funArry.push(generateLowerCase);
    }

    if(numberCheck.checked){
        funArry.push(generateRandomNumber);
    }

    if(symbolsCheck.checked){
        funArry.push(generateSymbol);
    }
     

    //cumpulsory addition
    for(let i=0; i<funArry.length; i++){
        password += funArry[i]();
    }

console.log("compulsary done");
    //remaining addition
    for(let i=0; i<passwordLength-funArry.length; i++){
        let randIndex = getRndInteger(0 , funArry.length);
        password += funArry[randIndex]();
    }
console.log("remaining done");
    //shuffle password
    password = shufflePassword(Array.from(password));
    console.log("shuffle done");

    //show UI
    passwordDisplay.value = password;
    console.log("display done");

    //calculate strength
    calcStrength();

})
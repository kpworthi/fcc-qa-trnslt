
import { americanOnly } from './american-only.js';
import { britishOnly } from './british-only.js';
import { americanToBritishSpelling } from './american-to-british-spelling.js';
import { americanToBritishTitles } from './american-to-british-titles.js';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#translate-btn').onclick = handleClick;
  document.querySelector('#clear-btn').onclick = handleClick;
  console.log('Listeners added!');
});

function handleClick (event){
  let button = event.currentTarget;
  if (button.id === 'translate-btn')
    main();
  if (button.id === 'clear-btn')
    clearText();
}

function clearText (){
  document.querySelector('#text-input').value = '';
  document.querySelector('#translated-sentence').textContent = '';
  document.querySelector('#error-msg').textContent = '';
}

//casing() takes a required checkString and, if no 'option' is
//provided, returns the dominant casing, if applicable.
//If an option is provided using a previously returned casing
//string, casing() returns the provided checkString in the
//specified casing option.
function casing (checkString, option) {
  if(!option){
    if(checkString === checkString.toUpperCase()){
      return 'upper';
    }
    else if(checkString === checkString.toLowerCase()){
      return 'lower';
    }
    else if(checkString[0] === checkString[0].toUpperCase()){
      return 'capital';
    }
    else return 'other';
  }
  else if(option === 'upper'){
    return checkString.toUpperCase();
  }
  else if(option === 'lower'){
    return checkString.toLowerCase();
  }
  else if(option === 'capital'){
    let checkArr = Array.from(checkString.toLowerCase());
    checkArr[0] = checkArr[0].toUpperCase();
    return checkArr.join('');
  }
  else if(option === 'other'){
    return checkString;
  }
  else return "Error: Check casing() params."
}

//isolateWord takes the current string and isolates the needed phrase,
//returning an array with the isolated phrase or word in the second index
//and everything before and after it in the first and third indices, respectively
function isolateWord (inputText, wordStart, wordLength) {
  let wordArr = ['','',''];
  wordArr[1] = inputText.slice(wordStart, wordStart+wordLength);
  wordArr[2] = inputText.slice(wordStart+wordLength);
  wordArr[0] = inputText.slice(0,wordStart);

  return wordArr;
}

function main (){
  let start = Date.now();
  let option = document.querySelector('#locale-select').value.split('-')[0];
  let translatedString = '';
  let translatedArea = document.querySelector('#translated-sentence');
  let errorArea = document.querySelector('#error-msg');
  console.log(option)

  translatedString = translate(document.querySelector('#text-input').value, option);
  console.log(translatedString);
  translatedArea.textContent = '';
  errorArea.textContent = '';

  //output translation
  //first if - blank input
  //second if - nothing needed translating
  //finally - normal operation
  if (translatedString === '') {
    errorArea.textContent = 'Error: No text to translate.';
  }
  else if(!translatedString.includes('<hl>')){
    translatedArea.textContent = 'Everything looks good to me!';
  }
  else {
    while(translatedString.includes('<hl>')){
      let beforeText = translatedString.slice(0, translatedString.indexOf('<'));
      translatedArea.appendChild(document.createTextNode(beforeText));
      translatedString = translatedString.slice( translatedString.indexOf('>')+1);

      let newSpan = document.createElement('span');
      newSpan.textContent = translatedString.slice(0, translatedString.indexOf('<'));
      newSpan.className = "highlight";
      translatedString = translatedString.slice( translatedString.indexOf('>')+1);

      translatedArea.appendChild(newSpan);
    }
    translatedArea.appendChild(document.createTextNode(translatedString));
  }
  console.log(`Time is ${Date.now()-start} ms`);

}

function translate (inputString, option){
  let newString = inputString;
  const bOnlyKeys = Object.keys(britishOnly),
        aOnlyKeys = Object.keys(americanOnly),
        spellVals = Object.values(americanToBritishSpelling),
        spellKeys = Object.keys(americanToBritishSpelling),
        titleVals = Object.values(americanToBritishTitles),
        titleKeys = Object.keys(americanToBritishTitles);

  //Translation array to allow for one method handling either case.
  //[0, 1] handle language 'exclusive' words
  //[2, 3] handle alternative spellings
  //[4, 5] handle title conversion
  //Time conversions are handled afterwards.
  let tArray = [];
  if (option === 'british')
    tArray = [bOnlyKeys, Object.values(britishOnly), spellVals, spellKeys, titleVals, titleKeys];
  else tArray = [aOnlyKeys, Object.values(americanOnly), spellKeys, spellVals, titleKeys, titleVals];

  //handle 'only' words, particular 'spellings', and titles.
  for (let i = 0; i < tArray.length; i += 2) {
    const oldWordArr = tArray[i],
      newWordArr = tArray[i + 1],
      modifiers = ['s', "'s", 'ed', 'ing']

    for (let oldWord of oldWordArr) {
      if (newString.toLowerCase().includes(oldWord)) {
        let matches = newString.toLowerCase().matchAll(new RegExp(oldWord, 'g'));
        let incIndex = 0;
        for (let each of matches) {
          let wordIndex = each.index + incIndex;
          let wordLength = oldWord.length;
          let indAfterWord = wordIndex + wordLength;

          //check if already in between highlight tags
          if (newString.slice(0, wordIndex).match(/<hl>/) && newString.slice(indAfterWord).match(/<\/hl>/) &&
            newString[newString.slice(0, wordIndex).lastIndexOf('hl>') - 1] === '<') {
            //no change
          }
          //check character before word and characters after word to see if it's part of a different word.
          else if ((wordIndex - 1 >= 0 && newString[wordIndex - 1].match(/[a-zA-Z]/)) ||
            (indAfterWord < newString.length && newString[indAfterWord].match(/[a-zA-Z]/) &&
              modifiers.filter(val => newString.toLowerCase().slice(indAfterWord).startsWith(val)).length === 0)) {
            //no change
          //special case for mrs
          } else if (oldWord === 'mr' && newString.toLowerCase().slice(wordIndex, wordIndex + 3) === 'mrs') {
            //no change
          } else {
            let modArray = isolateWord(newString, wordIndex, wordLength);
            let wordCase = casing(newString.slice(wordIndex, wordIndex + wordLength));
            //if the replacement starts with a capital, special casing is likely. preserve it.
            if (newWordArr[oldWordArr.indexOf(oldWord)].match(/^[A-Z]/)) wordCase = 'other';
            modArray[1] = '<hl>' + casing(newWordArr[oldWordArr.indexOf(oldWord)], wordCase) + '</hl>';
            newString = modArray.join('');
            incIndex += modArray[1].length - oldWord.length;
          }
        }
      }
    }
  }
  
  //handle times
  if ((newString.match(/\d?\d\.\d\d/) && option === 'british') ||
      (newString.match(/\d?\d:\d\d/) && option === 'american')){
    let matches = option==='british'?
                    newString.matchAll(/\d?\d\.\d\d/g):
                    newString.matchAll(/\d?\d:\d\d/g)
    let incIndex = 0;
    for (let time of matches) {
      let timeIndex = time.index + incIndex;
      let timeLength = time[0].length;
      let modArray = isolateWord(newString, timeIndex, timeLength);

      modArray[1] = '<hl>' +
                    (option === 'british' ?
                    time[0].split('.').join(':') :
                    time[0].split(':').join('.')) +
                    '</hl>';

      newString = modArray.join('');
      incIndex = modArray[1].length - time[0].length;
    }
  }

  return newString;
}

try {
  module.exports = {
    main: main,
    translate: translate,
    isolateWord: isolateWord,
    casing: casing,
    handleClick: handleClick,
    clearText: clearText
  }
} catch (e) {}
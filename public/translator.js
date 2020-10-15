
import { americanOnly } from './american-only.js';
import { britishOnly } from './british-only.js';
import { americanToBritishSpelling } from './american-to-british-spelling.js';
import { americanToBritishTitles } from './american-to-british-titles.js';

/*
const { americanOnly } = require('./american-only.js');
const { britishOnly } = require('./british-only.js');
const { americanToBritishSpelling } = require('./american-to-british-spelling.js');
const { americanToBritishTitles } = require('./american-to-british-titles.js');
*/
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#translate-btn').onclick = handleClick;
  document.querySelector('#clear-btn').onclick = handleClick;
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
    return checkStr;
  }
  else return "Error: Check casing() params."
}

//isolateWord takes a string that should already be only a word
//with leading or trailing punctuation, and returns a 3-element
//array, the first element being the actual word, with the
//second and third elements being any leading and trailing
//puncuation.
function isolateWord (wordValue) {
  let wordArr = ['','',''];
  wordArr[1] = wordValue.match(/^[\W]*/)[0] || '';
  wordArr[2] = wordValue.match(/[\W]*$/)[0] || '';
  wordArr[0] = wordValue.slice(wordArr[1].length, wordValue.length- wordArr[2].length);

  return wordArr;
}

function main (){
  let start = Date.now();
  let option = document.querySelector('#locale-select').value.split('-')[0];
  let translatedString = '';
  let translatedArea = document.querySelector('#translated-sentence');
  let errorArea = document.querySelector('#error-msg');
  console.log(option)

  translatedString = translate(option);
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

function translate (option){
  let newString = document.querySelector('#text-input').value,
      strToArray = newString.split(' ');
  
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
  //Time conversions are handled within the function itself
  let tArray = [];
  if (option === 'british')
    tArray = [bOnlyKeys, britishOnly, spellVals, spellKeys, titleVals, titleKeys];
  else tArray = [aOnlyKeys, americanOnly, spellKeys, spellVals, titleKeys, titleVals];

  //check 'only'
  strToArray = strToArray.map(word => {
    let wordArr = isolateWord(word);
    for(let i=0;i<tArray[0].length;i++){
      if(wordArr[0].toLowerCase() === tArray[0][i]){
        //find case
        let wordCase = casing(wordArr[0]);
        return wordArr[1].concat('<hl>') + casing(tArray[1][tArray[0][i]],wordCase) + '</hl>'.concat(wordArr[2]);
      }
      //limited plural check
      else if(wordArr[0].toLowerCase().slice(0,wordArr[0].length-1) === tArray[0][i] &&
              wordArr[0][wordArr[0].length-1] === 's'){
        let wordCase = casing(wordArr[0]);
        return wordArr[1].concat('<hl>') + casing(tArray[1][tArray[0][i]]+'s', wordCase) + '</hl>'.concat(wordArr[2]);
      }
    }
    return word;
  });

  //check 'spellings'
  strToArray = strToArray.map(word => {
    let wordArr = isolateWord(word);
    for(let i=0;i<tArray[2].length;i++){
      if(wordArr[0].toLowerCase() === tArray[2][i]){
        let wordCase = casing(wordArr[0]);
        return wordArr[1].concat('<hl>') + casing(tArray[3][i],wordCase) + '</hl>'.concat(wordArr[2]);
      }
      //limited plural check
      else if(wordArr[0].toLowerCase().slice(0,wordArr[0].length) === tArray[2][i] &&
              wordArr[0][wordArr[0].length-1] === 's'){
        let wordCase = casing(wordArr[0]);
        return wordArr[1].concat('<hl>') + casing(tArray[3][i]+'s', wordCase) + '</hl>'.concat(wordArr[2]);
      }
    }
    return word;
  });

  //check titles
  // mr. mr
  strToArray = strToArray.map(word => {
    let wordArr = isolateWord(word);
    for(let i=0;i<tArray[4].length;i++){
      //british title case
      if(wordArr[0].toLowerCase() === tArray[4][i] && !word.endsWith('.')){
        let wordCase = casing(wordArr[0]);
        return wordArr[1].concat('<hl>') + casing(tArray[5][i],wordCase) + '</hl>'.concat(wordArr[2]);
      }
      //american title case, accounts for isolate's punctuation stripping
      else if(wordArr[0].toLowerCase().concat('.') === tArray[4][i]){
        let wordCase = casing(wordArr[0]);
        return wordArr[1].concat('<hl>') + casing(tArray[5][i],wordCase) + '</hl>'.concat(wordArr[2].slice(1));
      }
      
    }
    return word;
  });

  //check times
  strToArray = strToArray.map(word => {
    if((word.match(/\d?\d\.\d\d/) && option === 'british') ||
       (word.match(/\d?\d:\d\d/) && option === 'american')){
      let theTime = option==='british'?
                    word.match(/\d?\d\.\d\d/)[0]:
                    word.match(/\d?\d:\d\d/)[0];

      let timeLength = theTime.length;
      let timeInd = word.indexOf(theTime);

      theTime = option==='british'?
                theTime.split('.').join(':'):
                theTime.split(':').join('.');

      return '<hl>' + word.slice(0,timeInd)+theTime+word.slice(timeInd+timeLength) + '</hl>';
    } else return word;
  });
  
  return strToArray.join(' ');

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

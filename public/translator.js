import { americanOnly } from './american-only.js';
import { britishOnly } from './british-only.js';
import { americanToBritishSpelling } from './american-to-british-spelling.js';
import { americanToBritishTitles } from './american-to-british-titles.js';

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
}

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

function main (){
  let option = document.querySelector('#locale-select').value.split('-')[0];
  let translatedString = '';
  console.log(option)

  translatedString = translate(option);

  //output translation
  console.log(translatedString);

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
  let tArray = [];
  if (option === 'british')
    tArray = [bOnlyKeys, britishOnly, spellVals, spellKeys, titleVals, titleKeys];
  else tArray = [aOnlyKeys, americanOnly, spellKeys, spellVals, titleKeys, titleVals];

  //check 'only'
  strToArray = strToArray.map(word => {
    for(let i=0;i<tArray[0].length;i++){
      if(word.toLowerCase().includes(tArray[0][i])){
        //find case without possible end periods
        let wordCase = casing(word.split('.')[0]);
        return casing(tArray[1][tArray[0][i]],wordCase).concat(word.endsWith('.')?'.':'');
      }
    }
    return word;
  });

  //check 'spellings'
  strToArray = strToArray.map(word => {
    for(let i=0;i<tArray[2].length;i++){
      if(word.toLowerCase().includes(tArray[2][i])){
        let wordCase = casing(word.split('.')[0]);
        return casing(tArray[3][i], wordCase).concat(word.endsWith('.')?'.':'');
      }
    }
    return word;
  });

  //check titles
  strToArray = strToArray.map(word => {
    for(let i=0;i<tArray[4].length;i++){
      if(word.toLowerCase() === tArray[4][i]){
        let wordCase = casing(word.split('.')[0]);
        return casing(tArray[5][i], wordCase);
      }
    }
    return word;
  });

  //check times
  strToArray = strToArray.map(word => {
    if(word.match(/\d?\d\.\d\d/) || word.match(/\d?\d:\d\d/)){
      let theTime = option==='british'?
                    word.match(/\d?\d\.\d\d/)[0]:
                    word.match(/\d?\d:\d\d/)[0];
      let timeLength = theTime.length;
      let timeInd = word.indexOf(theTime);

      theTime = option==='british'?
                theTime.split('.').join(':'):
                theTime.split(':').join('.');

      return word.slice(0,timeInd)+theTime+word.slice(timeInd+timeLength);
    } else return word;
  });
  
  return strToArray.join(' ');

}

try {
  module.exports = {

  }
} catch (e) {}

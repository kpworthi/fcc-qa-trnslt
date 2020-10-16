/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]----
 *       (if additional are added, keep them at the very end!)
 */

const chai = require('chai');
const assert = chai.assert;

let Translator;

suite('Functional Tests', () => {
  suiteSetup(() => {
    // DOM already mocked -- load translator then run tests
    Translator = require('../public/translator.js');
  });

  suite('Function main()', () => {
    /* 
      The translated sentence is appended to the `translated-sentence` `div`
      and the translated words or terms are wrapped in 
      `<span class="highlight">...</span>` tags when the "Translate" button is pressed.
    */
    test("Translation appended to the `translated-sentence` `div`", done => {
      const input = 'Mangoes are my favorite fruit.';
      const output = 'Mangoes are my favourite fruit.';
      document.querySelector('#text-input').value = input;
      let clickEvent = document.createEvent('MouseEvents');
      clickEvent.initEvent('click', true, true);
      document.querySelector('#translate-btn').dispatchEvent(clickEvent);
      let result = document.querySelector('#translated-sentence');

      assert.equal(result.textContent, output);
      assert.equal(result.querySelectorAll('span').length, 1);
      assert.equal(result.querySelector('span').className, 'highlight');
      assert.equal(result.querySelector('span').childNodes[0].textContent, 'favourite');

      done();
    });

    /* 
      If there are no words or terms that need to be translated,
      the message 'Everything looks good to me!' is appended to the
      `translated-sentence` `div` when the "Translate" button is pressed.
    */
    test("'Everything looks good to me!' message appended to the `translated-sentence` `div`", done => {
      const input = 'Mangoes are a fruit.';
      const output = 'Mangoes are a fruit.';
      document.querySelector('#text-input').value = input;
      let clickEvent = document.createEvent('MouseEvents');
      clickEvent.initEvent('click', true, true);
      document.querySelector('#translate-btn').dispatchEvent(clickEvent);
      let result = document.querySelector('#translated-sentence');

      assert.equal(result.textContent, 'Everything looks good to me!');
      assert.notEqual(result.textContent, output);

      done();
    });

    /* 
      If the text area is empty when the "Translation" button is
      pressed, append the message 'Error: No text to translate.' to 
      the `error-msg` `div`.
    */
    test("'Error: No text to translate.' message appended to the `translated-sentence` `div`", done => {
      document.querySelector('#text-input').value = '';
      let clickEvent = document.createEvent('MouseEvents');
      clickEvent.initEvent('click', true, true);
      document.querySelector('#translate-btn').dispatchEvent(clickEvent);
      let result = document.querySelector('#translated-sentence');
      let error = document.querySelector('#error-msg');

      assert.equal(result.textContent, '');
      assert.equal(error.textContent, 'Error: No text to translate.');

      done();
    });

  });

  suite('Function clearText()', () => {
    /* 
      The text area and both the `translated-sentence` and `error-msg`
      `divs` are cleared when the "Clear" button is pressed.
    */
    test("Text area, `translated-sentence`, and `error-msg` are cleared", done => {
      let result = document.querySelector('#translated-sentence');
      let error = document.querySelector('#error-msg');
      let input = document.querySelector('#text-input');

      result.textContent = 'abcd';
      error.textContent = 'abcd';
      input.value = 'abcd';

      let clickEvent = document.createEvent('MouseEvents');
      clickEvent.initEvent('click', true, true);
      document.querySelector('#clear-btn').dispatchEvent(clickEvent);

      assert.equal(result.textContent, '');
      assert.equal(error.textContent, '');
      assert.equal(input.value, '');

      done();
    });

  });

});

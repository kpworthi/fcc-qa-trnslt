**freeCodeCamp** - Quality Assurance 5: American / British English Translator
------

[![Run on Repl.it](https://repl.it/badge/github/freeCodeCamp/boilerplate-project-american-british-english-translator)](https://repl.it/github/freeCodeCamp/boilerplate-project-american-british-english-translator)

### Goal:
Create a client-side american/british translator using the dictionaries provided. An express server is established for the purpose of running unit and functional tests via Mocha/Chai. A simple front-end was provided for testing and demoing.

### Capability Notes:
1. Punctuation (quotations marks, exclamation points, periods, etc.) should no longer affect translation ability.
1. Detection of casing should occur for all upper-, lower- and capital-case lettering. Words in random-case or other alternative casing such as camel-case will not have case preserved.
1. Limited plural support has been implemented. In most cases, the translator will catch translateable words with an 's' at the end.
1. Will also try to account for -ed or -ing versions of words.

### Notes on translate() specifically:
1. `translate()` accepts two required parameters, `inputString` and `option`.
1. `main()` reads the value in the `<textarea>` input by the user as well as the current dropdown value, and sends them to translate().
1. `translate()` returns the translated string, with `<hl></hl>` tags surrounding each translated word or phrase, to then be handled by the `main()` function and converted to `<span>` tags.

### User stories:

1. I can enter a simple sentence into the text area and select whether to translate to British or American English from the dropdown menu.
1. When the "Translate" button is pressed, append the translated sentence to the `translated-sentence` `div`. See the JavaScript files in `/public` for the different spelling and terms your application should translate.
1. Your application should handle the way time is written in American and British English. For example, ten thirty is written as "10.30" in British English and "10:30" in American English.
1. Your application should also handle the way titles/honorifics are abbreviated in American and British English. For example, Doctor Wright is abbreviated as "Dr Wright" in British English and "Dr. Wright" in American English. See `/public/american-to-british-titles.js` for the different titles your application should handle.
1. Wrap any translated spelling or terms with `<span class="highlight">...</span>` tags so they appear in green.
1. If the sentence in the text area has no spelling or terms that should be translated, append the message "Everything looks good to me!" to the `translated-sentence` `div`.
1. If there is no text in the text area, append the message "Error: No text to translate." to the `error-msg` `div` so the text appears in red.
1. I can press the "Clear Input" button to remove all text from the text area and the `translated-sentence` `div`.
1. All 20 unit tests are complete and passing. See `/tests/1_unit-tests.js` for the sentences you should write tests for.
1. All 4 functional tests are complete and passing. See `/tests/2_functional-tests.js` for the functionality you should write tests for.
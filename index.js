var express = require('express');
var app = express();
var port = process.env.PORT;
var validURLRegex = /^https?:\/\/\w+\.\w+/;
var shortenedURLs = {};
var allowedChars = [
  'a', 'b', 'c', 'd', 'e',
  'f', 'g','h', 'i', 'j',
  'k', 'l', 'm', 'n', 'o',
  'p', 'q', 'r', 's', 't',
  'u', 'v', 'w', 'x', 'y',
  'z', 'A', 'B', 'C', 'D',
  'E', 'F', 'G', 'H', 'I',
  'J', 'K', 'L', 'M', 'N',
  'O', 'P', 'Q', 'R', 'S',
  'T', 'U', 'V', 'W', 'X',
  'Y', 'Z', '0', '1', '2',
  '3', '4', '5', '6', '7',
  '8', '9'
];

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * (arr.length - 1))];
}

function randomSequence(availableChars, length) {
  var toReturn = '';
  for (var i = 0; i < length; i++)
    toReturn += randomChoice(availableChars);

  return toReturn;
}

function shortenURL(url) {
  var shortenKey = randomSequence(allowedChars, 6);
  shortenedURLs[shortenKey] = url;
  return shortenKey;
}

app.get('*', function(request, response) {
  var userInput = request.originalUrl.slice(1); // get rid of the / at the beginning.
  if (userInput.substr(0, 3) === 'new') {
    userInput = userInput.slice(4); // skip /new/
    var toReturn = {};
    console.log('User entered: '+userInput);
    if (userInput.match(validURLRegex) === null)
      toReturn.error = 'Invalid URL!';
    else {
      var shortenedKey = shortenURL(userInput);
      var URLPrefix = request.protocol + '://' + request.hostname;
      var shortenedURL = URLPrefix + '/' + shortenedKey;
      toReturn['original_url'] = userInput;
      toReturn['shortened_url'] = shortenedURL;
    }
    response.send(JSON.stringify(toReturn));
  } else if (userInput === '')
    response.send('/new/URL to shorten.');
  else {
    var validInputRegex = /^[a-zA-z0-9]+$/;
    if (userInput.match(validInputRegex) !== null && shortenedURLs.hasOwnProperty(userInput))
      response.redirect(shortenedURLs[userInput]);
    else
      response.send(JSON.stringify({error: 'Invalid URL!'}));
  }

});

app.listen(port, function() {
  console.log('Running on port ' + port + '.');
});

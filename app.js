const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Hello Express!');
});
app.get('/burgers', (req, res) =>{
  res.send('We have juicy cheese burgers!');
});
app.get('/pizza/pepperoni', (req, res) => {
  res.send('Your pizza is on the way!');
});
app.get('/pizza/pineapple', (req, res) => {
  res.send("We don't serve that here. Never call again!");
});
app.get('/echo', (req, res) => {
  const responseText = `Here are some details of your request:
      App: ${req.app}
      Base URL: ${req.baseUrl}
      Body: ${req.body}
      Cookies: ${req.cookies}
      Fresh: ${req.fresh}
      Host: ${req.hostname}
      IP: ${req.ip}
      Method: ${req.method}
      Path: ${req.path}
  `;
  res.send(responseText);
});
app.get('/queryViewer', (req, res) => {
  console.log(req.query);
  res.end(); // do not send any data back to the client
})
app.get('/greetings', (req,res) => {
  //1. get values from the request
  const name = req.query.name;
  const race = req.query.race;

  //2. validate the values
  if(!name){
    //3. name was not provided
    return res.status(400).send('Please provide a name');
  }
  if(!race){
    //3. race was not provided
    return res.status(400).send('Please provide a race');
  }

  //4. and 5. both name and race are valid so do the processing.
  const greeting = `Greetings to ${name} the ${race}, welcome to our kingdom.`;

  //6. send the response
  res.send(greeting);
})
app.get('/sum', (req,res) =>{
  const a = parseInt(req.query.a);
  const b = parseInt(req.query.b);

  if(!a){
    //3. name was not provided
    return res.status(400).send('Please provide a value for "a"');
  }
  if(!b){
    //3. race was not provided
    return res.status(400).send('Please provide a value for "b"');
  }

  const sum = a + b;
  res.send(`The sum of ${a} and ${b} is ${sum}`);
})
app.get('/cipher', (req,res) =>{
  const text = req.query.text;
  const shift = req.query.shift;

  let encryption = "";

  if(!text){
    //3. name was not provided
    return res.status(400).send('Please provide some text');
  }
  if(!shift){
    //3. race was not provided
    return res.status(400).send('Please provide a shift value');
  }

  for (let i = 0; i < text.length; i++){
    encryption += String.fromCharCode(text[i].charCodeAt(0) + parseInt(shift));
    // console.log(text[i] + ": " + text[i].charCodeAt(0));
  }
  res.send(`You'll never decrypt ${encryption} as ${text}`)
})
app.get('/lotto', (req, res) =>{
  let userNums = req.query.num;
  
  const MIN = 1;
  const MAX = 20;

  if(!userNums){
    return res.status(400).send(`Please provide 6 unique numbers`);
  } else {
    for (let i = 0; i < userNums.length; i++){
      userNums[i] = parseInt(userNums[i]);
    }

    const unique = (value, index, self) => {
      return self.indexOf(value) === index;
    }
    const uniqueNums = userNums.filter(unique);
    userNums = uniqueNums;
  }

  if(userNums.length < 6){
    return res.status(400).send(`Not enough numbers. Please provide 6 UNIQUE numbers between ${MIN} & ${MAX}`);
  } else if(userNums.length > 6){
    return res.status(400).send(`Too many numbers. Please provide 6 UNIQUE numbers between ${MIN} & ${MAX}`);
  }

  let winningNums = [];

  for (let i = 0; i < 6; i++){
    const random = Math.floor(Math.random() * MAX) + MIN;
    winningNums.push(random);
  }

  console.log(`User Numbers: ${userNums}`);
  console.log(`Winning Numbers: ${winningNums}`);

  let matchingNums = 0;

  for (let i = 0; i < userNums.length; i++){
    if(userNums[i] < MIN || userNums[i] > MAX){
      return res.status(400).send(`${userNums[i]} out of bounds. Please only select numbers between ${MIN} and ${MAX}`)
    }


    for (let j = 0; j < winningNums.length; j++){
      if(userNums[i] === winningNums[j]){
        console.log(`${userNums[i]} matches ${winningNums[j]}`);
        matchingNums++;
      }
    }
  }

  let message = "Sorry, you lose."
  
  if (matchingNums === 4){
    message = "Congratulations, you win a free ticket"
  } else if(matchingNums === 5){
    message = "Congratulations! You win $100!"
  } else if (matchingNums === 6){
    message = "Wow! Unbelievable! You could have won the mega millions!"
  }

  res.send(message);
})

app.listen(8000, () => {
  console.log('Express server is listening on port 8000!');
});
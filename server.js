const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const { STATUS_CODES } = require('http');


const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('assets'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html')
})

app.post('/', async function(req, res){

    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
     

  const dataToMC =  {
    members: [
            {
            email_address: email,
            status: 'subscribed',
                  merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
          }
  ]
  };

  const dataSentToMC = JSON.stringify(dataToMC);

  const url = 'https://us14.api.mailchimp.com/3.0/lists/1a8832d88e';

  const options = {
    method: 'POST',
    auth: 'soloPayne:99b10638e137b072b3dae66c1508eae2-us14'
  }

  const request = https.request(url, options, function(response){
    response.on('data', function(data){
      console.log(JSON.parse(data));
    });

     switch(response.statusCode == 200){

      case true:
      res.sendFile(__dirname + '/success.html');
      break

      default:
        res.sendFile(__dirname + '/failure.html');
     }
  });

  request.write(dataSentToMC);
  request.end();

});



app.get('/failure', function(req, res){
  // res.sendFile(__dirname + '/failure.html');
  res.redirect(__dirname + '/');
})



app.listen(process.env.PORT || 4000, function(){
    console.log('Server started running on port 4000');
});

// 99b10638e137b072b3dae66c1508eae2-us14

// 1a8832d88e
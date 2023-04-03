const express = require('express');
const router = express.Router();

const axios = require('axios')
// This is the client ID and client secret that you obtained
// while registering on github app
const clientID = '7b8b2af8b27800254e7f'
const clientSecret = '0eff417e78e731d2079c52c1109e4e9d97f28afb'

// Declare the callback route
router.get('/github/callback', (req, res) => {

  // The req.query object has the query params that were sent to this route.
  const requestToken = req.query.code
  
  axios({
    method: 'post',
    url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
    // Set the content type header, so that we get the response in JSON
    headers: {
         accept: 'application/json'
    }
  }).then((response) => {
    access_token = response.data.access_token
    res.redirect('/success');
  })
})

router.get('/success', function(req, res) {

  axios({
    method: 'get',
    url: `https://api.github.com/user`,
    headers: {
      Authorization: 'token ' + access_token
    }
  }).then((response) => {
    res.render('pages/success',{ userData: response.data });
  })
});

module.exports = router;
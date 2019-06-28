const express = require('express');
const userCtrl = require('./userControler');

const server = express();

const apiPref= '/api/user';

server.get(`${apiPref}/:userId`, userCtrl.getUser);

server.get(`${apiPref}/:userId/avatar`, userCtrl.getUserAvatar);

server.delete(`${apiPref}/:userId/avatar`, userCtrl.deleteUserAvatar);

server.listen(3000, function(){
    console.log('server started');
});

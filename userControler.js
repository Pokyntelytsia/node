const https = require('https');
const { utils } = require('./utils');
const Stream = require('stream').Transform;
const fs = require('fs');

exports.getUser = function(req, res) {
    const userId = req.params.userId;
    getUserObject(userId)
    .then(userObj => {
        saveUserAvater(userObj.data.avatar, userId);
        res.send(userObj);
    })
    .catch(err => {
        utils.logger(err);
    })
}

exports.getUserAvatar = function(req, res) {
    const userId = req.params.userId;
    getUserObject(userId)
    .then(userObj => {
        if(userObj) {
            saveUserAvater(userObj.data.avatar, userId)
            .then(avatar => {
                res.set('Content-Type', 'image/jpeg');
                fs.readFile(`${userId}.jpg`, function(err, data){
                    res.send(data);
                })
            })
        }
    })
    .catch(err => {
        utils.logger(err);
    })
}

exports.deleteUserAvatar = function(req, res) {
    const userId = req.params.userId;
    fs.unlinkSync(`${userId}.jpg`);
    res.send('Avatar removed');
}

function saveUserAvater (avatarUrl, userId) {
    const filePath = `${userId}.jpg`;
    return new Promise((resolve, reject) => {
        if(!fs.existsSync(filePath)) {
            https.get(avatarUrl, resp => {
                let data = new Stream();
        
                // A chunk of data has been recieved.
                resp.on('data', (chunk) => {
                    data.push(chunk);
                });
        
                // The whole response has been received. Print out the result.
                resp.on('end', () => {
                    fs.writeFileSync(filePath, data.read());
                    resolve(data);
                });
            })
        } else {
            fs.readFile(filePath, function(err, data) {
                console.log('read cached file');
                resolve(data);
            })
        }
    })
}

function getUserObject (userId) {
    return new Promise((resolve, reject) => {
        https.get(`https://reqres.in/api/users/${userId}`, (resp) => {
            let data = '';
    
            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });
    
            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                resolve(JSON.parse(data));
            });
    
        }).on("error", (err) => {
            utils().logger(err);
        });
    })
}
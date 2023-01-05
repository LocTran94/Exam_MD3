const http = require('http');
const url = require('url');
const router = require('./controller/router');
const notFound = require('./controller/handleRouter/notFound');
const fs = require("fs");


const server = http.createServer((req, res) => {
    let pathName = url.parse(req.url, true).pathname;
    const checkPath = pathName.match(/\.js|\.css|\.png|\.jpg|\.ttf|\.woff|\.woff2|\.eot/);
    if (checkPath) {


        fs.createReadStream(__dirname + req.url).pipe(res);
    } else {
        const arrPath = pathName.split('/');
        let trimPath = '';
        let id = '';
        if (arrPath.length === 2) {
            trimPath = arrPath[arrPath.length - 1];
        } else {
            trimPath = arrPath[arrPath.length - 2];
            id = arrPath[arrPath.length - 1];
        }
        let chosenHandle;
        if (typeof router[trimPath] === 'undefined') {
            chosenHandle = notFound.handleNotFound;
        } else {
            chosenHandle = router[trimPath];
        }
        chosenHandle(req, res, id);
    }
});
server.listen(3001, () => {
    console.log('Server is running!')
})
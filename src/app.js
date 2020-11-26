import _ from 'lodash';
import express from 'express';
import fs from 'fs';
import bodyParser from 'body-parser';
import LogService from './log-service.js';
import serveIndex from 'serve-index';
import serveStatic from 'serve-static';
import yargs from 'yargs';

// Get argv from command
const argv = yargs(process.argv.slice(2)).argv;

// Setup port and dir
let port, dir;

if(! argv.p){
    port = '8000';
    console.log(` Using default port : ${port} , can be changed by -p PORT`)
}else {
    port = argv.p;
}
if (! argv.d){
    dir = './logs'; 
    console.log(` Using default directory : ${dir} , can be changed by -d DIR`)
}
else{
    dir = argv.d;
}

// check if dir exist
if(!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

let app = express();

app.use(bodyParser.raw({ type: 'text/plain', limit: 1024 * 1024 * 10 }));

// POST
app.post('/:id/log/', (req,res) => {
    let logname = req.params.id;
    console.log(req.body.toString())
    LogService(dir, logname)
        .write(req.body)
        .then(()=> {
            res.send()
        });

});

///
/// Get '/log' - Log the request body into a file. Each request will appended
/// into a file.
///
app.get('/*', serveIndex(dir, { icons: true, view: 'details' }));
app.get('/*.log', serveStatic(dir, { icons: true }));


app.listen(port);

console.log(_.template("Server run on : http://localhost:<%= port %>")({ port: port }));

console.log(_.template("Logs directory : '<%= dir %>'")({ dir: dir }));


export default app;
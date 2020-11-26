import _ from 'lodash';
import Q from 'q';
import fs from 'fs';

let generateFileName = (baseDir, id) => {
    
    let date = new Date();
    let dateSuffix = _.template("<%= year %>-<%= month %>-<%= day %>")(
        { year: date.getFullYear(), month: date.getMonth()+1, day: date.getDate() });

    let filename = id + '-' + dateSuffix;
        console.log(filename)
    return _.template("<%= dir %>/<%= filename %>.log")({ dir: baseDir, filename: filename });
}

let LogService = (baseDir, id) => {

    if(!baseDir || typeof(baseDir) != "string"){
        throw new Error("Base log dir is required!");
    }
    if (!fs.existsSync(baseDir)){
        fs.mkdirSync(baseDir);
    }

    let name = generateFileName(baseDir,id);

    let self = {
        write: (buffer) => {
            let dfd = Q.defer();

            fs.appendFile(name, buffer, (err) => {
                if(err) dfd.reject(err);
                else dfd.resolve();
            })

            return dfd.promise;
        }
    }

    return self;

}

export default LogService;
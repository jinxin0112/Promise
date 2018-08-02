const fs = require('fs');
const Promise = require('./Promise');

function readFlie(url, encoding) {
    return new Promise((resolved, rejected) => {
        fs.readFile(url, encoding, (err, data) => {
            if (err) {
                rejected(err);
            } else {
                resolved(data);
            }
        });
    })
}

let promise2 = readFlie('./a.txt', 'utf8').then((data) => {
    return readFlie(data, 'utf8')
}).then((data)=>{
    return data
}).then((data)=>{
    return data
}).then().then((data)=>{
    console.log(data);
});
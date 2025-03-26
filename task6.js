const fs = require('fs');
const path = require('path');
const http = require('http');
const split2 = require('split2');
const through2 = require('through2');
const { Transform } = require('stream');

const FILE_PATH = path.join(__dirname, 'data.csv');

class CustomStream extends Transform {
    _transform(chunk, encoding, callback) {
        const transformed = chunk.toString().replace(/[a-z]/g, char => char.toUpperCase());
        this.push(transformed);
        callback();
    }
}

http.createServer((req, res) => {
    if (req.method === 'GET') {
        const readStream = fs.createReadStream(FILE_PATH);
        let headers;
        const jsonArray = [];

        readStream
            .pipe(split2())
            .pipe(through2(function (line, _, next) {
                const row = line.toString().split(',');
                if (!headers) {
                    headers = row;
                } else {
                    const obj = {};
                    headers.forEach((header, index) => {
                        obj[header] = row[index];
                    });
                    jsonArray.push(obj);
                }
                next();
            }, function (done) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(jsonArray, null, 2));
                done();
            }));
    } else {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Method Not Allowed');
    }
}).listen(4000, () => console.log('Server running on port 4000'));

process.stdin.pipe(new CustomStream()).pipe(process.stdout);

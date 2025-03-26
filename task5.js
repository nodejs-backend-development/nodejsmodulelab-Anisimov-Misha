const fs = require('fs');
const path = require('path');
const http = require('http');
const split2 = require('split2');
const through2 = require('through2');

const FILE_PATH = path.join(__dirname, 'data.csv');

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
                    headers = row; // Зчитуємо заголовки з першого рядка
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
}).listen(3000, () => console.log('Server running on port 3000'));

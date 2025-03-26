// document.cookie = "user_info=user1; path=/";

const http = require('http');
const { parse } = require('cookie');

const host = 'localhost';
const port = 8000;

const server = http.createServer((req, res) => {
    const cookies = parse(req.headers.cookie || '');
    if (cookies.user_info === 'user1') {
        const userData = {
            id: 1,
            firstName: "Leanne",
            lastName: "Graham"
        };
        res.writeHead(200);
        res.end(JSON.stringify(userData));
    } else {
        res.writeHead(200);
        res.end(JSON.stringify({}));
    }
});

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});

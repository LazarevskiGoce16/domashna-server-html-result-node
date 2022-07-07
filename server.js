// za doma - rezultatot na operacijata da se prikazhe vo spanot vo html kodot (namesto {{res}})

const http = require('http');
const fs = require('fs');
const url = require('url');

const fileRead = (filename) => {
    return new Promise((success, fail) => { 
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) {
                return fail(err);
            }
            return success(data);
        });
    });
};

const findResult = (request, htmlContent, operator) => {
    const qs = url.parse(request.url, true).query;
    let result = "";

    if(operator === 'divide' && qs.b === '0') {
        result = "You have not put a proper operator in the URL! Choose another number not equal to zero (0)!"
    } else {
        switch(operator) {
            case 'plus':
                result = `${Number(qs.a) + Number(qs.b)}`;
                break;
            case 'minus':
                result = `${Number(qs.a) - Number(qs.b)}`;
                break;
            case 'multiply':
                result = `${Number(qs.a) * Number(qs.b)}`;
                break;
            case 'divide':
                result = `${Number(qs.a) / Number(qs.b)}`;
                break;
        }
    }
    return htmlContent.replace(/{{res}}/, result);
};

const pages = {
    "/plus": async (req, res) => {
        let content = await fileRead('./index.html');
        res.end(findResult(req, content, "plus"));
    },
    "/minus": async (req, res) => {
        let content = await fileRead('./index.html');
        res.end(findResult(req, content, "minus"));
    },
    "/multiply": async (req, res) => {
        let content = await fileRead('./index.html');
        res.end(findResult(req, content, "multiply"));
    },
    "/divide": async (req, res) => {
        let content = await fileRead('./index.html');
        res.end(findResult(req, content, "divide"));
    }
};

const server = http.createServer((req, res) => {
    let [path, _] = req.url.split('?');
    if (pages[path]) {
        pages[path](req, res);
    } else {
        res.end("You have put an invalid operator! Please put 'plus', 'minus', 'multiply' or 'divide' as the operator!");
    }
});

server.listen(8080);

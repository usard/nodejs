const fs = require('fs');
const executeOnRequest = (req, res) => {
    const url =req.url;
    if(url === '/') {
        res.write('<html>')
        res.write('<head><title>my page</title></head>')
        res.write(`<body>
        <form action='/message' method='POST'>
        <input type='text' name='input_text'></input>
        <button type='submit'>submit</button>   
        </form>
        </body>`)
        res.write('</html>')
        return res.end();
    }
    if(url === '/message') {
    const body=[];
    let parsedBody;
    req.on('data', (chunk)=> {
        console.log(chunk);
        body.push(chunk);
    })
    return req.on('end', ()=> {
        parsedBody = Buffer.concat(body).toString();
        const message = parsedBody.split('=')[1];
        console.log(parsedBody, message);
        fs.writeFile('data.txt', message, (err)=> {
            console.log(err);
        });
        res.statusCode = 302;
        res.setHeader('location' , '/'); // this will be invoked after the below default page is painted on screen.
        return res.end();
    })
}
}

module.exports = executeOnRequest;
const http = require('http');
const users =[]; // declaring here outside the server is must to see the list of  users after creating user.
const server = http.createServer((req,res)=> {
    const url = req.url;
    const method = req.method;
    // const users =[];  don't declare here because as soon as u enter the user name and hit submit this users will be empty because this variable is again created from scratch as containing function(request listener) runs again
    if( url === '/') {
        res.write(
        `<html>
            <head><title>assignment-1</title></head>
            <body>
                <h1>welcome anvesh!</h1>
                <form action='/create-user' method='POST' >
                    <input  type='text' name='username' />
                    <button type='submit'>submit</button >
                </form>
            </body>
         </html>`);
         res.end();
    }

    if(url === '/create-user' && method === 'POST'){
        const body = [];
        req.on('data', (chunk)=> {
                body.push(chunk);
            })
        req.on('end' , ()=> {
            let parsedText = Buffer.concat(body).toString();
            console.log(parsedText);
            const user = parsedText.split('=')[1];
            users.push(user);
            console.log(users);
        })
        res.statusCode = 302;
        res.setHeader('Location', '/');
        res.end();
    }

    if(url === '/users') {
        // console.log(users);
        res.write(`<html>`);
        res.write(
            `<body>
                <ul>
                ${
                    users.map((user)=> {
                        return (
                            `<li>${user}</li>`
                        )
                    })
                }
                </ul>
            </body>`);
        res.write(`</html>`);
        res.end();
    }
});
server.listen(4000);
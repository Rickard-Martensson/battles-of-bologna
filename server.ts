import * as express from 'express';

const app = express();

const port = 3000; // Use any port number you want

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

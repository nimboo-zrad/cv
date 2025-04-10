import express from 'express';
import path from 'path';
import url from 'url';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || '127.0.0.1';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/src', express.static(path.join(__dirname, 'src')));
app.use(express.urlencoded({extended: true}));

app.listen(port, host, () => console.log(`The server is running on ${host}:${port}`));

app.post('/submit', (req, res)=>{
    const data = req.body;
    if(data == undefined) res.status(403).send('the body is undefined!');
    const {firstName, lastName, age, stuCode, natCode} = data;
    const newData = {
        fullName: `${firstName} ${lastName}`,
        age: age,
        studentCode: stuCode,
        nationalCode: natCode
    }
    fs.writeFile(`./users/${firstName} ${lastName}.json`, JSON.stringify(newData, null, 2), (err)=>{
        if(err) console.error("there has been a problem: ", err.message);
        else console.log('writed successfully!')
    });
    res.sendFile(path.join(__dirname, 'src', 'redirect.html'));
});

app.get('/users/:fullName', (req, res)=>{
    const fullName = req.params.fullName;
    fs.readFile(`./users/${fullName}.json`, 'utf8', (err, data)=>{
        if(err) console.error('There has been an error: ', err.message);
        else {
            const parsedData = JSON.parse(data);
            res.status(201).send(parsedData);
            console.log('file read successfully!');
        }
    });
});

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, 'index.html'));
});

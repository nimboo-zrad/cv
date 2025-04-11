import express from 'express';
import path from 'path';
import url from 'url';
import fs from 'fs';
import dotenv from 'dotenv';
import formidable from 'formidable'; 

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || '127.0.0.1';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//middlewares:

app.use('/src', express.static(path.join(__dirname, 'src')));
app.use(express.urlencoded({extended: true}));

//listen:

app.listen(port, host, () => console.log(`The server is running on ${host}:${port}`));

//post:

app.post('/submit', (req, res)=>{
    const data = req.body;
    console.log(data);
    if(!data.firstName || !data.lastName) return res.status(404).send("some information are missing!");
    const {firstName, lastName, age, stuCode, natCode} = data;

    const userDir = path.join(__dirname, 'users');
    const userFolder = path.join(userDir, `${firstName} ${lastName}`);

    if(!userDir) fs.mkdirSync(userDir);
    if(!userFolder) fs.mkdirSync(userFolder);

    fs.writeFile(path.join(`${userFolder}/${firstName} ${lastName}.json`), JSON.stringify(data, null, 2), err=>{
        if(err) {
            console.error('error', err.message);
            return res.status(500).send('failed creating file');
        }
    });

    res.redirect('/success');

    const form = formidable({uploadDir: userFolder, keepExtensions: true});
    form.parse(req, (err, fields, files) => {
        if (err) console.error('error uploading file');
        else{
            console.log(fields, files);
        }
    })
})

//get methods...

app.get('/success', (req, res)=>{
	res.sendFile(path.join(__dirname, "src", "redirect.html"));
});

app.get('/users/:fullName', (req, res)=>{
    const fullName = req.params.fullName;
    const userFile = path.join(__dirname, "users", `${fullName}.json`);
    
    if(!fs.existsSync(userFile)) return res.status(404).send("user not found!");
    
    fs.readFile(userFile, 'utf8', (err, data)=>{
        if(err) {
        	console.error('There has been an error: ', err.message);
            return res.status(500).send("failed reading file!");
        }
            const parsedData = JSON.parse(data);
            res.status(201).send(parsedData);
            console.log('file read successfully!');
    });
});

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, 'index.html'));
});
import express from 'express';
import path from 'path';
import url from 'url';
import fs from 'fs';
import dotenv from 'dotenv';
import multer from 'multer';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || '127.0.0.1';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/src', express.static(path.join(__dirname, 'src')));
app.use(express.urlencoded({extended: true}));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const userDir = path.join(__dirname, "users", `${req.body.firstName} ${req.body.lastName}`);
        if(!fs.existsSync(userDir)) fs.mkdirSync(userDir, {recursive: true});

        cb(null, userDir);
    },
    filename: (req, file, cb) => cb(null, `${req.body.firstName} ${req.body.lastName}`)
});

const upload = multer({ storage });

app.listen(port, host, () => console.log(`The server is running on ${host}:${port}`));

//post methods

app.post('/submit', upload.single('file'), (req, res)=>{
    const data = req.body;
    
    if(data == undefined) return res.status(404).send("some information are missing!");
    const {firstName, lastName, age, stuCode, natCode} = data;

    const userDir = path.join(__dirname, 'users');
    const userFolder = path.join(userDir, `${firstName} ${lastName}`);

    fs.writeFileSync(path.join(userFolder, `${firstName} ${lastName}`), JSON.stringify(data, null, 2));
    res.redirect('/success');

    if(!req.file) console.error("there is no such thing");
    else console.log(req.file);
});

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
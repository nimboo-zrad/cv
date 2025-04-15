import express from 'express';
import path from 'path';
import url from 'url';
import fs from 'fs';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || '127.0.0.1';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//middlewares:

app.use('/src', express.static(path.join(__dirname, 'src')));
app.use(express.urlencoded({extended: true}));
app.use(fileUpload());

//listen:

app.listen(port, host, () => console.log(`The server is running on ${host}:${port}`));

//middlewares:

const formProcess = (req, res, next) => {
    const data = req.body;
    const {firstName, lastName} = data;
    
    if (!data.firstName || !data.lastName) {
        return res.status(404).send('Some information are missing!');
    }
    
    const fullName = `${firstName} ${lastName}`;
    const userDir = path.join(__dirname, 'users');
    const userFolder = path.join(userDir, fullName);

    req.sharedData = {userFolder: userFolder, fullName: fullName, data: data};

    if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });
    if (!fs.existsSync(userFolder)) fs.mkdirSync(userFolder, { recursive: true });
    next();
};

const photoProcess = (req, res, next) => {
    const photo = req.files.photo.data.toString('base64');
    const {fullName, userFolder, data} = req.sharedData;
    data.photo = photo;
    const newData = JSON.stringify(data, null, 2);
    
   fs.writeFile(
        `${userFolder}/${fullName}.json`,
        newData,
        (err) => {
            if(err){
                console.error("There has been an error writing binary data of the photo to the file!: ", err.message);
                return res.status(500).send("Failed to write binary data of photo to the file!");
            }
            console.log('data stored successfully!');
        }
    ); 
    
    next();
};

const userShow = (req, res, next) => {
    const fullName = req.params.fullName;
    const userFile = path.join(__dirname, "users", `${fullName}`, `${fullName}.json`);

    if(!fs.existsSync(userFile)) return res.status(404).send("user not found!");
    
    fs.readFile(userFile, 'utf8', (err, data)=>{
        if(err) {
        	console.error('There has been an error reading file\'s data: ', err.message);
            return res.status(500).send("failed reading file!");
        }
            const parsedData = JSON.parse(data);
            res.json(parsedData);
            console.log('file read successfully!');
    });
}

const userPhoto = (req, res, next) => {
    const image = path.join(__dirname, 'users', req.params.fullName, `${req.params.fullName}.json`);
    fs.readFile(image, (err, data)=>{
        if(err) {
            console.error('There has been an error reading image buffer: ', err.message);
            return res.status(500).send('failed to read image buffer');
        }
        // console.log(data);
        const jsoned = JSON.parse(data)
        res.setHeader('Content-Type', 'image/png');
       //  res.send(jsoned.photo);
       const final = Buffer.from(jsoned.photo, 'base64');
       res.send(final);
        console.log('image read successfully!');
    });
}

//post:

app.post('/submit', formProcess , photoProcess, (req, res) => {
    res.redirect('/success');
});

//get

app.get('/signin', (req, res) => {
    res.sendFile(path.join(__dirname, '/src/pages', 'signIn.html'));
})

app.get('/success', (req, res)=>{
	res.sendFile(path.join(__dirname, "/src/pages/", "redirect.html"));
});

app.get('/update', (req, res) => {
    res.sendFile(path.join(__dirname, '/src/pages', 'update.html'));
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/src/pages/', 'home.html'));
});
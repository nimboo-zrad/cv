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

//post:

app.post('/submit', (req, res) => {
    const data = req.body;
    const photo = req.files.photo.data;
    console.log(data);

    // Validate the input fields
    if (!data.firstName || !data.lastName) {
        return res.status(404).send('Some information are missing!');
    }

    const { firstName, lastName} = data;

    // Create user directories
    const userDir = path.join(__dirname, 'users');
    const userFolder = path.join(userDir, `${firstName} ${lastName}`);

    if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });
    if (!fs.existsSync(userFolder)) fs.mkdirSync(userFolder, { recursive: true });

    // Write user data to a JSON file
    fs.writeFile(
        `${userFolder}/${firstName} ${lastName}.json`,
        JSON.stringify(data, null, 2),
        (err) => {
            if (err) {
                console.error('Error writing JSON file:', err.message);
                return res.status(500).send('Failed to create JSON file.');
            }
        });
        
        fs.writeFileSync( `${userFolder}/${firstName} ${lastName}.png`, photo);
        
        res.redirect("/success");
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
//Définition des modules
const path = require('path');
const fs = require('fs');

const express = require("express");
const http = require('http');
const ws = require('ws');
const bodyParser = require('body-parser');

const project = require('./project');

// Serveur Express
const port = 8000;
const app = express();
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));
//app.listen(port, () => console.log(`Listening on port ${port}`));

//Définition des CORS
// app.use(function (req, res, next) {
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     next();
// });

// Initialisation WebSocket
const server = http.createServer(app);

wss = new ws.Server({ server });
wss.on('connection', (ws) => {

    //connection is up, let's add a simple simple event
    ws.on('message', (message) => {

        //log the received message and send it back to the client
        console.log('received: %s', message);
        ws.send(`Hello, you sent -> ${message}`);
    });

    //send immediatly a feedback to the incoming connection
    ws.send('Hi there, I am a WebSocket server');
});

server.listen(process.env.PORT || port, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});

// Broadcast to all.
wss.broadcast = function broadcast(message) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === ws.OPEN) {
        client.send(message);
      }
    });
  };

app.get('/hello', (req, res) => res.json("Hello Mad World"));

app.post('/project/', async function(req, res) {

    try {
        const dir = req.body.directory;
        const im = req.body.import;
        const it = req.body.transfert;
        const cntry = req.body.country;

        const cp = await project.create(dir, cntry, im, it);
        res.status(201).send();
    } catch(e) {
        res.status(500).send(e.toString());
    }
});

app.get('/project', async function(req, res) {

    try {
        const dir = req.query['directory'];
        wss.broadcast(`Ouverture du projet ${dir}`);
        res.status(200).send(await project.open(dir));
    } catch(e) {
        res.status(500).send(e.toString());
    }
});

app.post('/project/execute/:treatment?', async function(req, res) {

    try {
        const dir = req.query['directory'];
        const type = req.query['type'];
        const treatment = req.params["treatment"];
        project.execute(dir, type, treatment)
        res.status(200).send();
    } catch(e){
        res.status(500).send(e.toString());
    }
});

/*app.get('/modules/:typeModule', function(req, res) {

    // Lecture paramètres
    const ptypeModule = req.params["typeModule"];
    const pPays = req.query["pays"];

    // Filtres
    const repBase = `${path.resolve(__dirname)}/modules`;
    res.json(fs.readdirSync(`${repBase}/${ptypeModule}`).filter(r => {
        const repModule = `${repBase}/${ptypeModule}/${r}`;
        if (!fs.lstatSync(`${repModule}`).isFile()) {
            const m = require(`${repModule}/${r}.json`);
            return !m.hasOwnProperty("pays") || !m.pays || m.pays === pPays;
        }
    }).map(r => {
        return { nom : r };
    }));

});

app.post('/executerTraitements', function(req, res) {

    const module = req.body.module;
    const repertoire = req.body.repertoire;
    if (module) {
        projet.executerTraitements(repertoire, module);
    }
    res.sendStatus(200);
})

app.get('/verifierTraitements', function(req, res) {
    res.json(importDonnees.verifierTraitements());
})*/

module.exports = { wss }
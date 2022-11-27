const express = require('express');
const path = require('path');
const fs = require('fs');
//const { clog } = require('./middleware/clog');
//const api = require('./routes/index.js');

const PORT = process.env.PORT || 3001;

const app = express();
const publicDir = path.join(__dirname, "/public");

// Import custom middleware, "cLog"
//app.use(clog);

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use('/api', api);

app.use(express.static('public'));

// GET Route for homepage
app.get('/notes', (req, res) =>
  res.sendFile(path.join(publicDir, '/notes.html'))
);

app.get('/api/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './db/db.json'))
);

app.get('/api/notes/id', (req, res) => {
    let notes = JSON.parse (fs.readFileSync("./db/db.json", 'utf8'));
    res.json(notes[Number(req.params.id)])
}
);


app.get('*', (req, res) =>
  res.sendFile(path.join(publicDir, 'index.html'))
);

app.post("/api/notes", function (req, res) {
    let notes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let note = req.body;
    let newId = notes.length.toString();
    note.id = newId;
    notes.push(note);
  
    fs.writeFileSync("./db/db.json", JSON.stringify(notes));
    console.log("Note saved to db.json. Content: ", note);
    res.json(notes);
  });

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);

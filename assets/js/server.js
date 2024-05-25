const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

let db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run("CREATE TABLE tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, task TEXT)");
});

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/tasks', (req, res) => {
    db.all("SELECT * FROM tasks", [], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        res.json(rows);
    });
});

app.post('/tasks', (req, res) => {
    const task = req.body.task;
    db.run("INSERT INTO tasks (task) VALUES (?)", [task], function(err) {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        res.status(201).json({ id: this.lastID, task: task });
    });
});

app.delete('/tasks/:id', (req, res) => {
    const id = req.params.id;
    db.run("DELETE FROM tasks WHERE id = ?", [id], function(err) {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        res.status(204).end();
    });
});

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});

const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;
const sqlite3 = require('sqlite3').verbose()

app.use(cors());

// database setup
const db = new sqlite3.Database("paints.db", (err) => {
    if (err) {
        console.error("Could not connect to database: ", err.message);
    }
});

function checkPaintExists(colour) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT COUNT(*) AS count FROM paints WHERE colour = ?';
    
        db.get(query, [colour], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row.count > 0);
            }
        });
    });
}

function insertPaint(colour) {
    const query = 'INSERT INTO paints (colour, status, stock) VALUES (?, ?, ?)';

    db.run(query, [colour, "available", 10], (err) => {
        if (err) {
            console.error("Error inserting paints:", err.message);
        } else {
            console.log("New paint inserted successfully.");
        }
    });
}

function checkUserExists(username) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT COUNT(*) AS count FROM users WHERE username = ?';
    
        db.get(query, [username], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row.count > 0);
            }
        });
    });
}

function insertUser(user) {
    const query = 'INSERT INTO users (username, role, enabled) VALUES (?, ?, ?)';

    db.run(query, [user.name, user.role, user.enabled], (err) => {
        if (err) {
            console.error("Error inserting users:", err.message);
        } else {
            console.log("New user inserted successfully.");
        }
    });
}

db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT,
    role TEXT,
    enabled TEXT
)`, (err) => {
    if (err) {
        console.err("Could not create table 'users': ", err.message);
    } else {
        const usersTemplate = [
            {"name": "john", "role": "view", "enabled": "true"},
            {"name": "jane", "role": "crud", "enabled": "true"},
            {"name": "adam", "role": "admin", "enabled": "true"},
            {"name": "painter", "role": "crud", "enabled": "true"}
        ]
        usersTemplate.forEach((user) => {
            checkUserExists(user.name).then((exists) => {
                if (!exists) {
                    insertUser(user);
                }
            });
        });
    }
});

db.run(`CREATE TABLE IF NOT EXISTS paints (
    id INTEGER PRIMARY KEY,
    colour TEXT,
    status TEXT,
    stock INTEGER
)`, (err) => {
    if (err) {
        console.err("Could not create table 'paints': ", err.message);
    } else {
        const colourList = ["blue", "grey", "black", "white", "purple"];
        colourList.forEach((colour) => {
            checkPaintExists(colour).then((exists) => {
                if (!exists) {
                    insertPaint(colour);
                }
            });
        });
    }
});
// end of database setup

// routes
app.get("/", (req, res) => {
    res.send("hi");
});

app.get("/paints", (req, res) => {
    res.send("Hello from Express!");
});


app.get("/users/:username", (req, res) => {
    const usename = req.params.username;
    const query = "SELECT * FROM users WHERE username = ?";
    
    db.get(query, [usename], (err, row) => {
        if (err) {
            console.error('Error querying database:', err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else if (!row) {
            res.status(404).json({ error: 'Invalid login, user not found' });
        } else {
            res.json(row);
        }
    });
});

// end of routes

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

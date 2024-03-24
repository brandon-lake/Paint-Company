const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;
const sqlite3 = require('sqlite3').verbose()

app.use(cors());
app.use(express.json());

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
            {"name": "john", "role": "view", "enabled": "Yes"},
            {"name": "jane", "role": "crud", "enabled": "Yes"},
            {"name": "adam", "role": "admin", "enabled": "Yes"},
            {"name": "painter", "role": "crud", "enabled": "Yes"},
            {"name": "manager", "role": "manager", "enabled": "Yes"}
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
app.get("/paints", (req, res) => {
    const query = "SELECT * FROM paints";

    db.all(query, (err, rows) => {
        if (err) {
            console.error('Error querying database:', err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else if (!rows) {
            res.status(404).json({ error: 'Invalid login, user not found' });
        } else {
            res.json(rows);
        }
    });
});

app.put("/paints/update", (req, res) => {
    const query = "UPDATE paints SET status = ?, stock = ? WHERE colour = ?";
    const { colour, status, stock } = req.body;


    db.run(query, [status, stock, colour], (err) => {
        if (err) {
            res.status(500).json({ error: "Error updating paint: " + err });
        } else {
            res.status(200).json({ message: "Paint updated successfully" });
        }
    });
});

app.get("/users", (req, res) => {
    const query = "SELECT * FROM users";

    db.all(query, (err, rows) => {
        if (err) {
            console.error('Error querying database:', err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else if (!rows) {
            res.status(404).json({ error: 'Invalid login, user not found' });
        } else {
            res.json(rows);
        }
    })
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

app.put("/users/update", (req, res) => {
    let query = "UPDATE users SET ";
    let params = [];
    const { username, role, enabled } = req.body;

    if (role !== "") {
        query += "role = ?, ";
        params.push(role);
    }

    if (enabled !== "") {
        query += "enabled = ?";
        params.push(enabled);
    } else {
        query = query.slice(0, -2);
    }

    query += " WHERE username = ?";
    params.push(username);

    db.run(query, params, (err) => {
        if (err) {
            res.status(500).json({ error: "Error updating user: " + err });
        } else {
            res.status(200).json({ message: "User updated successfully" });
        }
    });
});

// end of routes

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

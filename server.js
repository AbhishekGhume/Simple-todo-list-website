const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Create MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Abhishek@2004',
    database: 'todolist',
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to MySQL');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/todos', (req, res) => {
    const task = req.body.task;

    // Insert new todo into MySQL
    const sql = 'INSERT INTO todos (task) VALUES (?)';
    db.query(sql, [task], (err, result) => {
        if (err) throw err;
        console.log('Todo inserted:', result);
        res.redirect('/');
    });
});

app.get('/todos', (req, res) => {
    // Retrieve all todos from MySQL
    const sql = 'SELECT * FROM todos';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

app.put('/todos/:id', (req, res) => {
    const id = req.params.id;
    const task = req.body.task;

    // Update todo in MySQL
    const sql = 'UPDATE todos SET task = ? WHERE id = ?';
    db.query(sql, [task, id], (err, result) => {
        if (err) throw err;
        console.log('Todo updated:', result);
        res.send('Todo updated successfully');
    });
});

app.delete('/todos/:id', (req, res) => {
    const id = req.params.id;

    // Delete todo from MySQL
    const sql = 'DELETE FROM todos WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) throw err;
        console.log('Todo deleted:', result);
        res.send('Todo deleted successfully');
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
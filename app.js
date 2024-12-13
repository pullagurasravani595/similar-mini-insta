const express = require('express');
const {open} = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, 'miniinsta.db');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());
let db = null;

const initializeDbServer = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });
        app.listen(3000, () => {
            console.log('server run at 3000 port')
        });
    }catch(e) {
        console.log(`DB error: ${e.message}`);
        process.exit(1);
    }
}

initializeDbServer();

// api code

app.post('/posts', async(request, response) => {
    try {
        const {id, name, userImage, time, description, media, likes} = request.body;
        const addNewNoteQuery = `
            INSERT INTO 
                posts(id, name, user_image, time, description, media, likes)
            VALUES
                (
                    '${id}',
                    '${name}',
                    '${userImage}',
                    '${time}',
                    '${description}',
                    '${JSON.stringify(media)}',
                    ${likes}
            );
        `;
        await db.run(addNewNoteQuery);
        response.send('sucessfully add new note');

    }catch(e) {
        console.log(`error: ${e.message}`);
    }
});

app.get('/posts', async (request, response) => {
    try {
        const getPostQuery = `SELECT * FROM posts`;
        const posts = await db.all(getPostQuery);
        response.json(posts);
    } catch (e) {
        console.error(`Error: ${e.message}`);
        response.status(500).json({ error: e.message });
    }
});




module.exports = app;


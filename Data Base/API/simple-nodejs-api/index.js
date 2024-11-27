import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import connect from './db.js';

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.get('/', async (req, res) => {
    let db;
    try {
        db = await connect();
        const query = "SELECT * FROM Account";
        const [rows] = await db.execute(query);
        console.log(rows);

        res.json({
            data: rows,
            status: 200
        });
    } catch(err) {
        console.error(err);
    } finally {
        if(db)
            db.end();
    }
}); 

app.listen(PORT, () => {
    console.log('► Server connected.');
})
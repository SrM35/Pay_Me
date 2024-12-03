import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import bcrypt, { hash } from 'bcrypt';
import connect from './db.js';

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.get('/Accounts', async (req, res) => {
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

app.post('/createAccount', async (req, res) =>{
    let db;
    try {
        const { nameUser, emailUser, passwordUser } = req.body;
        bcrypt.hash(passwordUser, 8, async(error, hash) => {
            if (error) throw error;
            db = await connect();
            const query = `CALL SP_CREATE_ACCOUNT('${nameUser}', '${emailUser}', '${hash}')`;
            const [rows] = await db.execute(query);
            console.log(rows);
            
            res.json({
                data: rows,
                status: 200
            });
        });
    } catch(err) {
        console.error(err);
    } finally {
        if(db)
            db.end();
    };
});


app.get('/Cards', async (req, res) => {
    let db;
    try {
        db = await connect();
        const query = "SELECT * FROM Cards";
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

app.post('/addCard', async (req, res) =>{
    let db;
    try {
        const {balance, numberCard, nameCardOwner, securityNumbers, idAccount} = req.body;
        
        db = await connect();
        const query = `CALL SP_ADD_CARD(${balance}, ${numberCard}, '${nameCardOwner}', '${securityNumbers}', '${idAccount}')`;
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
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import connect from './db.js';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



const PORT = process.env.PORT || 3000;

//no mover o si no ya no funciona
app.post('/login', async (req, res) => {
    let db;
    try {
        const { emailUser, passwordUser } = req.body;

        
        if (!emailUser || !passwordUser) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        db = await connect();
        
       
        const query = 'SELECT nameUser, passwordUser, balance FROM Account WHERE emailUser = ?';

        const [rows] = await db.execute(query, [emailUser]);

        
        if (!rows || rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        const user = rows[0];
        const isPasswordValid = await bcrypt.compare(passwordUser, user.passwordUser);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales incorrectas'
            });
        }

       
        res.json({
            success: true,
            message: 'Inicio de sesión exitoso',
            user: {
                name: user.nameUser,
                email: emailUser,
                balance: user.balance,
                idAccount: user.idAccount
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor'
        });
    } finally {
        if (db) await db.end();
    }
});




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


//no mover o si no ya no funciona
app.post('/createAccount', async (req, res) =>{
    let db;
    try {
        const { nameUser, balance, emailUser, passwordUser } = req.body;
        bcrypt.hash(passwordUser, 8, async(error, hash) => {
            if (error) throw error;
            db = await connect();
            const query = `CALL SP_CREATE_ACCOUNT('${nameUser}', ${balance}, '${emailUser}', '${hash}')`;
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

//  app.post('/addCard', async (req, res) =>{
//      let db;
//      try {
//          const {balance, numberCard, nameCardOwner, expirationDate, securityNumbers, idAccount} = req.body;
        
//         db = await connect();
//         const query = `CALL SP_ADD_CARD(${balance}, ${numberCard}, '${nameCardOwner}', '${expirationDate}', '${securityNumbers}', '${idAccount}')`;
//          const [rows] = await db.execute(query);
//          console.log(rows);

//         res.json({
//              data: rows,
//             status: 200
//          });
//      } catch(err) {
//          console.error(err);
//      } finally {
//          if(db)
//              db.end();
//      }
// });

app.post('/addCard', async (req, res) => {
    let db;
    try {
        const { balance, numberCard, nameCardOwner, expirationDate, securityNumbers, idAccount } = req.body;

        db = await connect();

        const query = `CALL SP_ADD_CARD(?, ?, ?, ?, ?, ?)`;
        const [rows] = await db.execute(query, 
            [balance,
                 numberCard, 
                 nameCardOwner, 
                 expirationDate, 
                 securityNumbers, 
                 idAccount]);
        
        res.json({
            data: rows,
            status: 200
        });
    } catch (err) {
        console.error('Error al añadir tarjeta:', err);
        res.status(500).json({ message: 'Error al añadir la tarjeta.' });
    } finally {
        if (db) await db.end();
    }
});

app.post('/transfere', async (req, res) => {
    let db;
    try {
        const { emailUser_origin, emailUser_destiny, amountTransfer } = req.body;

        db = await connect();
        const query = `CALL SP_TRANSFERE('${emailUser_origin}', '${emailUser_destiny}', ${amountTransfer})`;
        const [rows] = await db.execute(query);
        console.log(rows);

        res.json({
            data: rows,
            status: 200
        });
    } catch (err) {
        console.error(err);
    } finally {
        if (db)
            db.end();
    }
});








app.listen(PORT, () => {
    console.log('► Server connected.');
})
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const app = express();

app.use(express.json())
app.use(cors());

//database 
const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'postgres',
      password: 'postgresql@1.0',
      database : 'full-stack'
    }
  });

db.select('*').from('users').then(users => { console.log(users) })
//root route
app.get('/', (req, res) => {
    db.select('*').from('users').then(users => res.json(users))
})

//Sign-In Route
app.post('/signin', (req, res) => {
    const { password } = req.body;
    db.select("email", "hash")
        .from("login")
        .where("email", "=", req.body.email)
        .then(data => {
            console.log(data[0])
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
            console.log(isValid);
            if (isValid) {
                return db
                .select("*")
                .from("users")
                .where("email", "=", req.body.email)
                .then((users) => {
                    res.json(users[0]);
                })
                .catch((err) => res.status(400).json("unable to get user"));
            } else {
                res.status(400).json("1 wrong credentials");
            }
        })
        .catch((err) => res.status(400).json("2 wrong credentials"));
});

//Regiter route 
app.post('/register', (req, res) => {
    const { name, email, password} = req.body;
    const hash = bcrypt.hashSync(password);
    
    db.transaction((trx) => {
        trx.insert({
            hash: hash,
            email: email
        }).into('login').returning('email').then(loginEmail => {
           return trx('users').returning('*').insert({
                    name: name,
                    email: loginEmail[0].email,
                    joined: new Date()
                })
                .then(users => {
                        res.json(users[0])
                })
            })
                .then(trx.commit)
                    .catch(trx.rollback);
        }).catch(err => { res.status(400).json("unable to register")})
});

//Profile Route
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;

    db.select('*')
    .from('users')
    .where({
        id: id
    })
    .then(users => {
        console.log(users[0])
        res.json(users[0])
    })
})


//link route
app.put('/link', (req, res) => {
    const { id } = req.body;

    db('users').where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => res.json(entries[0].entries))
    .catch((err) => res.status(400).json("cannot get entries"))
})



app.listen('3002', () => {
    console.log('The API is running on port 3002');
});
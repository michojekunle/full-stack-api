const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();

app.use(express.json())
app.use(cors());

//database 
const database = {
    users: [
        {
            id: '12',
            name: 'Nnesoma',
            email:'rocks@gmail.com', 
            password:'cassava',
            entries:0,
            joined: new Date(),
        },
        {
            id: '39',
            name: 'Nnesomerema',
            email:'ewa@gmail.com', 
            password:'agbado',
            entries:0,
            joined: new Date(),
        }, 
    ],
    login: [
        {
            id: "18",
            hash: "",
            email: "michael@gmail.com",
        },
    ]
}

//root route
app.get('/', (req, res) => {
    res.send(database.users);
})

//Sign-In Route
app.post('/signin', (req, res) => {

    // Load hash from your password DB.
    bcrypt.compare("michpassword", "$2a$10$MnKXLhRqxlyFK/434zK12.4ifsz3bzYmFOiHArnxAR4Ih74gqdATS", function(err, res) {
        console.log("response 1:", res);
    });

    bcrypt.compare("agooo", "$2a$10$MnKXLhRqxlyFK/434zK12.4ifsz3bzYmFOiHArnxAR4Ih74gqdATS", function(err, res) {
        console.log("response 2:", res);
    });

    if(req.body.email === database.users[1].email && req.body.password === database.users[1].password) {
        res.json('SUCCESS')
    } else {
        res.status(400).json('Error 400 bad request signing in.')
    }
})

//Regiter route 
app.post('/register', (req, res) => {
    const { name, email, password} = req.body;
    
    bcrypt.hash(password, null, null, function(err, hash) {
        console.log(hash);
    });
    
    database.users.push({
        id: '95',
        name: name,
        email:email, 
        password: password,
        entries:0,
        joined: new Date()      
    });

    res.json(database.users[database.users.length - 1])
});

//Profile Route
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;

    database.users.forEach(user => {
        if(user.id === id) {
            found = true;
            return res.json(user)
        }
    })

    if(!found) {
        res.status(404).json("Not found!!")
    }
})


//link route
app.put('/link', (req, res) => {
    const { id } = req.body;
    let found = false;

    database.users.forEach(user => {
        if(user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries)
        }
    })

    if(!found) {
        res.status(404).json("Not found!!")
    }
})



app.listen('3002', () => {
    console.log('The API is running on port 3002');
})



// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });
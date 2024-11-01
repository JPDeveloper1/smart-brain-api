import express, { response } from 'express';
import bodyParser from "body-parser";
import bcrypt from 'bcrypt-nodejs'
import cors from 'cors'
// const cors = require('cors')
import knex from 'knex'
import {handleRegister} from './controllers/register.js';
import {handleSignin} from './controllers/signin.js'
import {handleProfileGet} from './controllers/profile.js'
import {handleImage} from './controllers/image.js'
import {handleApiCall} from './controllers/image.js'
// import register from './controllers/register.js';




// const db =
// const db = knex({
//   client: 'pg',
//   connection: {
//     host: 'dpg-cshjk0aj1k6c73993bb0-a.oregon-postgres.render.com',
//     port: 5432,
//     user: 'smart_brain_om63_user',
//     password: 'sG7mBzFnosevSw5Ovq72ydN5v4hbH2T0',
//     database: 'smart_brain_om63',
//     ssl: {
//       rejectUnauthorized: false // Importante si estás usando SSL con Render
//     }
//   },
// });
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  }
});
// db.select('*').from('users').then(data=>{
//   console.log(data)
// });

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json());
// middleware para habilitar cors
app.use(cors())



// Esto para probar si funciona en la base de datos de render
app.get("/", (req, res) => {
  res.send('Its working server');
});

// signin
// Dos maneras de hacerlo 
// app.post("/signin", (req,res) =>{handleSignin(req,res,db,bcrypt)})
app.post("/signin",handleSignin(db,bcrypt))


// (req, res) => {   db.select('email', 'hash').from('login')
//   .where('email', '=', req.body.email)
//   .then(data => {
//   const isValid=  bcrypt.compareSync(req.body.password, data[0].hash);
//   // console.log(isValid)
//   if (isValid){
//    return db.select('*').from('users')
//     .where('email', '=', req.body.email)
//     .then(user =>{
//       // console.log(user)
//       res.json(user[0])
//     })
//     .catch(err => res.status(400).json('unable to get user'))
//   } else{
//     res.status(400).json('wrong credentials')
//   }

//   })
//   .catch(err => res.status(400).json('wrong credentials'))
// });


  // const {name} = req.body
    // bcrypt.compare("apples", '$2a$10$an1CFm53JopKQ7nZeY703OJrj1bquxopGY1jWd/tE7KkACm2ipVXu', function(err, res) {
    //     console.log("first guess", res)
    // });
    // bcrypt.compare("veggies",'$2a$10$an1CFm53JopKQ7nZeY703OJrj1bquxopGY1jWd/tE7KkACm2ipVXu', function(err, res) {
    //     console.log("second guess", res)
    // });
    // esto a partir de aca es lo que se queda

// posible opcion a reemplazo de res.json (database.users[0])
// database.users.push({
//   id: "123456",
//   usarname: "user",
//   name: "John",
//   entries: 0,
// });
// return res.json(database.users[database.users.length - 1]);
// register
app.post("/register",(req,res) =>{handleRegister(req,res,db,bcrypt)});

// profile
// cuando aplicamos el /:id significa que sin importar el numero siempre podra tener acceso a traves de req.params
app.get('/profile/:id', (req,res)=>{handleProfileGet(req,res,db)});

// images
app.put('/image', (req,res) =>{handleImage(req,res,db)});
app.post('/imageurl', (req,res) =>{handleApiCall(req,res)});
// Password

// bcrypt.hash("bacon", null, null, function(err, hash) {
//     // Store hash in your password DB.
// });

// Load hash from your password DB.
const PORT= process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log( `app is running on port ${PORT}`);
});

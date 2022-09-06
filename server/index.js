import express, { json } from "express"
const app = express()
import morgan from 'morgan'
import { connect } from 'mongoose'
import { expressjwt } from "express-jwt"

//middleware
app.use(json())
app.use(morgan('dev'))
require('dotenv').config()

//connect to db
connect(
    process.env.MONGO_URI,
    () => console.log('connected to database')
)


//routes
app.use('/auth', require('./routes/authRouter.js'))
app.use('/api', expressjwt({ secret: process.env.SECRET, algorithms: ['HS256'] }))
app.use('/api/user', require('./routes/userRouter.js'))
app.use('/api/candidates', require('./routes/originRouter.js'))
app.use('/api/candidates/comments', require('./routes/commentRouter.js'))

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000" );
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    next();
  });

//error handling
app.use((err, req, res, next) => {
    console.log(err)
    if(err.name === "Unathorized Error"){
        res.status(err.status)
    }
    return res.send({errMsg: err.message})
})

//connect to server
app.listen(9000, ()=> {
    console.log("Server is running on Port 9000")
})
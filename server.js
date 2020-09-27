import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import Pusher from 'pusher'


// app config
const app = express();
const port = process.env.PORT || 9000;

// middlewares
app.use(express.json())
app.use(cors())

// DB Config
const connection_url = 'mongodb+srv://admin:NvVpRJ1BQCjHalIC@cluster0.rqyz2.mongodb.net/instragram-clone?retryWrites=true&w=majority'
mongoose.connect(connection_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.once('open', () => {
    console.log('DB Connected')
})

// api routes
app.get("/", (req, res) => res.status(200).send('Hello World'))
app.post("/upload", (req, res) => res.status(200).send('Hello World'))

// listen

app.listen(port, () => console.log(`listening on localhost:${port}`));
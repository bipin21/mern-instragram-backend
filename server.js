import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import Pusher from 'pusher'
import dbModel from './dbModel.js';


// app config
const app = express();
const port = process.env.PORT || 9000;

const pusher = new Pusher({
    appId: '1080476',
    key: '699fbe48313a5f925fc9',
    secret: '52179dc0bb97beb9c6fc',
    cluster: 'eu',
    useTLS: true
});

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

    const changeStream = mongoose.connection.collection('posts').watch();
    changeStream.on('change', (change) => {
        console.log('change triggered ...')
        console.log(change)

        if (change.operationType === 'insert') {
            const postDetails = change.fullDocument;
            pusher.trigger('posts', 'inserted', {
                user: postDetails.user,
                caption: postDetails.caption,
                image: postDetails.image,
            });
        }
        else{
            console.log('Error triggered')
        }
    })
})

// api routes
app.get("/", (req, res) => res.status(200).send('Hello World'))
app.post("/upload", (req, res) => {
    const body = req.body;

    dbModel.create(body, (err, data) => {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.status(201).send(data);
        }
    });
})

app.get("/sync", (req, res) => {
    dbModel.find((err, data) => {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.status(200).send(data);
        }
    })
})

// listen

app.listen(port, () => console.log(`listening on localhost:${port}`));
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.swu9d.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const uri=`mongodb+srv://nkadmin:nazifa1309@cluster0.qnbwm.mongodb.net/nazmulinmarket?retryWrites=true&w=majority`

const app = express()

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('doctors'));
app.use(fileUpload());

// const port = 3000;
const port=process.env.PORT ||3000

app.get('/', (req, res) => {
    res.send("hello from db it's working working")
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    
    const messageCollection = client.db("nazmulinmarket").collection("formmessage");
    const newsLetterCollection = client.db("nazmulinmarket").collection("newsLetter");


// Message receive from nazmul.inmarketdigital.com start
app.post('/message', (req, res) => {
    console.log(req.body)

    const name = req.body.name;
    const email = req.body.email;
    const telephone = req.body.telephone;
    const subject = req.body.subject;
    const textarea=req.body.textarea;
    const checkmesssage="unread"

    

    messageCollection.insertOne({ name,email,telephone,subject,textarea,checkmesssage})
        .then(result => {
            
            res.send({name:`Thank you ${req.body.name}, I have received your message`})
        })
})

app.post('/newsLetter', (req, res) => {
    console.log(req.body)

    
    const email = req.body.email;
    

    newsLetterCollection.insertOne({email})
        .then(result => {
            
            res.send({name:"Thank you,Your email is stored succesfully"})
        })
})

app.get('/messagelist', (req, res) => {
    messageCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
});

app.patch('/checkmesssage/:id', (req, res) => {
    
    const ObjectId = require('mongodb').ObjectId;
    const id = req.params.id;
        const { checkmessage } = req.body;
        console.log(id)


        messageCollection.updateOne({_id:new ObjectId(id)}, // Find the document by ID
        { $set: { checkmessage } }, // Update checkmessage field
        (err, result) => {
            if (err) {
                res.status(500).send({ message: 'Error updating message', error: err });
            } else if (result.matchedCount === 0) {
                res.status(404).send({ message: 'Message not found' });
            } else {
                res.status(200).send({ message: 'Checkmessage updated successfully' });
            }
        })

});


// Message receive from nazmul.inmarketdigital.com end

    

});


// app.listen(process.env.PORT || port)


app.listen( port , ()=>console.log(`Server listening from  ${port}`)) ;
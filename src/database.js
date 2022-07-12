import mongoose from "mongoose";

const user = 'bot';
const password = 'bot';
const dbname = 'Bot';
const uri = `mongodb+srv://${user}:${password}@cluster0.yixc3.mongodb.net/${dbname}?retryWrites=true&w=majority`;

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(db => console.log('DataBase is connected'))
    .catch(err => console.error(err));

export default mongoose;

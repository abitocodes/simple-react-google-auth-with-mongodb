import mongoose from 'mongoose';
mongoose.set('useFindAndModify', false);
import { mongoConfig } from '../config/mongo.js'; 

const env = process.env.NODE_ENV || 'development';

const localUrl = `mongodb://${mongoConfig[env].host}/${mongoConfig[env].dbName}`;
const prodUrl = mongoConfig[env].envVariable;

const connectionUrl = prodUrl ? prodUrl : localUrl;

const connect = mongoose.connect(connectionUrl, {
    useNewUrlParser: true,
    useCreateIndex: true
});

export default connect;
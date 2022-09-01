import mongoose from 'mongoose';
const { Schema } = mongoose;
require('dotenv').config();

const URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@car-workshop.uwvuy.mongodb.net/car-workshop?retryWrites=true&w=majority`;
const conn = mongoose.createConnection(URI);
conn.once('open', () => {
    console.log('Connected to MongoDB');
});
                            

const ServiceSchema = new Schema({
    code: {type: Number, required: true},
    date: {type: String, required: true},
    amount: {type: Number, required: true},  
    carCode: {type: Number, required: true},    
    work: {type: String, required: true},
    carKms: {type: Number, required: true},
    status: {type: String, required: true}
},
{
    collection: 'services'
});

const ServiceModel = conn.model('ServiceModel', ServiceSchema);

export default ServiceModel;
import mongoose from 'mongoose';
const { Schema } = mongoose;

const URI = 'mongodb+srv://beto123:superpassw123@car-workshop.uwvuy.mongodb.net/car-workshop?retryWrites=true&w=majority';
const conn = mongoose.createConnection(URI);
conn.once('open', () => {
    console.log('Connected to MongoDB');
});
                            

const ServiceSchema = new Schema({
    code: {type: Number, required: true},
    date: {type: Date, required: true},
    amount: {type: Number, required: true},  
    carCode: {type: Number, required: true},    
    carKms: {type: Number, required: true},
    status: {type: String, required: true}
},
{
    collection: 'services'
});

const ServiceModel = conn.model('ServiceModel', ServiceSchema);

export default ServiceModel;
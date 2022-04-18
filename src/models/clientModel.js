import mongoose from 'mongoose';
const { Schema } = mongoose;

const URI = 'mongodb+srv://beto123:superpassw123@car-workshop.uwvuy.mongodb.net/car-workshop?retryWrites=true&w=majority';
const conn = mongoose.createConnection(URI);
//const connection = mongoose.connect(URI)
//                           .then(db => console.log('DB conectada!'))
//                            .catch(error => console.log("El error es: ", error));
conn.once('open', () => {
    console.log('Connected to MongoDB');
});

const ClientSchema = new Schema({    
    name: {type: String, required: true},
    lastName: {type: String, required: true},
    dni: {type: Number, required: true},
    email: {type: String, required: true},
    phone: {type: Number, required: true}
},
{
    collection: 'clients'
});

const ClientModel = conn.model('ClientModel', ClientSchema);

export default ClientModel;
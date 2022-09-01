import mongoose from "mongoose";
const { Schema } = mongoose;
require('dotenv').config();

const URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@car-workshop.uwvuy.mongodb.net/car-workshop?retryWrites=true&w=majority`;
const conn = mongoose.createConnection(URI);

conn.once("open", () => {
  console.log("Connected to MongoDB");
});

const ClientSchema = new Schema(
  {
    code: { type: Number, required: true },
    id: { type: Number, required: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    status: { type: String, required: true },
  },
  {
    collection: "clients",
  }
);

const ClientModel = conn.model("ClientModel", ClientSchema);

export default ClientModel;

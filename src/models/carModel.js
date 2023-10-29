import mongoose from "mongoose";

const { Schema } = mongoose;
const URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@car-workshop.uwvuy.mongodb.net/car-workshop?retryWrites=true&w=majority`;
const conn = mongoose.createConnection(URI);

conn.once("open", () => {
  console.log("Connected to MongoDB");
});

const carSchema = new Schema(
  {
    code: { type: Number, required: true },
    patent: { type: String, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    clientCode: { type: Number, required: true },
    status: { type: String, required: true },
  },
  {
    collection: "cars",
  }
);

const CarModel = conn.model("CarModel", carSchema);

export default CarModel;

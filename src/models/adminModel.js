import mongoose from "mongoose";
const { Schema } = mongoose;

const URI =
  "mongodb+srv://beto123:superpassw123@car-workshop.uwvuy.mongodb.net/car-workshop?retryWrites=true&w=majority";
const conn = mongoose.createConnection(URI);

conn.once("open", () => {
  console.log("Connected to MongoDB");
});

const AdminSchema = new Schema(
  {    
    code: { type: Number, required: true }, 
    username: { type: Number, required: true },
    password: { type: String, required: true }    
  },
  {
    collection: "admins",
  }
);

const AdminModel = conn.model("AdminModel", AdminSchema);

export default AdminModel;

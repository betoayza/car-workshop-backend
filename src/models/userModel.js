import mongoose from "mongoose";
const { Schema } = mongoose;

const URI =
  "mongodb+srv://beto123:superpassw123@car-workshop.uwvuy.mongodb.net/car-workshop?retryWrites=true&w=majority";
const conn = mongoose.createConnection(URI);

conn.once("open", () => {
  console.log("Connected to MongoDB");
});

const UserSchema = new Schema(
  {    
    id: { type: Number, required: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: Number, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true },
  },
  {
    collection: "users",
  }
);

const UserModel = conn.model("UserModel", UserSchema);

export default UserModel;

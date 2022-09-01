import express from "express";
import routes from "./routes/routes.js";
import cors from "cors";
import morgan from "morgan";
import { dotenv } from "dotenv";

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// var corsOptions = {
//   origin: "https://betoayza.github.io",
//   optionsSuccessStatus: 200,
// };

// var corsOptions = {
//   origin: "http://127.0.0.1:4173/car-workshop-frontend/",
//   optionsSuccessStatus: 200,
// };

//app.use(cors(corsOptions));

//app.options('*', cors())
app.use(cors());

app.use(routes);

//Use the logger package we have imported to get the log details of our application if needed.
app.use(morgan("dev"));

app.get("/", (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: {
      name: "Server running on port 5000 :)",
    },
  });
});

// app.get("/favicon.ico", (req, res) => res.status(204));

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto 5000...");
});

dotenv.config();

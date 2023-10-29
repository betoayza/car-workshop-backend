import express from "express";
import routes from "./routes/routes.js";
import cors from "cors";

const PORT = process.env.PORT || 5000;

const app = express();

app.use(
  cors()
  // {
  // origin: "https://betoayza.github.io",
  // }
);

app.use(express.json());

// for POST forms
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(routes);

app.get("/favicon.ico", (req, res) => res.status(204));

app.listen(PORT, () => {
  console.log("Server running...");
});

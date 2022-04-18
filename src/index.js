import express from 'express';
import routes from './routes/routes.js';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';

const app = express();

// Middleware para parsear el cuerpo de las peticiones HTTP
app.use(express.urlencoded({
    extended: true
}));

app.use(routes);

app.use(cors());

app.use(express.json());

//Use the logger package we have imported to get the log details of our application if needed.
app.use(morgan('dev'));

//Use body-parser to handle HTTP POST requests.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(5000, () => {
    console.log('Servidor corriendo en puerto 5000...');
});


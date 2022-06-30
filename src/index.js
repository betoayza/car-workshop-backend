import express from 'express';
import routes from './routes/routes.js';
import cors from 'cors';
import morgan from 'morgan';

const PORT=process.env.PORT || 5000;

const app = express();

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

app.use(routes);

app.use(cors({ origin: true }));

//Use the logger package we have imported to get the log details of our application if needed.
app.use(morgan('dev'));

app.get('/', (req, res, next) => {

    res.status(200).json({
        status: 'success',
        data: {
            name: 'Server running on port 5000 :)'            
        }
    });

});

app.listen(PORT, () => {
    console.log('Servidor corriendo en puerto 5000...');    
});


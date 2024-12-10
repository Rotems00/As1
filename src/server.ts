import express, { Express } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import postsRoutes from './routes/posts_routes';
import commentsRoutes from './routes/comments_routes';

dotenv.config();

const app = express();

const initApplication = async (): Promise<Express> => {
    return new Promise<Express>((resolve, reject) => {
        const db = mongoose.connection;

        db.on('error', (error) => {
            console.error('Database connection error:', error);
        });

        db.once('open', () => {
            console.log('CONNECTED TO MONGODB');
        });

        if (!process.env.DATABASE_URL) {
            console.error('initApplication UNDEFINED DATABASE_URL');
            reject();
            return;
        }

        mongoose
            .connect(process.env.DATABASE_URL)
            .then(() => {
                console.log('initApplication: Connected to MongoDB');

               
                app.use(bodyParser.json());
                app.use(bodyParser.urlencoded({ extended: true }));

               
                app.use('/Posts', postsRoutes);
                app.use('/Comments', commentsRoutes);

                app.use(express.json());

                
                app.get('/', (req, res) => {
                    console.log('Welcome to the homepage');
                    res.send('Welcome to the homepage');
                });

                resolve(app);
            })
            
    });
};

export default { initApplication };

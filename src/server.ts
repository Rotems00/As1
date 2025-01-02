import express, { Express } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import postsRoutes from './routes/posts_routes';
import commentsRoutes from './routes/comments_routes';
import authRoutes from './routes/auth_routes';

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/auth', authRoutes);
app.use('/Posts', postsRoutes);
app.use('/Comments', commentsRoutes);

const initApplication = async (): Promise<Express> => {
    return new Promise<Express>((resolve, reject) => {
        const db = mongoose.connection;

        db.on('error', (error) => {
            console.error('Database connection error:', error);
        });

        db.once('open', () => {
            console.log('Connected to database');
        });

        if (!process.env.DATABASE_URL) {
            console.error('initApplication UNDEFINED DATABASE_URL');
            reject();
            return;
        }
        else {
        mongoose
            .connect(process.env.DATABASE_URL)
            .then(() => {
                //app.use(express.json());
                resolve(app);
            })
        }      
    });
};

export default { initApplication };

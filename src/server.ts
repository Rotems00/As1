import express, { Express } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import postsRoutes from "./routes/posts_routes";
import commentsRoutes from "./routes/comments_routes";
import authRoutes from "./routes/auth_routes";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Middleware to set CORS headers
app.use((req , res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*'); 
  next(); 
});

app.use("/auth", authRoutes);
app.use("/Posts", postsRoutes);
app.use("/Comments", commentsRoutes);

// Swagger setup
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Web Dev 2025 REST API By Shon Hason And Rotem Ziv",
      version: "1.0.0",
      description: "REST server including authentication using JWT",
    },
    servers: [{ url: "http://localhost:4000" }],
  },
  apis: ["./src/routes/*.ts"],
};
const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

const initApplication = async (): Promise<Express> => {
  return new Promise<Express>((resolve, reject) => {
    const db = mongoose.connection;

    db.on("error", (error) => {
      console.error("Database connection error:", error);
    });

    db.once("open", () => {
      console.log("Connected to database");
    });

    if (!process.env.DATABASE_URL) {
      console.error("initApplication UNDEFINED DATABASE_URL");
      reject();
      return;
    } else {
      mongoose.connect(process.env.DATABASE_URL).then(() => {
        resolve(app);
      });
    }
  });
};

export default { initApplication };

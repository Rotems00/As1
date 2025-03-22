import express, { Express } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import postsRoutes from "./routes/posts_routes";
import commentsRoutes from "./routes/comments_routes";
import fileRoutes from "./routes/file_routes";
import authRoutes from "./routes/auth_routes";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/media", express.static("public"));
app.use("/public", express.static("public"));
app.use("/storage", express.static("storage"));
app.use("/poststorage", express.static("poststorage"));
app.use(express.static("front"));


app.use("/auth", authRoutes);
app.use("/Posts", postsRoutes);
app.use("/Comments", commentsRoutes);
app.use("/file", fileRoutes);


app.use(express.static('build'));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../front/index.html'));
});

app.options("*", (req, res) => {
  res.sendStatus(200);
});


// Swagger setup
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Web Dev 2025 REST API By Shon Hason And Rotem Ziv",
      version: "1.0.0",
      description: "REST server including authentication using JWT",
    },
    servers: [{ url: "http://localhost:" + process.env.PORT },{ url: "http://10.10.246.3" },{ url: "https://10.10.246.3" },
    ],
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
      mongoose
        .connect(process.env.DATABASE_URL)
        .then(() => {
          resolve(app);
        })
        .catch((err) => {
          reject(err);
        });
    }
  });
};

export default { initApplication };
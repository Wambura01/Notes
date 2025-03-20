import express from "express";
import cors from "cors";
import db from "./app/models";
import * as dotenv from "dotenv";
import authRoutes from "./app/routes/auth.route";
import userRoutes from "./app/routes/user.route";
import notesRoutes from "./app/routes/notes.route";
import swaggerSpec from "./app/config/swagger";
import swaggerUi from "swagger-ui-express";

dotenv.config();
const app = express();

const corsOptions = {
  origin: ["http://localhost:8080", "http://localhost:3000"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the notes application." });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notes", notesRoutes);

const PORT = process.env.PORT || 8080;

const MONGODB_URI = process.env.MONGODB_URI || "";

function initializeRoles() {
  db.Role.estimatedDocumentCount()
    .then((count: number) => {
      if (count === 0) {
        return Promise.all([
          new db.Role({ name: "user" }).save(),
          new db.Role({ name: "admin" }).save(),
          new db.Role({ name: "moderator" }).save(),
        ]);
      }
    })
    .then((roles) => {
      if (roles) {
        console.log(
          "Added 'user', 'admin', and 'moderator' to roles collection."
        );
      }
    })
    .catch((err) => {
      console.error("Error initializing roles:", err);
    });
}

db.mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to the database!");
    initializeRoles();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  })
  .catch((err) => {
    console.error("Connection error:", err);
    process.exit();
  });

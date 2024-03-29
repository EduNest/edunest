import express from "express";
import path from "path";
import viewRoutes from "./routes/viewRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/coursesRoutes.js";
import bodyParser from "body-parser";

const server = express();
server.set("view engine", "ejs");
server.set("views", path.join(process.cwd(), "views"));
server.use(express.static(path.join(process.cwd(), "public")));
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.use(express.json());
server.use("/api", authRoutes);
server.use("/courses", courseRoutes);
server.use("/", viewRoutes);

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

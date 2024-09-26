const express = require("express");

const ProjectsRouter = require("./data/helpers/projects-routers");

const server = express();

server.use(express.json());
server.use("/api/projects", ProjectsRouter);

server.get("/", (req, res) => {
    res.send(`
    <h2>Webapi-sprint-challenge</h2>
   
  `);
});

module.exports = server;

import express from "express";

export const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/v1/projects", (req, res) => {

});

app.post("/v1/projects", (req, res) => {

});

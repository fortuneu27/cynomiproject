import "reflect-metadata";
import express from "express";

import app from "./app";
import { AppDataSource } from "./data-source";

var port: number = 4000;

AppDataSource.initialize()
  .then(() => {
    app.listen(port, () => console.log("Database is running"));
  })
  .catch((error) => console.log(error));

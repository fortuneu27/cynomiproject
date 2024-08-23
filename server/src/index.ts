import "reflect-metadata";
import express from "express";
import { ConnectOptions, createConnection, DataSourceOptions, getConnectionOptions } from "typeorm";

import app from "./app";
import { AppDataSource } from "./data-source";

var port: number = 3306;

app.listen(port, () => console.log("Database is running"))

AppDataSource.initialize()
  .then(() => {
    console.log("Database is running")
    //app.listen(port, () => console.log("Database is running"));
  })
  .catch((error) => {
    console.log(error)
    process.exit(1)
  });


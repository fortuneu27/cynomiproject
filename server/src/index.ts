import "reflect-metadata";
import express from "express";
import { ConnectOptions, createConnection, DataSourceOptions, getConnectionOptions } from "typeorm";

import app from "./app";
import { AppDataSource } from "./data-source";

var port: number = 3306

async function main() {
  var connnection  = await AppDataSource.initialize()
  setInterval(function () {
    if(!connnection.isInitialized){
      console.error("DB not connected")
      process.exit(1)
    }
  }, 20000)
  console.log("DB connected")
  app.listen(port, () => console.log("Express is connected and listening on port " + port))
}

main().catch(function(error) {
  console.error("Main function has thrown an error:\n", error)
  process.exit(2)
})
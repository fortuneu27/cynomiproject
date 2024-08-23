import "reflect-metadata";
import express from "express";

import app from "./app";

import * as fs from 'fs'
import * as path from 'path'
import { AppDataSource } from "./data-source";

var port: number = 4000

if(fs.existsSync(path.resolve('client'))){
  app.use('/', express.static('client'))
  app.use((req, res) => {
    res.sendFile(path.resolve('client/index.html'))
  })
} else {
  console.log('No client detected')
  app.use('/', (req,res) => res.send('No client'))
}

async function main() {
  var connnection  = await AppDataSource.initialize()
  setInterval(function () {
    if(!connnection.isInitialized){
      console.error("DB not connected")
      process.exit(1)
    }
  }, 20000)
  console.log("DB connected ")
  app.listen(port, () => console.log('Express server is runnign on port ' + port))
}

main().catch(function(error) {
  console.error("Main function has thrown an error:\n", error)
  process.exit(2)
})
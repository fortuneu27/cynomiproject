import { DataSource } from "typeorm";
import { SleepSchedule } from "entities/SleepSchedule"
import { SleepChart } from "entities/SleepChart";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  username: "root",
  password: "@Chiduboy05",
  database: "sleep",
  entities: [SleepChart, SleepSchedule],
  synchronize: true,
  logging: true,
});

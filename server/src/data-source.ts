import { DataSource } from "typeorm";
import { SleepSchedule } from "entities/SleepSchedule"
import { SleepChart } from "entities/SleepChart";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 4000,
  username: "sleepSchedule",
  password: "sleepSchedule@1",
  database: "sleep",
  entities: [SleepChart, SleepSchedule],
  synchronize: true,
  logging: true,
});

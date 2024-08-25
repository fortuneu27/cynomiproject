import { Router } from "express";
import { SleepChart } from "../../entities/SleepChart";

var router: Router = Router();

/**
 * @api {GET} /sleepChart/ Gets all sleepcCharts
 * @apiGroup SleepChart
 * @apiVersion 0.0.1
 */
router.get("/", async function (req, res) {
  // get all sleep charts, count them and return a paginated response
  var [sleepCharts, total] = await SleepChart.findAndCount({take: req.pageSize, skip: (req.page) * req.pageSize})
  res.pagedRespond(sleepCharts, total);
})

export default router
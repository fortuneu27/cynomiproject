import { Router } from "express";
import { SleepSchedule } from "../../entities/SleepSchedule";
import moment from "moment";
import { validate } from "class-validator";
import { SleepChart } from "../../entities/SleepChart";

var router: Router = Router();

interface ChartItem {
  date: string
  sleepDuration: number
}

/**
 * @api {GET} /sleepSchedule/chart/:name Gets sleep schedules for a given name, within the last week
 * @apiGroup SleepSchedule
 * @apiVersion 0.0.1
 */
router.get("/chart/:name", async function (req, res) {
  var currDateTime = moment().utc().unix()
  var oneWeekAgo = moment().utc().subtract(1,'w').unix()
  var sleepSchedules = await SleepSchedule.createQueryBuilder('sleepSchedule')
  .where('name = :sName',{sName: req.params.name})
  .andWhere('sleepDateTime >= :fromDate', {fromDate: oneWeekAgo})
  .andWhere('sleepDateTime <= :toDate', {toDate: currDateTime})
  .getMany()

  if(!sleepSchedules) {return res.respond(null, 404, 'Sleep schedules could not be found')}

  var chartArray: ChartItem[] = []

  for (let i = 0; i < sleepSchedules.length; i++) {
    const element = sleepSchedules[i]

    chartArray.push({date: moment.unix(element.sleepDateTime).format('YYYY-MM-DD'), sleepDuration: element.sleepDuration})
    
  }
  return res.respond(chartArray, 200);
});

/**
 * @api {PUT} /sleepSchedule/:sleepScheduleID Edits specified sleep schedule
 * @apiGroup SleepSchedule
 * @apiVersion 0.0.1
 * 
 * Not in use
 */
router.put("/:sleepScheduleID", async function (req, res) {
  var sleepSchedule = await SleepSchedule.findOne({
    where: { id: parseInt(req.params.sleepScheduleID) },
  });
  if (!sleepSchedule)
    return res.respond(null, 404, "Sleep schedule cannot be found");

  if (req.body.name !== sleepSchedule.name) sleepSchedule.name = req.body.name;
  if (req.body.gender !== sleepSchedule.gender)
    sleepSchedule.gender = req.body.gender;
  if (req.body.sleepDateTime !== sleepSchedule.sleepDateTime)
    sleepSchedule.sleepDateTime = req.body.sleepDateTime;
  if (req.body.sleepDuration !== sleepSchedule.sleepDuration)
    sleepSchedule.sleepDuration = req.body.sleepDuration;

  var validationErrors = await validate(sleepSchedule);
  if (validationErrors.length === 0) {
    try {
      await sleepSchedule.save();
      return res.respond(null, 204);
    } catch (error) {
      return res.respond(null, 409, "Sleep schedule could not be updated");
    }
  } else {
    var badFields = validationErrors.map((e) => e.property);
    return res.respond({ badFields }, 400, "Validation error");
  }
});

/**
 * @api {POST} /sleepSchedule/ Creates a sleep schedule
 * @apiGroup SleepSchedule
 * @apiVersion 0.0.1
 */
router.post("/", async function (req, res) {
  var sleepSchedule = new SleepSchedule();

  // reject if any of the values arent present
  if (req.body.name) {
    sleepSchedule.name = req.body.name
  }else {
    return res.respond(null,400,'Must have a name')
  }
  if (req.body.gender) {
    sleepSchedule.gender = req.body.gender
  }else {
    return res.respond(null,400,'Must have a gender')
  }
  if (req.body.sleepDateTime) {
    sleepSchedule.sleepDateTime = req.body.sleepDateTime
  }else {
    return res.respond(null,400,'Must have a sleep date time')
  }
  if (req.body.sleepDuration) {
    sleepSchedule.sleepDuration = req.body.sleepDuration
  }else {
    return res.respond(null,400,'Must have a sleep duration')
  }

  // convert timestamp to moment
  var currentDay = moment.unix(sleepSchedule.sleepDateTime)

  // check if a sleep has already been tracked by a user for the same gender, name and date
  var validateSleepSchedule = await SleepSchedule.createQueryBuilder('sleepSchedule')
  .where('sleepSchedule.name = :name', {name: sleepSchedule.name})
  .andWhere('sleepSchedule.gender = :gender', {gender: sleepSchedule.gender})
  .andWhere('sleepSchedule.sleepDateTime >= :fromDate', {fromDate: currentDay.startOf('day').unix()})
  .andWhere('sleepSchedule.sleepDateTime < :toDate', {toDate: currentDay.endOf('day').unix()})
  .getOne()

  // reject if true
  if(validateSleepSchedule) return res.respond(null,400,'Cannot have multiple records on the same day')

  // run validation and attempt save if validation passes
  var validationErrors = await validate(sleepSchedule);
  if (validationErrors.length === 0) {
    try {
      await sleepSchedule.save();
      await UpdateSleepChart(sleepSchedule)
      return res.respond(sleepSchedule, 200);
    } catch (error) {
      return res.respond(null, 409, "Sleep schedule could not be saved");
    }
  } else {
    var badFields = validationErrors.map((e) => e.property);
    return res.respond({ badFields }, 400, "Validation error");
  }
});

function ValidateSleepSchedules(data: SleepSchedule): {
  Errors: String[];
  valid: boolean;
} {
  var errors: string[] = [];
  return { Errors: errors, valid: true };
}

async function UpdateSleepChart(data: SleepSchedule) {

  //find a current sleep chart instance matching the data provided
  var currSleepChart = await SleepChart.findOne({where: {name: data.name, gender: data.gender}})
  // if not found create a new sleep instance and save it, otherwise update the current instance and save it
  if(!currSleepChart){
    var newSleepChart = new SleepChart()
    newSleepChart.name = data.name
    newSleepChart.gender = data.gender
    newSleepChart.count = 1

    try {
      await newSleepChart.save()
    } catch (error) {
    }
  } else {
    currSleepChart.count += 1
    try {
      await currSleepChart.save()
    } catch (error) {
    }
  }
}

export default router
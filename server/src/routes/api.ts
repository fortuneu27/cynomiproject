import { NextFunction, Router } from "express"
import cors from "cors"
import bodyParser from "body-parser"
import respondMiddleware from "../respondMiddleware"

import sleepSchedule from './api/sleepSchedule'
import sleepChart from './api/sleepChart'

var apiRouter: Router = Router();

// Setting headers
apiRouter.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: false,
  })
);

apiRouter.use(bodyParser.json());
apiRouter.use(bodyParser.urlencoded({extended: true}))

apiRouter.use(respondMiddleware);

// Api Routes
apiRouter.use('/sleepSchedule', sleepSchedule)
apiRouter.use('/sleepChart', sleepChart)

apiRouter.use((p, res, next, err: any) => {
  console.error('Error: ', p.method, p.path)
  if(err instanceof Error) console.error('Error: ', err.message, err.stack)
  return res.respond(null, 500, 'Unhandled endpoint exception')
}) 

export default apiRouter;

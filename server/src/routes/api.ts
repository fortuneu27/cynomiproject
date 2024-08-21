import { Router } from "express"
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
    credentials: true,
  })
);

apiRouter.use(bodyParser.json());

apiRouter.use(respondMiddleware);

// Api Routes
apiRouter.use('/sleepSchedule', sleepSchedule)
apiRouter.use('/sleepChart', sleepChart)

export default apiRouter;

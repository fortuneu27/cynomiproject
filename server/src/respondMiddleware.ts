import { NextFunction, Request, Response } from "express";

declare global {
  namespace Express {
    interface Response {
      respond: (payload: any, status?: number, error?: string) => void;
      pagedRespond: (
        payload: any,
        totalObjects: number,
        pageSize?: number
      ) => void;
    }
  }
}

declare global {
  namespace Express {
    interface Request {
      page: number;
      pageSize: number;
    }
  }
}

export default function respondMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  var page = req.query.page ? parseInt(req.query.page.toString(), 10) : 1;
  if (page < 1) page = 1;
  req.page = page;

  var pageSize = req.query.pageSize
    ? parseInt(req.query.pageSize.toString(), 10)
    : 10;
  if (pageSize < 1) pageSize = 1;
  if (pageSize > 25) pageSize = 25;
  req.pageSize = pageSize;

  res.respond = function (payload, status = 200, error) {
    if (payload === null) payload = undefined;
    var outPut: ApiResponse = {
      status,
      payload,
      error,
    };
    res.status(status).json(outPut).end();
  };

  res.pagedRespond = function (payload, totalObjects) {
    var pagedOutPut: PagedResponse = {
      status: 200,
      page,
      pageSize: req.pageSize,
      pageCount: Math.ceil(totalObjects / pageSize),
      total: totalObjects,
      payload,
    };
    res.json(pagedOutPut).end();
  };
  next();
}

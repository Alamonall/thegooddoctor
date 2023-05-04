import express from 'express';

export default function loggerMiddleware(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction,
) {
  console.log(`${new Date().toISOString()}: ${request.method} ${request.path}`);
  next();
}

import { ErrorRequestHandler } from 'express';
import Boom from '@hapi/boom';

export const errorsMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);

  if (Boom.isBoom(err)) {
    const { statusCode } = err.output;
    const message = err.output.payload.message;
    return res.status(statusCode).json({ error: { message, statusCode } });
  }

  res.status(500).json({ error: { message: err.message || 'Internal server error', statusCode: 500 } });
};

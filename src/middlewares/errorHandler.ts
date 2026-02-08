import { Request, Response, NextFunction } from 'express';

export class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 404;
  }
}

export class BadRequestError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 400;
  }
}

export class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 401;
  }
}

export class ForbiddenError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 403;
  }
}

export class ConflictError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 409;
  }
}

export class InternalServerError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 500;
  }
}

const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'На сервере произошла ошибка';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  } else if (err.name === 'CastError' || err.name === 'SyntaxError') {
    statusCode = 400;
    message = 'Переданы некорректные данные';
  } else if (err.code === 11000) {
    statusCode = 409;
    message = 'Пользователь с таким email уже существует';
  }

  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
};

export default errorHandler;

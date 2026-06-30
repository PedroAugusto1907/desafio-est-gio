import { Request, Response, NextFunction } from 'express';
import { AccountNotFoundError } from '../errors/AccountNotFoundError';
import { InsufficientBalanceError } from '../errors/InsufficientBalanceError';

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AccountNotFoundError) {
    return res.status(404).json({ error: err.message });
  }
  if (err instanceof InsufficientBalanceError) {
    return res.status(422).json({ error: err.message });
  }
  console.error(err);
  return res.status(500).json({ error: 'Erro interno no servidor' });
}

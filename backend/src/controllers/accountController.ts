import { Request, Response, NextFunction } from 'express';
import { accountService } from '../services/accountService';

interface AccountIdParam {
  id: string;
}

interface SaqueBody {
  valor: number;
}

interface TransferenciaBody {
  destinoId: string;
  valor: number;
}

export const accountController = {
  listar(req: Request, res: Response) {
    res.json(accountService.buscarTodas());
  },

  buscarPorId(req: Request<AccountIdParam>, res: Response) {
    const account = accountService.buscarPorId(req.params.id);
    res.json(account);
  },

  saque(req: Request<AccountIdParam, unknown, SaqueBody>, res: Response, next: NextFunction) {
    try {
      const { valor } = req.body;
      const account = accountService.saque(req.params.id, Number(valor));
      res.json(account);
    } catch (err) {
      next(err);
    }
  },

  transferencia(
    req: Request<AccountIdParam, unknown, TransferenciaBody>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { destinoId, valor } = req.body;
      const resultado = accountService.transferencia(req.params.id, destinoId, Number(valor));
      res.json(resultado);
    } catch (err) {
      next(err);
    }
  },
};

import { Request, Response, NextFunction } from 'express';
import { CalificacionServices } from "../services/calificacion.services";

const service = new CalificacionServices()

export class CalificacionController {
  getCalificaciones = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await service.getAllCalificaciones();
      res.json(data);
    } catch (err) {
      next(err);
    }
  };

  getCalificacion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const item = await service.getCalificacionById(id);
      res.json(item);
    } catch (err) {
      next(err);
    }
  };

  createCalificacion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newItem = await service.createCalificacion(req.body);
      res.status(201).json(newItem);
    } catch (err) {
      next(err);
    }
  };

  updateCalificacion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const updated = await service.updateCalificacion(id, req.body);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  };

  deleteCalificacion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await service.deleteCalificacion(Number(req.params.id));
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}

export const calificacionController = new CalificacionController();
import { Request, Response } from "express";
import { Model } from "mongoose";

export class BaseController<T> {
  model: Model<T>;
  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(req: Request, res: Response) {
    console.log("CREATE METHOD");
    console.log(req.body);

    try {
      const newItem = await this.model.create(req.body);
      if (!newItem) {
        res.status(404).send("COULDNT CREATE POST! DUE TO AN ERROR");
        return;
      } else {
        res.status(201).send(newItem);
        return;
      }
    } catch (error) {
      res.status(400).send(error);
      return;
    }
  }

  async getAll(req: Request, res: Response) {
    const ownerFilter = req.query.owner;

    try {
      if (ownerFilter) {
        const Items = await this.model.find({ owner: ownerFilter });
        res.status(200).send(Items);
        return;
      } else {
        const Items = await this.model.find();
        res.status(200).send(Items);
        return;
      }
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    const askedID = req.params._id;
    console.log("GET BY ID METHOD");
    console.log(askedID);
    try {
      const Item = await this.model.findById(askedID);

      if (!Item) {
        res.status(404).send("COULDNT FIND POST! DUE TO AN ERROR");
        return;
      } else {
        res.status(200).send(Item);
        return;
      }
    } catch (error) {
      res.status(400).send(error);
      return;
    }
  }
}
const createController = <T>(model: Model<T>) => {
  return new BaseController(model);
};

export default createController;
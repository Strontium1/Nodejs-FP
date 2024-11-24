import { Request, Response } from "express";
import { create, findAll, findOne, update, remove } from "../services/category.service"
import * as Yup from "yup";

const categoryValidationSchema = Yup.object().shape({
  name: Yup.string().required(),
  products: Yup.string().required()
});

export default {
  categoryValidationSchema,
  async create(req: Request, res: Response) {
    /**
     #swagger.tags = ['Category']
     #swagger.security = [{
      "bearerAuth": []
     }]
     #swagger.requestBody = {
      required: true,
      schema: {
        $ref: "#/components/schemas/CategoryCreate"
      }
     }
     */
    try {
      const result = await create(req.body);
      res.status(201).json({
        data: result,
        message: "Success create category",
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({
        data: err.message,
        message: "Failed create category",
      });
    }
  },
  async findAll(req: Request, res: Response) {
    /**
     #swagger.tags = ['Category']
     */
    try {
      const result = await findAll("products");
      res.status(200).json({
        data: result,
        message: "Success get all category",
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({
        data: err.message,
        message: "Failed get all category",
      });
    }
  },
  async findOne(req: Request, res: Response) {
    /**
     #swagger.tags = ['Category']
     */
    try {
      const result = await findOne(req.params?.id, "products");
      res.status(200).json({
        data: result,
        message: "Success get one category",
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({
        data: err.message,
        message: "Failed get one category",
      });
    }
  },
  async update(req: Request, res: Response) {
    /**
     #swagger.tags = ['Category']
     #swagger.security = [{
      "bearerAuth": []
     }]
     */
    try {
      const result = await update(req.params?.id, req.body);

      res.status(200).json({
        data: result,
        message: "Success update category",
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({
        data: err.message,
        message: "Failed update category",
      });
    }
  },
  async delete(req: Request, res: Response) {
    /**
     #swagger.tags = ['Category']
     #swagger.security = [{
      "bearerAuth": []
     }]
     */
    try {
      const result = await remove(req.params?.id);

      res.status(200).json({
        data: result,
        message: "Success delete category",
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({
        data: err.message,
        message: "Failed delete category",
      });
    }
  },
};

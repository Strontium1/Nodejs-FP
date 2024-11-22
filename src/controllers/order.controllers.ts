import { Request, Response } from "express";
import { create, findAll, findOne, update, remove } from "../services/order.service"
import * as Yup from "yup";
import { SECRET } from "../utils/env";
import jwt from "jsonwebtoken";
import OrderModel from "../models/orders.model";

const dec_key = SECRET;

const categoryValidationSchema = Yup.object().shape({
    productId: Yup.string().required(),
    qty: Yup.number().required(),
    grandTotal: Yup.number().optional(),
    status: Yup.string().required()
});

export default {
  categoryValidationSchema,
  async create(req: Request, res: Response) {
    /**
     #swagger.tags = ['Orders']
     #swagger.security = [{
      "bearerAuth": []
     }]
     #swagger.requestBody = {
      required: true,
      schema: {
        $ref: "#/components/schemas/OrderCreate"
      }
     }
     */
    try {
      const { status } = req.body;
      if (!req.headers.authorization) {
        return res.status(401).json({ message: "Please login or register first."})
      }
      const jwtToken = req.headers.authorization.split(' ')[1];
      const decoded_token = jwt.verify(jwtToken, SECRET) as { id: string };
      if (!decoded_token.id) {
        return res.status(400).json({ data: decoded_token, message: 'Invalid token: missing userId' });
      }
      const order = new OrderModel({
        status,
        createdBy: decoded_token.id, // Assign userId directly
      });

      const result = await create(order);
      res.status(201).json({
        data: result,
        message: "Success create order",
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({
        data: err.message,
        message: "Failed create order",
      });
    }
  },
  async findAll(req: Request, res: Response) {
    /**
     #swagger.tags = ['Orders']
     */
    try {
      const result = await findAll("itemDetails");
      res.status(200).json({
        data: result,
        message: "Success get all orders",
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({
        data: err.message,
        message: "Failed get all orders",
      });
    }
  },
  async findOne(req: Request, res: Response) {
    /**
     #swagger.tags = ['Orders']
     */
    try {
      const result = await findOne(req.params?.id);
      res.status(200).json({
        data: result,
        message: `Success get order ${req.params.id}`,
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({
        data: err.message,
        message: `Failed get order ${req.params.id}`,
      });
    }
  },
  async update(req: Request, res: Response) {
    /**
     #swagger.tags = ['Orders']
     #swagger.security = [{
      "bearerAuth": []
     }]
     */
    try {
      const result = await update(req.params?.id, req.body);

      res.status(200).json({
        data: result,
        message: "Success update order",
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({
        data: err.message,
        message: `Failed update order ${req.params.id}`,
      });
    }
  },
  async delete(req: Request, res: Response) {
    /**
     #swagger.tags = ['Orders']
     #swagger.security = [{
      "bearerAuth": []
     }]
     */
    try {
      const result = await remove(req.params?.id);

      res.status(200).json({
        data: result,
        message: `Success delete order ${req.params.id}`,
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({
        data: err.message,
        message: `Failed delete order ${req.params.id}`,
      });
    }
  },
};

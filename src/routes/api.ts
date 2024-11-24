import express from "express";

import uploadMiddleware from "../middlewares/upload.middleware";
import uploadController from "../controllers/upload.controller";
import productsController from "../controllers/products.controller";
import categoryController from "../controllers/category.controller";
import orderControllers from "../controllers/order.controllers";
import authController from "../controllers/auth.controllers";
import authMiddleware from "../middlewares/auth.middleware";
import rbacMiddleware from "../middlewares/rbac.middleware";

const router = express.Router();

router.get("/products", productsController.findAll);
router.post("/products", [authMiddleware, rbacMiddleware(["admin"])], productsController.create);
router.get("/products/:id", productsController.findOne);
router.put("/products/:id", [authMiddleware, rbacMiddleware(["admin"])], productsController.update);
router.delete("/products/:id", [authMiddleware, rbacMiddleware(["admin"])], productsController.delete);

router.get("/category", categoryController.findAll);
router.post("/category", [authMiddleware, rbacMiddleware(["admin"])], categoryController.create);
router.get("/category/:id", categoryController.findOne);
router.put("/category/:id", [authMiddleware, rbacMiddleware(["admin"])], categoryController.update);
router.delete("/category/:id", [authMiddleware, rbacMiddleware(["admin"])], categoryController.delete);

router.get("/order", orderControllers.findAll);
router.post("/order", orderControllers.create);
router.get("/order/:id", orderControllers.findOne);
router.put("/order/:id", orderControllers.update);
// router.get("/order/:id/:itemID", orderControllers.findOneItem);
// router.put("/order/:id/:itemID", orderControllers.updateItem);
router.delete("/order/:id", orderControllers.delete);

router.post("/auth/login", authController.login);
router.post("/auth/register", authController.register);
router.post("/auth/me",authController.me);
router.put("/auth/update-profile", authMiddleware, authController.updateProfile);

router.post("/upload", uploadMiddleware.single, uploadController.single);
router.post("/uploads", uploadMiddleware.multiple, uploadController.multiple);

export default router;
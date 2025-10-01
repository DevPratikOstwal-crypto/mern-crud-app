import { Router } from "express";
import { body } from "express-validator";
import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  exportCSV,
} from "../controllers/userController.js";
import { upload } from "../middleware/upload.js";

const router = Router();

const validate = [
  body("firstName").trim().notEmpty().withMessage("First name required"),
  body("lastName").trim().notEmpty().withMessage("Last name required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("mobile")
    .matches(/^\d{10}$/)
    .withMessage("10-digit mobile required"),
  body("gender").isIn(["Male", "Female"]).withMessage("Gender required"),
  body("status").optional().isIn(["Active", "Inactive"]),
];

router.post("/", upload.single("profile"), validate, createUser);

router.get("/", getUsers);

router.get("/export", exportCSV);

router.get("/:id", getUser);

router.put("/:id", upload.single("profile"), validate, updateUser);

router.delete("/:id", deleteUser);

export default router;

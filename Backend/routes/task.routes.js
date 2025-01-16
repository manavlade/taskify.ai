import express from "express";
import { createTask, editTask } from "../Controller/task.controller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.route('/createTask').post(isAuthenticated, createTask);

router.route('/editTask').put(isAuthenticated, editTask);


export default router;

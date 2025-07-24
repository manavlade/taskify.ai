import express from "express";
import { createTask, EditTask, GetAllTask, GetTaskById, } from "../Controller/task.controller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.route('/createTask').post(isAuthenticated, createTask);

router.route('/editTask/:id').put(isAuthenticated, EditTask);

router.route('/getTask').get(isAuthenticated, GetAllTask);

router.route('/getTaskById/:id').get(isAuthenticated, GetTaskById);

// router.route('/delete/:id').delete(isAuthenticated, deleteTask)


export default router;

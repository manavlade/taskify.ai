import express from "express";
import { createTask, deleteTask, editTask, getFilteredAndSortedTasks } from "../Controller/task.controller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.route('/createTask').post(isAuthenticated, createTask);

router.route('/editTask').put(isAuthenticated, editTask);

router.route('/delete/:id').delete(isAuthenticated, deleteTask)

router.route('/filter-sort').get(isAuthenticated, getFilteredAndSortedTasks);

export default router;

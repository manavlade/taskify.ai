import express from "express";
import { getUserById, login, logout, register } from "../Controller/user.controller.js"
import isAuthenticated from "../middleware/isAuthenticated.js";
import { getDashboardData } from "../Controller/Dashboard.controller.js";

const router = express.Router();

router.route('/register').post(register);

router.route('/login').post(login);

router.route('/logout').get(logout);

router.route('/').get(isAuthenticated, getUserById);

router.route('/dashboard').get(isAuthenticated, getDashboardData);

export default router;

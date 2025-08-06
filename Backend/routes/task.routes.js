import express from "express";
import { createTask, EditTask, GetAllTask, GetTaskById, } from "../Controller/task.controller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { getSentimentAnalysis, GetSmartSearch, GetTaskAssistantReply } from "../Controller/openAIAPI.controller.js";
import { getGenAISmartSearch } from "../Controller/geminiAPI.controller.js";

const router = express.Router();

router.route('/createTask').post(isAuthenticated, createTask);

router.route('/editTask/:id').put(isAuthenticated, EditTask);

router.route('/getTask').get(isAuthenticated, GetAllTask);

router.route('/getTaskById/:id').get(isAuthenticated, GetTaskById);

router.route('/smart-suggestion').post(isAuthenticated, GetTaskAssistantReply);

router.route('/smart-search').post(isAuthenticated, getGenAISmartSearch);

router.route('/sentiment-analysis').post(isAuthenticated, getSentimentAnalysis);

// router.route('/delete/:id').delete(isAuthenticated, deleteTask)


export default router;

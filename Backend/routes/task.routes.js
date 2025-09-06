import express from "express";
import { createTask, EditTask, GetAllTask, GetTaskById, switchTaskStatus, } from "../Controller/task.controller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { getSentimentAnalysis } from "../Controller/openAIAPI.controller.js";
import { GetGenAIPineconeSemanticSearch, GetGenAISentimentAnalysis, GetGenAISmartAssistantReply } from "../Controller/geminiAPI.controller.js";

const router = express.Router();


router.route('/createTask').post(isAuthenticated, createTask);

router.route('/editTask/:id').put(isAuthenticated, EditTask);

router.route('/getTask').get(isAuthenticated, GetAllTask);

router.route('/getTaskById/:id').get(isAuthenticated, GetTaskById);

router.route('/smart-search').post(isAuthenticated, GetGenAIPineconeSemanticSearch);

router.route('/smart-assistant').post(isAuthenticated, GetGenAISmartAssistantReply);

router.route('/sentiment-analysis').get(isAuthenticated, GetGenAISentimentAnalysis);

router.route('/switch-task-status/:taskId').patch(isAuthenticated, switchTaskStatus);

export default router;
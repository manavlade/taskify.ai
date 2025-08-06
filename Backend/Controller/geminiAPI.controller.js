import { GoogleGenAI  } from "@google/genai"
import dotenv from "dotenv"
import { Task } from "../models/task.js";

dotenv.config();

const genAI = new GoogleGenAI({
    apiKey: `${process.env.GEMINI_API_KEY}`
})


function cosineSimilarity(vec1, vec2) {
    const dot = vec1.reduce((sum, v, i) => sum + v * vec2[i], 0);
    const mag1 = Math.sqrt(vec1.reduce((sum, v) => sum + v * v, 0));
    const mag2 = Math.sqrt(vec2.reduce((sum, v) => sum + v * v, 0));
    return dot / (mag1 * mag2);
}


//testing done as well
export const getGenAITaskEmbedding = async (texts) => {
    try {
        const response = await genAI.models.embedContent({
            model: 'gemini-embedding-001',
            contents: texts
        })

        return response.embeddings[0].values;
    } catch (error) {

        console.log(error);
        return error;

    }
}

// testing done as well
export const getGenAISmartSearch = async ( req, res) => {
    try {
        const {query} = req.body;

        if(!query){
            return res.status(400).json({
                message: "No query recieved",
                success: false,
            })
        }

        const queryEmbedding = await getGenAITaskEmbedding(query);

        const tasks = await Task.find({ created_by: req.id });

      const scored = tasks.map((task) => {
        const taskObj = task.toObject();
        const score = cosineSimilarity(taskObj.embedding, queryEmbedding);
        delete taskObj.embedding;
        return { ...taskObj, score };
      })

        .sort((a,b) => b.score - a.score)
        .slice(0, 5);


        return res.status(200).json({
            message: "Task assistant reply fetched successfully",
            success: true,
            scored
        })

    } catch (error) {
        return res.status(500).json({
            message: `${error}`,
            success: false,
        })
    }
}
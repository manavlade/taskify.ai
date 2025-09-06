import { GoogleGenAI } from "@google/genai"
import dotenv from "dotenv"
import { Task } from "../models/task.js";
import { Pinecone } from "@pinecone-database/pinecone";


dotenv.config();

const genAI = new GoogleGenAI({
    apiKey: `${process.env.GEMINI_API_KEY}`
})

const pinecone = new Pinecone({
    apiKey: `${process.env.PINECONE_API_KEY}`,
})

const indexName = process.env.PINECONE_INDEX_NAME;
const index = pinecone.Index(indexName);

const userChats = {};


export const getGenAITaskEmbedding = async (texts) => {
    try {
        const response = await genAI.models.embedContent({
            model: 'gemini-embedding-001',
            contents: texts,
            config: {
                outputDimensionality: 768,
            }
        })

        return response.embeddings[0].values;
    } catch (error) {

        console.log(error);
        return error;

    }
}


export const GetGenAIPineconeSemanticSearch = async (req, res) => {
    try {
        const { query } = req.body;

        if (!query) {
            return res.status(400).json({
                message: "No query recieved",
                success: false,
            })
        }

        const queryEmbedding = await getGenAITaskEmbedding(query);


        const response = await index.query({
            topK: 5,
            vector: queryEmbedding,
            includeValues: false,
            includeMetadata: true,
        })

        const scored = response.matches.map((match) => ({
            id: match.id,
            score: match.score,
            task: match.metadata,
        }));

        console.log(JSON.stringify(response, null, 2));


        return res.status(200).json({
            message: "Task assistant reply fetched successfully",
            success: true,
            scored,
        })

    } catch (error) {
        return res.status(500).json({
            message: `${error}`,
            success: false,
        })
    }
}

function cosineSimilarity(vec1, vec2) {
    const dot = vec1.reduce((sum, v, i) => sum + v * vec2[i], 0);
    const mag1 = Math.sqrt(vec1.reduce((sum, v) => sum + v * v, 0));
    const mag2 = Math.sqrt(vec2.reduce((sum, v) => sum + v * v, 0));
    return dot / (mag1 * mag2);
}


const queryPinecone = async (query) => {
    try {

        if (!query) {
            return res.status(400).json({
                message: "No query recieved",
                success: false,
            })
        }

        const queryEmbedding = await getGenAITaskEmbedding(query);

        const response = await index.query({
            topK: 5,
            vector: queryEmbedding,
            includeMetadata: true,
        })

        if (!response) {
            return res.status(400).json({
                message: "No response recieved from pinecone vector database",
                success: false,
            })
        }

        return response.matches.map((match) => ({
            id: match.id,
            score: match.score,
            ...match.metadata
        }));


    } catch (error) {
        return error;
    }
}


export const GetGenAISmartAssistantReply = async (req, res) => {
    try {

        const userId = req.id;
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                message: "No message recieved",
                success: false,
            })
        }


        if (!userChats[userId]) {
            userChats[userId] = genAI.chats.create({
                model: 'gemini-2.5-flash',
                history: [],
            })
        }

        const chat = userChats[userId];

        const pineconeResults = await queryPinecone(message);
        let contextText = "";

        if (pineconeResults?.length > 0) {
            contextText = pineconeResults
                .map((t) => `Task: ${t.name}, Description: ${t.description}, Priority: ${t.priority}, Status: ${t.status}, Comments: ${t.comments}, StartDate ${t.startDate}, EndDate ${t.endDate} \n`)
                .join("\n");
        }

        const response = await chat.sendMessage({
            message: contextText
                ? `${message}\n\nContext:\n${contextText}`
                : message,
        });

        if (!response) {
            return res.status(400).json({
                message: "No response recieved from gemini API",
                success: false,
            })
        }

        return res.status(200).json({
            message: "Smart assistant reply fetched successfully",
            success: true,
            data: response.text.trim()
        })

    } catch (error) {
        return res.status(500).json({
            message: `${error}`,
            success: false,
        })
    }
}


export const GetGenAISentimentAnalysis = async (req, res) => {

    try {
        const tasks = await Task.find({ created_by: req.id });

        if (!tasks || tasks.length === 0) {
            return res.status(404).json({
                message: "No tasks found",
                success: false,
            });
        }

        console.log(tasks);

        const formattedTasks = tasks
            .map((t, i) => `${i + 1}. ${t.comments} | Priority: ${t.priority} | Status: ${t.status}`)
            .join("\n");

        const messages = [
            {
                role: "system",
                content: `You are an AI assistant named ZapTask. 
              Perform a deep sentiment analysis on the provided tasks. 
              Instructions:
              1. Identify all emotions (not just positive/negative/neutral).
              2. Include joy, sadness, anger, fear, surprise, disgust, anticipation, trust, and any other relevant emotions.
              3. For each emotion, calculate its percentage of the overall dataset.
              4. Return output ONLY in JSON array format:
              [
                { "emotion": "<emotion_name>", "percentage": <number> },
                ...
              ]`,
            },
            {
                role: "user",
                content: `Here are my tasks:\n${formattedTasks}`,
            },
        ];


        const response = await genAI.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: messages,
            config: {
                systemInstruction: "You are a helpful AI assistant for task management that answers questions about tasks as you have access to what tasks the user has created. Your name is ZapTask"
            }
        })

        const aiText =
            response?.response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
            "No analysis generated";

        let sentimentData;
        try {
            sentimentData = JSON.parse(aiText);
        } catch (e) {
            sentimentData = aiText;
        }

        return res.status(200).json({
            message: "Task sentiment analysis fetched successfully",
            success: true,
            data: sentimentData
        })

    } catch (error) {
        return res.status(500).json({
            message: `${error}`,
            success: false,
        })
    }
}


export const getGenAIDuplicateTaskDetection = async (descriptionEmbedding, req) => {
    try {

        const tasks = await Task.find({ created_by: req.id })

        for (const task of tasks) {
            const similarity = cosineSimilarity(descriptionEmbedding, task.embedding);
            if (similarity > 0.8) {
                return true;
            }
        }
        return false;

    } catch (error) {
        console.log(error);
        return error;
    }

}


// testing done as well but using mongoDB
// export const getGenAISmartSearch = async (req, res) => {
//     try {
//         const { query } = req.body;

//         if (!query) {
//             return res.status(400).json({
//                 message: "No query recieved",
//                 success: false,
//             })
//         }

//         const queryEmbedding = await getGenAITaskEmbedding(query);

//         const tasks = await Task.find({ created_by: req.id });

//         const scored = tasks.map((task) => {
//             const taskObj = task.toObject();
//             const score = cosineSimilarity(taskObj.embedding, queryEmbedding);
//             delete taskObj.embedding;
//             return { ...taskObj, score };
//         })

//             .sort((a, b) => b.score - a.score)
//             .slice(0, 5);


//         return res.status(200).json({
//             message: "Task assistant reply fetched successfully",
//             success: true,
//             scored
//         })

//     } catch (error) {
//         return res.status(500).json({
//             message: `${error}`,
//             success: false,
//         })
//     }
// }
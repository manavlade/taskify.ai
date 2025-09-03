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


//testing done working well
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

// tested working semantic search as well 
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

export const getGenAISuggestions = async (tasks, query) => {
    try {

        const queryEmbedding = await getGenAITaskEmbedding(query);

        const scoredTask = tasks.map(task => ({
            ...task,
            score: cosineSimilarity(task.embedding, queryEmbedding)
        }))

        const topTasks = scoredTask.sort((a, b) => b.score - a.score).slice(0, 5);

        const formattedTask = topTasks.map(
            (t, i) => `${i + 1}. ${t.name} ${t.priority} ${t.status} ${t.endDate} ${t.actualTime} ${t.completed}`
        )

        const messages = [
            {
                role: "system",
                content: "You are a helpful AI assistant for task management.."
            },
            {
                role: "user",
                content: `Here are my tasks:\n${formattedTask}\n\n${query}`
            },
        ]

        const response = await genAI.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: messages,
            config: {
                systemInstruction: "You are a helpful AI assistant for task management that answers questions about tasks as you have access to what tasks the user has created. Your name is ZapTask"
            }
        })

        return response.text.trim();
    } catch (error) {
        console.log(error);
        return error;
    }
}

export const getGenAIAssistantReply = async (req, res) => {
    try {

        const { query } = req.body;

        if (!query) {
            return res.status(400).json({
                message: "No query recieved",
                success: false,
            })
        }

        const tasks = await Task.find({ created_by: req.id });

        const response = await getGenAISuggestions(tasks, query);

        return res.status(200).json({
            message: "Task assistant reply fetched successfully",
            success: true,
            response
        })
    } catch (error) {
        return res.status(500).json({
            message: `${error}`,
            success: false,
        })
    }
}


export const getGenAISentimentAnalysis = async (req, res) => {

    try {
        const tasks = await Task.findById(req.id);

        const formtattedTasks = tasks.map(
            (t, i) => `${i + 1}. ${t.comments} ${t.priority} ${t.status}`
        )

        const messages = [
            {
                role: "system",
                content: JSON.stringify({
                    task: "Perform sentiment analysis on the provided dataset.",
                    instructions: {
                        1: "Analyze the text data and identify all relevant emotions expressed within it.",
                        2: "Do not limit the emotions to positive, negative, or neutral; include a comprehensive range of emotions such as joy, sadness, anger, fear, surprise, disgust, anticipation, trust, and any other applicable sentiments.",
                        3: "For each identified emotion, calculate the percentage of the overall text that conveys that sentiment.",
                        4: "Structure the output in a JSON format with the following structure: {emotion: <emotion_name>, percentage: <percentage_value>}",
                        5: "Ensure the analysis reflects the nuanced sentiment conveyed in the text, capturing subtle variations in emotional expression."
                    },
                    output_format: "Return the results as an array of JSON objects, each containing an emotion and its corresponding percentage."
                })
            },
            {
                role: "user",
                content: `Here are my tasks:\n${formtattedTasks}`
            }
        ]

        const response = await genAI.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: messages,
            config: {
                systemInstruction: "You are a helpful AI assistant for task management that answers questions about tasks as you have access to what tasks the user has created. Your name is ZapTask"
            }
        })

        return res.status(200).json({
            message: "Task sentiment analysis fetched successfully",
            success: true,
            // data: response
            data: response.text.trim()
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


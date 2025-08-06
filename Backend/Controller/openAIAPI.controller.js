import OpenAI from "openai";
import dotenv from "dotenv"
import { Task } from "../models/task.js";

dotenv.config();

const openai = new OpenAI({
    apiKey: `${process.env.OPENAI_API_KEY}`
})


export const GetSmartSuggestions = async (tasks, query) => {

    try {
        const formattedTasks = tasks.map((t, i) => `${i + 1}. ${t.name} ${t.priority} ${t.status} ${t.endDate}`)

        const messages = [
            {
                role: "system",
                content: "You are a helpful AI assistant for task management.."
            },
            {
                role: "user",
                content: `Here are my tasks:\n${formattedTasks}\n\n${query}`
            },
        ]

        const resposne = await openai.chat.completions.create({
            model: 'gpt-4.1-mini',
            messages,
        })

        return resposne.choices[0].message.content.trim();

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false,
        })
    }
}

export const getTaskEmbedding = async (texts) => {

    const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: texts
    })

    return response.data[0].embedding;

}

export const GetTaskAssistantReply = async (req, res) => {

    try {
        const { tasks, query } = req.body;

        if (!tasks || !query) {
            return res.status(400).json({
                message: "Insufficient data",
                success: false,
            })
        }

        const resposne = await GetSmartSuggestions(tasks, query);

        if (!resposne) {
            return res.status(400).json({
                message: "Task assistant reply not fetched",
                success: false,
            })
        }

        return res.status(200).json({
            message: "Task assistant reply fetched successfully",
            success: true,
            resposne,
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
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

export const GetSmartSearch = async (req, res) => {
    try {

        const query = req.body;

        if(!query){
            return res.status(400).json({
                message: "No query recieved",
                success: false,
            })
        }

        const queryEmbedding = await getTaskEmbedding(query);

        const tasks = await Task.find({ created_by: req.id });

        const scored = tasks.map((task) => ({
            ...task.toObject(),
            score: cosineSimilarity(task.embedding, queryEmbedding)
        }))

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


export const getSentimentAnalysis = async (req, res) => {
    try {
        const tasks = await Task.find({ created_by: req.id });

        const allComments = tasks.map((task) => task.comments).join("\n");

        const messages = [
            {
              role: "system",
              content: "You are a helpful assistant that performs detailed sentiment analysis on user task comments. For each emotion, give a percentage between 0-100 (all values must sum to 100)."
            },

            {
              role: "user",
              content: `Analyze the emotional content of the following task comments and return the result as a JSON object with percentages for: joy, sadness, anger, fear, surprise, love, neutral.\n\n${allComments}`
            }

          ];

          const resposne = await openai.chat.completions.create({
            model: 'gpt-4.1-mini',
            messages,
            temperature: 0.3
          })

          if(!resposne.ok){
            return res.status(400).json({
                message: "Sentiment analysis not fetched",
                success: false,
            })
          }

          const sentimentJSON = JSON.parse(resposne.choices[0].message.content.trim())

          return res.status(200).json({
            message: "Sentiment analysis fetched successfully",
            success: true,
            sentimentJSON,
          })

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false,
        })
    }
} 
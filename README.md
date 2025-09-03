# 🧠 Taskify.ai – AI Powered Task Manager  

Taskify.ai is a **next-gen Task Management App** 🚀 that goes beyond to-do lists.  
With **AI Assistants, Smart Search, Duplicate Detection, and Sentiment Analysis**, you’ll never lose track of your tasks again.  

Powered by **Gemini API + Pinecone + LangChain**, Taskify.ai makes your productivity *smarter, faster, and GenZ-friendly*.  

---

## ✨ Features  

✅ **AI Assistant (Taskify.ai)** – Ask anything about your tasks in natural language.  
✅ **Smart Search** – Semantic search using Pinecone & embeddings.  
✅ **Duplicate Detection** – Prevents creating tasks with similar descriptions.  
✅ **Sentiment Analysis** – Understand the mood behind your task notes & comments.  
✅ **Task Status Toggle** – Instantly mark tasks as *complete/incomplete*.  
✅ **Priority + Deadlines** – Sort, filter, and analyze tasks by priority and due dates.  

---

## 🛠️ Tech Stack  

- **Frontend**: Next.js + TypeScript + Tailwind + Shadcn UI  
- **Backend**: Node.js + Express + MongoDB  
- **AI Models**: Google Gemini API (embeddings, LLMs)  
- **Vector Database**: Pinecone (semantic search & retrieval)  
- **Orchestration**: LangChain  

---

## 🚀 How It Works  

1. **Task Creation**  
   - When a task is created, its description is converted into **embeddings** using Gemini.  
   - Stored in **MongoDB** (for metadata) & **Pinecone** (for semantic search).  

2. **Smart Search**  
   - Query → Embedding → Pinecone → Similar tasks retrieved.  
   - AI ranks & explains the results.  

3. **AI Assistant**  
   - Taskify.ai (built on LangChain + Gemini) answers your task-related queries.  
   - Example:  
     ```
     User: What tasks are due this week with high priority?
     Taskify.ai: You have 2 tasks due this week – “Design Landing Page” (High Priority) and “API Testing” (Medium Priority).
     ```

4. **Duplicate Task Detection**  
   - New task embeddings compared with existing embeddings in Pinecone.  
   - If similarity > threshold → Mark as duplicate.  

5. **Sentiment Analysis**  
   - AI scans task comments & notes.  
   - Returns emotion breakdown (joy, stress, urgency, etc.).  

---

## 📦 Installation  

```bash
# Clone repo
git clone https://github.com/your-username/taskifyai.git
cd taskifyai

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Run backend
npm run dev
```

<!-- ---

## ⚡ API Endpoints  

- `POST /task/create` → Create new task  
- `PUT /task/:id/switch-status` → Toggle task completion  
- `POST /task/assistant` → Get AI Assistant reply  
- `POST /task/search` → Smart semantic search  
- `POST /task/sentiment` → Run sentiment analysis  
- `POST /task/duplicate-check` → Detect duplicate task  
- `POST /task/assistant` → Get Taskify.ai reply

--- -->

## 🌟 Why Taskify.ai?  

Because task managers are boring 😴.  
Taskify.ai makes it **AI-first, GenZ-friendly, and super smart** 💡.  

---

## 🔮 Future Enhancements  

- 📊 **Task Analytics Dashboard** – Visual insights into productivity  
- 🤖 **Role-based AI Assistants** – Different AI for Managers, Employees & Clients  
- 🔔 **Smart Reminders** – AI-driven alerts before deadlines  
- 📱 **Mobile App** – Full cross-platform support  

---

## 🧑‍💻 Author  

👨‍💻 Built with ❤️ by **Mr Manav Shailendra Lade**  
🔗 [LinkedIn](https://www.linkedin.com/in/manav-lade/) | [GitHub](https://github.com/manavlade)  

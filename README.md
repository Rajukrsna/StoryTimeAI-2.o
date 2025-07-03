# 📚 Storytime AI

Storytime AI is a collaborative, AI-powered storytelling platform where creativity meets community. With AI-generated chapters, collaborative writing, and intelligent story navigation using semantic search, Storytime AI enables users to co-author immersive narratives in a fun, gamified environment.

![Storytime AI Banner](https://i.ibb.co/35b8P22F/story.png)
---

## 🚀 Features

- ✍️ **Start Your Story:** Provide a title, image, and chapter summary — AI helps generate Chapter 1.
- 👥 **Collaborate Seamlessly:** Other users can contribute new chapters after reading the previous ones.
- 🤖 **AI-Powered PlotBot:** Ask contextual questions (e.g., "Who is the protagonist?") using vector search + RAG.
- 🔄 **Review Workflow:** Original authors approve or reject chapter submissions.
- 🏆 **Contribution Leaderboard:** Contributors earn points for accepted chapters and top the leaderboard.
- 📈 **Serverless APIs:** Certain routes (like profile and gallery) run on AWS Lambda for scalability.

---

## 🏗️ Tech Stack

| Layer        | Technology                     |
|--------------|--------------------------------|
| Frontend     | Next.js + TypeScript           |
| Backend      | Express.js + Node.js           |
| Serverless   | AWS Lambda (for some routes)   |
| Database     | MongoDB Atlas (with vector search) |
| AI Engine    | Gemini API (for story generation + RAG) |

---

## 📦 Architecture

![Architecture Diagram](https://i.ibb.co/zWC45Nh5/Whats-App-Image-2025-07-01-at-6-32-14-PM.jpg)

- **MongoDB Vector Search** powers chapter-level embeddings for semantic Q&A.
- **Gemini AI + RAG** helps generate content and answer contextual questions via PlotBot.
- **Lambda functions** support fast, stateless data fetches for user profile and story galleries.

---

## 🧪 Setup Instructions

### 1. Clone the Repository and run the Frontend
```bash
git clone https://github.com/Rajukrsna/StoryTimeAI-2.o.git
cd StoryTime-Frontend
npm install
npm run dev
```

### 2. Run the Backend
```bash
cd story_backend
npm install
npx nodemon server.js
```
### 3. Create and Populate the dotenv file

## 🔐 Environment Variables

Create a `.env` file in the backend folder and add the following:

```env
MONGODB_URI=<Your MongoDB URI>
GEMINI_API_KEY=<Your Gemini API Key>
JWT_SECRET=<Secret for Authentication>
FRONTEND_URL=http://localhost:3000
```

## 👥 Contributors

Thanks to these amazing people for making Storytime AI possible:

- [https://github.com/rishimooooo](https://github.com/yourgithubhandle) – 🧠 Idea, 💻 Code, 🎨 Design
- [https://github.com/Rajukrsna](https://github.com/teammate1) – 📦 Backend, ☁️ Serverless
- [@teammate2](https://github.com/teammate2) – 🖌️ UI/UX, Frontend

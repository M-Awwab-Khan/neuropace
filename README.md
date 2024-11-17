# 🌟 Neuropace: Spaced Repetition-Based Memorization System

**Neuropace** is a powerful and user-friendly spaced repetition system designed to help users optimize their learning and retention. By leveraging the scientifically proven SM2 algorithm, Neuropace makes memorization both effective and engaging.

---

## 🚀 Features

### ✨ Core Functionality
- **User Profile Management and Authentication**: Secure and seamless user authentication system to manage profiles.
- **Deck Management**: Create, read, update, and delete (CRUD) decks for personalized learning.
- **Flashcard Management**:
  - Create, update, and delete flashcards with smooth flipping animations.
  - Bulk flashcard creation from JSON or CSV files.
- **Spaced Repetition Algorithm**:
  - Integrated SM2 algorithm for intelligent scheduling of flashcards.
  - Uses a **Priority Queue** and **Dynamic Array** for efficient flashcard reviewing.

### 💡 User-Friendly Features
- **Drag and Drop Flashcard Upload**: Easy bulk creation of flashcards using `dropzone-react`.
- **Responsive UI**: Beautifully designed interface built with **Tailwind CSS** and **Shadcn UI components**.
- **Error Handling**: Strong type validation using **Typescript** and **Zod**.

---

## 🛠️ Technologies Used

| **Technology**      | **Purpose**                                     |
|----------------------|-------------------------------------------------|
| **Next.js (App Router)** | Frontend framework for a seamless user experience. |
| **Tailwind CSS**     | For modern and responsive UI design.           |
| **Shadcn Components**| Accessible and customizable UI elements.       |
| **Dropzone-React**   | Drag-and-drop functionality for bulk uploads.  |
| **Vercel Postgres**  | Backend database for reliable data storage.    |
| **TypeScript**       | Strongly typed language for safer development. |
| **Zod**              | Schema-based type validation for robust inputs.|

---

## 📸 Screenshots

![Hero Section](https://github.com/user-attachments/assets/694cd335-c7d4-4e45-948f-29a8f0a29f01)
*Landing Page*

![image](https://github.com/user-attachments/assets/8ab803fe-2319-4243-8230-349f98b57a96)
*Decks interface.*

![image](https://github.com/user-attachments/assets/e2b03138-d906-4156-9f7d-ff4670a4bc5a)
*Flashcards interface*

![image](https://github.com/user-attachments/assets/edf14c6c-a73f-4add-a360-f44c31f51559)
*Flashcards reviewing interface*

---

## 📦 Installation and Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/neuropace.git
   cd neuropace
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add the following variables:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
   CLERK_SECRET_KEY=
   POSTGRES_URL=
   POSTGRES_PRISMA_URL=
   POSTGRES_URL_NO_SSL=
   POSTGRES_URL_NON_POOLING=
   POSTGRES_USER=
   POSTGRES_HOST=
   POSTGRES_PASSWORD=
   POSTGRES_DATABASE=
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Access the app:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔮 Future Enhancements

- **AI-powered suggestions** for creating flashcards.
- Enhanced analytics to track user progress and performance.
- Collaboration features for shared decks and study groups.

---

## 💬 Contributing

Contributions are welcome! If you have suggestions or improvements, please:
- Fork the repository.
- Create a new branch: `git checkout -b feature-name`.
- Submit a pull request with your changes.

---

## 📝 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙌 Acknowledgments

- The concept of **spaced repetition** and the **SM2 algorithm** for guiding Neuropace’s design.
- Amazing open-source libraries and tools that made this project possible.

---

## 📧 Contact

For inquiries or feedback, feel free to reach out at **mawwabkhank2006@gmail.com** or visit [GitHub Profile](https://github.com/M-Awwab-Khan).

---

Crafted with ❤️ by [Muhammad Awwab Khan](https://github.com/M-Awwab-Khan)  [Muhammad Talha](https://github.com/MuhammadTalha57) [Syed Muhammad Rayyan](https://github.com/Rayyan52)🌟

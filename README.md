# Collaborative Drawing App

This is a real-time collaborative whiteboard application built with Next.js and TypeScript. It provides a feature-rich canvas for users to draw, sketch, and collaborate on ideas using various tools and shapes. The application uses `rough.js` to give the drawings a hand-drawn, sketchy appearance.

**<img width="1780" height="1001" alt="image" src="https://github.com/user-attachments/assets/b258dfcb-11ae-4b9d-b3f0-46d932655d58" />**

## Features

* **🎨 Multiple Drawing Tools:** Includes a variety of tools like Pen, Rectangle, Ellipse, Line, Arrow, Diamond, and Text.
* **👆 Selection & Transformation:** A selection tool to move and resize single or multiple objects on the canvas.
* **🧼 Eraser:** Easily erase parts of the drawing.
* **🖐️ Pan & Zoom:** Navigate the infinite canvas with pan and zoom functionalities.
* **↩️ Undo/Redo:** A complete history stack for undoing and redoing actions.
* **⚙️ Customizable Properties:**
    * **Shapes:** Adjust stroke color, background color, stroke width, style (solid, dashed, dotted), and roughness.
    * **Text:** Customize font family, size, and alignment.
* **🌓 Dark/Light Mode:** A theme toggle for user preference.

## Tech Stack

* **Framework:** [Next.js](https://nextjs.org/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Drawing Library:** [Rough.js](https://roughjs.com/)
* **Database ORM:** [Prisma](https://www.prisma.io/)
* **Database:** [PostgreSQL](https://www.postgresql.org/)
* **UI Components:** [shadcn/ui](https://ui.shadcn.com/)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* [Node.js](https://nodejs.org/) (version 18 or higher recommended)
* [Bun](https://bun.sh/) (or your preferred package manager like npm/yarn)
* [Docker](https://www.docker.com/) (for running the local database)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/draw_app.git](https://github.com/your-username/draw_app.git)
    cd draw_app
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project by copying the example file:
    ```bash
    cp .env.example .env
    ```
    The `DATABASE_URL` is already configured for the local Docker setup.

4.  **Start the local database:**
    Run the provided script to start a PostgreSQL container using Docker.
    ```bash
    ./start-database.sh
    ```

5.  **Push the database schema:**
    Apply the database schema to your local database using Prisma.
    ```bash
    bunx prisma db push
    ```

6.  **Run the development server:**
    ```bash
    bun run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

import express from "express";
import dotenv from "dotenv";
import { gadgetRouter } from "./routes/gadgetRoutes.js";
import swaggerUi from "swagger-ui-express";
import { readFileSync } from "fs";

const swaggerDocument = JSON.parse(
  readFileSync(new URL("./swagger.json", import.meta.url))
);

dotenv.config();

const app = express();

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Phoenix API</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-900 text-white flex flex-col items-center justify-center min-h-screen p-6">
        <div class="max-w-3xl text-center">
            <h1 class="text-4xl font-bold text-green-500">Phoenix: IMF Gadget API</h1>
            <p class="mt-4 text-lg">An API to manage IMF gadgets with authentication and self-destruct features.</p>
            <div class="mt-6 space-y-2">
                <a href="${process.env.API_DOC_LINK}" class="text-blue-400 hover:underline text-lg">
                    🔗 API Documentation (Swagger)
                </a>
                <a href="https://github.com/Athul28/phoenix-api" class="block text-blue-400 hover:underline text-lg">
                    💻 GitHub Repository
                </a>
            </div>
            <h2 class="mt-6 text-2xl font-semibold">Features:</h2>
            <ul class="mt-2 text-lg space-y-1 text-gray-300">
                <li>✅ CRUD operations for gadgets</li>
                <li>🔐 JWT-based authentication</li>
                <li>💣 Self-destruct sequence</li>
                <li>🚀 Deployed on Render</li>
            </ul>
            <h2 class="mt-6 text-xl font-semibold">Your JWT Token:</h2>
            <textarea id="jwtToken" class="mt-2 p-2 h-28 w-full bg-gray-800 text-green-400 text-sm border border-gray-700 rounded" readonly>
                ${process.env.JWT_TOKEN}
            </textarea>
            <button class="mt-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition" onclick="copyToken()">
                📋 Copy Token
            </button>
            <p class="mt-6 text-gray-500 text-sm">
                This token will self-destruct in 5 seconds... Just kidding!
            </p>
        </div>
        <script>
            function copyToken() {
                const tokenTextarea = document.getElementById("jwtToken");
                const token = tokenTextarea.value.trim();  // Trim spaces & newlines
                navigator.clipboard.writeText(token)
                    .then(() => alert("JWT Token copied to clipboard"))
                    .catch(err => console.error("Failed to copy: ", err));
            }
        </script>
    </body>
    </html>
  `);
});

app.use(express.json());
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/gadgets", gadgetRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3001;

  // Middleware to parse JSON bodies
  app.use(express.json());

  // Serve posts folder statically
  app.use('/posts', express.static(path.join(process.cwd(), 'public', 'posts')));

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/posts", (req, res) => {
    const postsDir = path.join(process.cwd(), "public", "posts");
    if (!fs.existsSync(postsDir)) {
      return res.json([]);
    }
    
    try {
      const files = fs.readdirSync(postsDir);
      const mdFiles = files.filter(f => f.endsWith(".md"));
      
      const posts = mdFiles.map(filename => {
        const filePath = path.join(postsDir, filename);
        const stat = fs.statSync(filePath);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        
        let title = filename.replace(".md", "");
        let date = stat.mtime.toLocaleDateString("ru-RU", { day: 'numeric', month: 'long', year: 'numeric' });
        let author = "Александр";
        let content = fileContent;

        const frontmatterMatch = fileContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
        if (frontmatterMatch) {
          const yaml = frontmatterMatch[1];
          content = frontmatterMatch[2];
          const nameMatch = yaml.match(/^name:\s*(.*)$/m);
          if (nameMatch) title = nameMatch[1].replace(/['"]/g, '').trim();
          const dateMatch = yaml.match(/^date:\s*(.*)$/m);
          if (dateMatch) date = dateMatch[1].replace(/['"]/g, '').trim();
          const authorMatch = yaml.match(/^author:\s*(.*)$/m);
          if (authorMatch && authorMatch[1].trim()) author = authorMatch[1].replace(/['"]/g, '').trim();
        }

        const id = encodeURIComponent(filename.replace(".md", ""));
        const possibleImages = [".jpg", ".jpeg", ".png", ".webp"];
        let image = "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&q=80&w=1000";
        const baseName = filename.replace(".md", "");
        for (const ext of possibleImages) {
          if (files.includes(baseName + ext)) {
            image = `./posts/${encodeURIComponent(baseName + ext)}`;
            break;
          }
        }

        const excerpt = content.split("\n")
          .filter(line => line.trim().length > 0 && !line.startsWith("#"))
          .slice(0, 3)
          .join(" ")
          .substring(0, 150) + "...";

        return { id, title, excerpt, image, category: "Советы", date, author, metaDescription: excerpt };
      });
      res.json(posts);
    } catch (err) {
      res.status(500).json({ error: "Failed to read posts" });
    }
  });

  app.get("/api/posts/:id", (req, res) => {
    const filename = decodeURIComponent(req.params.id);
    const postsDir = path.join(process.cwd(), "public", "posts");
    const filePath = path.join(postsDir, `${filename}.md`);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Post not found" });
    }

    try {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const stat = fs.statSync(filePath);
      const files = fs.readdirSync(postsDir);
      
      let title = filename;
      let date = stat.mtime.toLocaleDateString("ru-RU", { day: 'numeric', month: 'long', year: 'numeric' });
      let author = "Александр";
      let content = fileContent;

      const frontmatterMatch = fileContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
      if (frontmatterMatch) {
        const yaml = frontmatterMatch[1];
        content = frontmatterMatch[2];
        const nameMatch = yaml.match(/^name:\s*(.*)$/m);
        if (nameMatch) title = nameMatch[1].replace(/['"]/g, '').trim();
        const dateMatch = yaml.match(/^date:\s*(.*)$/m);
        if (dateMatch) date = dateMatch[1].replace(/['"]/g, '').trim();
        const authorMatch = yaml.match(/^author:\s*(.*)$/m);
        if (authorMatch && authorMatch[1].trim()) author = authorMatch[1].replace(/['"]/g, '').trim();
      }

      const possibleImages = [".jpg", ".jpeg", ".png", ".webp"];
      let image = "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&q=80&w=1000";
      for (const ext of possibleImages) {
        if (files.includes(filename + ext)) {
          image = `./posts/${encodeURIComponent(filename + ext)}`;
          break;
        }
      }

      res.json({ id: req.params.id, title, content, image, category: "Советы", date, author, metaDescription: title });
    } catch (err) {
      res.status(500).json({ error: "Failed to read post" });
    }
  });

  // Универсальная функция для отправки в Telegram
  const sendToTelegram = async (message: string) => {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
      console.warn("TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing in .env");
      return false;
    }

    try {
      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: 'HTML'
        }),
      });
      
      if (!response.ok) {
        const errData = await response.json();
        console.error("Telegram API error:", errData);
        return false;
      }
      return true;
    } catch (err) {
      console.error("Telegram sending error:", err);
      return false;
    }
  };

  // Универсальный эндпоинт для заявок
  app.post("/api/lead", async (req, res) => {
    const { type, name, phone, address, details } = req.body;

    if (!phone) {
      return res.status(400).json({ error: "Phone is required" });
    }

    let message = "";
    if (type === "callback") {
      message = `
<b>📞 Заказ звонка!</b>

👤 <b>Имя:</b> ${name || "Не указано"}
📱 <b>Телефон:</b> ${phone}
      `.trim();
    } else if (type === "contact") {
      message = `
<b>📩 Новая заявка (Контакты)</b>

👤 <b>Имя:</b> ${name || "Не указано"}
📱 <b>Телефон:</b> ${phone}
🏠 <b>Адрес/ЖК:</b> ${address || "Не указано"}
      `.trim();
    } else if (type === "calculator") {
      message = `
<b>🚀 Новая заявка из калькулятора!</b>

📱 <b>Телефон:</b> ${phone}
🏠 <b>Тип:</b> ${details?.buildingType || "—"}
🛠 <b>Ремонт:</b> ${details?.repairType || "—"}
📐 <b>Площадь:</b> ${details?.area || "—"} м²
🚽 <b>Санузлов:</b> ${details?.bathrooms || "—"}
🧱 <b>Замена стяжки:</b> ${details?.replaceScreed || "—"}

💰 <b>Предварительная смета:</b> ${details?.totalEstimated || "—"}
      `.trim();
    } else {
      message = `
<b>🆕 Новая заявка!</b>
<code>${JSON.stringify(req.body, null, 2)}</code>
      `.trim();
    }

    const success = await sendToTelegram(message);
    if (success) {
      res.json({ success: true });
    } else {
      res.status(500).json({ error: "Failed to send message to Telegram" });
    }
  });

  // Обработка заявок из калькулятора (сохраняем для обратной совместимости или редиректим)
  app.post("/api/calculator-lead", async (req, res) => {
    const { phone, details } = req.body;
    
    const message = `
🚀 *Новая заявка из калькулятора!*

📱 *Телефон:* ${phone}
🏠 *Тип:* ${details.buildingType}
🛠 *Ремонт:* ${details.repairType}
📐 *Площадь:* ${details.area} м²
🚽 *Санузлов:* ${details.bathrooms}
🧱 *Замена стяжки:* ${details.replaceScreed}

💰 *Предварительная смета:* ${details.totalEstimated}
    `.trim();

    const success = await sendToTelegram(message);
    if (success) {
      res.json({ success: true });
    } else {
      res.status(500).json({ error: "Failed to send message to Telegram" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

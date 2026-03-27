import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";

async function startServer() {
  const app = express();
  const PORT = 3001;

  // Serve posts folder statically
  app.use('/posts', express.static(path.join(process.cwd(), 'public', 'posts')));

  // API routes FIRST
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
        
        // Simple frontmatter parsing
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
        
        // Find matching image
        const possibleImages = [".jpg", ".jpeg", ".png", ".webp"];
        let image = "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&q=80&w=1000";
        const baseName = filename.replace(".md", "");
        for (const ext of possibleImages) {
          if (files.includes(baseName + ext)) {
            image = `/posts/public/${encodeURIComponent(baseName + ext)}`;
            break;
          }
        }

        const excerpt = content.split("\n")
          .filter(line => line.trim().length > 0 && !line.startsWith("#"))
          .slice(0, 3)
          .join(" ")
          .substring(0, 150) + "...";

        return {
          id,
          title,
          excerpt,
          image,
          category: "Советы",
          date,
          author,
          metaDescription: excerpt
        };
      });
      res.json(posts);
    } catch (err) {
      console.error(err);
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

      // Find matching image
      const possibleImages = [".jpg", ".jpeg", ".png", ".webp"];
      let image = "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&q=80&w=1000";
      for (const ext of possibleImages) {
        if (files.includes(filename + ext)) {
          image = `./posts/${encodeURIComponent(filename + ext)}`;
          break;
        }
      }

      res.json({
        id: req.params.id,
        title,
        content,
        image,
        category: "Советы",
        date,
        author,
        metaDescription: title
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to read post" });
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

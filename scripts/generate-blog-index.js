import fs from 'fs';
import path from 'path';

const postsDir = path.join(process.cwd(), 'posts', 'public');
const outputDir = path.join(process.cwd(), 'public');
const outputFile = path.join(outputDir, 'blog-index.json');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

if (!fs.existsSync(postsDir)) {
  console.log('Posts directory not found, creating empty index.');
  fs.writeFileSync(outputFile, JSON.stringify([]));
  process.exit(0);
}

try {
  const files = fs.readdirSync(postsDir);
  const mdFiles = files.filter(f => f.endsWith('.md'));

  const posts = mdFiles.map(filename => {
    const filePath = path.join(postsDir, filename);
    const stat = fs.statSync(filePath);
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // Simple frontmatter parsing
    let title = filename.replace('.md', '');
    let date = stat.mtime.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
    let author = 'Александр';
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

    const id = encodeURIComponent(filename.replace('.md', ''));

    // Find matching image
    const possibleImages = ['.jpg', '.jpeg', '.png', '.webp'];
    let image = 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&q=80&w=1000';
    const baseName = filename.replace('.md', '');
    for (const ext of possibleImages) {
      if (files.includes(baseName + ext)) {
        image = `./posts/public/${encodeURIComponent(baseName + ext)}`;
        break;
      }
    }

    const excerpt = content.split('\n')
      .filter(line => line.trim().length > 0 && !line.startsWith('#'))
      .slice(0, 3)
      .join(' ')
      .substring(0, 150) + '...';

    return {
      id,
      title,
      excerpt,
      image,
      category: 'Советы',
      date,
      author,
      metaDescription: excerpt
    };
  });

  fs.writeFileSync(outputFile, JSON.stringify(posts, null, 2));
  console.log(`Successfully generated blog index with ${posts.length} articles.`);
} catch (err) {
  console.error('Failed to generate blog index:', err);
  process.exit(1);
}

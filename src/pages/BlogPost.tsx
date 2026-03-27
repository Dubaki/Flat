import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams, Navigate } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Loader2 } from 'lucide-react';

interface BlogPostData {
  id: string;
  title: string;
  content: string;
  image: string;
  category: string;
  date: string;
  author: string;
  metaDescription: string;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      try {
        // 1. Fetch metadata from index
        const indexResponse = await fetch('./blog-index.json');
        if (!indexResponse.ok) throw new Error('Failed to load blog index');
        const indexData = await indexResponse.json();
        const meta = indexData.find((p: any) => p.id === slug);
        
        if (!meta) throw new Error('Post not found');

        // 2. Fetch the actual markdown content
        const contentResponse = await fetch(`./posts/${decodeURIComponent(slug)}.md`);
        if (!contentResponse.ok) throw new Error('Failed to load post content');
        const rawContent = await contentResponse.text();

        // 3. Strip frontmatter
        let content = rawContent;
        if (rawContent.startsWith('---')) {
          const parts = rawContent.split(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);
          if (parts.length > 1) content = parts[1];
        }

        setPost({
          ...meta,
          content
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-24 min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-accent animate-spin mb-4" />
        <p className="text-slate-500">Загрузка статьи...</p>
      </div>
    );
  }

  if (error || !post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div className="pt-24 min-h-screen bg-slate-50">
      <Helmet>
        <title>{post.title} | Блог Дядя Фёдор</title>
        <meta name="description" content={post.metaDescription} />
      </Helmet>

      <article className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link to="/blog" className="text-accent hover:underline text-sm font-medium flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Назад в блог
          </Link>
        </div>

        <div className="mb-10 text-center">
          <div className="inline-block bg-accent/10 text-accent px-4 py-1.5 rounded-full text-sm font-bold mb-6">
            {post.category}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-slate-900 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {post.date}
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {post.author}
            </div>
          </div>
        </div>

        <div className="rounded-3xl overflow-hidden aspect-video mb-12 shadow-xl bg-slate-200">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Article Content */}
        <div 
          className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-accent hover:prose-a:text-accent/80 prose-img:rounded-2xl"
        >
          {post.content.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('## ')) {
              return <h2 key={index} className="text-2xl mt-8 mb-4 font-bold text-slate-900">{paragraph.replace('## ', '').trim()}</h2>;
            }
            if (paragraph.startsWith('### ')) {
              return <h3 key={index} className="text-xl mt-6 mb-3 font-bold text-slate-900">{paragraph.replace('### ', '').trim()}</h3>;
            }
            if (paragraph.startsWith('*') || paragraph.startsWith('-')) {
              const items = paragraph.split('\n').map(item => item.replace(/^[\*\-]\s+/, '').trim());
              return (
                <ul key={index} className="list-disc pl-6 mb-6 space-y-2">
                  {items.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              );
            }
            return <p key={index} className="mb-6 leading-relaxed text-slate-700">{paragraph.trim()}</p>;
          })}
        </div>
      </article>
    </div>
  );
};

export default BlogPost;

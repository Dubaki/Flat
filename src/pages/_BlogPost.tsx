import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams, Navigate } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import HashScrollLinkButton from '../components/ui/HashScrollLinkButton';
import GlobalCalc from '../components/calculators/GlobalCalc';
import BathroomCalc from '../components/calculators/BathroomCalc';
import RoughCalc from '../components/calculators/RoughCalc';

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
        const baseUrl = import.meta.env.BASE_URL;
        const safeBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

        const indexResponse = await fetch(`${safeBaseUrl}blog-index.json`);
        if (!indexResponse.ok) throw new Error('Failed to load blog index');
        const indexData = await indexResponse.json();
        const meta = indexData.find((p: any) => p.id === slug);

        if (!meta) throw new Error('Post not found');

        const contentResponse = await fetch(`${safeBaseUrl}posts/${decodeURIComponent(slug)}.md`);
        if (!contentResponse.ok) throw new Error('Failed to load post content');
        const rawContent = await contentResponse.text();

        let content = rawContent;
        if (rawContent.startsWith('---')) {
          const parts = rawContent.split(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);
          if (parts.length > 1) content = parts[1];
        }

        const imagePath = meta.image.startsWith('./') 
          ? `${safeBaseUrl}${meta.image.substring(2)}` 
          : meta.image;

        setPost({
          ...meta,
          image: imagePath,
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
        <div className="prose prose-lg prose-slate max-w-none 
          prose-headings:font-bold prose-headings:text-slate-900 
          prose-a:text-accent hover:prose-a:text-accent/80 
          prose-img:rounded-2xl prose-blockquote:border-accent 
          prose-blockquote:bg-accent/5 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r-xl">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => {
                const text = React.Children.toArray(children).join('').trim();
                if (text === '[global-calc]') return <div className="not-prose my-12"><GlobalCalc /></div>;
                if (text === '[bathroom-calc]') return <div className="not-prose my-12"><BathroomCalc /></div>;
                if (text === '[rough-calc]') return <div className="not-prose my-12"><RoughCalc /></div>;
                return <p>{children}</p>;
              },
              a: ({ href, children }) => {
                // Handle internal hash links for smooth scrolling to home sections
                if (href?.startsWith('#')) {
                  const targetId = href.replace('#', '');
                  return (
                    <HashScrollLinkButton to={targetId} className="text-accent font-bold hover:underline cursor-pointer">
                      {children}
                    </HashScrollLinkButton>
                  );
                }
                // Default external link behavior
                return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
              }
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;

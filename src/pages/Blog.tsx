import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, User, Loader2 } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  author: string;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('./blog-index.json');
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="pt-24 min-h-screen bg-slate-50">
      <Helmet>
        <title>Блог о ремонте квартир | Советы, тренды, материалы | Дядя Фёдор</title>
        <meta name="description" content="Полезные статьи о ремонте квартир, выборе материалов и дизайне интерьера от экспертов компании Дядя Фёдор в Екатеринбурге." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link to="/" className="text-accent hover:underline text-sm font-medium flex items-center gap-2">
            ← На главную
          </Link>
        </div>

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
            Блог о ремонте
          </h1>
          <div className="w-20 h-1 bg-accent mx-auto mb-6"></div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Делимся опытом, рассказываем о подводных камнях ремонта и помогаем сделать ваш дом идеальным.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-accent animate-spin mb-4" />
            <p className="text-slate-500">Загрузка статей...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">Ошибка: {error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-accent text-white px-6 py-2 rounded-xl font-bold hover:bg-accent/90 transition-all"
            >
              Попробовать снова
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            Пока нет опубликованных статей.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article key={post.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                <Link to={`/blog/${post.id}`} className="relative aspect-video overflow-hidden block">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-accent">
                    {post.category}
                  </div>
                </Link>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.author}
                    </div>
                  </div>
                  <h2 className="text-xl font-bold mb-3 text-slate-900 leading-tight">
                    <Link to={`/blog/${post.id}`} className="hover:text-accent transition-colors">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-slate-600 text-sm mb-6 flex-grow">
                    {post.excerpt}
                  </p>
                  <Link to={`/blog/${post.id}`} className="text-accent font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all mt-auto">
                    Читать статью <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;

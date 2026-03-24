import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams, Navigate } from 'react-router-dom';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { blogPosts } from '../lib/blogData';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find(p => p.id === slug);

  if (!post) {
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

        <div className="rounded-3xl overflow-hidden aspect-video mb-12 shadow-xl">
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
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* CTA Section */}
        <div className="mt-16 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100 text-center">
          <h3 className="text-2xl font-bold mb-4">Планируете ремонт без обмана и скрытых платежей?</h3>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
            Мы в компании «Дядя Фёдор» фиксируем стоимость работ в договоре и не меняем ее в процессе. Рассчитайте примерную стоимость прямо сейчас или вызовите замерщика бесплатно.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/#calculator" className="bg-accent text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-all shadow-lg shadow-accent/20">
              Рассчитать стоимость
            </Link>
            <a href="tel:89221800911" className="bg-slate-100 text-slate-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-200 transition-all">
              Позвонить нам
            </a>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;

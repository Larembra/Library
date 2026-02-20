import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Rating } from './Rating';
import { Book } from '../data/mock';
import { ImageWithFallback } from './figma/ImageWithFallback';

export const BookCard: React.FC<{ book: Book }> = React.memo(({ book }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group flex flex-col gap-3 w-full"
    >
      <Link to={`/book/${book.id}`} className="relative aspect-[2/3] overflow-hidden rounded-xl bg-secondary border border-base">
        <ImageWithFallback
          src={book.cover}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
           <button className="w-full py-2 bg-accent text-white rounded-lg text-sm font-medium shadow-lg">
             Читать
           </button>
        </div>
      </Link>

      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <Link to={`/book/${book.id}`} className="text-sm font-semibold text-primary line-clamp-1 hover:text-accent transition-colors">
            {book.title}
          </Link>
          <span className="text-[11px] font-medium text-secondary">{book.year}</span>
        </div>
        <p className="text-xs text-secondary">{book.author}</p>
        <div className="flex items-center gap-2 mt-1">
          <Rating rating={book.rating} size={12} />
          <span className="text-[10px] text-secondary">({book.reviewsCount})</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {book.tags.slice(0, 2).map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-secondary text-secondary text-[10px] rounded-full border border-base">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
});

import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_BOOKS, MOCK_REVIEWS, Review } from '../data/mock';
import { Rating } from '../components/Rating';
import { Header } from '../components/Header';
import { Heart, Share2, BookOpen, MessageSquare, Star, ThumbsUp, ThumbsDown, Trash2, Send, X, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
import { useAuth } from '../context/AuthContext';

export const BookDetails: React.FC = () => {
  const { id } = useParams();
  const book = MOCK_BOOKS.find(b => b.id === id) || MOCK_BOOKS[0];
  const [activeTab, setActiveTab] = useState<'desc' | 'reviews' | 'comments'>('desc');
  const [isFavorite, setIsFavorite] = useState(false);
  const [commentLikes, setCommentLikes] = useState(24);
  const [commentDislikes, setCommentDislikes] = useState(2);
  const [commentReaction, setCommentReaction] = useState<'like' | 'dislike' | null>(null);
  const { isLoggedIn } = useAuth();

  // Отзывы
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS.filter(r => r.bookId === book.id));
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Модальное окно "Поделиться"
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Комментарий
  const [commentText, setCommentText] = useState('');

  const handleCommentReaction = (type: 'like' | 'dislike') => {
    if (!isLoggedIn) return;
    if (type === 'like') {
      if (commentReaction === 'like') {
        setCommentLikes(prev => prev - 1);
        setCommentReaction(null);
      } else {
        if (commentReaction === 'dislike') {
          setCommentDislikes(prev => prev - 1);
        }
        setCommentLikes(prev => prev + 1);
        setCommentReaction('like');
      }
      return;
    }

    if (commentReaction === 'dislike') {
      setCommentDislikes(prev => prev - 1);
      setCommentReaction(null);
    } else {
      if (commentReaction === 'like') {
        setCommentLikes(prev => prev - 1);
      }
      setCommentDislikes(prev => prev + 1);
      setCommentReaction('dislike');
    }
  };

  const handleReviewReaction = (reviewId: string, type: 'like' | 'dislike') => {
    if (!isLoggedIn) return;
    setReviews(prev => prev.map(review => {
      if (review.id !== reviewId) return review;
      const updated = { ...review };

      if (type === 'like') {
        if (updated.likedByUser) {
          updated.likes -= 1;
          updated.likedByUser = false;
        } else {
          if (updated.dislikedByUser) {
            updated.dislikes -= 1;
            updated.dislikedByUser = false;
          }
          updated.likes += 1;
          updated.likedByUser = true;
        }
      } else {
        if (updated.dislikedByUser) {
          updated.dislikes -= 1;
          updated.dislikedByUser = false;
        } else {
          if (updated.likedByUser) {
            updated.likes -= 1;
            updated.likedByUser = false;
          }
          updated.dislikes += 1;
          updated.dislikedByUser = true;
        }
      }
      return updated;
    }));
  };

  const submitReview = () => {
    if (!isLoggedIn || !newReviewText.trim()) return;

    const newReview: Review = {
      id: Date.now().toString(),
      bookId: book.id,
      userId: 'current-user',
      userName: 'Александр Ридер',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&h=100&auto=format&fit=crop',
      rating: newReviewRating,
      text: newReviewText,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      dislikes: 0
    };

    setReviews(prev => [newReview, ...prev]);
    setNewReviewText('');
    setNewReviewRating(5);
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const submitComment = () => {
    if (!isLoggedIn || !commentText.trim()) return;
    // Очищаем текст комментария (имитация отправки)
    setCommentText('');
  };

  return (
    <div className="min-h-screen bg-primary">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left: Book Cover & Main Actions */}
          <div className="w-full lg:w-80 shrink-0 space-y-6">
            <div className="aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-base">
              <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col gap-3">
              <Link to="/reader" className="w-full py-4 bg-accent text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-accent/20">
                <BookOpen className="w-5 h-5" /> Читать книгу
              </Link>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => isLoggedIn && setIsFavorite(prev => !prev)}
                  className={clsx(
                    "py-3 border border-base rounded-xl font-medium flex items-center justify-center gap-2 transition-colors",
                    isLoggedIn ? "hover:bg-secondary" : "opacity-50 cursor-not-allowed",
                    isFavorite && "bg-blue-600 text-white border-blue-600 hover:bg-blue-600"
                  )}
                  aria-disabled={!isLoggedIn}
                  title={isLoggedIn ? "Добавить в избранное" : "Войдите, чтобы добавить в избранное"}
                >
                  <Heart className="w-4 h-4" /> {isFavorite ? 'В избранном' : 'В избранное'}
                </button>
                <button
                  onClick={() => setShowShareModal(true)}
                  className="py-3 border border-base rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-secondary transition-colors"
                >
                  <Share2 className="w-4 h-4" /> Поделиться
                </button>
              </div>
            </div>
            
            <div className="p-4 bg-secondary rounded-xl border border-base space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Год издания</span>
                <span className="font-medium">{book.year}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Жанр</span>
                <span className="font-medium text-accent">{book.genre}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Возрастное ограничение</span>
                <span className="font-medium">16+</span>
              </div>
            </div>
          </div>

          {/* Right: Book Info & Interactive Blocks */}
          <div className="flex-1 space-y-8">
            <div>
              <h1 className="text-4xl font-black mb-2">{book.title}</h1>
              <p className="text-xl text-secondary font-medium mb-6">{book.author}</p>
              
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-bold">{book.rating}</div>
                  <div className="flex flex-col">
                    <Rating rating={book.rating} size={16} />
                    <span className="text-xs text-secondary">{book.reviewsCount} отзывов</span>
                  </div>
                </div>
                <div className="h-10 w-px bg-border-color" />
                <div className="flex gap-2">
                  {book.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-accent/10 text-accent text-xs font-bold rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-base flex gap-8">
              {(['desc', 'reviews', 'comments'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={clsx(
                    "pb-4 text-sm font-bold transition-all relative",
                    activeTab === tab ? "text-primary" : "text-secondary"
                  )}
                >
                  {tab === 'desc' ? 'О книге' : tab === 'reviews' ? `Отзывы (${book.reviewsCount})` : 'Комментарии'}
                  {activeTab === tab && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-accent rounded-t-full" />
                  )}
                </button>
              ))}
            </div>

            <div className="min-h-[300px]">
              {activeTab === 'desc' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <p className="text-lg leading-relaxed text-secondary">{book.description}</p>
                  <div className="p-6 bg-secondary/50 rounded-2xl border border-dashed border-base">
                    <h3 className="font-bold mb-3">Почему стоит прочитать?</h3>
                    <ul className="space-y-2 text-sm text-secondary list-disc pl-4">
                      <li>Уникальный авторский стиль и глубокая проработка персонажей.</li>
                      <li>Захватывающий сюжет с неожиданными поворотами.</li>
                      <li>Актуальные темы, которые заставляют задуматься.</li>
                    </ul>
                  </div>
                </motion.div>
              )}

              {activeTab === 'reviews' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  {isLoggedIn && (
                    <div className="p-6 bg-secondary/50 rounded-2xl border border-base space-y-4">
                      <h3 className="font-bold">Оставить отзыв</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Ваша оценка:</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              onClick={() => setNewReviewRating(star)}
                              className="transition-all"
                            >
                              <Star
                                className={clsx(
                                  "w-6 h-6 transition-colors",
                                  star <= newReviewRating ? "fill-amber-500 text-amber-500" : "text-gray-400"
                                )}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <textarea
                        value={newReviewText}
                        onChange={(e) => setNewReviewText(e.target.value)}
                        placeholder="Поделитесь своими впечатлениями о книге..."
                        className="w-full p-4 bg-primary border border-base rounded-xl outline-none focus:ring-2 focus:ring-accent h-32"
                      />
                      <button
                        onClick={submitReview}
                        className="px-6 py-2 bg-accent text-white rounded-xl font-bold"
                      >
                        Отправить отзыв
                      </button>
                    </div>
                  )}

                  <div className="space-y-4">
                    {reviews.length === 0 ? (
                      <div className="text-center py-12 text-secondary">
                        <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>Пока нет отзывов. Будьте первым!</p>
                      </div>
                    ) : (
                      reviews.map(review => (
                        <div key={review.id} className="p-6 bg-secondary/50 rounded-2xl border border-base space-y-4">
                          <div className="flex items-start gap-4">
                            <img
                              src={review.userAvatar}
                              alt={review.userName}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <p className="font-bold">{review.userName}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <div className="flex">
                                      {[1, 2, 3, 4, 5].map(star => (
                                        <Star
                                          key={star}
                                          className={clsx(
                                            "w-4 h-4",
                                            star <= review.rating ? "fill-amber-500 text-amber-500" : "text-gray-400"
                                          )}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-xs text-secondary">
                                      {new Date(review.date).toLocaleDateString('ru-RU')}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <p className="text-secondary leading-relaxed">{review.text}</p>
                              <div className="flex items-center gap-4 mt-3">
                                <button
                                  type="button"
                                  onClick={() => handleReviewReaction(review.id, 'like')}
                                  className={clsx(
                                    "flex items-center gap-1 text-xs transition-colors",
                                    review.likedByUser ? 'text-accent' : 'text-secondary hover:text-accent',
                                    !isLoggedIn && 'opacity-50 cursor-not-allowed'
                                  )}
                                  disabled={!isLoggedIn}
                                >
                                  <ThumbsUp className="w-3 h-3" /> {review.likes}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleReviewReaction(review.id, 'dislike')}
                                  className={clsx(
                                    "flex items-center gap-1 text-xs transition-colors",
                                    review.dislikedByUser ? 'text-rose-500' : 'text-secondary hover:text-rose-500',
                                    !isLoggedIn && 'opacity-50 cursor-not-allowed'
                                  )}
                                  disabled={!isLoggedIn}
                                >
                                  <ThumbsDown className="w-3 h-3" /> {review.dislikes}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'comments' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  {isLoggedIn && (
                    <div className="space-y-4">
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Поделитесь вашим мнением..."
                        className="w-full p-4 bg-secondary border border-base rounded-2xl outline-none focus:ring-2 focus:ring-accent h-32"
                      />
                      <button
                        onClick={submitComment}
                        className="px-6 py-2 bg-accent text-white rounded-xl font-bold ml-auto block"
                      >
                        Отправить
                      </button>
                    </div>
                  )}

                  {/* Mock Comment */}
                  <div className="p-4 rounded-xl border border-base space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent/20" />
                        <div>
                          <p className="text-sm font-bold">Константин В.</p>
                          <p className="text-[10px] text-secondary">2 часа назад</p>
                        </div>
                      </div>
                      {isLoggedIn && (
                        <button className="text-rose-500 hover:bg-rose-500/10 p-2 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-sm">Книга просто потрясающая! Не мог оторваться до самого утра. Особенно понравилась развязка в 14 главе.</p>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => handleCommentReaction('like')}
                        className={clsx(
                          "flex items-center gap-1 text-xs transition-colors",
                          commentReaction === 'like' ? 'text-accent' : 'text-secondary hover:text-accent',
                          !isLoggedIn && 'opacity-50 cursor-not-allowed'
                        )}
                        aria-disabled={!isLoggedIn}
                      >
                        <ThumbsUp className="w-3 h-3" /> {commentLikes}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCommentReaction('dislike')}
                        className={clsx(
                          "flex items-center gap-1 text-xs transition-colors",
                          commentReaction === 'dislike' ? 'text-rose-500' : 'text-secondary hover:text-rose-500',
                          !isLoggedIn && 'opacity-50 cursor-not-allowed'
                        )}
                        aria-disabled={!isLoggedIn}
                      >
                        {commentDislikes} <ThumbsDown className="w-3 h-3" />
                      </button>
                      {isLoggedIn && (
                        <button
                          onClick={() => setReplyingTo(replyingTo === '1' ? null : '1')}
                          className="text-xs font-bold text-accent ml-2"
                        >
                          Ответить
                        </button>
                      )}
                    </div>

                    {/* Reply Form */}
                    {isLoggedIn && replyingTo === '1' && (
                      <div className="mt-4 pl-8 space-y-2">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Напишите ответ..."
                          className="w-full p-3 bg-primary border border-base rounded-xl outline-none focus:ring-2 focus:ring-accent h-24 text-sm"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setReplyText('');
                              setReplyingTo(null);
                            }}
                            className="px-4 py-1.5 bg-accent text-white rounded-lg font-bold text-sm flex items-center gap-1"
                          >
                            <Send className="w-3 h-3" /> Отправить
                          </button>
                          <button
                            onClick={() => {
                              setReplyText('');
                              setReplyingTo(null);
                            }}
                            className="px-4 py-1.5 bg-secondary rounded-lg font-bold text-sm"
                          >
                            Отмена
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
               )}
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowShareModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-primary rounded-3xl p-8 shadow-2xl border border-base"
            >
              <button
                onClick={() => setShowShareModal(false)}
                className="absolute top-6 right-6 text-secondary hover:text-primary transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-2xl font-black mb-2">Поделиться книгой</h2>
              <p className="text-secondary text-sm mb-6">Отправьте ссылку на "{book.title}" друзьям</p>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={window.location.href}
                    readOnly
                    className="flex-1 px-4 py-3 bg-secondary border border-base rounded-xl text-sm"
                  />
                  <button
                    onClick={handleShare}
                    className={clsx(
                      "px-4 py-3 rounded-xl font-bold flex items-center gap-2 transition-all",
                      copied ? "bg-green-500 text-white" : "bg-accent text-white hover:bg-accent/90"
                    )}
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    {copied ? 'Скопировано!' : 'Копировать'}
                  </button>
                </div>

                <div className="pt-2">
                  <p className="text-xs text-secondary mb-3">Поделиться в социальных сетях:</p>
                  <div className="grid grid-cols-3 gap-3">
                    <button className="p-4 bg-secondary rounded-xl border border-base hover:border-accent transition-colors">
                      <div className="w-6 h-6 mx-auto bg-blue-500 rounded-lg" />
                      <p className="text-xs mt-2 font-medium">ВКонтакте</p>
                    </button>
                    <button className="p-4 bg-secondary rounded-xl border border-base hover:border-accent transition-colors">
                      <div className="w-6 h-6 mx-auto bg-sky-500 rounded-lg" />
                      <p className="text-xs mt-2 font-medium">Telegram</p>
                    </button>
                    <button className="p-4 bg-secondary rounded-xl border border-base hover:border-accent transition-colors">
                      <div className="w-6 h-6 mx-auto bg-green-500 rounded-lg" />
                      <p className="text-xs mt-2 font-medium">WhatsApp</p>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
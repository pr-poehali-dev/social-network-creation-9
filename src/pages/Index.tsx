import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface Post {
  id: number;
  author: {
    name: string;
    avatar: string;
    username: string;
  };
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  timestamp: string;
}

interface Comment {
  id: number;
  author: string;
  avatar: string;
  text: string;
}

const Index = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('feed');
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [expandedComments, setExpandedComments] = useState<{ [key: number]: boolean }>({});
  const [commentTexts, setCommentTexts] = useState<{ [key: number]: string }>({});
  const [postComments, setPostComments] = useState<{ [key: number]: Comment[] }>({});

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const requireAuth = (action: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Требуется авторизация",
        description: `Войдите, чтобы ${action}`,
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleLike = (postId: number) => {
    if (!requireAuth("ставить лайки")) return;
    
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
          : post
      )
    );
  };

  const toggleComments = (postId: number) => {
    setExpandedComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const addComment = (postId: number) => {
    if (!requireAuth("комментировать")) return;
    
    const text = commentTexts[postId];
    if (!text?.trim()) return;

    const newComment: Comment = {
      id: Date.now(),
      author: user?.name || 'Вы',
      avatar: user?.avatar || '/placeholder.svg',
      text: text,
    };

    setPostComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment],
    }));

    setPosts(
      posts.map((post) => (post.id === postId ? { ...post, comments: post.comments + 1 } : post))
    );

    setCommentTexts((prev) => ({ ...prev, [postId]: '' }));
  };

  const handleShare = (postId: number) => {
    if (!requireAuth("делиться постами")) return;
    
    setPosts(posts.map((post) => (post.id === postId ? { ...post, shares: post.shares + 1 } : post)));
    toast({
      title: "Пост опубликован!",
      description: "Пост появился в вашей ленте",
    });
  };

  const createPost = () => {
    if (!requireAuth("создавать посты")) return;
    if (!newPost.trim()) return;

    const post: Post = {
      id: Date.now(),
      author: {
        name: user?.name || 'Вы',
        avatar: user?.avatar || '/placeholder.svg',
        username: user?.username || '@you',
      },
      content: newPost,
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      timestamp: 'Только что',
    };

    setPosts([post, ...posts]);
    setNewPost('');
    toast({
      title: "Пост создан!",
      description: "Ваш пост появился в ленте",
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { id: 'feed', label: 'Лента', icon: 'Home' },
    { id: 'profile', label: 'Профиль', icon: 'User' },
    { id: 'friends', label: 'Друзья', icon: 'Users' },
    { id: 'messages', label: 'Сообщения', icon: 'MessageCircle' },
    { id: 'search', label: 'Поиск', icon: 'Search' },
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="gradient-purple h-10 w-10 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🌍</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[hsl(var(--game-purple))] to-[hsl(var(--game-pink))] bg-clip-text text-transparent">
                Мир
              </h1>
            </div>

            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? 'default' : 'ghost'}
                  className={`${
                    activeTab === item.id ? 'gradient-purple' : ''
                  } transition-all duration-200`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon name={item.icon as any} className="mr-2" size={18} />
                  {item.label}
                </Button>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Icon name="Bell" size={20} />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 gradient-orange text-white">
                  0
                </Badge>
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <Icon name="LogOut" size={20} />
              </Button>
              <Avatar className="h-9 w-9 ring-2 ring-primary cursor-pointer" onClick={() => setActiveTab('profile')}>
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{user?.name?.[0] || 'Я'}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {activeTab === 'feed' && (
          <div className="space-y-6">
            <Card className="border-2 border-primary/20 animate-fade-in">
              <CardContent className="pt-6">
                <div className="flex space-x-4">
                  <Avatar>
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>{user?.name?.[0] || 'Я'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-3">
                    <Textarea
                      placeholder="Что у вас нового? 🌟"
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      className="min-h-[100px] resize-none border-border focus:border-primary"
                    />
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Icon name="Image" size={16} className="mr-2" />
                          Фото
                        </Button>
                        <Button variant="outline" size="sm">
                          <Icon name="Smile" size={16} className="mr-2" />
                          Эмодзи
                        </Button>
                      </div>
                      <Button onClick={createPost} className="gradient-purple">
                        Опубликовать
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {posts.length === 0 && (
              <Card className="animate-fade-in">
                <CardContent className="py-12 text-center">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-xl font-semibold mb-2">Лента пуста</h3>
                  <p className="text-muted-foreground">Создайте первый пост или добавьте друзей!</p>
                </CardContent>
              </Card>
            )}

            {posts.map((post, index) => (
              <Card
                key={post.id}
                className="overflow-hidden border-border hover:border-primary/50 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12 ring-2 ring-primary/30">
                        <AvatarImage src={post.author.avatar} />
                        <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-foreground">{post.author.name}</p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>{post.author.username}</span>
                          <span>•</span>
                          <span>{post.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Icon name="MoreVertical" size={20} />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-foreground leading-relaxed">{post.content}</p>

                  {post.image && (
                    <div className="rounded-xl overflow-hidden -mx-6">
                      <img
                        src={post.image}
                        alt="Post content"
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`${post.isLiked ? 'text-red-500' : ''} hover:text-red-500 transition-colors`}
                      onClick={() => handleLike(post.id)}
                    >
                      <Icon name="Heart" size={18} className="mr-2" fill={post.isLiked ? 'currentColor' : 'none'} />
                      {post.likes}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:text-blue-400 transition-colors"
                      onClick={() => toggleComments(post.id)}
                    >
                      <Icon name="MessageCircle" size={18} className="mr-2" />
                      {post.comments}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:text-green-400 transition-colors"
                      onClick={() => handleShare(post.id)}
                    >
                      <Icon name="Share2" size={18} className="mr-2" />
                      {post.shares}
                    </Button>
                  </div>

                  {expandedComments[post.id] && (
                    <div className="space-y-3 pt-3 border-t border-border animate-accordion-down">
                      {(postComments[post.id] || []).map((comment) => (
                        <div key={comment.id} className="flex space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={comment.avatar} />
                            <AvatarFallback>{comment.author[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 bg-muted rounded-lg px-4 py-2">
                            <p className="font-semibold text-sm">{comment.author}</p>
                            <p className="text-sm text-foreground">{comment.text}</p>
                          </div>
                        </div>
                      ))}

                      <div className="flex space-x-3 pt-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user?.avatar} />
                          <AvatarFallback>{user?.name?.[0] || 'Я'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 flex space-x-2">
                          <Textarea
                            placeholder="Написать комментарий..."
                            value={commentTexts[post.id] || ''}
                            onChange={(e) =>
                              setCommentTexts((prev) => ({ ...prev, [post.id]: e.target.value }))
                            }
                            className="min-h-[40px] resize-none"
                          />
                          <Button size="icon" onClick={() => addComment(post.id)} className="gradient-blue">
                            <Icon name="Send" size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'profile' && (
          <Card className="animate-fade-in">
            <CardHeader>
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24 ring-4 ring-primary">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>{user?.name?.[0] || 'Я'}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h2 className="text-2xl font-bold">{user?.name}</h2>
                  <p className="text-muted-foreground">{user?.username}</p>
                  <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
                </div>
                <div className="flex space-x-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold gradient-purple bg-clip-text text-transparent">{posts.length}</p>
                    <p className="text-sm text-muted-foreground">Постов</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold gradient-blue bg-clip-text text-transparent">0</p>
                    <p className="text-sm text-muted-foreground">Друзей</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold gradient-orange bg-clip-text text-transparent">
                      {posts.reduce((sum, post) => sum + post.likes, 0)}
                    </p>
                    <p className="text-sm text-muted-foreground">Лайков</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full gradient-purple" onClick={() => navigate('/edit-profile')}>
                Редактировать профиль
              </Button>
              <Button variant="outline" className="w-full" onClick={handleLogout}>
                <Icon name="LogOut" size={16} className="mr-2" />
                Выйти
              </Button>
            </CardContent>
          </Card>
        )}

        {activeTab === 'friends' && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-2xl font-bold">Друзья</h2>
            <Card>
              <CardContent className="py-12 text-center">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-xl font-semibold mb-2">Список друзей пуст</h3>
                <p className="text-muted-foreground mb-4">Начните добавлять друзей!</p>
                <Button className="gradient-blue" onClick={() => setActiveTab('search')}>
                  <Icon name="Search" size={16} className="mr-2" />
                  Найти друзей
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'messages' && (
          <Card className="animate-fade-in">
            <CardHeader>
              <h2 className="text-2xl font-bold">Сообщения</h2>
            </CardHeader>
            <CardContent className="py-12 text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-2">Нет сообщений</h3>
              <p className="text-muted-foreground">Начните общение с друзьями!</p>
            </CardContent>
          </Card>
        )}

        {activeTab === 'search' && (
          <div className="space-y-4 animate-fade-in">
            <div className="relative">
              <Icon name="Search" className="absolute left-3 top-3 text-muted-foreground" size={20} />
              <input
                type="text"
                placeholder="Поиск людей, постов, хештегов..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Популярные хештеги</h3>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {['#путешествия', '#еда', '#природа', '#искусство', '#технологии'].map((tag) => (
                  <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-primary/10">
                    {tag}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur">
        <div className="flex justify-around py-2">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              size="icon"
              className={`${activeTab === item.id ? 'text-primary' : 'text-muted-foreground'}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon name={item.icon as any} size={24} />
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
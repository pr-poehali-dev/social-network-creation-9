import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleGoogleLogin = () => {
    login('google');
    navigate('/');
  };

  const handleYandexLogin = () => {
    login('yandex');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-2 border-primary/20 animate-fade-in">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="gradient-purple h-16 w-16 rounded-2xl flex items-center justify-center">
              <span className="text-4xl">🌍</span>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-[hsl(var(--game-purple))] to-[hsl(var(--game-pink))] bg-clip-text text-transparent">
            Добро пожаловать в Мир!
          </CardTitle>
          <CardDescription className="text-base">
            Войдите, чтобы общаться с друзьями и делиться моментами
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4 pt-6">
          <Button 
            onClick={handleGoogleLogin}
            variant="outline" 
            className="w-full h-12 text-base border-2 hover:border-primary/50 transition-all"
          >
            <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Войти через Google
          </Button>

          <Button 
            onClick={handleYandexLogin}
            variant="outline" 
            className="w-full h-12 text-base border-2 hover:border-primary/50 transition-all"
          >
            <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13.142 0h-2.284v18.098h2.284V0zm-2.284 21.076c0 1.613 1.308 2.924 2.923 2.924 1.614 0 2.923-1.31 2.923-2.924 0-1.613-1.309-2.923-2.923-2.923-1.615 0-2.923 1.31-2.923 2.923z"/>
            </svg>
            Войти через Яндекс
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Безопасный вход</span>
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Продолжая, вы соглашаетесь с нашими<br />
              <span className="text-primary cursor-pointer hover:underline">Условиями использования</span> и{' '}
              <span className="text-primary cursor-pointer hover:underline">Политикой конфиденциальности</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from 'wouter';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { LogIn, UserPlus } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export function AuthModal({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { login, register } = useAuth();
  const { toast } = useToast();

  const [loginForm, setLoginForm] = useState({
    identifier: '',
    password: '',
  });

  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(loginForm);
      toast({
        title: "Success",
        description: "Login successful!",
      });
      onClose();
      setLocation('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await register(registerForm);
      toast({
        title: "Success",
        description: "Registration successful! Please login.",
      });
      setMode('login');
      setRegisterForm({ username: '', email: '', password: '' });
    } catch (error) {
      toast({
        title: "Error",
        description: "Registration failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-music-card border-gray-600 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {mode === 'login' ? 'Welcome Back' : 'Join the Music'}
          </DialogTitle>
          <p className="text-gray-400">
            {mode === 'login'
              ? 'Sign in to your music library'
              : 'Create your account to start listening'
            }
          </p>
        </DialogHeader>

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label className="text-gray-300">Email or Username</Label>
              <Input
                type="text"
                placeholder="Enter email or username"
                value={loginForm.identifier}
                onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })}
                className="bg-music-gray border-gray-600 text-white placeholder-gray-400 focus:border-music-primary"
                required
              />
            </div>
            <div>
              <Label className="text-gray-300">Password</Label>
              <Input
                type="password"
                placeholder="Enter password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="bg-music-gray border-gray-600 text-white placeholder-gray-400 focus:border-music-primary"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-music-primary hover:bg-purple-700"
            >
              <LogIn className="w-4 h-4 mr-2" />
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-600" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-music-card px-2 text-gray-400">Or</span>
              </div>
            </div>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={() => setMode('register')}
                className="text-music-accent hover:text-blue-400"
              >
                Don't have an account? Sign up
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Label className="text-gray-300">Username</Label>
              <Input
                type="text"
                placeholder="Choose a username"
                value={registerForm.username}
                onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                className="bg-music-gray border-gray-600 text-white placeholder-gray-400 focus:border-music-primary"
                required
              />
            </div>
            <div>
              <Label className="text-gray-300">Email</Label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                className="bg-music-gray border-gray-600 text-white placeholder-gray-400 focus:border-music-primary"
                required
              />
            </div>
            <div>
              <Label className="text-gray-300">Password</Label>
              <Input
                type="password"
                placeholder="Create a password"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                className="bg-music-gray border-gray-600 text-white placeholder-gray-400 focus:border-music-primary"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-music-secondary hover:bg-purple-600"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={() => setMode('login')}
                className="text-music-accent hover:text-blue-400"
              >
                Already have an account? Sign in
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

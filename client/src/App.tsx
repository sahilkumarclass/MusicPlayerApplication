import { Switch, Route, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { AudioProvider } from "@/context/AudioContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { AudioPlayer } from "@/components/layout/AudioPlayer";
import { AuthModal } from "@/components/auth/AuthModal";
import { UploadModal } from "@/components/admin/UploadModal";
import HomePage from "@/pages/HomePage";
import SearchPage from "@/pages/SearchPage";
import LibraryPage from "@/pages/LibraryPage";
import FavoritesPage from "@/pages/FavoritesPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminSongs from "@/pages/admin/AdminSongs";
import AdminUsers from "@/pages/admin/AdminUsers";
import NotFound from "@/pages/not-found";

function Router() {
  const [location] = useLocation();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Handle auth modal from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    if (location === '/auth') {
      setAuthMode((mode as 'login' | 'register') || 'login');
      setAuthModalOpen(true);
    }
  }, [location]);

  const handleUploadClick = () => {
    setUploadModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-music-dark">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header onUploadClick={handleUploadClick} />
        
        <main className="flex-1 overflow-y-auto pb-24">
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/search" component={SearchPage} />
            <Route path="/library" component={LibraryPage} />
            <Route path="/favorites" component={FavoritesPage} />
            <Route path="/admin/dashboard" component={AdminDashboard} />
            <Route path="/admin/songs" component={AdminSongs} />
            <Route path="/admin/users" component={AdminUsers} />
            <Route path="/auth">
              {() => {
                setAuthModalOpen(true);
                return null;
              }}
            </Route>
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>

      <AudioPlayer />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false);
          if (location === '/auth') {
            window.history.pushState({}, '', '/');
          }
        }}
        defaultMode={authMode}
      />

      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
      />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AudioProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AudioProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

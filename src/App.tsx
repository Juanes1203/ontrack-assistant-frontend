import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { ClassProvider } from "@/contexts/ClassContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import ClassDetail from "./pages/ClassDetail";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { ElevenLabsProvider } from './contexts/ElevenLabsContext';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ClassProvider>
          <ElevenLabsProvider>
            <Toaster />
            <Sonner />
            <HashRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } />
                <Route path="/class/:classId" element={
                  <ProtectedRoute>
                    <ClassDetail />
                  </ProtectedRoute>
                } />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </HashRouter>
          </ElevenLabsProvider>
        </ClassProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

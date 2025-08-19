import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { ClassProvider } from "@/contexts/ClassContext";
import Index from "./pages/Index";
import ClassDetail from "./pages/ClassDetail";
import NotFound from "./pages/NotFound";
import { ElevenLabsProvider } from './contexts/ElevenLabsContext';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ClassProvider>
        <ElevenLabsProvider>
          <Toaster />
          <Sonner />
          <HashRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/class/:classId" element={<ClassDetail />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </HashRouter>
        </ElevenLabsProvider>
      </ClassProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

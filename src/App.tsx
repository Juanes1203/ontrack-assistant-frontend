import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { ClassProvider } from "@/contexts/ClassContext";
import Home from "./pages/Home";
import Classes from "./pages/Classes";
import ClassDetail from "./pages/ClassDetail";
import ClassAnalysis from "./pages/ClassAnalysis";
import Analytics from "./pages/Analytics";
import Documents from "./pages/Documents";
import Students from "./pages/Students";
import Feedback from "./pages/Feedback";
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
              <Route path="/" element={<Home />} />
              <Route path="/classes" element={<Classes />} />
              <Route path="/class/:classId" element={<ClassDetail />} />
              <Route path="/class/:classId/analysis" element={<ClassAnalysis />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/students" element={<Students />} />
              <Route path="/feedback" element={<Feedback />} />
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

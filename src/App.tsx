import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { ClassProvider } from "@/contexts/ClassContext";
import { StudentProvider } from "@/contexts/StudentContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { DashboardProvider } from "@/contexts/DashboardContext";
import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";
import { PublicRoute } from "@/components/Auth/PublicRoute";
import { HomeRedirect } from "@/components/Auth/HomeRedirect";
import Home from "./pages/Home";
import Classes from "./pages/ClassesSimple";
import ClassDetail from "./pages/ClassDetail";
import ClassAnalysis from "./pages/ClassAnalysis";
import ClassAnalysisPage from "./pages/ClassAnalysisPage";
import Analytics from "./pages/Analytics";
import Documents from "./pages/Documents";
import KnowledgeCenter from "./pages/KnowledgeCenter";
import Students from "./pages/Students";
import Feedback from "./pages/Feedback";
import AdminPanel from "./pages/AdminPanel";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import TestPage from "./pages/TestPage";
import { ElevenLabsProvider } from './contexts/ElevenLabsContext';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <DashboardProvider>
          <ClassProvider>
            <StudentProvider>
              <ElevenLabsProvider>
              <Toaster />
              <Sonner />
              <HashRouter
                future={{
                  v7_startTransition: true,
                  v7_relativeSplatPath: true
                }}
              >
                <Routes>
                  {/* Public Routes */}
                  <Route path="/login" element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  } />
                  <Route path="/register" element={
                    <PublicRoute>
                      <Register />
                    </PublicRoute>
                  } />
                  <Route path="/unauthorized" element={<Unauthorized />} />
                  
                  {/* Default redirect */}
                  <Route path="/" element={<HomeRedirect />} />
                  <Route path="/test" element={<TestPage />} />
                  
                  {/* Protected Routes */}
                  <Route path="/home" element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  } />
                  <Route path="/classes" element={
                    <ProtectedRoute requiredRole="teacher">
                      <Classes />
                    </ProtectedRoute>
                  } />
                  <Route path="/class/:classId" element={
                    <ProtectedRoute requiredRole="teacher">
                      <ClassDetail />
                    </ProtectedRoute>
                  } />
                  <Route path="/class/:classId/analysis" element={<ClassAnalysis />} />
                  <Route path="/class/:classId/analysis-page" element={
                    <ProtectedRoute requiredRole="teacher">
                      <ClassAnalysisPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/analytics" element={
                    <ProtectedRoute requiredRole="teacher">
                      <Analytics />
                    </ProtectedRoute>
                  } />
                  <Route path="/documents" element={
                    <ProtectedRoute requiredRole="teacher">
                      <Documents />
                    </ProtectedRoute>
                  } />
                  <Route path="/knowledge-center" element={
                    <ProtectedRoute requiredRole="teacher">
                      <KnowledgeCenter />
                    </ProtectedRoute>
                  } />
                  <Route path="/students" element={
                    <ProtectedRoute requiredRole="teacher">
                      <Students />
                    </ProtectedRoute>
                  } />
                  <Route path="/feedback" element={
                    <ProtectedRoute requiredRole="teacher">
                      <Feedback />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin" element={
                    <ProtectedRoute requiredRole="super_admin">
                      <AdminPanel />
                    </ProtectedRoute>
                  } />
                  
                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </HashRouter>
              </ElevenLabsProvider>
            </StudentProvider>
          </ClassProvider>
        </DashboardProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

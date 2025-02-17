
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import Overview from "./pages/Overview";
import Metrics from "./pages/Metrics";
import Cornerstones from "./pages/Cornerstones";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { IndicatorProvider } from "./components/CircleDiagram/context/IndicatorContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="min-h-screen bg-[#F3F3F3]">
        <Toaster />
        <Sonner />
        <IndicatorProvider>
          <BrowserRouter>
            <Navigation />
            <div className="pt-[62px]">
              <Routes>
                <Route path="/" element={<Overview />} />
                <Route path="/metrics" element={<Metrics />} />
                <Route path="/cornerstones" element={<Cornerstones />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </IndicatorProvider>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider, useAppState } from "@/lib/AppContext";
import BottomNav from "@/components/BottomNav";
import Home from "./pages/Home";
import CarProgress from "./pages/CarProgress";
import Garage from "./pages/Garage";
import Insights from "./pages/Insights";
import Settings from "./pages/Settings";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppShell = () => {
  const { state } = useAppState();

  if (!state.profile.onboardingComplete) {
    return <Onboarding />;
  }

  return (
    <>
      <div className="min-h-screen pb-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/progress" element={<CarProgress />} />
          <Route path="/garage" element={<Garage />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <BottomNav />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppProvider>
          <AppShell />
        </AppProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

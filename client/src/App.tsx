import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "./lib/queryClient";
import { Sidebar } from "./components/layout/Sidebar";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import Timer from "./pages/Timer";
import Tasks from "./pages/Tasks";
import Settings from "./pages/Settings";
import NotFound from "./pages/not-found";

function Router() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 lg:pl-72">
        <div className="px-4 py-8 sm:px-6 lg:px-8">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/calendar" component={Calendar} />
            <Route path="/timer" component={Timer} />
            <Route path="/tasks" component={Tasks} />
            <Route path="/settings" component={Settings} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
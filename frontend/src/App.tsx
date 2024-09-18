import { Route, BrowserRouter, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import Home from "./pages/Home";
import Header from "./components/Header";
import About from "./pages/About";
import { CartProvider } from "./CartContext";
import Footer from "./components/Footer";
import Menu from "./pages/Menu";
import Payment from "./pages/Payment";
import { UserProvider } from "./UserContext";
import Profile from "./pages/Profile";
import { Toaster } from "./components/ui/sonner";
import Dashboard from "./pages/Dashboard";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <UserProvider>
          <CartProvider>
            <Header />
            <main className="min-h-[66.9vh]">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/dashboard" element={<Dashboard/>} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </main>
            <Toaster />
            <Footer />
          </CartProvider>
        </UserProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

import { Route, BrowserRouter, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Header from "./components/Header";
import About from "./pages/About";
import { CartProvider } from "./CartContext";
import Footer from "./components/Footer";
import Menu from "./pages/Menu";
import Payment from "./pages/Payment";
import { UserProvider } from "./UserContext";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <CartProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
          <Footer />
        </CartProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;

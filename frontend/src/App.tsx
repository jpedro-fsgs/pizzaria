import { Route, BrowserRouter, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Header from "./components/Header";
import About from "./pages/About";
import { CartProvider } from "./CartContext";
import Footer from "./components/Footer";
import Menu from "./pages/Menu";

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/menu" element={<Menu />} />
        </Routes>
        <Footer />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;

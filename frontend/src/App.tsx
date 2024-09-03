import { Route, BrowserRouter, Routes } from "react-router-dom";

import Home from "./pages/Home/Home";
import Header from "./components/Header";
import About from "./pages/About";
import { CartProvider } from "./CartContext";

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;

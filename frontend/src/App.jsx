import { Route, BrowserRouter, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Header from "./components/Header";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

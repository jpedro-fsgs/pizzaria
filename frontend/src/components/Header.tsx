import { useContext, useState } from "react";
import logo from "/equipe2/logo.png";
import { ShoppingCart as ShoppingCartIcon } from "lucide-react";
import ShoppingCart from "./ShoppingCart";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "lucide-react";
import { CartContext } from "../CartContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartContext = useContext(CartContext);

  if (!cartContext) {
    throw new Error("Header must be used within a CartProvider");
  }

  const { cartSize } = cartContext;

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <>
      <header className="bg-primary w-full shadow">
        <div className="container mx-auto flex items-center justify-between px-4 py-4 md:px-6">
          <Link to="/" aria-label="Voltar para a página inicial" className="w-24 hover:scale-105 transition duration-200">
            <img src={logo} alt="Logo da Borcelle Pizzaria, link para a página inicial" className="rounded-full" />
          </Link>

          <div className="flex items-center space-x-4 md:space-x-6">
            <nav className="hidden md:flex items-center space-x-6">
              <ul className="flex gap-6 md:gap-20 text-xl text-secondary pr-10">
                <li className="hover:scale-105 hover:brightness-90 transition duration-200">
                  <Link to="/about">Sobre</Link>
                </li>
                <li className="hover:scale-105 hover:brightness-90 transition duration-200">
                  <Link to="/menu">Menu</Link>
                </li>
              </ul>
            </nav>

            <div className="relative">
              <div className="dropdown dropdown-end transition duration-200">
                <button tabIndex={0} className="group btn btn-secondary flex items-center justify-between md:justify-center focus:outline-none  max-h-7 h-4 min-h-10 md:h-12 pl-2 md:px-3 w-11 md:w-48" aria-label="Abrir carrinho de compras" aria-expanded={isMenuOpen}>
                  <span className="hidden md:block group-hover:scale-105 text-primary font-semibold">Veja meu carrinho</span>
                  <div className="group-hover:scale-105 indicator">
                    <ShoppingCartIcon className="text-2xl text-primary" aria-hidden="true" />
                    <span className="badge badge-sm badge-info indicator-item">{cartSize}</span>
                  </div>
                </button>
                <ShoppingCart />
              </div>
            </div>

            {/* Ícone do usuário */}
            <Dialog>
              <DialogTrigger asChild>
                <Button size="icon" className="hover:brightness-90 hover:bg-secondary bg-secondary w-10 h-10 md:w-12 md:h-12 transition duration-200" aria-label="Abrir login do usuário">
                  <User className="h-6 w-6 transition duration-200 text-primary" aria-hidden="true" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-base-100">
                <DialogHeader>
                  <DialogTitle className="text-neutral">Logar ou Registrar</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="signin" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signin">Logar</TabsTrigger>
                    <TabsTrigger value="signup">Registrar</TabsTrigger>
                  </TabsList>
                  <TabsContent value="signin">
                    <form className="space-y-4">
                      <Input placeholder="Email" type="email" required />
                      <Input placeholder="Senha" type="password" required />
                      <Button className="w-full">Logar</Button>
                    </form>
                  </TabsContent>
                  <TabsContent value="signup">
                    <form className="space-y-4">
                      <Input placeholder="Nome" required />
                      <Input placeholder="Email" type="email" required />
                      <Input placeholder="Senha" type="password" required />
                      <Input placeholder="Confirme a Senha" type="password" required />
                      <Button className="w-full">Registrar</Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
            {/* Botão para abrir/fechar menu mobile */}
            <button className="text-secondary text-3xl md:hidden focus:outline-none" onClick={toggleMenu} aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={isMenuOpen}>
              &#9776;
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden bg-primary text-secondary text-xl">
            <ul className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col  gap-4 p-4">
              <li>
                <Link to="/about" className="hover:brightness-90 transition duration-200 block px-3 py-2 rounded-md text-base font-medium text-primary-foreground hover:text-primary hover:bg-accent" onClick={toggleMenu}>
                  Sobre
                </Link>
              </li>
              <li>
                <Link to="/menu" className="hover:brightness-90 transition duration-200 block px-3 py-2 rounded-md text-base font-medium text-primary-foreground hover:text-primary hover:bg-accent" onClick={toggleMenu}>
                  Menu
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </header>

      <section className="relative w-full h-[400px] md:h-[500px] bg-cover bg-center" style={{ backgroundImage: "url('/equipe2/hero-pizza.png')" }}>
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
          <h1 className="text-4xl font-bold text-yellow-500">Borcelle Pizza</h1>
          <p className="mt-2 text-xl text-white">Hoje é dia de vale pizza!</p>
          <Link to="/menu" className="mt-4">
            <button className="px-6 py-2 text-lg font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition duration-200 focus:outline-none">Veja as opções</button>
          </Link>
        </div>
      </section>
    </>
  );
};

export default Header;

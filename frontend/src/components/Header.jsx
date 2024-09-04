import logo from "/equipe2/logo.png";
import ShoppingCartIcon from "../assets/icons";
import ShoppingCart from "./ShoppingCart";

const Header = () => {
  return (
    <header className="navbar bg-primary justify-around md:px-20">
      <div className="avatar">
        <span className="w-24 rounded-full cursor-pointer">
          <img
            src={logo}
            alt="Logo da borcelle pizaria"
            className="w-full h-full rounded-full"
          />
        </span>
      </div>

      <ul className="flex text-xl text-secondary gap-4 md:gap-20">
        <li className="cursor-pointer hover:brightness-90"><a href="/">Sobre</a></li>
        <li className="cursor-pointer hover:brightness-90"><a href="/menu">Menu</a></li>
      </ul>

      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn  btn-secondary md:w-52">
            <p className="text-primary font-semibold max-md:hidden">Veja meu carrinho</p>
            <div className="indicator">
              <span className="text-2xl text-primary">
                <ShoppingCartIcon />
              </span>
              <span className="badge badge-sm badge-info indicator-item">
                8
              </span>
            </div>
          </div>

          <ShoppingCart />
        </div>
      </div>
    </header>
  );
};

export default Header;

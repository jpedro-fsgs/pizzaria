import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative w-full h-[400px] md:h-[500px] bg-cover bg-center" style={{ backgroundImage: "url('/equipe2/hero-pizza.png')" }}>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
        <h1 className="text-4xl font-bold text-yellow-500">Borcelle Pizza</h1>
        <p className="mt-2 text-xl text-white">Hoje é dia de vale pizza!</p>
        <Link to="/menu" className="mt-4">
          <button className="px-6 py-2 text-lg font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition duration-200 focus:outline-none">Veja as opções</button>
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;

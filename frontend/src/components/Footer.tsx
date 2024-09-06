import { Facebook, Twitter, Instagram, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-red-600 text-white">
      <div className="container mx-auto px-4 py-6">
        {/* Formas de Pagamento e Localização */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0">
            <h3 className="text-xl font-semibold mb-4">Formas de Pagamento</h3>
            <div className="bg-white w-fit p-1 rounded">
              {/* <img src="/equipe2/cartoes.png" alt="Formas de pagamento: Visa, Mastercard, etc." className="h-8" /> */}
              <img src="/equipe2/pix.svg" alt="Formas de pagamento: Pix" className="h-8" />
            </div>
          </div>

          {/* Redes Sociais */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6">Nossas Redes</h2>
          <div className="flex justify-center space-x-6">
            <a href="#" aria-label="Facebook" className="hover:text-gray-300 transition-colors">
              <Facebook size={24} />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-gray-300 transition-colors">
              <Twitter size={24} />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-gray-300 transition-colors">
              <Instagram size={24} />
            </a>
          </div>
        </div>

          <div className="text-center md:text-right">
            <h3 className="text-xl font-semibold mb-4">Venha conferir!</h3>
            <div className="flex items-center justify-center md:justify-end space-x-2">
              <MapPin size={24} />
              <a href="#" className="hover:text-gray-300 transition-colors">
                Encontre a loja mais perto de você
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Direitos Autorais */}
      <div className="bg-black py-4 text-center mt-10">
        <p>&copy; 2024 - Todos os direitos reservados</p>
      </div>
    </footer>
  );
}

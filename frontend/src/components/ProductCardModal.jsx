/* eslint-disable react/prop-types */

const ProductCardModal = ({ produto }) => {
  return (
    <>
      <input
        type="checkbox"
        id={"produto-" + produto.id}
        className="modal-toggle"
      />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <div className="carousel w-full">
            {produto.url_imagens.map((imagem, index, imagens) => {
              return (
                <div
                  id={"slide" + index}
                  key={index}
                  className="carousel-item relative w-full"
                >
                  <img
                    src={"/pizza-images/" + imagem}
                    className="w-full"
                  />
                  {imagens.length > 1 && (<div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                    <a href={index > 0 ? "#slide" + String(index - 1) : "#slide" + String(index)} className="btn btn-circle">
                      ❮
                    </a>
                    <a href={index < imagens.length - 1 ? "#slide" + String(index + 1) : "#slide" + String(index)} className="btn btn-circle">
                      ❯
                    </a>
                  </div>)}
                </div>
              );
            })}
          </div>
          <h3 className="text-lg font-bold">{produto.nome}</h3>
          <p className="py-4">This modal works with a hidden checkbox!</p>
        </div>
        <label className="modal-backdrop" htmlFor={"produto-" + produto.id}>
          Close
        </label>
      </div>
    </>
  );
};

export default ProductCardModal;

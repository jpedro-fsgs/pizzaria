import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

function PizzaCarousel({ imagens }: { imagens: string[] }) {
  return (
    <Carousel className="w-full max-w-xs mx-auto">
      <CarouselContent>
        {imagens.map((imagem, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <img className="size-48 mx-auto" src={"/pizza-images/" + imagem} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {imagens.length > 1 && (
        <>
          <CarouselPrevious />
          <CarouselNext />
        </>
      )}
    </Carousel>
  );
}

export default PizzaCarousel;

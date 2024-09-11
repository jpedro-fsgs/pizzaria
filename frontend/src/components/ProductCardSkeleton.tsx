import { Skeleton } from './ui/skeleton'

const ProductCardSkeleton = () => {
  return (
    <div className="bg-base-100 w-80 rounded-lg shadow-xl p-5">
      <Skeleton className="m-6 p-2 h-[125px] w-[250px] rounded-xl bg-neutral-content" />
      <div className="flex flex-col items-center text-center space-y-5">
        <Skeleton className="h-8 w-[150px] bg-neutral-content" />
        <Skeleton className="h-5 w-[200px] bg-neutral-content" />
        <Skeleton className="w-[62px] h-[62px] rounded-full bg-neutral-content" />
      </div>
    </div>
  )
}

export default ProductCardSkeleton
import { Title } from "@/components";
import Link from "next/link";
import { ProductsInCart } from "./ui/ProductsInCart";
import { PlaceOrder } from "./ui/PlaceOrder";





export default function CheckOutPage() {

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title
          title="Verificar orden"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">

          {/* Carrito */}
          <div className="flex flex-col mt-5">
            <span className="text-xl">Ajustar elementos</span>
            <Link href={'/cart'} className="underline mb-5">
              Editar carrito
            </Link>



            {/* items */}
            <ProductsInCart />
          </div>
          {/* Checkout */}
          <PlaceOrder />

        </div>
      </div>
    </div>
  )
}

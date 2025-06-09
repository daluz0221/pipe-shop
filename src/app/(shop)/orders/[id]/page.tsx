import { getOrderById } from "@/actions";
import { OrderStatus, PayPalButton, Title } from "@/components";
import Image from "next/image";
import { redirect } from "next/navigation";
import { currencyFormat } from "@/utils";




interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function OrderIdPage({ params }: Props) {

  const { id } = await params;

  //TODO: Llamar el server action
  const { ok, order } = await getOrderById(id);


  if (!ok) {
    redirect('/')
  }

  const address = order!.OrderAddress


  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title
          title={`Orden #${id.split('-').at(0)}`}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">

          {/* Carrito */}
          <div className="flex flex-col mt-5">
            <OrderStatus isPaid={ order?.isPaid } />
            {/* items */}
            {
              order?.OrderItem.map(({ product, price, quantity, size }) => (
                <div className="flex mb-5" key={product.slug + '-' + size}>
                  <Image
                    src={`/products/${product.Image[0].url}`}
                    width={100}
                    height={100}
                    style={{
                      width: '100px',
                      height: '100px'
                    }}
                    alt={product.title}
                    className="mr-5 rounded"
                  />

                  <div >
                    <p>{product.title}</p>
                    <p>${price} x {quantity}</p>
                    <p className="font-bold">Subtotal: {currencyFormat(price * quantity)}</p>

                    <button className="underline mt-3">
                      Remover
                    </button>
                  </div>
                </div>
              ))
            }
          </div>
          {/* Checkout */}
          <div className="bg-white rounded-xl shadow-xl p-7">

            <h2 className="text-2xl font-bold mb-2">Dirección de entrega</h2>
            <div className="mb-10">
              <p>{address!.firsName} {address!.lastName}</p>
              <p>{address!.address}</p>
              <p>{address!.address2}</p>
              <p>{address!.postalCode}</p>
              <p>{address!.city}, {address!.countryId}</p>
              <p>{address!.phone}</p>
            </div>

            {/* Divider */}
            <div className="w-full h-0.5 rounded bg-gray-200 mb-10"></div>


            <h2 className="text-2xl font-bold mb-2">Resumen de orden</h2>

            <div className="grid grid-cols-2">
              <span>No. Productos</span>
               <span className="text-right">
                {
                  order!.itemsInOrder > 1
                    ? `${order?.itemsInOrder} Artículos`
                    : '1 Artículo'
                }
              </span>

              <span>Sub Total</span>
              <span className="text-right">{currencyFormat(order!.subTotal)} </span>

              <span>Impuestos</span>
              <span className="text-right">{currencyFormat(order!.tax)} </span>

              <span className="text-2xl mt-5">Total:</span>
              <span className="mt-5 text-2xl text-right">{currencyFormat(order!.total)}</span>


            </div>

            <div className="mt-5 mb-2 w-full">
                {
                  order?.isPaid 
                  ? (
                    <OrderStatus isPaid={ order.isPaid }/>
                  )
                  : (
                    <PayPalButton 
                      amount={order!.total}
                      orderId={ order!.id }
                    />

                  )
                }
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

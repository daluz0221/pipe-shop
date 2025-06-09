export const revalidate = 120

import { ProductMobileSlideshow, ProductSlideshow, StockLabel } from "@/components";
import { titleFont } from "@/config/fonts";
import { notFound } from "next/navigation";
import { getProductBySlug } from '../../../../actions/products/get-product-by-slug';
import { Metadata, ResolvingMetadata } from "next";
import { AddToCart } from "./ui/AddToCart";



interface Props {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata(
  { params }: Props,
  // eslint-disable-next-line
  _: ResolvingMetadata
): Promise<Metadata> {
  const slug = (await params).slug
 
  // fetch post information
  const product = await getProductBySlug( slug )
 
  return {
    title: product?.title ?? 'Producto no encontrado',
    description: product?.description ?? '',
    openGraph: {
      title: product?.title ?? 'Producto no encontrado',
      description: product?.description ?? '',
      images: [`/products/${ product?.images[1] }`]
    }
  }
}
 

export default async function ProductSlugPage({ params }:Props){

  const { slug } = await params;
  const product = await getProductBySlug( slug )

  if (!product){
    notFound();
  }

  return (
    <div className="mt-5 mb-20 grid grid-cols-1 md:grid-cols-3 gap-3">
        
    {/* Slideshow */}
      <div className="col-span-1 md:col-span-2">

        {/* Mobile slide */}
        <ProductMobileSlideshow 
          title={ product.title }
          images={ product.images }
          className="block md:hidden"
        />
        {/* Desktop slide */}
        <ProductSlideshow 
          title={ product.title }
          images={ product.images }
          className="hidden md:block"
        />


      </div>

    {/* Detalles de prod */}
      <div className="col-span-1 px-5">
        <StockLabel slug={ product.slug } />
        <h1 className={`${ titleFont.className } antialiased font-bold text-xl`}>
          { product.title }
        </h1>
        <p className="text-lg mb-5">
          { product.price }
        </p>

      <AddToCart product={ product } />

      {/* Description */}
      <h3 className="font-bold text-sm">
        Descripción
      </h3>
      <p className="font-light">
        { product.description }
      </p>


      </div>

    </div>
  )
}

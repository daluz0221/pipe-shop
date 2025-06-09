export const revalidate = 60

import { getPaginateProductsWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
import { redirect } from "next/navigation";

interface Props {
  searchParams: Promise<{
    page?: string;
  }>
}


export default async function Home({ searchParams }:Props) {

  const { page: pageParams } = await searchParams;
  const page = pageParams ? parseInt( pageParams ) : 1;
 
  

  const { products, totalPages } = await getPaginateProductsWithImages({page});



  if (products.length === 0 ){
    redirect('/')
  }


  return (
    <>
      <Title 
        title="Tienda" 
        subTitle="Todos los productos"
        className="mb-2"  
      />

      <ProductGrid 
        products={products}
      />

      <Pagination totalPages={totalPages} />
    </>
  );
}

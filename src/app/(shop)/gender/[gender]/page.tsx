export const revalidate = 60

import { getPaginateProductsWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
import { Gender } from "@/generated/prisma";


interface Props {

  params: Promise<{ gender: string }>
  searchParams: Promise<{ page?: string }>

}


export default async function GenderPage({params, searchParams}:Props){

  const { gender } = await params;
    const { page: pageParams} = await searchParams
    const page = pageParams ? parseInt( pageParams ) : 1
    console.log({gender});
    
  
  // const products = initialData.products.filter( product => product.gender === id || product.gender === 'unisex' ) 
  const { products, totalPages } = await getPaginateProductsWithImages({page, gender: gender as Gender});
  
  

  
  let productsFor = '';
  let title = '';
  
  if (gender === 'men') {
    productsFor = 'Hombres'
  } else if (gender === 'women'){
    productsFor = 'Mujeres'
  } else {
    productsFor = 'Niños'
  }

  if (gender === 'men') {
    title = 'Hombres'
  } else if (gender === 'women'){
    title = 'Mujeres'
  } else {
    title = 'Niños'
  }

  return (
    <>
       <Title 
        title={ title } 
        subTitle={`Productos para ${ productsFor }`}
        className="mb-2"  
      />

      <ProductGrid 
        products={products}
      /> 

       <Pagination totalPages={totalPages} />
    </>
  )
}

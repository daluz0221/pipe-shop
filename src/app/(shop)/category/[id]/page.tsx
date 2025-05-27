import { ProductGrid, Title } from "@/components";
import { ValidCategories } from "@/interfaces";
import { initialData } from "@/seed/seed";
import { notFound } from "next/navigation";


interface Props {

  params: {
    id:ValidCategories;
  }

}


export default async function ({params}:Props){

  const { id } = await params;
  
  const products = initialData.products.filter( product => product.gender === id || product.gender === 'unisex' ) 

  
  // if(id === 'kids'){
  //   notFound();
  // }
  
  let productsFor = '';
  let title = '';
  
  if (id === 'men') {
    productsFor = 'Hombres'
  } else if (id === 'women'){
    productsFor = 'Mujeres'
  } else {
    productsFor = 'Niños'
  }

  if (id === 'men') {
    title = 'Hombres'
  } else if (id === 'women'){
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
    </>
  )
}

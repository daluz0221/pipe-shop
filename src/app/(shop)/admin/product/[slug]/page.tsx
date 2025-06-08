import { getCategories, getProductBySlug } from "@/actions";
import { Title } from "@/components";
import { redirect } from "next/navigation";
import { ProductForm } from "./ui/ProductForm";


interface Props {
  params: Promise<{
    slug: string
  }>
}


export default async function ProductPage({ params }:Props) {

  const slug = (await params).slug;

  // mejora de fernando
  const [ product, {categories} ] = await Promise.all([
    getProductBySlug( slug ),
    getCategories()
  ]);

  console.log(product, 'from pae');
  

  if (!categories){
    redirect('/admin/products')
  }

  // TODO: new

  if(!product){
    redirect('/admin/products')
  };

  const title = (slug === 'new') ? 'Nuevo producto':'Editar producto'


  return (
    <>
      <Title title={ title } />
      <ProductForm product={ product } categories={ categories } />
    
    </>
  );
}
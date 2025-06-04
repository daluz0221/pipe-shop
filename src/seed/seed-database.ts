import { initialData } from "./seed";
import prisma from '../lib/prisma';
import { countries } from "./seed-countries";





async function main() {
    

    // Borrar registros previos
    // await Promise.all([
    
       await prisma.userAddress.deleteMany(); 
       await prisma.user.deleteMany();
       await prisma.country.deleteMany();
       await prisma.productImage.deleteMany();
       await prisma.product.deleteMany();
       await prisma.category.deleteMany();
    // ]);

    const { categories, products, users } = initialData;
  

    //Users
    await prisma.user.createMany({
        data: users
    });

    // Countries
    await prisma.country.createMany({
        data: countries
    })

    // Categorias
    const categoriesData = categories.map( cat => ({
        name: cat
    }))
    await prisma.category.createMany({
        data: categoriesData
    })

    const categoriesDB = await prisma.category.findMany();
    
    const categoriesMap = categoriesDB.reduce( (map, category)  => {

        map[category.name.toLocaleLowerCase()] = category.id 

        return map

    }, {} as Record<string, string>)
   
    // Products
    products.forEach( async(product) => {

        const { type, images, ...insertProduct } = product;
        const dbProduct = await prisma.product.create({
            data: {
                ...insertProduct,
                categoryId: categoriesMap[type]
            }
        });

        //Images
        const imagesData = images.map( img => ({
            url: img,
            productId: dbProduct.id
        }));

        await prisma.productImage.createMany({
            data: imagesData
        });

    })
    
    


    console.log('Seed ejecutado');
    
}





(()=>{
    
    if (process.env.NODE_ENV === 'production') return;
    
    main()

})();

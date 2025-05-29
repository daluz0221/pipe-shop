


export const generatePaginationNumbers = ( currentPage: number, totalPages: number ) => {
  
    if( totalPages <= 7){
        return Array.from({ length: totalPages }, (_, i) => i + 1)
    };

    //Si la página actual está entre las 3 primeras
    // mostrar las 3 primeras, ..., ultimas 2
    if (currentPage <= 3){
        return[1,2,3,'...', totalPages - 1, totalPages]
    }

    //Si la página actual está en las últimas páginas

    if ( currentPage >= totalPages - 2){
        return [1,2,'...', totalPages - 2, totalPages - 1, totalPages]
    }

    //Si la pag actual está en un lugar medio
    // primera página, puntos, current, puntos, final
    return [
        1,
        '...',
        currentPage - 1,
        currentPage,
        currentPage + 1,
        '...',
        totalPages
    ]


};
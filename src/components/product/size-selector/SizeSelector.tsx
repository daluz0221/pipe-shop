import type { ValidSizes } from "@/interfaces"
import clsx from "clsx";

interface Props {
    selectedSize?: ValidSizes;
    availableSizes: ValidSizes[];

    onSizeChange: ( size: ValidSizes ) => void
}



export const SizeSelector = ({ selectedSize, availableSizes, onSizeChange }:Props) => {


  return (
   <div className="my-5">
    <h3 className="font-bold mb-4">Tallas disponibles</h3>

    <div className="flex">
        {
            availableSizes.map( size => (
                <button 
                    key={ size }
                    onClick={()=> onSizeChange( size )}
                    className={
                        clsx(
                            "mx-2 hover:bg-blue-200 hover:text-white hover:rounded p-1 text-lg cursor-pointer ",
                            {
                                'bg-blue-500 text-white rounded p-1': size === selectedSize
                            }
                        )
                    }
                >
                    { size }
                </button>
            ))
        }
    </div>

   </div>
  )
}

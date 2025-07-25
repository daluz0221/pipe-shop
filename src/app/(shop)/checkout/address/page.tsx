import { Title } from '@/components';
import { getCountries, getUserAddress } from '@/actions';
import AddresProvider from './ui/AddresProvider';
import { auth } from '@/auth.config';
import { redirect } from 'next/navigation';

export default async function  AddressPage() {

  const countries = await getCountries();
  
  const session = await auth();

  if (!session?.user){
    redirect('/auth/login')
  }

  const userAddress = await getUserAddress( session.user.id )

  return (
    <div className="flex flex-col sm:justify-center sm:items-center mb-72 px-10 sm:px-0">



      <div className="w-full  xl:w-[1000px] flex flex-col justify-center text-left">
        
        <Title title="Dirección" subTitle="Dirección de entrega" />
        
          <AddresProvider countries={countries} userStoreAddress={userAddress ?? undefined} />
      </div>




    </div>
  );
}
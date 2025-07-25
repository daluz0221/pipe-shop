export const revalidate = 0

// https://tailwindcomponents.com/component/hoverable-table
import { getPaginatedUsers } from '@/actions';
import { Pagination, Title } from '@/components';


import { redirect } from 'next/navigation';
import { UsersTable } from './ui/UsersTable';

export default async function adminUserPage() {

  const { ok, users = [] } = await getPaginatedUsers();

  if (!ok) {
    redirect('/auth/login')
  }

  return (
    <>
      <Title title="User maintenance" />

      <div className="mb-10">
        <UsersTable users={ users } />

        <Pagination totalPages={1} />
      </div>
    </>
  );
}
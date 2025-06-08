export const validate = 0

// https://tailwindcomponents.com/component/hoverable-table
import { getPaginatedOrders, getPaginatedUsers } from '@/actions';
import { Pagination, Title } from '@/components';

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { IoCardOutline } from 'react-icons/io5';
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
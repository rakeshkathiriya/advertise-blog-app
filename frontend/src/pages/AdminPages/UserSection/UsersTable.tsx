import { memo, useEffect, useMemo, useState } from 'react';
import { InfiniteScrollTable, type TableColumn } from '../../../components/AdminPanel/InfiniteTable';
import Pagination from '../../../components/AdminPanel/Pagination';
import { useGetSubScribeUserList } from '../../../queries/adminPanel/users.query';
import type { UserDetails } from '../../../utils/types/users';

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  expiredDate: string;
  foreEverSubscribe: boolean;
}

export interface UserWithIndex extends User {
  index: number;
}

const UsersTable = ({
  canRefresh,
  setCanRefresh,
  setEditingUser,
  searchFilter,
}: {
  canRefresh: boolean;
  setCanRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingUser: React.Dispatch<React.SetStateAction<UserDetails | null>>;
  searchFilter: {
    email: string;
    isSubscribed: string;
  } | null;
}) => {
  // States
  const [selectedRow, setSelectedRow] = useState<{ data: UserDetails; index: number } | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);

  // API hooks
  const tableQuery = useGetSubScribeUserList({
    email: searchFilter?.email ?? '',
    isSubscribed: searchFilter?.isSubscribed ?? 'all',
    isForeverSubscribe: 'false',
    page: pageNumber,
  });

  // Handlers
  const tableData = useMemo(() => {
    return tableQuery.data?.data ?? [];
  }, [tableQuery.data]);

  const pagination = useMemo(() => {
    return tableQuery.data?.pagination;
  }, [tableQuery.data]);

  // Effects
  useEffect(() => {
    const records = tableData;
    if (records && records.length > 0 && selectedRow === null) {
      const firstRecord = records[0];
      setSelectedRow({ data: firstRecord, index: 0 });
    }
  }, [tableData, selectedRow]);

  useEffect(() => {
    if (canRefresh) {
      tableQuery.refetch();
      setCanRefresh(false);
      setSelectedRow(null);
      setPageNumber(1);
    }
  }, [canRefresh, setCanRefresh, tableQuery]);

  const columns: TableColumn<UserDetails>[] = [
    {
      label: 'User Name',
      render: (data) => `${data.firstname} ${data.lastname}`,
    },
    {
      label: 'Email',
      accessor: 'email',
    },
    {
      label: 'Forever Subscribe',
      render: (data) => (data.isForeverSubscribe ? 'Yes' : 'No'),
    },
    {
      label: 'Status',
      render: (data) => (data.isSubscribed ? 'Active' : 'InActive'),
      tdProps: (data) => {
        return {
          className: `px-3 py-2 text-[14px] font-semibold tracking-wide whitespace-nowrap ${data.isSubscribed ? 'text-green-700' : 'text-red-600'}`,
        };
      },
    },
  ];

  return (
    <>
      <InfiniteScrollTable<UserDetails>
        columns={columns}
        data={tableData}
        tableCaption="User Subscriptions Table"
        containerClassName="w-full overflow-x-auto rounded-lg border border-gray-200 shadow-2xl"
        selectedRowIndex={selectedRow?.index ?? -1}
        onRowClick={(data, index) => {
          setSelectedRow({ data, index });
        }}
        onRowDoubleClick={(data) => {
          setEditingUser({ ...data });
        }}
        isLoading={tableQuery.isLoading}
      />
      <Pagination
        currentPage={pageNumber}
        totalPages={pagination?.totalPages ?? 1}
        totalItems={pagination?.totalRecords ?? 0}
        itemsPerPage={pagination?.limit ?? 10}
        onPageChange={setPageNumber}
        itemLabel="users"
      />
    </>
  );
};

export default memo(UsersTable);

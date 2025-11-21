import { memo, useEffect, useMemo, useState } from 'react';
import { InfiniteScrollTable, type TableColumn } from '../../../components/AdminPanel/InfiniteTable';
import Pagination from '../../../components/AdminPanel/Pagination';
import { initialUsers } from '../../../utils/staticData/staticData';

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
  setEditingClient,
  currentPage,
  setCurrentPage,
}: {
  setEditingClient: React.Dispatch<React.SetStateAction<UserWithIndex | null>>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}) => {
  // States
  const [selectedRow, setSelectedRow] = useState<{ data: User; index: number } | null>(null);

  // API hooks
  //   const tableQuery = useGetTerritoryTableDetails();

  // Handlers
  const tableData = useMemo(() => {
    return initialUsers;
  }, [initialUsers]);

  const parseDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split('/');
    return new Date(Number(year), Number(month) - 1, Number(day));
  };

  const getRemainingDays = (expiredDate: string): string => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expired = parseDate(expiredDate);
    if (expired > today) {
      const diffTime = expired.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} days`;
    }
    return '0 days';
  };

  const getStatus = (expiredDate: string): 'Active' | 'InActive' => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expired = parseDate(expiredDate);
    return expired > today ? 'Active' : 'InActive';
  };

  // Effects
  useEffect(() => {
    const records = tableData;
    if (records && records.length > 0 && selectedRow === null) {
      const firstRecord = records[0];
      setSelectedRow({ data: firstRecord, index: 0 });
    }
  }, [tableData, selectedRow]);

  const columns: TableColumn<User>[] = [
    {
      label: 'User Name',
      render: (data) => `${data.firstName} ${data.lastName}`,
    },
    {
      label: 'Email',
      accessor: 'email',
    },
    {
      label: 'Email',
      accessor: 'email',
    },
    {
      label: 'Forever Subscribe',
      render: (data) => (data.foreEverSubscribe ? 'Yes' : 'No'),
    },
    {
      label: 'S.Expired Date',
      accessor: 'expiredDate',
    },
    {
      label: 'Status',
      render: (data) => getStatus(data.expiredDate) || 'N/A',
      tdProps: (data) => {
        const status = getStatus(data.expiredDate);
        return {
          className: `px-3 py-2 text-[14px] font-semibold tracking-wide whitespace-nowrap ${status === 'InActive' ? 'text-red-600' : 'text-green-700'}`,
        };
      },
    },
    {
      label: 'Remaining Days',
      render: (data) => getRemainingDays(data.expiredDate) ?? 'N/A',
    },
  ];

  return (
    <>
      <InfiniteScrollTable<User>
        columns={columns}
        data={tableData}
        tableCaption="User Subscriptions Table"
        containerClassName="w-full overflow-x-auto rounded-lg border border-gray-200 shadow-2xl"
        selectedRowIndex={selectedRow?.index ?? -1}
        onRowClick={(data, index) => {
          setSelectedRow({ data, index });
        }}
        onRowDoubleClick={(data, index) => {
          setEditingClient({ ...data, index });
        }}
        isLoading={false}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(tableData.length / 10)}
        totalItems={tableData.length}
        itemsPerPage={10}
        onPageChange={setCurrentPage}
        itemLabel="users"
      />
    </>
  );
};

export default memo(UsersTable);

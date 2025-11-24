import { memo, useEffect, useMemo, useState } from 'react';
// import { FaPlay } from 'react-icons/fa';
import { InfiniteScrollTable, type TableColumn } from '../../../components/AdminPanel/InfiniteTable';
import Pagination from '../../../components/AdminPanel/Pagination';
import { initialForeEverUsers } from '../../../utils/staticData/staticData';

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

const ForEverSubscriptionUsersTable = ({
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
    return initialForeEverUsers;
  }, [initialForeEverUsers]);

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
      label: 'Forever Subscribe',
      render: (data) => (data.foreEverSubscribe ? 'Yes' : 'No'),
    },
    {
      label: 'Status',
      render: (data) => (data.foreEverSubscribe ? 'Active' : 'InActive'),
      tdProps: (data) => {
        return {
          className: `px-3 py-2 text-[14px] font-semibold tracking-wide whitespace-nowrap ${data.foreEverSubscribe ? 'text-green-700' : 'text-red-600'}`,
        };
      },
    },
  ];

  return (
    <>
      <InfiniteScrollTable<User>
        columns={columns}
        data={tableData}
        tableCaption="User ForEver Subscriptions Table"
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

export default memo(ForEverSubscriptionUsersTable);

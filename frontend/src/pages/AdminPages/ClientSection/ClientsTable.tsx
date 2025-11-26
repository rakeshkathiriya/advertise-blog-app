import { format } from 'date-fns';
import { memo, useEffect, useMemo, useState } from 'react';
import { InfiniteScrollTable, type TableColumn } from '../../../components/AdminPanel/InfiniteTable';
import { useGetClientsList } from '../../../queries/adminPanel/clients.query';
import { getRemainingDays, getStatus } from '../../../utils/dateUtils';
import type { ClientDetails } from '../../../utils/types/clients';

export interface Client {
  name: string;
  poc: string;
  email: string;
  postLimit: string;
  expiredDate: string;
  contact: string;
}

export interface ClientWithIndex extends Client {
  index: number;
}

const ClientsTable = () => {
  // States
  const [selectedRow, setSelectedRow] = useState<{ data: ClientDetails; index: number } | null>(null);

  // API hooks
  const tableQuery = useGetClientsList();

  // Handlers
  const tableData = useMemo(() => {
    return tableQuery.data?.data ?? [];
  }, [tableQuery.data]);

  // Effects
  useEffect(() => {
    const records = tableData;
    if (records && records.length > 0 && selectedRow === null) {
      const firstRecord = records[0];
      setSelectedRow({ data: firstRecord, index: 0 });
    }
  }, [tableData, selectedRow]);

  const handleDelete = (idx: number) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      tableData.splice(idx, 1);
      alert('Client deleted successfully.');
    }
  };

  const columns: TableColumn<ClientDetails>[] = [
    {
      label: 'Company Name',
      accessor: 'name',
    },
    {
      label: 'POC',
      accessor: 'poc',
    },
    {
      label: 'Email',
      accessor: 'email',
    },
    {
      label: 'Post Limit',
      accessor: 'postLimit',
      className: 'w-12!',
    },
    {
      label: 'Ads Posted',
      render: (data) => data.posts.length,
      className: 'w-12!',
    },
    {
      label: 'S.Expired Date',
      // accessor: 'expiredDate',
      render: (data) => {
        const utcDate = new Date(data.expiredDate);

        // convert UTC → IST
        const istDate = new Date(utcDate.getTime() - 5.5 * 60 * 60 * 1000);

        const formatted = format(istDate, 'yyyy-MM-dd | hh:mm:ss a');
        return formatted;
      },
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
    {
      label: 'Actions',
      render: (_data, index) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(index);
          }}
          className="flex w-full cursor-pointer text-red-600 transition-colors hover:text-red-800"
          title="Delete client"
        >
          🗑️
        </button>
      ),
    },
  ];

  return (
    <>
      <InfiniteScrollTable<ClientDetails>
        columns={columns}
        data={tableData}
        tableCaption="Client Subscriptions Table"
        containerClassName="w-full overflow-x-auto rounded-lg border border-gray-200 shadow-2xl"
        selectedRowIndex={selectedRow?.index ?? -1}
        onRowClick={(data, index) => {
          setSelectedRow({ data, index });
        }}
        onRowDoubleClick={(data, index) => {
          // setEditingClient({ ...data, index });
        }}
        isLoading={tableQuery.isLoading}
      />
      {/* <Pagination
        currentPage={0}
        totalPages={Math.ceil(tableData.length / 10)}
        totalItems={tableData.length}
        itemsPerPage={10}
        onPageChange={setCurrentPage}
        itemLabel="clients"
      /> */}
    </>
  );
};

export default memo(ClientsTable);

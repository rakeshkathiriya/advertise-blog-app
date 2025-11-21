import { memo, useEffect, useMemo, useState } from 'react';
import { FaPlay } from 'react-icons/fa';
import { InfiniteScrollTable, type TableColumn } from '../../../components/AdminPanel/InfiniteTable';
import Pagination from '../../../components/AdminPanel/Pagination';
import { initialClients } from '../../../utils/staticData/staticData';

export interface Client {
  name: string;
  poc: string;
  email: string;
  postLimit: string;
  expiredDate: string;
}

export interface ClientWithIndex extends Client {
  index: number;
}

const RenderArrow = (index: number, arrowIndex: number) => {
  if (arrowIndex === index) {
    return <FaPlay size={16} color="#000" />;
  }
  return <></>;
};

const ClientsTable = ({
  setEditingClient,
  currentPage,
  setCurrentPage,
}: {
  setEditingClient: React.Dispatch<React.SetStateAction<ClientWithIndex | null>>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}) => {
  // States
  const [selectedRow, setSelectedRow] = useState<{ data: Client; index: number } | null>(null);

  // API hooks
  //   const tableQuery = useGetTerritoryTableDetails();

  // Handlers
  const tableData = useMemo(() => {
    return initialClients;
  }, [initialClients]);

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

  const handleDelete = (idx: number) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      tableData.splice(idx, 1);
      alert('Client deleted successfully.');
    }
  };

  const columns = (selectedIndex: number | null): TableColumn<Client>[] => [
    {
      label: '',
      render: (_data, index) => {
        return selectedIndex != null && RenderArrow(index, selectedIndex);
      },
      className: 'w-12!',
    },
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
    {
      label: 'Actions',
      render: (_data, index) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(index);
          }}
          className="cursor-pointer text-red-600 transition-colors hover:text-red-800"
          title="Delete client"
        >
          🗑️
        </button>
      ),
    },
  ];

  return (
    <>
      <InfiniteScrollTable<Client>
        columns={columns(selectedRow?.index ?? null)}
        data={tableData}
        tableCaption="Territories"
        containerClassName="w-full overflow-x-auto rounded-lg border border-gray-200 shadow-2xl"
        selectedRowIndex={selectedRow?.index ?? -1}
        onRowClick={(data, index) => {
          setSelectedRow({ data, index });
        }}
        onRowDoubleClick={(data, index) => {
          setEditingClient({ ...data, index });
        }}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(tableData.length / 10)}
        totalItems={tableData.length}
        itemsPerPage={10}
        onPageChange={setCurrentPage}
        itemLabel="clients"
      />
    </>
  );
};

export default memo(ClientsTable);

import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { InfiniteScrollTable, type TableColumn } from '../../../components/AdminPanel/InfiniteTable';
import Pagination from '../../../components/AdminPanel/Pagination';
import DeletePopup from '../../../components/common/DeletePopup';
import { useDeleteClient, useGetClientsList } from '../../../queries/adminPanel/clients.query';
import { getRemainingDays, getStatus } from '../../../utils/dateUtils';
import type { ClientDetails } from '../../../utils/types/clients';

const ClientsTable = ({
  canRefresh,
  setCanRefresh,
  setEditingClient,
  searchFilter,
}: {
  canRefresh: boolean;
  setCanRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingClient: React.Dispatch<React.SetStateAction<ClientDetails | null>>;
  searchFilter: {
    name: string;
    status: string;
  } | null;
}) => {
  // States
  const [selectedRow, setSelectedRow] = useState<{ data: ClientDetails; index: number } | null>(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);

  // API hooks
  const tableQuery = useGetClientsList({
    name: searchFilter?.name ?? '',
    status: searchFilter?.status ?? 'all',
    page: pageNumber,
  });
  const { mutate: deleteMutate, isPending: deleteClient } = useDeleteClient();

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

  const handleDelete = useCallback(async () => {
    if (!selectedPostId) return;
    deleteMutate(
      { id: selectedPostId },
      {
        onSuccess: (data) => {
          if (data?.status) {
            toast.success(data?.message ?? 'Client deleted successfully');
            tableQuery.refetch();
            setShowDeletePopup(false);
            setSelectedPostId(null);
            setSelectedRow(null);
            setPageNumber(1);
          }
        },
        onError: (error) => {
          console.error('Error:', error);
          toast.error(error.message ?? 'Failed to delete a client');
        },
      },
    );
  }, [deleteMutate, tableQuery, selectedPostId]);

  const columns: TableColumn<ClientDetails>[] = [
    {
      label: 'Firm',
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
      label: 'Post Qty',
      accessor: 'postLimit',
      className: 'w-12!',
    },
    {
      label: 'Post',
      render: (data) => data?.posts?.length,
      className: 'w-12!',
    },
    {
      label: 'Exp. Date',
      render: (data) => {
        const utcDate = new Date(data.expiredDate);

        // convert UTC → IST
        const istDate = new Date(utcDate.getTime() - 5.5 * 60 * 60 * 1000);

        const formatted = format(istDate, 'yyyy-MM-dd | hh:mm:ss a');
        return formatted;
      },
    },
    {
      label: 'State',
      render: (data) => getStatus(data.expiredDate) || 'N/A',
      tdProps: (data) => {
        const status = getStatus(data.expiredDate);
        return {
          className: `truncate overflow-hidden px-3 py-2 text-[14px] font-semibold tracking-wide whitespace-nowrap ${status === 'InActive' ? 'text-red-600' : 'text-green-700'}`,
        };
      },
    },
    {
      label: 'Days Left',
      render: (data) => getRemainingDays(data.expiredDate) ?? 'N/A',
    },
    {
      label: 'Actions',
      render: (data, index) => (
        <span
          onClick={(e) => {
            e.stopPropagation();
            setSelectedRow({ data, index });
            setSelectedPostId(data._id);
            setShowDeletePopup(true);
          }}
          className="flex w-full cursor-pointer items-center justify-center overflow-hidden text-red-600 hover:text-red-800"
          title="Delete client"
        >
          <Trash2 size={20} />
        </span>
      ),
    },
  ];

  return (
    <>
      <InfiniteScrollTable<ClientDetails>
        columns={columns}
        data={tableData}
        tableCaption="Subscribed Clients"
        containerClassName="w-full overflow-x-auto rounded-lg border border-gray-200 shadow-2xl"
        selectedRowIndex={selectedRow?.index ?? -1}
        onRowClick={(data, index) => {
          setSelectedRow({ data, index });
        }}
        onRowDoubleClick={(data) => {
          setEditingClient({ ...data });
        }}
        isLoading={tableQuery.isLoading}
      />
      <Pagination
        currentPage={pageNumber}
        totalPages={pagination?.totalPages ?? 1}
        totalItems={pagination?.totalRecords ?? 0}
        itemsPerPage={pagination?.limit ?? 10}
        onPageChange={setPageNumber}
        itemLabel="clients"
      />
      {showDeletePopup && (
        <DeletePopup
          title="Delete Client ?"
          onConfirm={handleDelete}
          onCancel={() => {
            setShowDeletePopup(false);
            setSelectedPostId(null);
          }}
          loading={deleteClient}
        />
      )}
    </>
  );
};

export default memo(ClientsTable);

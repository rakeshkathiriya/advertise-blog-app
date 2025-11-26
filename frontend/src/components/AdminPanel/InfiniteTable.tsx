import React, { useEffect, useRef, useState } from 'react';

type CellContent = string | React.ReactNode;

export interface TableColumn<T> {
  label: string | React.ReactNode;
  accessor?: keyof T;
  className?: string;
  style?: React.CSSProperties;
  render?: (item: T, rowIndex: number) => React.ReactNode;
  tdProps?:
    | React.HTMLAttributes<HTMLTableCellElement>
    | ((item: T, rowIndex: number) => React.HTMLAttributes<HTMLTableCellElement>);
  width?: number;
  minWidth?: number;
  key?: string;
}

export interface HeaderCell {
  content?: CellContent;
  colSpan?: number;
  className?: string;
  style?: React.CSSProperties;
}

export interface HeaderRow {
  cells: HeaderCell[];
  className?: string;
  style?: React.CSSProperties;
}

interface InfiniteScrollTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  customLoader?: React.ReactNode;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onRowClick?: (item: T, index: number, event: React.MouseEvent) => void;
  onRowDoubleClick?: (item: T, index: number, event: React.MouseEvent) => void;
  selectedRowIndex?: number | number[];
  containerClassName?: string;
  tableClassName?: string;
  tableCaption?: string;
  trProps?: (data: T, index: number) => React.HTMLAttributes<HTMLTableRowElement>;
  noOptionsMessage?: string;
  noOptionsClassName?: string;
  tableTextColor?: (item: T, rowIndex: number, colIndex: number) => string;
  tableRowBackgroundColor?: (item: T, rowIndex: number) => string;
}

export const col = <T, K extends keyof T>(
  accessor: K | undefined,
  label: string,
  className: `${string}` = '',
): TableColumn<T> => ({
  label,
  accessor,
  className,
});

export function InfiniteScrollTable<T>({
  columns,
  data,
  isLoading,
  customLoader,
  hasMore,
  onLoadMore,
  onRowClick,
  onRowDoubleClick,
  selectedRowIndex,
  containerClassName = 'h-40',
  tableClassName = '',
  tableCaption,
  trProps,
  noOptionsMessage = 'Data Not Found',
  noOptionsClassName = '',
  tableTextColor,
  tableRowBackgroundColor,
}: Readonly<InfiniteScrollTableProps<T>>) {
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const tableRef = useRef<HTMLTableElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [currentColumns] = useState<TableColumn<T>[]>(columns);

  useEffect(() => {
    const loaderEl = loaderRef.current;
    const containerEl = containerRef.current;
    if (!loaderEl || !containerEl) return;

    let isUnmounted = false;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (!isUnmounted && first.isIntersecting && hasMore && !isLoading) {
          onLoadMore?.();
        }
      },
      {
        root: containerEl,
        rootMargin: '0px 0px 16px 0px',
        threshold: 0.1,
      },
    );

    observer.observe(loaderEl);

    return () => {
      isUnmounted = true;
      observer.disconnect();
    };
  }, [hasMore, isLoading, onLoadMore]);

  function safeStringify(obj: Record<string, unknown>): string {
    try {
      return JSON.stringify(obj);
    } catch {
      return '[Object]';
    }
  }

  return (
    <div
      ref={containerRef}
      className={`custom-scroll custom-caption relative flex flex-col overflow-y-auto ${containerClassName}`}
    >
      <table ref={tableRef} className={`min-w-full divide-y divide-black/20 ${tableClassName}`}>
        <caption className="bg-[#aec2d1] px-3 py-2 text-base font-semibold tracking-wide text-nowrap whitespace-nowrap text-[#3a4b66]">
          {tableCaption}
        </caption>
        <thead className={`rounded-lg bg-[#aec2d1] text-left`}>
          <tr className="divide-x divide-black/20">
            {currentColumns.map((col, idx) => {
              return (
                <th
                  key={`header-${idx + 1}`}
                  className={`px-3 py-2 text-base font-semibold tracking-wide text-nowrap whitespace-nowrap text-[#3a4b66] ${col?.className}`}
                >
                  <div className="flex items-center justify-between pr-2">
                    <span className={'truncate'} title={col?.label?.toString()}>
                      {col.label}
                    </span>
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-black/20">
          {data.map((item, rowIndex) => {
            const isSelected = Array.isArray(selectedRowIndex)
              ? selectedRowIndex.includes(rowIndex)
              : selectedRowIndex === rowIndex;
            return (
              <tr
                key={`row-${rowIndex}-${(item as { id?: string })?.id ?? rowIndex}`}
                className={`divide-x divide-black/20 ${trProps?.(item, rowIndex)?.className} ${isSelected ? 'selectedRow' : ''}`}
                style={{
                  willChange: isSelected ? 'background-color, color' : 'auto',
                  transition: 'background-color 0.05s ease, color 0.05s ease',
                  cursor: onRowClick || onRowDoubleClick ? 'pointer' : 'default',
                  ...(tableRowBackgroundColor && { backgroundColor: tableRowBackgroundColor(item, rowIndex) }),
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onRowClick?.(item, rowIndex, e);
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onRowDoubleClick?.(item, rowIndex, e);
                }}
              >
                {currentColumns.map((col, colIndex) => {
                  let cellContent: React.ReactNode = null;
                  if (col.render) {
                    cellContent = col.render(item, rowIndex);
                  } else if (col.accessor) {
                    const value = item[col.accessor];
                    cellContent = value != null ? String(value) : '';
                  }
                  let titleText: string;
                  if (
                    typeof cellContent === 'object' &&
                    cellContent !== null &&
                    !Array.isArray(cellContent) &&
                    !React.isValidElement(cellContent) &&
                    !(cellContent instanceof Promise)
                  ) {
                    titleText = safeStringify(cellContent as unknown as Record<string, unknown>);
                  } else if (typeof cellContent === 'string') {
                    titleText = cellContent;
                  } else if (typeof cellContent === 'number' || typeof cellContent === 'boolean') {
                    titleText = cellContent.toString();
                  } else {
                    titleText = '';
                  }

                  return (
                    <td
                      key={`cell-${rowIndex}-${colIndex}`}
                      className={`truncate px-3 py-2 text-[14px] font-semibold tracking-wide whitespace-nowrap text-[#3a4b66] ${col.className ?? ''} ${typeof col.tdProps === 'function' && col.tdProps(item, rowIndex)?.className}`}
                      title={titleText}
                      style={{
                        transition: 'background-color 0.05s ease, color 0.05s ease',
                        ...col.style,
                        ...(tableTextColor && { color: tableTextColor(item, rowIndex, colIndex) }),
                      }}
                      {...(typeof col.tdProps === 'function' ? col.tdProps(item, rowIndex) : col.tdProps)}
                    >
                      {cellContent}
                    </td>
                  );
                })}
              </tr>
            );
          })}
          {isLoading && (
            <tr>
              <td colSpan={currentColumns.length} className="h-full border-none py-2 text-center">
                <div className="bg-opacity-50 absolute inset-0 z-500! flex h-full items-center justify-center bg-white">
                  {customLoader ?? (
                    <div className="h-6 w-6 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                  )}
                </div>
              </td>
            </tr>
          )}
          {!isLoading && data.length === 0 && (
            <tr>
              <td colSpan={currentColumns.length} className="h-full border-none py-4 text-center">
                <h1 className={`text-gray-500 ${noOptionsClassName}`}>{noOptionsMessage ?? 'Data Not Found'}</h1>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {hasMore && data?.length > 0 && !isLoading && <div ref={loaderRef} className="h-4"></div>}
    </div>
  );
}

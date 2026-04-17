import { useState, useMemo } from 'react';
import { MdChevronLeft, MdChevronRight, MdUnfoldMore, MdExpandLess, MdExpandMore } from 'react-icons/md';

const DataTable = ({ columns, data, pageSize = 10, onRowClick, emptyMessage = 'No data found' }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (!field) return;
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const sortedData = useMemo(() => {
    if (!sortField) return data;
    return [...data].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (aVal == null) aVal = '';
      if (bVal == null) bVal = '';
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <MdUnfoldMore size={14} style={{ opacity: 0.3 }} />;
    return sortDirection === 'asc' ? <MdExpandLess size={14} /> : <MdExpandMore size={14} />;
  };

  if (!data || data.length === 0) {
    return (
      <div className="empty-state">
        <h3>{emptyMessage}</h3>
      </div>
    );
  }

  return (
    <div>
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.875rem',
          }}
        >
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key || col.label}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  style={{
                    padding: '12px 16px',
                    textAlign: col.align || 'left',
                    borderBottom: '2px solid #e0d8cc',
                    background: '#F5F0E8',
                    color: '#1A2E0A',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    cursor: col.sortable !== false ? 'pointer' : 'default',
                    whiteSpace: 'nowrap',
                    userSelect: 'none',
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    {col.label}
                    {col.sortable !== false && col.key && <SortIcon field={col.key} />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, idx) => (
              <tr
                key={row._id || row.id || idx}
                onClick={() => onRowClick && onRowClick(row)}
                style={{
                  cursor: onRowClick ? 'pointer' : 'default',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#faf8f5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                }}
              >
                {columns.map((col) => (
                  <td
                    key={col.key || col.label}
                    style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid #f0ebe3',
                      textAlign: col.align || 'left',
                      color: '#1A1A1A',
                    }}
                  >
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 0',
            fontSize: '0.85rem',
            color: '#4d564a',
          }}
        >
          <span>
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} entries
          </span>
          <div style={{ display: 'flex', gap: 4 }}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="btn btn-secondary btn-sm"
              style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
            >
              <MdChevronLeft size={18} />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let page;
              if (totalPages <= 5) {
                page = i + 1;
              } else if (currentPage <= 3) {
                page = i + 1;
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i;
              } else {
                page = currentPage - 2 + i;
              }
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`btn btn-sm ${currentPage === page ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="btn btn-secondary btn-sm"
              style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
            >
              <MdChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;

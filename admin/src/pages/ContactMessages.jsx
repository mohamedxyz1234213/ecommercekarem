import { useCallback, useEffect, useState } from 'react';
import { MdMarkEmailRead, MdMarkEmailUnread, MdSearch } from 'react-icons/md';
import toast from 'react-hot-toast';
import API from '../api/axios';
import DataTable from '../components/DataTable';
import LoadingSpinner from '../components/LoadingSpinner';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchMessages = useCallback(async () => {
    try {
      const { data } = await API.get('/admin/contact-messages', {
        params: { page, limit: 20, search: search.trim() || undefined },
      });
      setMessages(data.messages || []);
      setPages(data.pages || 1);
      setTotal(data.total || 0);
    } catch {
      toast.error('Failed to fetch contact messages');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const toggleReadStatus = async (row) => {
    try {
      await API.put(`/admin/contact-messages/${row._id}/read`, { isRead: !row.isRead });
      setMessages((prev) =>
        prev.map((message) =>
          message._id === row._id ? { ...message, isRead: !row.isRead } : message
        )
      );
      toast.success(!row.isRead ? 'Marked as read' : 'Marked as unread');
    } catch {
      toast.error('Failed to update message status');
    }
  };

  const columns = [
    {
      key: 'createdAt',
      label: 'Date',
      render: (row) => (
        <span style={{ fontSize: '0.85rem', color: '#4d564a' }}>
          {new Date(row.createdAt).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'sender',
      label: 'Sender',
      sortable: false,
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.name}</div>
          <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{row.email}</div>
        </div>
      ),
    },
    {
      key: 'subject',
      label: 'Subject',
      render: (row) => row.subject || 'No Subject',
    },
    {
      key: 'message',
      label: 'Message',
      sortable: false,
      render: (row) => (
        <span
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            maxWidth: 420,
          }}
          title={row.message}
        >
          {row.message}
        </span>
      ),
    },
    {
      key: 'isRead',
      label: 'Status',
      render: (row) => (
        <span
          style={{
            padding: '3px 10px',
            borderRadius: 999,
            fontSize: '0.75rem',
            fontWeight: 700,
            background: row.isRead ? '#d1fae5' : '#fef3c7',
            color: row.isRead ? '#065f46' : '#92400e',
          }}
        >
          {row.isRead ? 'Read' : 'Unread'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (row) => (
        <button
          className={`btn btn-sm ${row.isRead ? 'btn-secondary' : 'btn-primary'}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleReadStatus(row);
          }}
        >
          {row.isRead ? <MdMarkEmailUnread size={14} /> : <MdMarkEmailRead size={14} />}
          {row.isRead ? 'Unread' : 'Read'}
        </button>
      ),
    },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="page-title">Contact Messages</h1>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="search-bar">
          <MdSearch size={18} />
          <input
            placeholder="Search by sender, email, subject, or message..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      <div className="card">
        <DataTable columns={columns} data={messages} pageSize={20} emptyMessage="No contact messages found" />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
        <span style={{ fontSize: '0.85rem', color: '#4d564a' }}>Total messages: {total}</span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            className="btn btn-secondary btn-sm"
            disabled={page <= 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            style={{ opacity: page <= 1 ? 0.6 : 1 }}
          >
            Previous
          </button>
          <span style={{ fontSize: '0.85rem', minWidth: 84, textAlign: 'center' }}>
            Page {page} / {pages}
          </span>
          <button
            className="btn btn-secondary btn-sm"
            disabled={page >= pages}
            onClick={() => setPage((prev) => Math.min(prev + 1, pages))}
            style={{ opacity: page >= pages ? 0.6 : 1 }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactMessages;

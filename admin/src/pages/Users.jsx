import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdSearch, MdEdit, MdDelete, MdVisibility } from 'react-icons/md';
import API from '../api/axios';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteModal, setDeleteModal] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [newRole, setNewRole] = useState('user');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await API.get('/users');
      setUsers(data.users || data || []);
    } catch {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    try {
      await API.delete(`/users/${deleteModal._id}`);
      toast.success('User deleted');
      setUsers(users.filter((u) => u._id !== deleteModal._id));
    } catch {
      toast.error('Failed to delete user');
    } finally {
      setDeleteModal(null);
    }
  };

  const handleRoleUpdate = async () => {
    if (!editModal) return;
    try {
      await API.put(`/users/${editModal._id}`, { role: newRole });
      toast.success(`Role updated to ${newRole}`);
      setUsers(users.map((u) => (u._id === editModal._id ? { ...u, role: newRole } : u)));
    } catch {
      toast.error('Failed to update role');
    } finally {
      setEditModal(null);
    }
  };

  const filtered = users.filter((u) => {
    if (!search) return true;
    return (
      (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(search.toLowerCase())
    );
  });

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#2D5016',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem',
              flexShrink: 0,
            }}
          >
            {(row.name || 'U').charAt(0).toUpperCase()}
          </div>
          <span style={{ fontWeight: 600 }}>{row.name || 'Unknown'}</span>
        </div>
      ),
    },
    { key: 'email', label: 'Email' },
    {
      key: 'role',
      label: 'Role',
      render: (row) => <StatusBadge status={row.role || 'user'} />,
    },
    {
      key: 'createdAt',
      label: 'Joined',
      render: (row) => (
        <span style={{ color: '#888', fontSize: '0.85rem' }}>
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'ordersCount',
      label: 'Orders',
      render: (row) => <span style={{ fontWeight: 600 }}>{row.ordersCount || row.orders?.length || 0}</span>,
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (row) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={(e) => { e.stopPropagation(); navigate(`/users/${row._id}`); }}
            title="View"
          >
            <MdVisibility size={14} />
          </button>
          <button
            className="btn btn-gold btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              setEditModal(row);
              setNewRole(row.role || 'user');
            }}
            title="Edit Role"
          >
            <MdEdit size={14} />
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={(e) => { e.stopPropagation(); setDeleteModal(row); }}
            title="Delete"
          >
            <MdDelete size={14} />
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="page-title">Users</h1>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="search-bar">
          <MdSearch size={18} />
          <input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="card">
        <DataTable columns={columns} data={filtered} pageSize={10} emptyMessage="No users found" />
      </div>

      {/* Delete Modal */}
      <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Delete User">
        <p style={{ marginBottom: 20 }}>
          Are you sure you want to delete <strong>{deleteModal?.name}</strong>? This action cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={() => setDeleteModal(null)}>Cancel</button>
          <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
        </div>
      </Modal>

      {/* Edit Role Modal */}
      <Modal isOpen={!!editModal} onClose={() => setEditModal(null)} title="Change User Role">
        <p style={{ marginBottom: 16 }}>
          Update role for <strong>{editModal?.name}</strong>
        </p>
        <div className="form-group">
          <label>Role</label>
          <select className="form-control" value={newRole} onChange={(e) => setNewRole(e.target.value)}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 20 }}>
          <button className="btn btn-secondary" onClick={() => setEditModal(null)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleRoleUpdate}>Update Role</button>
        </div>
      </Modal>
    </motion.div>
  );
};

export default Users;

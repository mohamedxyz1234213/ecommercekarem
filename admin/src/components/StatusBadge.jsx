const statusColors = {
  pending: { bg: '#fff3e0', color: '#e65100', label: 'Pending' },
  processing: { bg: '#e3f2fd', color: '#1565c0', label: 'Processing' },
  shipped: { bg: '#e8f5e9', color: '#2e7d32', label: 'Shipped' },
  delivered: { bg: '#e8f5e9', color: '#1b5e20', label: 'Delivered' },
  cancelled: { bg: '#ffebee', color: '#c62828', label: 'Cancelled' },
  paid: { bg: '#e8f5e9', color: '#2e7d32', label: 'Paid' },
  unpaid: { bg: '#ffebee', color: '#c62828', label: 'Unpaid' },
  approved: { bg: '#e8f5e9', color: '#1b5e20', label: 'Approved' },
  rejected: { bg: '#ffebee', color: '#c62828', label: 'Rejected' },
  refunded: { bg: '#fce4ec', color: '#880e4f', label: 'Refunded' },
  active: { bg: '#e8f5e9', color: '#2e7d32', label: 'Active' },
  inactive: { bg: '#f5f5f5', color: '#616161', label: 'Inactive' },
  admin: { bg: '#ede7f6', color: '#4527a0', label: 'Admin' },
  user: { bg: '#e3f2fd', color: '#1565c0', label: 'User' },
  'on sale': { bg: '#fff8e1', color: '#f57f17', label: 'On Sale' },
  'cash on delivery': { bg: '#e0f2f1', color: '#00695c', label: 'Cash on Delivery' },
  instapay: { bg: '#fce4ec', color: '#880e4f', label: 'InstaPay' },
  'credit card': { bg: '#e3f2fd', color: '#0d47a1', label: 'Credit Card' },
};

const StatusBadge = ({ status }) => {
  const key = (status || '').toLowerCase();
  const config = statusColors[key] || { bg: '#f5f5f5', color: '#616161', label: status };

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: 20,
        fontSize: '0.75rem',
        fontWeight: 700,
        background: config.bg,
        color: config.color,
        textTransform: 'capitalize',
        whiteSpace: 'nowrap',
      }}
    >
      {config.label || status}
    </span>
  );
};

export default StatusBadge;

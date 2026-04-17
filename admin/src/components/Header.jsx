import { useAuth } from '../context/AuthContext';
import { MdLogout, MdNotifications, MdPerson } from 'react-icons/md';

const Header = ({ collapsed }) => {
  const { user, logout } = useAuth();

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        left: collapsed ? 72 : 260,
        height: 64,
        background: 'white',
        borderBottom: '1px solid #e0d8cc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        zIndex: 900,
        transition: 'left 0.3s ease',
      }}
    >
      <div>
        <h3 style={{ fontSize: '1rem', color: '#1A2E0A', fontFamily: 'var(--font-heading)', fontWeight: 400 }}>
          vybe dashboard
        </h3>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          style={{
            position: 'relative',
            background: '#F5F0E8',
            border: 'none',
            borderRadius: 8,
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#8B7355',
          }}
          title="Notifications"
        >
          <MdNotifications size={20} />
          <span
            style={{
              position: 'absolute',
              top: 6,
              right: 6,
              width: 8,
              height: 8,
              background: '#e74c3c',
              borderRadius: '50%',
            }}
          />
        </button>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '6px 12px',
            background: '#F5F0E8',
            borderRadius: 8,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#2D5016',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            <MdPerson size={18} />
          </div>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1A1A1A' }}>
            {user?.name || 'Admin'}
          </span>
        </div>

        <button
          onClick={logout}
          style={{
            background: 'none',
            border: '1px solid #e0d8cc',
            borderRadius: 8,
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            color: '#e74c3c',
            fontSize: '0.85rem',
            fontWeight: 600,
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#fdf0ef';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'none';
          }}
        >
          <MdLogout size={16} />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;

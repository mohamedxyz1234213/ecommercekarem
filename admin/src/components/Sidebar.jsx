import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdDashboard,
  MdInventory,
  MdShoppingCart,
  MdPeople,
  MdSettings,
  MdLocalOffer,
  MdChevronLeft,
  MdChevronRight,
} from 'react-icons/md';

const navItems = [
  { path: '/', label: 'Dashboard', icon: MdDashboard },
  { path: '/products', label: 'Products', icon: MdInventory },
  { path: '/orders', label: 'Orders', icon: MdShoppingCart },
  { path: '/users', label: 'Users', icon: MdPeople },
  { path: '/sales', label: 'Sales Manager', icon: MdLocalOffer },
  { path: '/settings', label: 'Settings', icon: MdSettings },
];

const Sidebar = ({ collapsed, onToggle }) => {
  const location = useLocation();

  return (
    <motion.aside
      className="sidebar"
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        background: 'linear-gradient(180deg, #1A2E0A 0%, #2D5016 100%)',
        zIndex: 1000,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          padding: collapsed ? '20px 12px' : '20px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          minHeight: 64,
        }}
      >
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
            >
              <h2 style={{ color: '#C4A265', fontSize: '1.25rem', fontFamily: "'Playfair Display', serif" }}>
                Perfume Admin
              </h2>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={onToggle}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            color: '#FAF8F5',
            borderRadius: 6,
            width: 28,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {collapsed ? <MdChevronRight size={18} /> : <MdChevronLeft size={18} />}
        </button>
      </div>

      <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path));

          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: collapsed ? '12px 0' : '12px 24px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                color: isActive ? '#C4A265' : 'rgba(255,255,255,0.7)',
                background: isActive ? 'rgba(196,162,101,0.15)' : 'transparent',
                borderRight: isActive ? '3px solid #C4A265' : '3px solid transparent',
                transition: 'all 0.2s',
                fontSize: '0.9rem',
                fontWeight: isActive ? 700 : 400,
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = 'transparent';
              }}
            >
              <item.icon size={20} style={{ flexShrink: 0 }} />
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}
      </nav>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              padding: '16px 24px',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.4)',
              fontSize: '0.75rem',
              textAlign: 'center',
            }}
          >
            © 2024 Perfume Store
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
};

export default Sidebar;

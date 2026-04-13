import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { MdTrendingUp, MdTrendingDown } from 'react-icons/md';

const StatsCard = ({ icon: Icon, label, value, trend, trendValue, color = '#2D5016', prefix = '', isCurrency = false }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const numericValue = typeof value === 'number' ? value : parseInt(value) || 0;
    const duration = 1000;
    const steps = 30;
    const increment = numericValue / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), numericValue);
      setDisplayValue(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  const formatValue = (val) => {
    if (isCurrency) {
      return `${prefix}${val.toLocaleString()}`;
    }
    return `${prefix}${val.toLocaleString()}`;
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        background: 'white',
        borderRadius: 12,
        padding: 24,
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        border: '1px solid #e0d8cc',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 16,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color,
          flexShrink: 0,
        }}
      >
        {Icon && <Icon size={24} />}
      </div>

      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {label}
        </p>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1A1A1A', fontFamily: "'Lato', sans-serif", marginBottom: 4 }}>
          {formatValue(displayValue)}
        </h3>
        {trendValue !== undefined && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {trend === 'up' ? (
              <MdTrendingUp size={16} style={{ color: '#27ae60' }} />
            ) : (
              <MdTrendingDown size={16} style={{ color: '#e74c3c' }} />
            )}
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                color: trend === 'up' ? '#27ae60' : '#e74c3c',
              }}
            >
              {trendValue}%
            </span>
            <span style={{ fontSize: '0.75rem', color: '#999' }}>vs last month</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatsCard;

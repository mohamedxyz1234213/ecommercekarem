import { motion } from 'framer-motion';

const LoadingSpinner = ({ fullScreen = false, size = 40 }) => {
  const spinner = (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      style={{
        width: size,
        height: size,
        border: '3px solid #e0d8cc',
        borderTopColor: '#2D5016',
        borderRadius: '50%',
      }}
    />
  );

  if (fullScreen) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          width: '100vw',
          background: '#FAF8F5',
        }}
      >
        {spinner}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      {spinner}
    </div>
  );
};

export default LoadingSpinner;

import { motion } from 'framer-motion';

const spinnerStyles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 0',
    minHeight: '300px',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: '50%',
    backgroundColor: 'var(--primary)',
  },
  row: {
    display: 'flex',
    gap: '8px',
    marginBottom: '1.5rem',
  },
  text: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1rem',
    color: 'var(--accent)',
    letterSpacing: '2px',
  },
};

const LoadingSpinner = () => {
  return (
    <div style={spinnerStyles.wrapper}>
      <div style={spinnerStyles.row}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            style={spinnerStyles.dot}
            animate={{ y: [0, -16, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
      <motion.p
        style={spinnerStyles.text}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        LOADING
      </motion.p>
    </div>
  );
};

export default LoadingSpinner;

import { motion } from 'framer-motion'

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 5 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: -5 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      style={{ minHeight: '100%', width: '100%' }}
    >
      {children}
    </motion.div>
  )
}

export default PageTransition

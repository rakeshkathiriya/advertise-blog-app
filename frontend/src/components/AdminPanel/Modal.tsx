import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import React from 'react';

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  isLoading?: boolean;
}

const Modal = ({ children, onClose, isLoading }: ModalProps) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-scroll bg-black/40 py-10 backdrop-blur-sm md:items-center md:py-0"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.85 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="relative mx-4 w-full max-w-md rounded-lg bg-white p-6"
      >
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 size-4 cursor-pointer font-bold text-[#3a4b66]"
          title="Close Modal"
        >
          <X size={20} />
        </button>
        {children}
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

export default Modal;

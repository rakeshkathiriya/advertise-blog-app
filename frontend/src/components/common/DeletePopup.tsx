import { AnimatePresence, motion } from 'framer-motion';
import { Loader, Trash2 } from 'lucide-react';

interface DeletePopupProps {
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
  isOpen?: boolean;
  loading: boolean;
}

export default function DeletePopup({
  onConfirm,
  onCancel,
  title = 'Delete Advertisement ?',
  message = 'Are you sure you want to delete this item? This action cannot be undone.',
  isOpen = true,
  loading,
}: DeletePopupProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="relative w-[90%] max-w-sm overflow-hidden rounded-2xl bg-white p-6 shadow-xl"
          >
            {/* LOADER FIX */}
            {loading && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                <Loader className="h-7 w-7 animate-spin text-[#3a4b66]" />
              </div>
            )}

            {/* Warning Icon */}
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
              <Trash2 size={32} />
            </div>

            {/* Title */}
            <h2 className="mb-2 text-center text-xl font-bold text-gray-900">{title}</h2>

            {/* Message */}
            <p className="mb-6 text-center text-sm text-gray-600">{message}</p>

            {/* Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={onConfirm}
                disabled={loading}
                className="w-full rounded-md bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                {loading ? 'Deleting...' : 'Yes, Delete'}
              </button>

              <button
                onClick={onCancel}
                disabled={loading}
                className="w-full rounded-md bg-gray-200 px-4 py-2 font-semibold text-gray-800 transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

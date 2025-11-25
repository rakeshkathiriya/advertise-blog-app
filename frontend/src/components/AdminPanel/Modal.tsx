import React from 'react';

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

const Modal = ({ children, onClose }: ModalProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
    <div className="relative mx-4 w-full max-w-md rounded-lg bg-white p-6">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 cursor-pointer font-bold text-[#3a4b66] hover:text-gray-700"
      >
        X
      </button>
      {children}
    </div>
  </div>
);

export default Modal;

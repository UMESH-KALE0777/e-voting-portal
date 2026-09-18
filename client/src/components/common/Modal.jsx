const Modal = ({ isOpen, onClose, children }) => {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

      <div className="bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-lg relative">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-red-500"
        >
          ✕
        </button>

        {children}

      </div>

    </div>
  );
};

export default Modal;
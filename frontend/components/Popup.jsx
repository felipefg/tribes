function Popup({ isOpen, onClose, children }) {
    if (!isOpen) return null;
  
    return (
      <div className="inset-0 flex items-center justify-center z-50 fixed">
        <div className="bg-white py-8 px-8 shadow-lg rounded-xl w-1/3">
          {children}
        </div>
      </div>
    );
  }
  
  export default Popup;
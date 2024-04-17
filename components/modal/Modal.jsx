import CloseIcon from "@mui/icons-material/Close";

const Modal = ({ isModalTypeOpen, modalContent, onClose }) => {
  console.log(isModalTypeOpen);
  if (isModalTypeOpen === false) {
    return null;
  }
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-80 cursor-pointer" onClick={onClose}>
      <div className={`relative py-10 px-20 rounded-xl ${isModalTypeOpen}`}>
        <CloseIcon className="absolute right-2 top-2" />
        <div className="text-white">{modalContent}</div>
      </div>
    </div>
  );
};

export default Modal;

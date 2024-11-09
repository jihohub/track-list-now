interface CloseButtonProps {
  onClose: () => void;
}

const CloseButton = ({ onClose }: CloseButtonProps) => {
  return (
    <div className="h-6">
      <button
        onClick={onClose}
        className="absolute top-0 right-3 text-gray-400 hover:text-gray-300 focus:outline-none text-3xl"
        type="button"
        aria-label="Close Player"
      >
        &times;
      </button>
    </div>
  );
};

export default CloseButton;

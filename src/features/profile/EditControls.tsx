interface EditControlsProps {
  label: string;
  isEditing: boolean;
  toggleEditing: () => void;
  handleSaveChanges: () => void;
}

const EditControls = ({
  label,
  isEditing,
  toggleEditing,
  handleSaveChanges,
}: EditControlsProps) => {
  return (
    <div className="flex justify-end mb-6">
      <button
        onClick={isEditing ? handleSaveChanges : toggleEditing}
        className="bg-persianBlue text-white px-4 py-2 rounded-lg"
        type="button"
        aria-label={isEditing ? "Save Changes" : "Edit Profile"}
      >
        {label}
      </button>
    </div>
  );
};

export default EditControls;

interface AdminNotesProps {
  notes: string;
  onNotesChange: (notes: string) => void;
}

export const AdminNotes: React.FC<AdminNotesProps> = ({ notes, onNotesChange }) => {
  return (
    <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Notes</h3>
      <textarea
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Add notes about this order (required for rejection)..."
        className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 resize-none"
      />
      <p className="mt-2 text-sm text-gray-500">
        These notes will be saved with the order and are required when rejecting orders.
      </p>
    </div>
  );
};
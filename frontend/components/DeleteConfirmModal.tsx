import { X, Trash2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  loading?: boolean;
}

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, loading }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-paper rounded-2xl shadow-2xl w-full max-w-sm animate-scale-in border border-border p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
            <Trash2 size={18} className="text-red-500" />
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-cream text-muted hover:text-ink transition-all">
            <X size={16} />
          </button>
        </div>
        <h3 className="font-display font-bold text-lg text-ink mb-2">Delete resource?</h3>
        <p className="text-sm text-muted mb-6">This action cannot be undone. The resource will be permanently removed.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1 text-center">Cancel</button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-red-500 text-white font-display font-semibold px-6 py-2.5 rounded-xl hover:bg-red-600 transition-all duration-200 text-sm tracking-wide disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <span className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

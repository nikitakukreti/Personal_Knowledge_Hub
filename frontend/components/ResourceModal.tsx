import { useState, useEffect, KeyboardEvent } from "react";
import { Resource, ResourceFormData } from "@/types";
import { X, Plus } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ResourceFormData) => Promise<void>;
  editResource?: Resource | null;
}

const EMPTY_FORM: ResourceFormData = { title: "", url: "", description: "", tags: [] };

export default function ResourceModal({ isOpen, onClose, onSubmit, editResource }: Props) {
  const [form, setForm] = useState<ResourceFormData>(EMPTY_FORM);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editResource) {
      setForm({
        title: editResource.title,
        url: editResource.url,
        description: editResource.description || "",
        tags: editResource.tags,
      });
    } else {
      setForm(EMPTY_FORM);
      setTagInput("");
    }
  }, [editResource, isOpen]);

  if (!isOpen) return null;

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase().replace(/^#/, "");
    if (tag && !form.tags.includes(tag)) {
      setForm((f) => ({ ...f, tags: [...f.tags, tag] }));
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.url.trim()) return;
    setLoading(true);
    try {
      await onSubmit(form);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-paper rounded-2xl shadow-2xl w-full max-w-lg animate-scale-in border border-border">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-display font-bold text-xl text-ink">
            {editResource ? "Edit resource" : "Add resource"}
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-cream text-muted hover:text-ink transition-all">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-display font-semibold text-ink uppercase tracking-wider mb-2">
              Title <span className="text-accent">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Interesting article about..."
              className="input"
            />
          </div>

          <div>
            <label className="block text-xs font-display font-semibold text-ink uppercase tracking-wider mb-2">
              URL <span className="text-accent">*</span>
            </label>
            <input
              type="url"
              value={form.url}
              onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
              placeholder="https://..."
              className="input"
            />
          </div>

          <div>
            <label className="block text-xs font-display font-semibold text-ink uppercase tracking-wider mb-2">
              Description <span className="text-muted font-normal normal-case">(optional)</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="What's this resource about?"
              rows={3}
              className="input resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-display font-semibold text-ink uppercase tracking-wider mb-2">Tags</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Add tag, press Enter"
                className="input flex-1"
              />
              <button type="button" onClick={addTag} className="btn-secondary px-3 flex items-center gap-1">
                <Plus size={14} />
              </button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {form.tags.map((tag) => (
                  <span key={tag} className="tag-accent flex items-center gap-1.5">
                    #{tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-accent/60 transition-colors">
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-border">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={loading || !form.title.trim() || !form.url.trim()}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && <span className="inline-block w-3 h-3 border-2 border-paper/30 border-t-paper rounded-full animate-spin" />}
            {editResource ? "Save changes" : "Add resource"}
          </button>
        </div>
      </div>
    </div>
  );
}

import { Resource } from "@/types";
import { ExternalLink, Pencil, Trash2, Clock } from "lucide-react";

interface Props {
  resource: Resource;
  onEdit: (r: Resource) => void;
  onDelete: (id: number) => void;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

export default function ResourceCard({ resource, onEdit, onDelete }: Props) {
  return (
    <div className="card p-5 hover:shadow-md transition-all duration-200 group animate-slide-up">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-ink text-base leading-snug mb-1 line-clamp-2">
            {resource.title}
          </h3>
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-muted hover:text-accent transition-colors font-mono"
          >
            {getDomain(resource.url)}
            <ExternalLink size={10} />
          </a>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={() => onEdit(resource)}
            className="p-1.5 rounded-lg hover:bg-cream text-muted hover:text-ink transition-all"
            title="Edit"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(resource.id)}
            className="p-1.5 rounded-lg hover:bg-red-50 text-muted hover:text-red-500 transition-all"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {resource.description && (
        <p className="text-sm text-muted leading-relaxed mb-3 line-clamp-2">{resource.description}</p>
      )}

      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex flex-wrap gap-1.5">
          {resource.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
          {resource.tags.length > 4 && (
            <span className="tag">+{resource.tags.length - 4}</span>
          )}
        </div>
        <span className="flex items-center gap-1 text-xs text-muted/60 font-mono flex-shrink-0">
          <Clock size={10} />
          {timeAgo(resource.created_at)}
        </span>
      </div>
    </div>
  );
}

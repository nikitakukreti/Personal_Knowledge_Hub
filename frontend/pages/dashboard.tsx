import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/lib/auth";
import api from "@/lib/api";
import { Resource, ResourceFormData } from "@/types";
import ResourceCard from "@/components/ResourceCard";
import ResourceModal from "@/components/ResourceModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import toast from "react-hot-toast";
import {
  BookOpen, Plus, Search, LogOut, X, Tag, LayoutGrid, List,
  SlidersHorizontal, ChevronDown
} from "lucide-react";

export default function Dashboard() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [modalOpen, setModalOpen] = useState(false);
  const [editResource, setEditResource] = useState<Resource | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (debouncedSearch) params.search = debouncedSearch;
      if (tagFilter.length) params.tags = tagFilter.join(",");
      const { data } = await api.get<Resource[]>("/api/resources/", { params });
      setResources(data);
      // Collect all tags for sidebar
      const tags = new Set<string>();
      data.forEach((r) => r.tags.forEach((t) => tags.add(t)));
      setAllTags(Array.from(tags).sort());
    } catch {
      toast.error("Failed to load resources");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, tagFilter]);

  // Fetch all tags on mount separately (unfiltered)
  useEffect(() => {
    if (!user) return;
    api.get<Resource[]>("/api/resources/").then(({ data }) => {
      const tags = new Set<string>();
      data.forEach((r) => r.tags.forEach((t) => tags.add(t)));
      setAllTags(Array.from(tags).sort());
    });
  }, [user]);

  useEffect(() => {
    if (user) fetchResources();
  }, [user, fetchResources]);

  const handleCreate = async (data: ResourceFormData) => {
    await api.post("/api/resources/", data);
    toast.success("Resource added!");
    fetchResources();
  };

  const handleUpdate = async (data: ResourceFormData) => {
    if (!editResource) return;
    await api.put(`/api/resources/${editResource.id}`, data);
    toast.success("Resource updated!");
    fetchResources();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/api/resources/${deleteId}`);
      toast.success("Resource deleted");
      setDeleteId(null);
      fetchResources();
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleteLoading(false);
    }
  };

  const openEdit = (r: Resource) => {
    setEditResource(r);
    setModalOpen(true);
  };

  const toggleTag = (tag: string) => {
    setTagFilter((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  if (authLoading) return null;
  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="border-b border-border bg-paper/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-ink rounded-lg flex items-center justify-center">
              <BookOpen size={14} className="text-paper" />
            </div>
            <span className="font-display font-bold text-ink">KnowledgeHub</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted hidden sm:block font-body">
              {user.username}
            </span>
            <button onClick={logout} className="p-2 rounded-xl hover:bg-cream text-muted hover:text-ink transition-all" title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 gap-6">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col gap-4 w-56 flex-shrink-0">
          <div>
            <p className="text-xs font-display font-semibold text-ink uppercase tracking-wider mb-3 flex items-center gap-2">
              <Tag size={12} /> Tags
            </p>
            {allTags.length === 0 ? (
              <p className="text-xs text-muted">No tags yet</p>
            ) : (
              <div className="flex flex-col gap-1">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`text-left text-sm px-3 py-1.5 rounded-xl transition-all font-mono ${
                      tagFilter.includes(tag)
                        ? "bg-ink text-paper"
                        : "text-muted hover:bg-cream hover:text-ink"
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            )}
          </div>

          {tagFilter.length > 0 && (
            <button
              onClick={() => setTagFilter([])}
              className="text-xs text-accent hover:underline text-left flex items-center gap-1"
            >
              <X size={10} /> Clear filters
            </button>
          )}
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="relative flex-1 min-w-0 max-w-sm">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search resources..."
                className="input pl-9"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <div className="flex border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 transition-colors ${viewMode === "grid" ? "bg-ink text-paper" : "text-muted hover:bg-cream"}`}
                >
                  <LayoutGrid size={14} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2.5 transition-colors ${viewMode === "list" ? "bg-ink text-paper" : "text-muted hover:bg-cream"}`}
                >
                  <List size={14} />
                </button>
              </div>

              <button
                onClick={() => { setEditResource(null); setModalOpen(true); }}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={15} />
                Add
              </button>
            </div>
          </div>

          {/* Active filters */}
          {tagFilter.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-xs text-muted font-body">Filtering by:</span>
              {tagFilter.map((tag) => (
                <span key={tag} className="tag-accent flex items-center gap-1.5">
                  #{tag}
                  <button onClick={() => toggleTag(tag)}><X size={10} /></button>
                </span>
              ))}
              <button onClick={() => setTagFilter([])} className="text-xs text-muted hover:text-accent transition-colors">
                Clear all
              </button>
            </div>
          )}

          {/* Stats row */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted">
              {loading ? "Loading..." : `${resources.length} resource${resources.length !== 1 ? "s" : ""}`}
            </p>
          </div>

          {/* Resource grid/list */}
          {loading ? (
            <div className={`grid gap-4 ${viewMode === "grid" ? "sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card p-5 h-36 animate-pulse">
                  <div className="h-4 bg-cream rounded-lg w-3/4 mb-3" />
                  <div className="h-3 bg-cream rounded-lg w-1/2 mb-4" />
                  <div className="h-3 bg-cream rounded-lg w-full mb-2" />
                  <div className="flex gap-2 mt-4">
                    <div className="h-5 bg-cream rounded-lg w-14" />
                    <div className="h-5 bg-cream rounded-lg w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : resources.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-cream rounded-2xl flex items-center justify-center mx-auto mb-4 border border-border">
                <BookOpen size={24} className="text-muted" />
              </div>
              <h3 className="font-display font-bold text-ink text-lg mb-2">
                {search || tagFilter.length ? "No results found" : "Your library is empty"}
              </h3>
              <p className="text-muted text-sm mb-6">
                {search || tagFilter.length
                  ? "Try different search terms or filters"
                  : "Add your first resource to start building your knowledge hub"}
              </p>
              {!search && !tagFilter.length && (
                <button
                  onClick={() => { setEditResource(null); setModalOpen(true); }}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <Plus size={15} /> Add first resource
                </button>
              )}
            </div>
          ) : (
            <div className={`grid gap-4 ${viewMode === "grid" ? "sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
              {resources.map((r) => (
                <ResourceCard
                  key={r.id}
                  resource={r}
                  onEdit={openEdit}
                  onDelete={setDeleteId}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <ResourceModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditResource(null); }}
        onSubmit={editResource ? handleUpdate : handleCreate}
        editResource={editResource}
      />

      <DeleteConfirmModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </div>
  );
}

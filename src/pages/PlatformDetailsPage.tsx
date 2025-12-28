import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Plus, Trash2, LayoutList, Tag } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/Input';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EditableText } from '../components/ui/EditableText';

export const PlatformDetailsPage = () => {
  const { platformId } = useParams<{ platformId: string }>();
  const navigate = useNavigate();
  const {
    platforms,
    addCategory,
    renameCategory,
    deleteCategory,
    addConcept,
    renameConcept,
    deleteConcept,
    deletePlatform
  } = useAppStore();

  const platform = platforms.find((p) => p.id === platformId);

  const [newCategoryName, setNewCategoryName] = useState('');
  const [conceptInputs, setConceptInputs] = useState<Record<string, string>>({});
  const [deletePlatformOpen, setDeletePlatformOpen] = useState(false);
  const [deleteCategoryTarget, setDeleteCategoryTarget] = useState<string | null>(null);

  if (!platform) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <p className="text-slate-500">Platform not found.</p>
        <Link to="/platforms" className="mt-4 text-blue-600 hover:underline">
          Back to Platforms
        </Link>
      </div>
    );
  }

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      addCategory(platform.id, newCategoryName.trim());
      setNewCategoryName('');
    }
  };

  const handleAddConcept = (categoryId: string) => {
    const name = conceptInputs[categoryId]?.trim();
    if (name) {
      addConcept(platform.id, categoryId, name);
      setConceptInputs((prev) => ({ ...prev, [categoryId]: '' }));
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Link to="/platforms" className="hover:text-slate-900">Platforms</Link>
            <span>/</span>
            <span>{platform.name}</span>
          </div>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">Areas of Evaluation</h1>
          <p className="mt-1 text-sm text-slate-500">Manage categories and concepts for {platform.name}.</p>
        </div>
        <Button 
          variant="destructive" 
          onClick={() => setDeletePlatformOpen(true)}
        >
          Delete Platform
        </Button>
      </div>

      {/* Add Category Section */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
        <h3 className="mb-4 text-sm font-medium text-slate-900">Add New Category</h3>
        <form onSubmit={handleAddCategory} className="flex gap-3">
          <Input
            placeholder="Category Name (e.g., Communication, Architecture, Security)"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="max-w-md bg-white"
          />
          <Button type="submit" disabled={!newCategoryName.trim()}>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </form>
      </div>

      {/* Categories List */}
      <div className="space-y-6">
        {platform.categories.map((category) => (
          <div 
            key={category.id} 
            className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
          >
            {/* Category Header */}
            <div className="flex items-center justify-between bg-slate-50 px-6 py-4">
              <div className="flex items-center gap-3">
                <LayoutList className="h-5 w-5 text-slate-400" />
                <EditableText 
                  initialValue={category.name}
                  onSave={(val) => renameCategory(platform.id, category.id, val)}
                  className="font-semibold text-slate-900 text-lg"
                />
                <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                  {category.concepts.length}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:bg-red-50 hover:text-red-600"
                onClick={() => setDeleteCategoryTarget(category.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>

            {/* Concepts List */}
            <div className="p-6">
              <div className="mb-4 space-y-1">
                {category.concepts.map((concept) => (
                  <div 
                    key={concept.id}
                    className="group flex items-center justify-between rounded-md px-3 py-2 hover:bg-slate-50"
                  >
                    <EditableText 
                      initialValue={concept.name}
                      onSave={(val) => renameConcept(platform.id, category.id, concept.id, val)}
                      className="text-sm text-slate-700 w-full"
                    />
                    <button
                      onClick={() => deleteConcept(platform.id, category.id, concept.id)}
                      className="hidden text-red-400 hover:text-red-600 group-hover:inline-flex"
                      aria-label="Delete concept"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {category.concepts.length === 0 && (
                  <p className="px-3 py-2 text-sm italic text-slate-400">No concepts added yet.</p>
                )}
              </div>

              {/* Add Concept Input */}
              <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4">
                <Tag className="h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Add a concept"
                  value={conceptInputs[category.id] || ''}
                  onChange={(e) => setConceptInputs(prev => ({ ...prev, [category.id]: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddConcept(category.id);
                  }}
                  className="flex-1 border-none shadow-none focus-visible:ring-0"
                />
                <Button 
                  size="sm" 
                  variant="ghost"
                  disabled={!conceptInputs[category.id]?.trim()}
                  onClick={() => handleAddConcept(category.id)}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dialogs */}
      <ConfirmDialog
        isOpen={deletePlatformOpen}
        title="Delete Platform"
        description={`Are you sure you want to delete "${platform.name}"? This cannot be undone.`}
        confirmLabel="Delete Platform"
        variant="destructive"
        onCancel={() => setDeletePlatformOpen(false)}
        onConfirm={() => {
          deletePlatform(platform.id);
          navigate('/platforms');
        }}
      />

      <ConfirmDialog
        isOpen={!!deleteCategoryTarget}
        title="Delete Category"
        description="Are you sure you want to delete this category? All concepts inside it will be lost."
        confirmLabel="Delete Category"
        variant="destructive"
        onCancel={() => setDeleteCategoryTarget(null)}
        onConfirm={() => {
          if (deleteCategoryTarget) {
            deleteCategory(platform.id, deleteCategoryTarget);
            setDeleteCategoryTarget(null);
          }
        }}
      />
    </div>
  );
};

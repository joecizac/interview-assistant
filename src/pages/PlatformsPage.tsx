import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, ChevronRight } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/Input';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';

export const PlatformsPage = () => {
  const navigate = useNavigate();
  const { platforms, addPlatform, deletePlatform } = useAppStore();
  const [newPlatformName, setNewPlatformName] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleAddPlatform = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlatformName.trim()) {
      addPlatform(newPlatformName.trim());
      setNewPlatformName('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Platforms</h1>
          <p className="mt-1 text-sm text-slate-500">Create and manage technical platforms.</p>
        </div>
      </div>

      {/* Add Platform Form */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <form onSubmit={handleAddPlatform} className="flex gap-3">
          <Input
            placeholder="Enter platform name (e.g., Android, iOS, React Native)"
            value={newPlatformName}
            onChange={(e) => setNewPlatformName(e.target.value)}
            className="max-w-md"
          />
          <Button type="submit" disabled={!newPlatformName.trim()}>
            <Plus className="mr-2 h-4 w-4" />
            Add Platform
          </Button>
        </form>
      </div>

      {/* Platforms Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {platforms.map((platform) => (
          <div
            key={platform.id}
            className="group relative flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div 
              className="cursor-pointer"
              onClick={() => navigate(`/platforms/${platform.id}`)}
            >
              <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600">
                {platform.name}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {platform.categories.length} Categories
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-blue-600"
                onClick={() => navigate(`/platforms/${platform.id}`)}
              >
                Manage Areas <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteId(platform.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {platforms.length === 0 && (
          <div className="col-span-full flex h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50">
            <p className="text-slate-500">No platforms found. Add one above.</p>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Platform"
        description="Are you sure you want to delete this platform? This will also permanently delete all associated categories, concepts, and interview profiles."
        confirmLabel="Delete Platform"
        variant="destructive"
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            deletePlatform(deleteId);
            setDeleteId(null);
          }
        }}
      />
    </div>
  );
};
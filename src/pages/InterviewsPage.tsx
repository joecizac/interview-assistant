import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Copy, Trash2, Settings, Play } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useSessionStore } from '../store/useSessionStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/Input';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EditableText } from '../components/ui/EditableText';

export const InterviewsPage = () => {
  const navigate = useNavigate();
  const { platforms, interviews, addInterview, renameInterview, deleteInterview, cloneInterview } = useAppStore();
  const { startSession } = useSessionStore();
  
  const [newInterviewName, setNewInterviewName] = useState('');
  const [selectedPlatformId, setSelectedPlatformId] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [startSessionId, setStartSessionId] = useState<string | null>(null);

  const handleAddInterview = (e: React.FormEvent) => {
    e.preventDefault();
    if (newInterviewName.trim() && selectedPlatformId) {
      addInterview(selectedPlatformId, newInterviewName.trim());
      setNewInterviewName('');
      // Keep platform selected for convenience
    }
  };

  const getPlatformName = (id: string) => {
    return platforms.find(p => p.id === id)?.name || 'Unknown Platform';
  };

  const handleStart = (round: 'l1' | 'l2') => {
    if (startSessionId) {
      startSession(startSessionId, round);
      navigate('/session/active');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Interviews</h1>
          <p className="mt-1 text-sm text-slate-500">Create and configure interview profiles.</p>
        </div>
      </div>

      {/* Add Interview Form */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <form onSubmit={handleAddInterview} className="flex gap-3">
          <select
            className="h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
            value={selectedPlatformId}
            onChange={(e) => setSelectedPlatformId(e.target.value)}
            required
          >
            <option value="" disabled>Select Platform</option>
            {platforms.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          
          <Input
            placeholder="Interview Name (e.g., Android Freshers, iOS L2)"
            value={newInterviewName}
            onChange={(e) => setNewInterviewName(e.target.value)}
            className="max-w-md"
          />
          
          <Button type="submit" disabled={!newInterviewName.trim() || !selectedPlatformId}>
            <Plus className="mr-2 h-4 w-4" />
            Add Interview
          </Button>
        </form>
        {platforms.length === 0 && (
           <p className="mt-2 text-xs text-amber-600">
             Please add a Platform first before creating an interview.
           </p>
        )}
      </div>

      {/* Interviews Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {interviews.map((interview) => (
          <div
            key={interview.id}
            className="flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 mr-2">
                  <EditableText 
                    initialValue={interview.name}
                    onSave={(val) => renameInterview(interview.id, val)}
                    className="text-lg font-semibold text-slate-900"
                  />
                  <span className="inline-block mt-1 rounded bg-slate-100 px-2 py-1 text-xs text-slate-600">
                    {getPlatformName(interview.platformId)}
                  </span>
                </div>
              </div>
              
              <div className="mt-6 flex flex-col gap-2">
                 <Button 
                   className="w-full bg-blue-600 hover:bg-blue-700"
                   onClick={() => setStartSessionId(interview.id)}
                 >
                   <Play className="mr-2 h-4 w-4" /> Start Interview
                 </Button>
                 
                 <Button 
                   variant="outline"
                   className="w-full"
                   onClick={() => navigate(`/interviews/${interview.id}/configure`)}
                 >
                   <Settings className="mr-2 h-4 w-4" /> Configure
                 </Button>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-500 hover:text-blue-600"
                onClick={() => cloneInterview(interview.id)}
              >
                <Copy className="mr-2 h-4 w-4" /> Clone
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-500 hover:text-red-600"
                onClick={() => setDeleteId(interview.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </div>
          </div>
        ))}

        {interviews.length === 0 && (
          <div className="col-span-full flex h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50">
            <p className="text-slate-500">No interview profiles found. Add one above.</p>
          </div>
        )}
      </div>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Interview Profile"
        description="Are you sure you want to delete this interview profile?"
        confirmLabel="Delete"
        variant="destructive"
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            deleteInterview(deleteId);
            setDeleteId(null);
          }
        }}
      />

      {/* Start Session Dialog */}
      {startSessionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900">Select Interview Round</h3>
            <p className="mt-2 text-sm text-slate-500">Which round are you conducting?</p>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                className="flex h-20 flex-col items-center justify-center rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
                onClick={() => handleStart('l1')}
              >
                <span className="text-lg font-bold text-blue-700">L1 Round</span>
                <span className="text-xs text-slate-500">First technical round</span>
              </button>

              <button
                className="flex h-20 flex-col items-center justify-center rounded-lg border border-slate-200 hover:border-orange-500 hover:bg-orange-50 transition-all"
                onClick={() => handleStart('l2')}
              >
                <span className="text-lg font-bold text-orange-700">L2 Round</span>
                <span className="text-xs text-slate-500">Advanced technical round</span>
              </button>
            </div>

            <div className="mt-4 flex justify-end">
               <Button variant="ghost" onClick={() => setStartSessionId(null)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
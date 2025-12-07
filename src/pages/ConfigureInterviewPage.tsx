import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckSquare } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { cn } from '../lib/utils';

export const ConfigureInterviewPage = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const { interviews, platforms, updateInterviewConfig, updateCategoryWeight } = useAppStore();

  const interview = interviews.find((i) => i.id === interviewId);
  const platform = platforms.find((p) => p.id === interview?.platformId);

  if (!interview || !platform) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <p className="text-slate-500">Interview Profile or Platform not found.</p>
        <Link to="/interviews" className="mt-4 text-blue-600 hover:underline">
          Back to Interviews
        </Link>
      </div>
    );
  }

  // Safe Access Helper for New Data Structure
  const getConfig = (categoryId: string, round: 'l1' | 'l2') => {
    const config = interview.config[categoryId];
    // Fallback logic for migration or initialization
    let roundConfig = config?.[round];
    
    // Handle legacy array format (if exists) or missing obj
    if (Array.isArray(roundConfig)) {
      return { concepts: roundConfig, weight: 5 };
    }
    if (!roundConfig) {
      return { concepts: [], weight: 5 };
    }
    return roundConfig;
  };

  const isChecked = (categoryId: string, conceptId: string, round: 'l1' | 'l2') => {
    return getConfig(categoryId, round).concepts.includes(conceptId);
  };

  const getWeight = (categoryId: string, round: 'l1' | 'l2') => {
    return getConfig(categoryId, round).weight;
  };

  const handleToggle = (categoryId: string, conceptId: string, round: 'l1' | 'l2') => {
    updateInterviewConfig(interview.id, categoryId, round, conceptId);
  };

  const handleWeightChange = (categoryId: string, round: 'l1' | 'l2', val: string) => {
    updateCategoryWeight(interview.id, categoryId, round, parseInt(val));
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Link to="/interviews" className="hover:text-slate-900">Interviews</Link>
          <span>/</span>
          <span>{interview.name}</span>
        </div>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Configure Interview</h1>
        <p className="mt-1 text-sm text-slate-500">
          Set weights (0-10) and required concepts for each category.
        </p>
      </div>

      {/* Matrix */}
      <div className="space-y-8">
        {platform.categories.map((category) => (
          <div key={category.id} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
               <span className="font-semibold text-slate-900">{category.name}</span>
            </div>
            
            <div className="divide-y divide-slate-100">
              {/* Header Row with Weights */}
              <div className="flex items-center bg-slate-50/50 px-6 py-2 text-xs font-medium text-slate-500">
                <div className="flex-1 uppercase tracking-wider">Concept</div>
                
                {/* L1 Header + Weight */}
                <div className="flex w-32 flex-col items-center gap-1">
                  <span className="uppercase tracking-wider">L1</span>
                  <select 
                    className="h-6 w-24 rounded border border-slate-200 bg-white text-xs"
                    value={getWeight(category.id, 'l1')}
                    onChange={(e) => handleWeightChange(category.id, 'l1', e.target.value)}
                    title="Weight (0-10)"
                  >
                    {[...Array(11)].map((_, i) => (
                      <option key={i} value={i}>Weight: {i}</option>
                    ))}
                  </select>
                </div>

                {/* L2 Header + Weight */}
                <div className="flex w-32 flex-col items-center gap-1">
                  <span className="uppercase tracking-wider">L2</span>
                  <select 
                    className="h-6 w-24 rounded border border-slate-200 bg-white text-xs"
                    value={getWeight(category.id, 'l2')}
                    onChange={(e) => handleWeightChange(category.id, 'l2', e.target.value)}
                    title="Weight (0-10)"
                  >
                    {[...Array(11)].map((_, i) => (
                      <option key={i} value={i}>Weight: {i}</option>
                    ))}
                  </select>
                </div>
              </div>

              {category.concepts.map((concept) => (
                <div key={concept.id} className="flex items-center px-6 py-3 hover:bg-slate-50/50 transition-colors">
                  <div className="flex-1 text-sm text-slate-700 font-medium">
                    {concept.name}
                  </div>
                  
                  {/* L1 Checkbox */}
                  <div className="flex w-32 justify-center">
                    <button
                      onClick={() => handleToggle(category.id, concept.id, 'l1')}
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded border transition-colors",
                        isChecked(category.id, concept.id, 'l1')
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-slate-300 bg-white text-transparent hover:border-blue-400"
                      )}
                      disabled={getWeight(category.id, 'l1') === 0}
                    >
                      <CheckSquare className="h-4 w-4" />
                    </button>
                  </div>

                  {/* L2 Checkbox */}
                  <div className="flex w-32 justify-center">
                    <button
                      onClick={() => handleToggle(category.id, concept.id, 'l2')}
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded border transition-colors",
                        isChecked(category.id, concept.id, 'l2')
                          ? "border-indigo-600 bg-indigo-600 text-white"
                          : "border-slate-300 bg-white text-transparent hover:border-indigo-400"
                      )}
                      disabled={getWeight(category.id, 'l2') === 0}
                    >
                      <CheckSquare className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

              {category.concepts.length === 0 && (
                <div className="px-6 py-4 text-sm text-slate-400 italic">
                  No concepts defined in this category.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
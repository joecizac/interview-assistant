import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, FileText, RefreshCw, CheckCircle2, Circle } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useSessionStore } from '../store/useSessionStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/Input';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { cn } from '../lib/utils';
import type { InterviewRoundConfig } from '../types/core';

export const InterviewSessionPage = () => {
  const navigate = useNavigate();
  const { interviews, platforms } = useAppStore();
  const {
    interviewId,
    round,
    candidateName,
    experience,
    remarks,
    scores,
    updateCandidate,
    setScore,
    resetSession
  } = useSessionStore();

  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  if (!interviewId || !round) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <p className="text-slate-500">No active session found.</p>
        <Button variant="link" onClick={() => navigate('/interviews')}> 
          Go to Interviews
        </Button>
      </div>
    );
  }

  const interview = interviews.find((i) => i.id === interviewId);
  const platform = platforms.find((p) => p.id === interview?.platformId);

  if (!interview || !platform) {
     return <div>Error: Data missing</div>;
  }

  // --- Helper Functions ---

  const getCategoryConfig = (categoryId: string) => {
    const config = interview.config[categoryId] || { l1: { concepts: [], weight: 5 }, l2: { concepts: [], weight: 5 } };
    const roundConfig = config[round];
    if (Array.isArray(roundConfig)) return { concepts: roundConfig, weight: 5 };
    if (!roundConfig) return { concepts: [], weight: 5 };
    return roundConfig;
  };

  const getRoundConcepts = (categoryId: string) => {
    const config = getCategoryConfig(categoryId);
    const conceptIds = config.concepts;
    const category = platform.categories.find(c => c.id === categoryId);
    return category?.concepts.filter(c => conceptIds.includes(c.id)) || [];
  };

  // --- Scoring Logic ---

  const activeCategories = platform.categories.map(cat => ({
    ...cat,
    weight: getCategoryConfig(cat.id).weight
  })).filter(c => c.weight > 0);

  const totalWeightSum = activeCategories.reduce((sum, cat) => sum + cat.weight, 0);
  let finalTotalScore = 0;

  const categoryScores = activeCategories.map(cat => {
    const rawScore = scores[cat.id] || 0;
    const contribution = totalWeightSum > 0 
      ? (rawScore / 10) * (cat.weight / totalWeightSum) * 100 
      : 0;
    
    finalTotalScore += contribution;

    return { ...cat, rawScore, contribution };
  });

  // --- Report Generation ---

  const handleCopyReport = () => {
    const lines = [
      `Interview: ${interview.name} (${round.toUpperCase()})`,
      `Candidate: ${candidateName} (${experience} YOE)`,
      `Total Score: ${finalTotalScore.toFixed(2)} / 100`,
      `Remarks: ${remarks}`,
      '',
      '--- Evaluation Breakdown ---',
    ];

    categoryScores.forEach(cat => {
      lines.push(`${cat.name} (Weight ${cat.weight}):`);
      lines.push(`  Score: ${cat.rawScore}/10  ->  Contribution: ${cat.contribution.toFixed(2)}`);
    });

    navigator.clipboard.writeText(lines.join('\n'));
    alert('Report copied to clipboard!');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-slate-50/95 px-6 py-4 backdrop-blur">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700 uppercase">
              {round} Round
            </span>
            <h1 className="text-lg font-bold text-slate-900">{interview.name}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <div className="mr-4 flex flex-col items-end">
             <span className="text-xs text-slate-500 font-medium">WEIGHTED SCORE</span>
             <span className="text-xl font-bold text-blue-600">{finalTotalScore.toFixed(2)}</span>
           </div>
           <Button variant="outline" size="sm" onClick={() => setResetDialogOpen(true)}>
             <RefreshCw className="mr-2 h-4 w-4" /> Reset
           </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 px-6">
        {/* Left Col: Candidate Info */}
        <div className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 font-semibold text-slate-900">Candidate Details</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Name</label>
                <Input 
                  value={candidateName}
                  onChange={(e) => updateCandidate('candidateName', e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Experience (Years)</label>
                {/* Use Reusable DecimalInput for Experience (Max 15) */}
                <DecimalInput 
                  value={experience === '' ? undefined : parseFloat(experience)} 
                  onChange={(val) => updateCandidate('experience', val.toString())}
                  max={15}
                  className="w-full"
                  placeholder="4.5"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Remarks</label>
                <textarea 
                  className="flex min-h-[120px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                  value={remarks}
                  onChange={(e) => updateCandidate('remarks', e.target.value)}
                  placeholder="Overall feedback, strengths, weaknesses..."
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
             <h3 className="mb-4 font-semibold text-slate-900">Actions</h3>
             <div className="space-y-3">
               <Button className="w-full" onClick={handleCopyReport}>
                 <Copy className="mr-2 h-4 w-4" /> Copy Report
               </Button>
               <Button variant="outline" className="w-full">
                 <FileText className="mr-2 h-4 w-4" /> Generate Cover Letter
               </Button>
             </div>
          </div>
        </div>

        {/* Right Col: Evaluation */}
        <div className="lg:col-span-2 space-y-6">
          {activeCategories.map((category) => {
            const roundConcepts = getRoundConcepts(category.id);
            const rawScore = scores[category.id] || 0;
            const contribution = totalWeightSum > 0 
              ? (rawScore / 10) * (category.weight / totalWeightSum) * 100 
              : 0;

            return (
              <div key={category.id} className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="flex items-center justify-between bg-slate-50 px-5 py-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900">{category.name}</h3>
                    <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-600 font-medium">
                      Weight: {category.weight}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500">Score:</span>
                        {/* Use Reusable DecimalInput for Score (Max 10) */}
                        <DecimalInput 
                          value={scores[category.id]}
                          onChange={(val) => setScore(category.id, val)} 
                          max={10}
                          className="h-9 w-16 text-center font-bold"
                        />
                        <span className="text-sm text-slate-400">/ 10</span>
                    </div>
                    <div className="text-sm font-medium text-blue-600 min-w-[80px] text-right">
                        + {contribution.toFixed(1)} pts
                    </div>
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="space-y-2">
                    {roundConcepts.map(concept => (
                      <div 
                        key={concept.id} 
                        className="flex items-start gap-3 cursor-pointer group"
                        onClick={() => setChecklist(prev => ({ ...prev, [concept.id]: !prev[concept.id] }))}
                      >
                         <div className={cn(
                           "mt-0.5 flex-shrink-0 transition-colors",
                           checklist[concept.id] ? "text-green-500" : "text-slate-300 group-hover:text-slate-400"
                         )}>
                           {checklist[concept.id] ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                         </div>
                         <span className={cn(
                           "text-sm transition-colors",
                           checklist[concept.id] ? "text-slate-400 line-through" : "text-slate-700"
                         )}>
                           {concept.name}
                         </span>
                      </div>
                    ))}
                    {roundConcepts.length === 0 && (
                      <p className="text-sm italic text-slate-400">No specific concepts configured for this round.</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          
          {activeCategories.length === 0 && (
              <div className="p-10 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-lg">
                  No active categories for this round (All weights are 0). <br/>
                  Please Configure the interview profile first.
              </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={resetDialogOpen}
        title="End Session?"
        description="This will clear all candidate data and scores. Make sure you have copied the report first."
        confirmLabel="End & Reset"
        variant="destructive"
        onCancel={() => setResetDialogOpen(false)}
        onConfirm={() => {
          resetSession();
          navigate('/interviews');
        }}
      />
    </div>
  );
};

// Extracted Reusable DecimalInput Component
interface DecimalInputProps {
  value: number | undefined;
  onChange: (val: number) => void;
  max: number;
  className?: string;
  placeholder?: string;
}

const DecimalInput = ({ value, onChange, max, className, placeholder }: DecimalInputProps) => {
  // Initialize local string state from prop
  const [strVal, setStrVal] = useState(value === undefined ? '' : value.toString());

  // Sync prop changes (e.g. reset) to local state
  useEffect(() => {
    setStrVal(value === undefined || value === 0 ? '' : value.toString());
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    
    // Regex: Allow empty, or numbers with max 1 decimal
    if (val === '' || val === '.') {
      setStrVal(val);
      onChange(0); // Temporarily 0 or handle empty logic upstream if needed
      return;
    }

    // Check format
    if (/^\d*\.?\d{0,1}$/.test(val)) {
      const num = parseFloat(val);
      if (!isNaN(num) && num >= 0 && num <= max) {
        setStrVal(val);
        onChange(num);
      }
    }
  };

  return (
    <input
      type="text"
      inputMode="decimal"
      className={cn(
        "no-spinner flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950",
        className
      )}
      value={strVal}
      onChange={handleChange}
      placeholder={placeholder}
      onBlur={() => {
        if (strVal !== '') {
           const num = parseFloat(strVal);
           setStrVal(isNaN(num) ? '' : num.toString());
        }
      }}
    />
  );
};
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SessionState {
  // Session Metadata
  interviewId: string | null;
  round: 'l1' | 'l2' | null;
  
  // Candidate Details
  candidateName: string;
  experience: string;
  remarks: string;
  
  // Scoring: categoryId -> score (0-10)
  scores: Record<string, number>;
  
  // Actions
  startSession: (interviewId: string, round: 'l1' | 'l2') => void;
  updateCandidate: (field: 'candidateName' | 'experience' | 'remarks', value: string) => void;
  setScore: (categoryId: string, score: number) => void;
  resetSession: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      interviewId: null,
      round: null,
      candidateName: '',
      experience: '',
      remarks: '',
      scores: {},

      startSession: (interviewId, round) => set({
        interviewId,
        round,
        candidateName: '',
        experience: '',
        remarks: '',
        scores: {},
      }),

      updateCandidate: (field, value) => set((state) => ({
        [field]: value
      })),

      setScore: (categoryId, score) => set((state) => ({
        scores: {
          ...state.scores,
          [categoryId]: score
        }
      })),

      resetSession: () => set({
        interviewId: null,
        round: null,
        candidateName: '',
        experience: '',
        remarks: '',
        scores: {},
      }),
    }),
    {
      name: 'interviewer-assistant-session',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Platform, InterviewProfile } from '../types/core'; // Removed Category, Concept
import { apiStorage } from './apiStorage';

interface AppState {
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;

  platforms: Platform[];
  interviews: InterviewProfile[];

  // Platform Actions
  addPlatform: (name: string) => void;
  deletePlatform: (id: string) => void;
  
  // Category Actions
  addCategory: (platformId: string, name: string) => void;
  renameCategory: (platformId: string, categoryId: string, newName: string) => void;
  deleteCategory: (platformId: string, categoryId: string) => void;
  
  // Concept Actions
  addConcept: (platformId: string, categoryId: string, name: string) => void;
  renameConcept: (platformId: string, categoryId: string, conceptId: string, newName: string) => void;
  deleteConcept: (platformId: string, categoryId: string, conceptId: string) => void;

  // Interview Actions
  addInterview: (platformId: string, name: string) => void;
  renameInterview: (id: string, newName: string) => void;
  deleteInterview: (id: string) => void;
  cloneInterview: (id: string) => void;
  updateInterviewConfig: (interviewId: string, categoryId: string, round: 'l1' | 'l2', conceptId: string) => void;
  updateCategoryWeight: (interviewId: string, categoryId: string, round: 'l1' | 'l2', weight: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      platforms: [],
      interviews: [],

      addPlatform: (name) =>
        set((state) => ({
          platforms: [
            ...state.platforms,
            { id: crypto.randomUUID(), name, categories: [] },
          ],
        })),

      deletePlatform: (id) =>
        set((state) => ({
          platforms: state.platforms.filter((p) => p.id !== id),
          interviews: state.interviews.filter((i) => i.platformId !== id),
        })),

      addCategory: (platformId, name) =>
        set((state) => ({
          platforms: state.platforms.map((p) =>
            p.id === platformId
              ? {
                  ...p,
                  categories: [
                    ...p.categories,
                    { id: crypto.randomUUID(), name, concepts: [] },
                  ],
                }
              : p
          ),
        })),

      renameCategory: (platformId, categoryId, newName) =>
        set((state) => ({
          platforms: state.platforms.map((p) =>
            p.id === platformId
              ? {
                  ...p,
                  categories: p.categories.map((c) => 
                    c.id === categoryId ? { ...c, name: newName } : c
                  ),
                }
              : p
          ),
        })),

      deleteCategory: (platformId, categoryId) =>
        set((state) => ({
          platforms: state.platforms.map((p) =>
            p.id === platformId
              ? {
                  ...p,
                  categories: p.categories.filter((c) => c.id !== categoryId),
                }
              : p
          ),
        })),

      addConcept: (platformId, categoryId, name) =>
        set((state) => ({
          platforms: state.platforms.map((p) =>
            p.id === platformId
              ? {
                  ...p,
                  categories: p.categories.map((c) =>
                    c.id === categoryId
                      ? {
                          ...c,
                          concepts: [
                            ...c.concepts,
                            { id: crypto.randomUUID(), name },
                          ],
                        }
                      : c
                  ),
                }
              : p
          ),
        })),

      renameConcept: (platformId, categoryId, conceptId, newName) =>
        set((state) => ({
          platforms: state.platforms.map((p) =>
            p.id === platformId
              ? {
                  ...p,
                  categories: p.categories.map((c) =>
                    c.id === categoryId
                      ? {
                          ...c,
                          concepts: c.concepts.map((con) => 
                            con.id === conceptId ? { ...con, name: newName } : con
                          ),
                        }
                      : c
                  ),
                }
              : p
          ),
        })),

      deleteConcept: (platformId, categoryId, conceptId) =>
        set((state) => ({
          platforms: state.platforms.map((p) =>
            p.id === platformId
              ? {
                  ...p,
                  categories: p.categories.map((c) =>
                    c.id === categoryId
                      ? {
                          ...c,
                          concepts: c.concepts.filter((con) => con.id !== conceptId),
                        }
                      : c
                  ),
                }
              : p
          ),
        })),

      addInterview: (platformId, name) =>
        set((state) => ({
          interviews: [
            ...state.interviews,
            {
              id: crypto.randomUUID(),
              platformId,
              name,
              config: {},
              customCategories: [],
            },
          ],
        })),

      renameInterview: (id, newName) =>
        set((state) => ({
          interviews: state.interviews.map((i) => 
            i.id === id ? { ...i, name: newName } : i
          ),
        })),

      deleteInterview: (id) =>
        set((state) => ({
          interviews: state.interviews.filter((i) => i.id !== id),
        })),

      cloneInterview: (id) =>
        set((state) => {
          const original = state.interviews.find((i) => i.id === id);
          if (!original) return state;
          return {
            interviews: [
              ...state.interviews,
              {
                ...original,
                id: crypto.randomUUID(),
                name: `${original.name} copy`,
              },
            ],
          };
        }),

      updateInterviewConfig: (interviewId, categoryId, round, conceptId) =>
        set((state) => ({
          interviews: state.interviews.map((i) => {
            if (i.id !== interviewId) return i;

            // Initialize with default structure if missing
            const currentConfig = i.config[categoryId] || { 
              l1: { concepts: [], weight: 0 }, 
              l2: { concepts: [], weight: 0 } 
            };
            
            // Handle legacy data where l1/l2 might be arrays instead of objects
            let roundConfig = currentConfig[round];
            if (Array.isArray(roundConfig)) {
               roundConfig = { concepts: roundConfig, weight: 0 };
            } else if (!roundConfig) {
               roundConfig = { concepts: [], weight: 0 };
            }

            const currentConcepts = roundConfig.concepts;
            const isIncluded = currentConcepts.includes(conceptId);

            const newConcepts = isIncluded
              ? currentConcepts.filter((id) => id !== conceptId)
              : [...currentConcepts, conceptId];

            return {
              ...i,
              config: {
                ...i.config,
                [categoryId]: {
                  ...currentConfig,
                  [round]: {
                    ...roundConfig,
                    concepts: newConcepts
                  },
                },
              },
            };
          }),
        })),

      updateCategoryWeight: (interviewId, categoryId, round, weight) =>
        set((state) => ({
          interviews: state.interviews.map((i) => {
            if (i.id !== interviewId) return i;

            const currentConfig = i.config[categoryId] || { 
              l1: { concepts: [], weight: 0 }, 
              l2: { concepts: [], weight: 0 } 
            };

            let roundConfig = currentConfig[round];
            if (Array.isArray(roundConfig)) {
               roundConfig = { concepts: roundConfig, weight: 0 };
            } else if (!roundConfig) {
               roundConfig = { concepts: [], weight: 0 };
            }

            return {
              ...i,
              config: {
                ...i.config,
                [categoryId]: {
                  ...currentConfig,
                  [round]: {
                    ...roundConfig,
                    weight
                  },
                },
              },
            };
          }),
        })),
    }),
    {
      name: 'interviewer-assistant-storage',
      storage: createJSONStorage(() => apiStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
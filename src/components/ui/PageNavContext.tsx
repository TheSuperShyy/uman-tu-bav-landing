import { createContext, useContext } from 'react';

// Page navigation context — exposed to any descendant of App so deeply
// nested CTAs (Hero, PriceBlock, future LeadForm submit success state…)
// can advance/retreat without prop-drilling.
type Ctx = {
  goNext: () => void;
  goBack: () => void;
  goTo: (idx: number) => void;
  current: number;
  total: number;
};

export const PageNavContext = createContext<Ctx | null>(null);

export function usePageNav() {
  const ctx = useContext(PageNavContext);
  if (!ctx) throw new Error('usePageNav must be used inside <PageNavContext.Provider>');
  return ctx;
}

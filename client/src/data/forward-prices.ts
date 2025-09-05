export type Forward = { label: string; price: number; code?: string };

// Central registry of forward prices per grade.
// Extend freely for other grades; empty arrays are valid for unknown grades.
export const forwardPrices: Record<string, Forward[]> = {
  "RBD Palm Oil": [
    { label: "August", price: 1000, code: "PO-MYRBD-M1" },
    { label: "September", price: 1005, code: "PO-MYRBD-M2" },
    { label: "October", price: 1010, code: "PO-MYRBD-M3" },
    { label: "Oct/Nov/Dec", price: 1025, code: "PO-MYRBD-Q1" },
    { label: "Jan/Feb/Mar", price: 1010, code: "PO-MYRBD-Q2" },
    { label: "Apr/May/June", price: 1005, code: "PO-MYRBD-Q3" },
  ],
  // Example placeholders, to be completed as needed:
  "RBD Palm Stearin": [],
  "RBD Palm Olein IV56": [],
  "Olein IV64": [],
  "RBD PKO": [],
  "RBD CNO": [],
  "CDSBO": [],
};

export function getForwards(gradeName?: string): Forward[] {
  if (!gradeName) return [];
  return forwardPrices[gradeName] || [];
}

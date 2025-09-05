export type Forward = { label: string; price: number; code?: string };
export const forwardPrices: Record<string, Forward[]> = {
  "RBD Palm Oil": [
    { label: "August", price: 1000, code: "PO-MYRBD-M1" },
    { label: "September", price: 1005, code: "PO-MYRBD-M2" },
    { label: "October", price: 1010, code: "PO-MYRBD-M3" },
    { label: "Oct/Nov/Dec", price: 1025, code: "PO-MYRBD-Q1" },
    { label: "Jan/Feb/Mar", price: 1010, code: "PO-MYRBD-Q2" },
    { label: "Apr/May/June", price: 1005, code: "PO-MYRBD-Q3" },
  ],
  "RBD Palm Olein IV56": [
    { label: "August", price: 995 },
    { label: "September", price: 1000 },
    { label: "October", price: 1005 },
    { label: "Oct/Nov/Dec", price: 1020 },
    { label: "Jan/Feb/Mar", price: 1005 },
    { label: "Apr/May/June", price: 1000 },
  ],
  "RBD Palm Stearin": [
    { label: "August", price: 980 },
    { label: "September", price: 985 },
    { label: "October", price: 990 },
    { label: "Oct/Nov/Dec", price: 1005 },
    { label: "Jan/Feb/Mar", price: 995 },
    { label: "Apr/May/June", price: 990 },
  ],
  "RBD CNO": [
    { label: "August", price: 1180 },
    { label: "September", price: 1185 },
    { label: "October", price: 1190 },
    { label: "Oct/Nov/Dec", price: 1205 },
    { label: "Jan/Feb/Mar", price: 1195 },
    { label: "Apr/May/June", price: 1190 },
  ],
  "RBD PKO": [
    { label: "August", price: 1200 },
    { label: "September", price: 1205 },
    { label: "October", price: 1210 },
    { label: "Oct/Nov/Dec", price: 1225 },
    { label: "Jan/Feb/Mar", price: 1215 },
    { label: "Apr/May/June", price: 1210 },
  ],
};

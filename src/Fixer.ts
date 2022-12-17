export type Fixer = (n: number) => number;

export const noFix: Fixer = (n: number) => n;

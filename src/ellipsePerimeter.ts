export const ellipsePerimeter = (r1: number, r2: number): number => {
	const a = r2 > r1 ? r2 : r1;
	const b = r2 < r1 ? r2 : r1;
	const aMinusB: number = a - b;
	const aPlusB: number = a + b;
	const h = (aMinusB * aMinusB) / (aPlusB * aPlusB);
	return Math.PI * (a + b) * (1 + ((3 * h) / (10 + Math.sqrt(4 - (3 * h)))));
};

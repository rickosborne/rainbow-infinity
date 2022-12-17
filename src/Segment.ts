import { Fixer } from './Fixer';

export type Segment = {
	readonly id: string;
	length(fixed?: Fixer): number;
	svgPath(fixed?: Fixer): string;
}

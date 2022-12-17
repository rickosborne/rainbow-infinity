import { ArcArgs, ArcSegment } from './ArcSegment.js';
import { Fixer, noFix } from './Fixer.js';
import { LineArgs, LineSegment } from './LineSegment.js';
import { Segment } from './Segment.js';
import { Side } from './Side.js';

export type InfinityArgs = LineArgs & ArcArgs;

export class InfinitySegment implements Segment {
	private readonly perimeter: number;
	private readonly segments: Segment[];

	constructor(
		public readonly id: string,
		args: InfinityArgs,
	) {
		const { ellipseHeight, ellipseWidth, halfDistance, intersectX, intersectY, thickness } = args;
		this.segments = [
			new ArcSegment('ra-path', Side.Right, {
				ellipseHeight,
				ellipseWidth,
				halfDistance,
				intersectX,
				intersectY,
				thickness,
			}),
			new ArcSegment('la-path', Side.Left, {
				ellipseHeight,
				ellipseWidth,
				halfDistance,
				intersectX,
				intersectY,
				thickness,
			}),
			new LineSegment('we-path', Side.Left, {
				halfDistance,
				intersectX,
				intersectY,
				thickness,
			}),
			new LineSegment('ew-path', Side.Right, {
				halfDistance,
				intersectX,
				intersectY,
				thickness,
			}),
		];
		this.perimeter = this.segments.map(s => s.length()).reduce((p, c) => p + c);
	}

	public length(fixed: Fixer = noFix): number {
		return fixed(this.perimeter);
	}

	public svgPath(fixed: Fixer = noFix): string {
		return this.segments.map(s => `<path d="${ s.svgPath(fixed) }" id="${ s.id }" />`).join('\n');
	}
}

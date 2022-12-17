import { ArcSegment } from './ArcSegment.js';
import { Fixer, noFix } from './Fixer.js';
import { LineSegment } from './LineSegment.js';
import { GivenMetrics, Metrics } from './Metrics.js';
import { Segment } from './Segment.js';
import { Side } from './Side.js';

export class InfinitySymbol implements Segment {
	public readonly metrics: Metrics;
	private readonly segments: Segment[];

	constructor(
		public readonly id: string,
		givenMetrics: GivenMetrics,
	) {
		this.segments = [
			new ArcSegment('ra-path', Side.Right, givenMetrics),
			new ArcSegment('la-path', Side.Left, givenMetrics),
			new LineSegment('we-path', Side.Left, givenMetrics),
			new LineSegment('ew-path', Side.Right, givenMetrics),
		];
		const perimeter = this.segments.map(s => s.length()).reduce((p, c) => p + c);
		this.metrics = Object.freeze({
			...givenMetrics,
			perimeter,
		});
	}

	public length(fixed: Fixer = noFix): number {
		return fixed(this.metrics.perimeter);
	}

	public svgPath(fixed: Fixer = noFix): string {
		return this.segments.map(s => `<path d="${ s.svgPath(fixed) }" id="${ s.id }" />`).join('\n');
	}
}

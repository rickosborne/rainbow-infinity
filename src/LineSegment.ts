import { Fixer, noFix } from './Fixer.js';
import { GivenMetrics, Metrics } from './Metrics';
import { Segment } from './Segment.js';
import { Side } from './Side.js';

export class LineSegment implements Segment {
	public readonly metrics: Metrics;

	public constructor(
		public readonly id: string,
		public readonly side: Side,
		metrics: GivenMetrics,
	) {
		this.metrics = Object.freeze({
			...metrics,
			perimeter: LineSegment.lengthOf(metrics),
		});
	}

	public static lengthOf(metrics: GivenMetrics): number {
		return Math.sqrt((metrics.intersectX * metrics.intersectX) + (metrics.intersectY * metrics.intersectY));
	}

	public length(fixed: Fixer = noFix): number {
		return fixed(this.metrics.perimeter);
	}

	public svgPath(fixed: Fixer = noFix): string {
		const ix = fixed(this.metrics.intersectX);
		const iy = fixed(this.metrics.intersectY);
		const tdx = fixed(this.metrics.thicknessDX);
		const tdy = fixed(this.metrics.thicknessDY);
		if (this.side === Side.Left) {
			return [
				`M ${ -ix + tdx }, ${ iy + tdy }`,
				`l ${ -tdx * 2 }, ${ -tdy * 2 }`,
				`L ${ ix - tdx }, ${ -iy - tdy }`,
				`l ${ tdx * 2 }, ${ tdy * 2 }`,
				'z',
			].join(' ');
		} else {
			return [
				`M ${ -ix - tdx }, ${ -iy + tdy }`,
				`l ${ tdx * 2 }, ${ -tdy * 2 }`,
				`L ${ ix + tdx }, ${ iy - tdy }`,
				`l ${ -tdx * 2 }, ${ tdy * 2 }`,
				'z',
			].join(' ');
		}
	}
}

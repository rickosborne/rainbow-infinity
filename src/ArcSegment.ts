import { ellipsePerimeter } from './ellipsePerimeter.js';
import { Fixer, noFix } from './Fixer.js';
import { GivenMetrics, Metrics } from './Metrics.js';
import { Segment } from './Segment.js';
import { Side } from './Side.js';

export class ArcSegment implements Segment {
	public readonly metrics: Metrics;

	public constructor(
		public readonly id: string,
		private readonly side: Side,
		metrics: GivenMetrics,
	) {
		this.metrics = Object.freeze({
			...metrics,
			perimeter: ArcSegment.lengthOf(metrics),
		});
	}

	public static lengthOf(metrics: GivenMetrics): number {
		const ep: number = ellipsePerimeter(metrics.ellipseWidth, metrics.ellipseHeight);
		const ef: number = (Math.PI - metrics.lineRadians) / Math.PI;  // ellipse fraction
		return ep * ef;
	}

	public length(fixed: Fixer = noFix): number {
		return fixed(this.metrics.perimeter);
	}

	public svgPath(fixed: Fixer = noFix): string {
		const ix = fixed(this.metrics.intersectX);
		const iy = fixed(this.metrics.intersectY);
		const tdx = fixed(this.metrics.thicknessDX);
		const tdy = fixed(this.metrics.thicknessDY);
		const ew = fixed(this.metrics.ellipseWidth);
		const eh = fixed(this.metrics.ellipseHeight);
		const ht = fixed(this.metrics.halfThickness);
		if (this.side === Side.Left) {
			return [
				`M ${ -ix - tdx }, ${ -iy + tdy }`,
				`l ${ tdx * 2 }, ${ -tdy * 2 }`,
				`a ${ ew + ht } ${ eh + ht } 0 1 0 0 ${ 2 * (iy + tdy) }`,
				`l ${ -tdx * 2 }, ${ -tdy * 2 }`,
				`a ${ ew - ht } ${ eh - ht } 0 1 1 0 ${ -2 * (iy - tdy) }`,
				'z',
			].join(' ');
		} else {
			return [
				`M ${ ix + tdx }, ${ -iy + tdy }`,
				`l ${ -tdx * 2 }, ${ -tdy * 2 }`,
				`a ${ ew + ht } ${ eh + ht } 0 1 1 0 ${ 2 * (iy + tdy) }`,
				`l ${ tdx * 2 }, ${ -tdy * 2 }`,
				`a ${ ew - ht } ${ eh - ht } 0 1 0 0 ${ -2 * (iy - tdy) }`,
				'z',
			].join(' ');
		}
	}
}

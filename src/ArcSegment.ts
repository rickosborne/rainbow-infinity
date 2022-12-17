import { ellipsePerimeter } from './ellipsePerimeter.js';
import { Fixer, noFix } from './Fixer.js';
import { Segment } from './Segment.js';
import { Side } from './Side.js';

export type ArcArgs = {
	ellipseHeight: number;
	ellipseWidth: number;
	halfDistance: number;
	intersectX: number;
	intersectY: number;
	thickness: number;
};

export class ArcSegment implements Segment {
	private readonly ellipseHeight: number;
	private readonly ellipseWidth: number;
	private readonly halfDistance: number;
	private readonly halfThickness: number;
	private readonly intersectX: number;
	private readonly intersectY: number;
	private readonly lineRadians: number;
	private readonly perimeter: number;
	private readonly thickness: number;
	private readonly thicknessDX: number;
	private readonly thicknessDY: number;

	public constructor(
		public readonly id: string,
		private readonly side: Side,
		args: ArcArgs,
	) {
		this.ellipseHeight = args.ellipseHeight;
		this.ellipseWidth = args.ellipseWidth;
		this.halfDistance = args.halfDistance;
		this.intersectX = args.intersectX;
		this.intersectY = args.intersectY;
		this.lineRadians = Math.atan(args.intersectY / (args.halfDistance - args.intersectX));
		this.thickness = args.thickness;
		this.halfThickness = args.thickness / 2;
		this.thicknessDX = Math.cos(this.lineRadians) * this.halfThickness;  // intersection point dx for thickness
		this.thicknessDY = Math.sin(this.lineRadians) * this.halfThickness;  // intersection point dy for thickness
		const ep: number = ellipsePerimeter(this.ellipseWidth, this.ellipseHeight);
		const ef: number = (Math.PI - this.lineRadians) / Math.PI;  // ellipse fraction
		this.perimeter = ep * ef;
	}

	public length(fixed: Fixer = noFix): number {
		return fixed(this.perimeter);
	}

	public svgPath(fixed: Fixer = noFix): string {
		const ix = fixed(this.intersectX);
		const iy = fixed(this.intersectY);
		const tdx = fixed(this.thicknessDX);
		const tdy = fixed(this.thicknessDY);
		const ew = fixed(this.ellipseWidth);
		const eh = fixed(this.ellipseHeight);
		const ht = fixed(this.halfThickness);
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

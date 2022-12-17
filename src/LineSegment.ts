import { Fixer, noFix } from './Fixer.js';
import { Segment } from './Segment.js';
import { Side } from './Side.js';

export type LineArgs = {
	halfDistance: number;
	intersectX: number;
	intersectY: number;
	thickness: number;
};

export class LineSegment implements Segment {
	private readonly intersectX: number;
	private readonly intersectY: number;
	private readonly len: number;
	private readonly lineRadians: number;
	private readonly thickness: number;
	private readonly thicknessDX: number;
	private readonly thicknessDY: number;

	public constructor(
		public readonly id: string,
		public readonly side: Side,
		args: LineArgs,
	) {
		this.intersectX = args.intersectX;
		this.intersectY = args.intersectY;
		this.thickness = args.thickness;
		this.lineRadians = Math.atan(args.intersectY / (args.halfDistance - args.intersectX));
		const halfThickness = args.thickness / 2;
		this.thicknessDX = Math.cos(this.lineRadians) * halfThickness;  // intersection point dx for thickness
		this.thicknessDY = Math.sin(this.lineRadians) * halfThickness;  // intersection point dy for thickness
		this.len = Math.sqrt((this.intersectX * this.intersectX) + (this.intersectY * this.intersectY));
	}

	public length(fixed: Fixer = noFix): number {
		return fixed(this.len);
	}

	public svgPath(fixed: Fixer = noFix): string {
		const ix = fixed(this.intersectX);
		const iy = fixed(this.intersectY);
		const tdx = fixed(this.thicknessDX);
		const tdy = fixed(this.thicknessDY);
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

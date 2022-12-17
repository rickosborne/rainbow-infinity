import { Options } from './Options.js';

export type GivenMetrics = {
	readonly ellipseDistance: number;
	readonly ellipseHeight: number;
	readonly ellipseWidth: number;
	readonly halfDistance: number;
	readonly halfHeight: number;
	readonly halfThickness: number;
	readonly halfWidth: number;
	readonly intersectX: number;
	readonly intersectY: number;
	readonly lineRadians: number;
	readonly thickness: number;
	readonly thicknessDX: number;
	readonly thicknessDY: number;
};

export type Metrics = GivenMetrics & {
	readonly perimeter: number;
};

export const givenFromOptions = (options: Options): GivenMetrics => {
	const halfDistance = options.ellipseDistance / 2;
	const halfThickness = options.thickness / 2;
	// This is the point from the ellipse-centered origin
	const rx = (options.ellipseWidth * options.ellipseWidth) / halfDistance;
	// ... and this is from the ribbon-centered origin
	const intersectX = halfDistance - rx;
	const intersectY = Math.sqrt((options.ellipseHeight * options.ellipseHeight) * (1 - (rx * rx) / (options.ellipseWidth * options.ellipseWidth)));
	const lineRadians = Math.atan(intersectY / (halfDistance - intersectX));
	const thicknessDX = Math.cos(lineRadians) * halfThickness;  // intersection point dx for thickness
	const thicknessDY = Math.sin(lineRadians) * halfThickness;  // intersection point dy for thickness
	const halfHeight = options.viewHeight / 2;
	const halfWidth = options.viewWidth / 2;
	return {
		...options,
		halfDistance,
		halfHeight,
		halfThickness,
		halfWidth,
		intersectX,
		intersectY,
		lineRadians,
		thicknessDX,
		thicknessDY,
	};
};

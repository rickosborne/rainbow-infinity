interface Options {
	debug?: boolean;
	ellipseDistance: number;
	ellipseHeight: number;
	ellipseWidth: number;
	thickness: number;
	viewHeight: number;
	viewWidth: number;
}

const DEGREES_PER_RADIAN = 180 / Math.PI;


export class InfinitySymbolSvg {
	protected readonly debug: boolean;
	protected readonly ellipseDistance: number;
	protected readonly ellipseHeight: number;
	protected readonly ellipseWidth: number;
	protected readonly halfDistance: number;
	protected readonly halfHeight: number;
	protected readonly halfWidth: number;
	protected readonly intersectX: number;
	protected readonly intersectY: number;
	protected readonly thickness: number;
	protected readonly viewHeight: number;
	protected readonly viewWidth: number;

	constructor(
		options: Options,
	) {
		console.log(options);
		this.debug = !!options.debug;
		this.ellipseDistance = options.ellipseDistance;
		this.ellipseHeight = options.ellipseHeight;
		this.ellipseWidth = options.ellipseWidth;
		this.thickness = options.thickness;
		this.viewHeight = options.viewHeight;
		this.viewWidth = options.viewWidth;
		this.halfDistance = this.ellipseDistance / 2;
		this.halfHeight = this.viewHeight / 2;
		this.halfWidth = this.viewWidth / 2;
		// This is the point from the ellipse-centered origin
		const rx = (this.ellipseWidth * this.ellipseWidth) / this.halfDistance;
		// ... and this is from the ribbon-centered origin
		this.intersectX = this.halfDistance - rx;
		this.intersectY = Math.sqrt((this.ellipseHeight * this.ellipseHeight) * (1 - (rx * rx) / (this.ellipseWidth * this.ellipseWidth)));
	}

	get validationProblems(): string[] {
		const problems = [];
		if (this.ellipseDistance <= (this.ellipseWidth * 2)) {
			problems.push(`ellipseDistance (${ this.ellipseDistance }) must be > ellipseWidth (${ this.ellipseWidth }) * 2`);
		}
		return problems;
	}

	static fixed(n: number, nearest = 0.001): number {
		return Math.round(n / nearest) * nearest;
	}

	toString(): string {
		const problems = this.validationProblems;
		if (problems.length > 0) {
			return `
<svg xmlns="http://www.w3.org/2000/svg" stroke="none" fill="none" viewBox="0 0 500 500">
<text fill="red" x="3em" y="3em">
<tspan>Validation problems:</tspan>
${ problems.map(p => `<tspan dy="2em" x="3em">${ p }</tspan>`).join('\n') }
</text>
</svg>
			`;
		}
		const f = InfinitySymbolSvg.fixed;
		const hw: number = f(this.halfWidth);
		const hh: number = f(this.halfHeight);
		const ew: number = f(this.ellipseWidth);
		const eh: number = f(this.ellipseHeight);
		const hd: number = f(this.halfDistance);
		const ed: number = f(this.ellipseDistance);
		const ix: number = f(this.intersectX);
		const iy: number = f(this.intersectY);
		const th = f(this.thickness);
		const ht = f(this.thickness / 2);
		const weRad = Math.atan(this.intersectY / (hd - this.intersectX));
		const weDeg = f(weRad * DEGREES_PER_RADIAN);
		const tdx = f(Math.cos(weRad) * ht);
		const tdy = f(Math.sin(weRad) * ht);
		const rightArc: string = [
			`M ${ ix + tdx }, ${ -iy + tdy }`,
			`l ${ -tdx * 2 }, ${ -tdy * 2 }`,
			`a ${ ew + ht } ${ eh + ht } 0 1 1 0 ${ 2 * (iy + tdy) }`,
			`l ${ tdx * 2 }, ${ -tdy * 2 }`,
			`a ${ ew - ht } ${ eh - ht } 0 1 0 0 ${ -2 * (iy - tdy) }`,
			'z',
		].join(' ');
		const leftArc: string = [
			`M ${ -ix - tdx }, ${ -iy + tdy }`,
			`l ${ tdx * 2 }, ${ -tdy * 2 }`,
			`a ${ ew + ht } ${ eh + ht } 0 1 0 0 ${ 2 * (iy + tdy) }`,
			`l ${ -tdx * 2 }, ${ -tdy * 2 }`,
			`a ${ ew - ht } ${ eh - ht } 0 1 1 0 ${ -2 * (iy - tdy) }`,
			'z',
		].join(' ');
		const weLine: string = [
			`M ${ -ix + tdx }, ${ iy + tdy }`,
			`l ${ -tdx * 2 }, ${ -tdy * 2 }`,
			`L ${ ix - tdx }, ${ -iy - tdy }`,
			`l ${ tdx * 2 }, ${ tdy * 2 }`,
			'z',
		].join(' ');
		const ewLine: string = [
			`M ${ -ix - tdx }, ${ -iy + tdy }`,
			`l ${ tdx * 2 }, ${ -tdy * 2 }`,
			`L ${ ix + tdx }, ${ iy - tdy }`,
			`l ${ -tdx * 2 }, ${ tdy * 2 }`,
			'z',
		].join(' ');
		const path: string = [
			`M ${ -ix }, ${ iy }`,
			`L ${ ix }, ${ -iy }`,
			`a ${ ew } ${ eh } 0 1 1 0 ${ 2 * iy }`,
			`L ${ -ix }, ${ -iy }`,
			`a ${ ew } ${ eh } 0 1 0 0 ${ 2 * iy }`,
			'Z',
		].join(' ');
		return `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" stroke="none" fill="none" viewBox="0 0 ${ this.viewWidth } ${ this.viewHeight }">
<style>
.arc, .part {
	stroke: none;
	fill: rgba(128, 128, 128, 0.9);
}
#ew {
	fill: url(#ew-line);
}
#we {
	fill: url(#we-line);
}
#debugIn {
	fill: url(#ew-line);
}
.ra-colors {
	width: 100%;
	height: 100%;
	/* This bit of magic via: https://css-tricks.com/my-struggle-to-use-and-animate-a-conic-gradient-in-svg/ */
	background-image: conic-gradient(
		from ${ weDeg - 90 }deg,
		hwb(80 0% 0%),
		hwb(180 0% 0%) ${ 360 - (2 * weDeg) }deg,
		transparent ${ 360 - (2 * weDeg) + 1.001 }deg
	);
	--dx: ${ hd - ix };
	--ix: ${ ix };
	--iy: ${ iy };
	--weDeg: ${ weDeg };
}
.la-colors {
	width: 100%;
	height: 100%;
	background-image: conic-gradient(
		from ${ 90 + weDeg - 1 }deg,
		hwb(360 0% 0%),
		hwb(260 0% 0%) ${ 360 - (2 * weDeg) + 2 }deg,
		transparent ${ 360 - (2 * weDeg) + 2.0001 }deg
	);
}
</style>
<defs>
	<linearGradient id="we-line" x1="${ -ix }" y1="${ iy }" x2="${ ix }" y2="${ -iy }" gradientUnits="userSpaceOnUse" >
		<stop offset="0" stop-color="hwb(0 0% 0%)" />
		<stop offset="1" stop-color="hwb(80 0% 0%)" />
	</linearGradient>
	<linearGradient id="ew-line" x1="${ ix }" y1="${ iy }" x2="${ -ix }" y2="${ -iy }" gradientUnits="userSpaceOnUse" >
		<stop offset="0" stop-color="hwb(180 0% 0%)" />
		<stop offset="1" stop-color="hwb(260 0% 0%)" />
	</linearGradient>
	<path d="${ ewLine }" id="ew-path" />
	<path d="${ weLine }" id="we-path" />
	<path d="${ rightArc }" id="ra-path" />
	<path d="${ leftArc }" id="la-path" />
</defs>
	<mask id="ra-mask">
		<use xlink:href="#ra-path" fill="white" />
	</mask>
	<mask id="la-mask">
		<use xlink:href="#la-path" fill="white" />
	</mask>
<g id="ribbon" transform="translate(${ hw } ${ hh })">
	<use xlink:href="#ew-path" id="ew" class="line part" />
	<use xlink:href="#we-path" id="we" class="line part" />
	<foreignObject x="${ hd - ew - ht }" y="${ -eh - ht }" width="${ ew * 2 + th }" height="${ eh * 2 + th }" mask="url(#ra-mask)">
		<div class="ra-colors" xmlns="http://www.w3.org/1999/xhtml" />
	</foreignObject>
	<foreignObject x="${ -hd - ew - ht }" y="${ -eh - ht }" width="${ ew * 2 + th }" height="${ eh * 2 + th }" mask="url(#la-mask)">
		<div class="la-colors" xmlns="http://www.w3.org/1999/xhtml" />
	</foreignObject>
</g>
</svg>
		`.trim();
	}
}


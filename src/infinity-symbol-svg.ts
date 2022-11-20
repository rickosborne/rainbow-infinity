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
		const rightArc: string = [
			`M ${ ix }, ${ -iy }`,
			`a ${ ew } ${ eh } 0 1 1 0 ${ 2 * iy }`,
		].join(' ');
		const leftArc: string = [
			`M ${ -ix }, ${ -iy }`,
			`a ${ ew } ${ eh } 0 1 0 0 ${ 2 * iy }`,
		].join(' ');
		const path: string = [
			`M ${ -ix }, ${ iy }`,
			`L ${ ix }, ${ -iy }`,
			`a ${ ew } ${ eh } 0 1 1 0 ${ 2 * iy }`,
			`L ${ -ix }, ${ -iy }`,
			`a ${ ew } ${ eh } 0 1 0 0 ${ 2 * iy }`,
			'Z',
		].join(' ');
		const weDeg = -f(Math.atan(iy / ix) * DEGREES_PER_RADIAN);
		return `
<svg xmlns="http://www.w3.org/2000/svg" stroke="none" fill="none" viewBox="0 0 ${ this.viewWidth } ${ this.viewHeight }">
<style>
.part {
	stroke: rgba(128, 128, 128, 0.9);
	stroke-width: ${ this.thickness };
}
#ew {
	stroke: url(#ew-line);
}
#we {
	stroke: url(#we-line);
}
#debugIn {
	fill: url(#ew-line);
}
.ra-colors {
	width: 100%;
	height: 100%;
	/* This bit of magic via: https://css-tricks.com/my-struggle-to-use-and-animate-a-conic-gradient-in-svg/ */
	background-image: conic-gradient(
		from ${ weDeg }deg,
		hwb(80 0% 0%),
		hwb(180 0% 0%) ${ 180 - (2 * weDeg) }deg,
		transparent ${ 180 - (2 * weDeg) + 0.001 }deg
	);
}
.la-colors {
	width: 100%;
	height: 100%;
	background-image: conic-gradient(
		from ${ 180 + weDeg - 0.5 }deg,
		hwb(360 0% 0%),
		hwb(260 0% 0%) ${ 180 - (2 * weDeg) + 1 }deg,
		transparent ${ 180 - (2 * weDeg) + 0.101 }deg
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
	<clipPath id="ra-clip">
		<ellipse rx="${ ew + ht }" ry="${ eh + ht }" transform="translate(${ hd } 0)" />
		<!-- <path d="${ rightArc }" /> -->
	</clipPath>
	<mask id="ra-mask">
		<ellipse rx="${ ew + ht }" ry="${ eh + ht }" transform="translate(${ hd } 0)" fill="white" />
		<ellipse rx="${ ew - ht }" ry="${ eh - ht }" transform="translate(${ hd } 0)" fill="black" />
	</mask>
	<mask id="la-mask">
		<ellipse rx="${ ew + ht }" ry="${ eh + ht }" transform="translate(${ -hd } 0)" fill="white" />
		<ellipse rx="${ ew - ht }" ry="${ eh - ht }" transform="translate(${ -hd } 0)" fill="black" />
	</mask>
</defs>
<g id="ribbon" transform="translate(${ hw } ${ hh })">
	${ this.debug ? `
	<rect id="debugIn" x="${ -ix }" y="${ -iy }" width="${ 2 * ix }" height="${ 2 * iy }" stroke-width="1" stroke="red" />
	<rect x="${ -hd }" y="${ -eh }" width="${ ed }" height="${ 2 * eh }" stroke-width="1" stroke="blue" />
	<ellipse rx="${ ew }" ry="${ eh }" cx="${ -hd }" cy="0" stroke="green" stroke-width="1" />
	<ellipse rx="${ ew }" ry="${ eh }" cx="${ hd }" cy="0" stroke="green" stroke-width="1" />
	` : '' }
	<line x1="${ -ix }" y1="${ iy }" x2="${ ix }" y2="${ -iy }" class="line part" id="we" />
	<!-- <path d="${ rightArc }" id="ra" class="arc part" /> -->
	<line x1="${ ix }" y1="${ iy }" x2="${ -ix }" y2="${ -iy }" class="line part" id="ew" />
	<!-- <path d="${ leftArc }" id="la" class="arc part" /> -->
	<foreignObject x="${ hd - ew - ht }" y="${ -eh - ht }" width="${ ew * 2 + th }" height="${ eh * 2 + th }" mask="url(#ra-mask)">
		<div class="ra-colors" xmlns="http://www.w3.org/1999/xhtml" />
	</foreignObject>
	<foreignObject x="${ -hd - ew - ht }" y="${ -eh - ht }" width="${ ew * 2 + th }" height="${ eh * 2 + th }" clip-path="url(#la-clip)" mask="url(#la-mask)">
		<div class="la-colors" xmlns="http://www.w3.org/1999/xhtml" />
	</foreignObject>
	<!-- <path d="${ path }" stroke="rgba(128, 128, 128, 0.9)" stroke-width="${ this.thickness }" stroke-linejoin="round" /> -->
</g>
</svg>
		`.trim();
	}
}


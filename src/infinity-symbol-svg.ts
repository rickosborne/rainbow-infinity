import { InfinitySymbol } from './InfinitySymbol.js';
import { givenFromOptions, GivenMetrics } from './Metrics.js';
import { Options } from './Options.js';

const DEGREES_PER_RADIAN = 180 / Math.PI;


export class InfinitySymbolSvg {
	protected readonly debug: boolean;
	protected readonly infinitySymbol: InfinitySymbol;
	protected readonly metrics: GivenMetrics;
	protected readonly segmentCount: number;

	constructor(
		options: Options,
	) {
		console.log(options);
		this.debug = !!options.debug;
		this.segmentCount = options.segmentCount || 20;
		this.metrics = givenFromOptions(options);
		this.infinitySymbol = new InfinitySymbol('ribbon', this.metrics);
	}

	get validationProblems(): string[] {
		const problems = [];
		const metrics: GivenMetrics = this.metrics;
		if (metrics.ellipseDistance <= (metrics.ellipseWidth * 2)) {
			problems.push(`ellipseDistance (${ metrics.ellipseDistance }) must be > ellipseWidth (${ metrics.ellipseWidth }) * 2`);
		}
		return problems;
	}

	static fixed(n: number, nearest = 0.001): number {
		return parseFloat(n.toFixed(0 - Math.log10(nearest)));
	}

	toString(): string {
		const problems = this.validationProblems;
		const metrics = this.infinitySymbol.metrics;
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
		const ellipseWidth: number = f(metrics.ellipseWidth);
		const ellipseHeight: number = f(metrics.ellipseHeight);
		const halfDistance: number = f(metrics.halfDistance);
		const intersectX: number = f(metrics.intersectX);
		const intersectY: number = f(metrics.intersectY);
		const thickness = f(metrics.thickness);  // rounded thickness
		const halfThickness = f(metrics.thickness / 2);  // half thickness
		const lineRadians = Math.atan(metrics.intersectY / (halfDistance - metrics.intersectX));
		const lineDegrees = f(lineRadians * DEGREES_PER_RADIAN);
		const avw = f(metrics.ellipseDistance + 2 * (metrics.ellipseWidth + metrics.thickness));
		const avh = f(2 * (metrics.ellipseHeight + metrics.thickness));
		const hw: number = f(avw / 2);  // half width
		const hh: number = f(avh / 2);  // half height
		return `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${ avw } ${ avh }">
<style>/* <![CDATA[ */
svg {
	background-color: white;
}
@media screen and (prefers-color-scheme: dark) {
	svg {
		background-color: black;
	}
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
		from ${ lineDegrees - 90 }deg,
		hwb(80 0% 0%),
		hwb(180 0% 0%) ${ 360 - (2 * lineDegrees) }deg,
		hwb(80 0% 0%)
	);
	--dx: ${ halfDistance - intersectX };
	--ix: ${ intersectX };
	--iy: ${ intersectY };
	--weDeg: ${ lineDegrees };
}
.la-colors {
	width: 100%;
	height: 100%;
	background-image: conic-gradient(from ${ 90 + lineDegrees }deg,
		hwb(360 0% 0%),
		hwb(260 0% 0%) ${ 360 - (2 * lineDegrees) }deg,
		hwb(360 0% 0%)
	);
	/* animation: 10s infinite linear forwards la-anim; */
}
@keyframes la-anim {
	from { --la-start: hsl(360 100% 50%); --la-end: hsl(270 100% 50%); }
	25%  { --la-start: hsl(270 100% 50%); --la-end: hsl(180 100% 50%); }
	50%  { --la-start: hsl(180 100% 50%); --la-end: hsl( 90 100% 50%); }
	75%  { --la-start: hsl( 90 100% 50%); --la-end: hsl( 0 100% 50%); }
	to   { --la-start: hsl(  0 100% 50%); --la-end: hsl(-90 100% 50%); }
}
/* #we-start { animation: 10s infinite linear forwards we-start-anim; } */
@keyframes we-start-anim {
	from { stop-color: hsl(0 100% 50%); }
	25% { stop-color: hsl(90 100% 50%); }
	50% { stop-color: hsl(180 100% 50%); }
	75% { stop-color: hsl(270 100% 50%); }
	to   { stop-color: hsl(359 100% 50%); }
}
/*#we-end { animation: 10s infinite linear forwards we-end-anim; }*/
@keyframes we-end-anim {
	from { stop-color: hsl(90 100% 50%); }
	25%  { stop-color: hsl(180 100% 50%); }
	50%  { stop-color: hsl(270 100% 50%); }
	75%  { stop-color: hsl(359 100% 50%); }
	75.1%{ stop-color: hsl(0 100% 50%); }
	to   { stop-color: hsl(90 100% 50%); }
}
/*#ew-start { animation: 10s infinite linear forwards ew-start-anim; }*/
@keyframes ew-start-anim {
	from { stop-color: hsl(180 100% 50%); }
	25%  { stop-color: hsl(270 100% 50%); }
	50%  { stop-color: hsl(359 100% 50%); }
	50.1%{ stop-color: hsl(0 100% 50%); }
	75%  { stop-color: hsl(90 100% 50%); }
	to   { stop-color: hsl(180 100% 50%); }
}
/*#ew-end { animation: 10s infinite linear forwards ew-end-anim; }*/
@keyframes ew-end-anim {
	from { stop-color: hsl(270 100% 50%); }
	25%  { stop-color: hsl(359 100% 50%); }
	25.1%{ stop-color: hsl(0 100% 50%); }
	50%  { stop-color: hsl(90 100% 50%); }
	75%  { stop-color: hsl(180 100% 50%); }
	to   { stop-color: hsl(270 100% 50%); }
}
/* ]]> */</style>
<defs>
	<linearGradient id="we-line" x1="${ -intersectX }" y1="${ intersectY }" x2="${ intersectX }" y2="${ -intersectY }" gradientUnits="userSpaceOnUse" >
		<stop offset="0" stop-color="hwb(0 0% 0%)" id="we-start" />
		<stop offset="1" stop-color="hwb(80 0% 0%)" id="we-end" />
	</linearGradient>
	<linearGradient id="ew-line" x1="${ intersectX }" y1="${ intersectY }" x2="${ -intersectX }" y2="${ -intersectY }" gradientUnits="userSpaceOnUse" >
		<stop offset="0" stop-color="hwb(180 0% 0%)" id="ew-start" />
		<stop offset="1" stop-color="hwb(260 0% 0%)" id="ew-end" />
	</linearGradient>
	${ this.infinitySymbol.svgPath(f) }
</defs>
	<mask id="ra-mask">
		<use xlink:href="#ra-path" fill="white" />
	</mask>
	<mask id="la-mask">
		<use xlink:href="#la-path" fill="white" />
	</mask>
	<rect width="100%" height="100%" id="matte" />
<g id="ribbon" transform="translate(${ hw } ${ hh })">
	<use xlink:href="#ew-path" id="ew" class="line part" />
	<use xlink:href="#we-path" id="we" class="line part" />
	<foreignObject x="${ halfDistance - ellipseWidth - halfThickness }" y="${ -ellipseHeight - halfThickness }" width="${ ellipseWidth * 2 + thickness }" height="${ ellipseHeight * 2 + thickness }" mask="url(#ra-mask)">
		<div class="ra-colors" xmlns="http://www.w3.org/1999/xhtml" />
	</foreignObject>
	<foreignObject x="${ -halfDistance - ellipseWidth - halfThickness }" y="${ -ellipseHeight - halfThickness }" width="${ ellipseWidth * 2 + thickness }" height="${ ellipseHeight * 2 + thickness }" mask="url(#la-mask)">
		<div class="la-colors" xmlns="http://www.w3.org/1999/xhtml" />
	</foreignObject>
</g>
</svg>
		`.trim();
	}
}


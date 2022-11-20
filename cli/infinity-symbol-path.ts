/*
 I generate an infinity symbol as an SVG path.
 */

import * as minimist from 'minimist';

/**
 * <pre>
 *  |< ew >|
 *     |< ed  >|
 *  /-----\ /-----\
 * (       X       )
 *  \-----/ \-----/
 * </pre>
 */
interface Args {
	_: string[];
	ed?: number;
	eh?: number;
	ew?: number;
	th?: number;
	vh?: number;
	vw?: number;
}

const defaults = {
	_: [],
	vw: 256,
};

const args: Args = minimist(process.argv.slice(2));

interface Options {
	ellipseDistance: number;
	ellipseHeight: number;
	ellipseWidth: number;
	thickness: number;
	viewHeight: number;
	viewWidth: number;
}

const viewWidth = args.vw || args.vh || defaults.vw;
const viewHeight = args.vh || viewWidth;
const ellipseDistance = args.ed || viewWidth / 2;
const ellipseHeight = args.eh || viewHeight / 4;
const ellipseWidth = args.ew || ellipseHeight;
const thickness = args.th || Math.max(ellipseHeight, ellipseWidth) / 4;
const options: Options = {
	ellipseDistance,
	ellipseHeight,
	ellipseWidth,
	thickness,
	viewHeight,
	viewWidth,
};


console.dir(options);

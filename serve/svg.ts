import express from 'express';
import { InfinitySymbolSvg } from '../src/infinity-symbol-svg.js';

const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Open: http://127.0.0.1:${ port }/`);
});

app.get('/', (req, res) => {
	const params = req.query as Record<string, unknown>;
	const viewWidth = parseFloat(String(params.vw || params.vh || 256));
	const viewHeight = parseFloat(String(params.vh || viewWidth));
	const ellipseDistance = parseFloat(String(params.ed || viewWidth / 1.75));
	const ellipseHeight = parseFloat(String(params.eh || viewHeight / 4));
	const ellipseWidth = parseFloat(String(params.ew || ellipseHeight));
	const thickness = parseFloat(String(params.th || Math.max(ellipseHeight, ellipseWidth) / 1.5));

	res.status(200).contentType('image/svg+xml').send(new InfinitySymbolSvg({
		ellipseDistance,
		ellipseHeight,
		ellipseWidth,
		thickness,
		viewHeight,
		viewWidth,
	}).toString());
});

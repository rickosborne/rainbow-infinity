import * as assert from 'assert';
import * as fs from 'fs';
import { SemVer } from 'semver';
import { sortedJson } from '../sorted-json';

const json: { version: string } = JSON.parse(fs.readFileSync('package.json', { encoding: 'utf-8' }));

const now = new Date();

const zeroPad = (n: number): string => `${ n < 10 ? '0' : '' }${ n }`;

const version = `${ now.getUTCFullYear() }.${ now.getUTCMonth() + 1 }.${ now.getUTCDay() }-T${ zeroPad(now.getUTCHours()) }${ zeroPad(now.getUTCMinutes()) }${ zeroPad(now.getUTCSeconds()) }Z`;

assert.equal(version, new SemVer(version), 'Version is not semver compliant');

const previous = json.version;
const updatedJson = Object.assign({}, json, { version });

console.log(`Version: ${ version } <- ${ previous }`);
console.log(updatedJson);

fs.writeFileSync('package.json', sortedJson(updatedJson, undefined, '\t'), { encoding: 'utf-8' });

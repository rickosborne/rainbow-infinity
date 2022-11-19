export const sortObject = <T>(obj: T): T => {
	if (Array.isArray(obj)) {
		return obj.map(sortObject) as T;
	} else if (obj instanceof Object) {
		const rec = obj as Record<string, unknown>;
		return Object.keys(rec).sort().reduce((result, key) => {
			const value: unknown = rec[key];
			result[key] = sortObject(value);
			return result;
		}, {} as Record<string, unknown>) as T;
	}
	return obj;
};

export const sortedJson = (
	value: unknown,
	replacer?: (this: unknown, key: string, value: unknown) => unknown,
	space: string | number = '\t',
): string => {
	return JSON.stringify(value, (key: string, value) => sortObject(replacer == null ? value : replacer(key, value)), space);
};

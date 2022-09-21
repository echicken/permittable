import React from 'react';

const ASCENDING = Symbol.for('SORT ASCENDING');
const DESCENDING = Symbol.for('SORT DESCENDING');

const sort = (data, key, dir, parser) => {
	const s = data.sort((a, b) => {
		let _a = a[key];
		let _b = b[key];
		if (typeof parser === 'function') {
			_a = parser(_a);
			_b = parser(_b);
		}
		if (dir === ASCENDING) {
			if (_a < _b) {
				return -1;
			} else if (_a > _b) {
				return 1;
			}
			return 0;
		}
		if (_a < _b) {
			return 1;
		} else if (_a > _b) {
			return -1;
		}
		return 0;
	});
	return s;
}

const Sorter = props => {

	const oc = evt => {
		const sorted = (props.sortFunction || sort)(props.data.slice(0), props.sortBy, Symbol.for(evt.target.dataset.sortdir), props.parser);
		props.setter(sorted);
	}

	return (<>
		<span data-sortdir={Symbol.keyFor(ASCENDING)} className="sort-button" onClick={oc}>▲</span>
		<span data-sortdir={Symbol.keyFor(DESCENDING)} className="sort-button" onClick={oc}>▼</span>
	</>);

}

export { ASCENDING as sortAscending, DESCENDING as sortDescending };
export default Sorter;

import React from 'react';

const ASCENDING = Symbol.for('SORT ASCENDING');
const DESCENDING = Symbol.for('SORT DESCENDING');

const Sorter = props => {

	const sort = (dir, data, key) => {
		const s = data.sort((a, b) => {
            if (dir === ASCENDING) {
                if (a[key] < b[key]) {
                    return -1;
                } else if (a[key] > b[key]) {
                    return 1;
                }
                return 0;
            }
            if (a[key] < b[key]) {
                return 1;
            } else if (a[key] > b[key]) {
                return -1;
            }
            return 0;
		});
		props.setter(s);
	}

    const oc = evt => {
        (props.sortFunction || sort)(Symbol.for(evt.target.dataset.sortdir), props.data.slice(0), props.sortBy);
    }

	return (<>
		<span data-sortdir={Symbol.keyFor(ASCENDING)} className="sort-button" onClick={oc}>▲</span>
		<span data-sortdir={Symbol.keyFor(DESCENDING)} className="sort-button" onClick={oc}>▼</span>
	</>);

}

export { ASCENDING as sortAscending, DESCENDING as sortDescending };
export default Sorter;

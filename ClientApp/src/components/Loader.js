import { useCallback, useEffect, useState } from 'react';
import { Spinner } from 'reactstrap';

const Loader = props => {

	const [ loaded, setLoaded ] = useState(false);

	const fetchData = useCallback(async () => {
		try {
			const response = await fetch(props.path, { credentials: 'same-origin'});
			const data = await response.json();
			props.onData(data);
			setLoaded(true);
		} catch (err) {
			console.error(`Error loading data from ${props.path}`, err);
			if (typeof props.onError === 'function') props.onError(err);
		}
	}, [props]);

	useEffect(() => {

		if (loaded) return;

		if (props.data) {
			props.onData(props.data);
			setLoaded(true);
			return;
		}

		(async () => {
			await (props.fetchData || fetchData)();
			setLoaded(true);
		})();
	
	}, [fetchData, loaded, props]);

	return loaded ? undefined : <Spinner>Loading ...</Spinner>;

}

export default Loader;
import { useState } from 'react';

const Loader = props => {

	const [ loading, setLoading ] = useState(false);
	const [ loaded, setLoaded ] = useState(false);

	const fetchData = async () => {
		setLoading(true);
		try {
			const response = await fetch(props.path, { credentials: 'same-origin'});
			const data = await response.json();
			props.onData(data);
		} catch (err) {
			console.error(`Error loading data from ${props.path}`, err);
			if (typeof props.onError === 'function') props.onError(err);
		} finally {
			setLoading(false);
		}
	}

	if (props.data && !loaded) {
		props.onData(props.data);
		setLoaded(true);
        return;
	} else if (!props.data && !loading) {
		fetchData();
        return <h2>Loading ...</h2>;
	}

}

export default Loader;
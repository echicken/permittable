import React, { useState } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const Map = props => {

	const [ key, setKey ] = useState(null);
	const [ loadingKey, setLoadingKey ] = useState(false);

	async function fetchKey() {
		setLoadingKey(true);
        try {
            const response = await fetch(`/api/map/key`, { credentials: 'same-origin' });
            const data = await response.json();
            setLoadingKey(false);
			setKey(data.key);
        } catch (err) {
            console.log('Error fetchinig Google Maps API key', err);
        }
	}

	if (!key) {
		if (!loadingKey) fetchKey();
		return;
	}

	return (
		<LoadScript googleMapsApiKey={key}>
			<GoogleMap
				mapContainerStyle={{ width: '100%', height: '550px' }}
				center={props.center}
				zoom={props.zoom}
				children={props.children}
			/>
		</LoadScript>
	);

}

export default Map;
import React, { useState } from 'react';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';

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

	const center = props.center || { lat: props.address.Latitude, lng: props.address.Longitude };

	return (
		<LoadScript googleMapsApiKey={key}>
			<GoogleMap
				mapContainerStyle={{ width: '100%', height: '400px' }}
				center={center}
				options={props.options}
				onLoad={props.onLoad}
			>
				<Marker position={center} />
				{props.children}
			</GoogleMap>
		</LoadScript>
	);

}

export default Map;
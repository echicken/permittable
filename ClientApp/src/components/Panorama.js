import React, { useCallback, useEffect, useState } from 'react';
import { StreetViewPanorama, StreetViewService } from '@react-google-maps/api';
import Map from './Map';
import PanoRanger from './PanoRanger';

const Panorama = props => {

	const [ center, setCenter ] = useState({ lat: 0, lng: 0 });
	const [ panos, setPanos ] = useState([]);
	const [ panoIdx, setPanoIdx ] = useState(0);

	const findBestPano = useCallback(() => {
		let closestDiff = Infinity;
		let closestPano = panos.length - 1;
		for (let i = 0; i < panos.length; i++) {
			const d = panos[i].Jo || panos[i].Ko;
			const diff = Math.abs(d - props.date);
			if (diff > closestDiff) continue;
			closestDiff = diff;
			closestPano = i;
		}
		setPanoIdx(closestPano);
	}, [panos, props]);

	useEffect(() => {
		findBestPano();
		if (props.address.Latitude !== center.lat || props.address.Longitude !== center.lng) {
			setCenter({ lat: props.address.Latitude, lng: props.address.Longitude });
		}
	}, [center, findBestPano, props]);

	const onPanorama = panorama => {
		panorama.addListener('links_changed', () => {
			const _pos = panorama.getPosition();
			const pos = { lat: _pos.lat(), lng: _pos.lng() };
			const heading = window.google.maps.geometry.spherical.computeHeading(pos, center);
			panorama.setPov({
				heading: heading,
				pitch: 0,
				zoom: 0,
			});
		});
	}

	const onService = svs => {
		svs.getPanorama({ location: center, radius: 50 }, (data, status) => {
			if (!data) return;
			if (status !== 'OK') return;
			setPanos(data.time);
		});
	}

	return (<>
		<Map address={props.address} zoom={11}>
			<StreetViewPanorama
				options={{
					addressControl: true,
					clickToGo: false,
					disableDefaultUI: true,
					imageDateControl: true,
				}}
				pano={panos[panoIdx]?.pano}
				position={center}
				visible={true}
				onLoad={onPanorama}
				zoom={0}
			/>
			<StreetViewService onLoad={onService} />
		</Map>
		<PanoRanger panos={panos} panoIdx={panoIdx} setPanoIdx={setPanoIdx} />
	</>);

}

export default Panorama;
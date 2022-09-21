import React, { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Marker, StreetViewPanorama, StreetViewService } from '@react-google-maps/api';
import Map from './Map';
import PanoRanger from './PanoRanger';
import PermitTable from './PermitTable';

const Address = () => {

	const [ permits, setPermits ] = useState([]);
	const [ loadingPermits, setLoadingPermits ] = useState(false);
	const [ address, setAddress ] = useState(null);
	const [ loadingAddress, setLoadingAddress ] = useState(false);
	const [ panoIdx, setPanoIdx ] = useState(0);
	const [ panos, setPanos ] = useState([]);

	const { geoid } = useParams();
	const location = useLocation();

	const fetchPermits = async () => {
		setLoadingPermits(true);
		let pstore = [];
		for (let page = 0;; page++) {
			try {
				const response = await fetch(`/api/permit/address/${geoid}/permits/${page}`, { credentials: 'same-origin' });
				const data = await response.json();
				if (data.length) {
					pstore = pstore.concat(data);
				} else {
					setPermits(pstore.sort((a, b) => a.Issued < b.Issued ? -1 : 1));
					setLoadingPermits(false);
					break;
				}
			} catch (err) {
				console.log('Error fetching address data', err);
				break;
			}
		}
	}

	const fetchAddress = async () => {
		setLoadingAddress(true);
		try {
			const response = await fetch(`/api/address/by-id/${geoid}`, { credentials: 'same-origin' });
			const data = await response.json();
			setAddress(data);
		} catch (err) {
			console.log('Error fetching address data', err);
		}
		setLoadingAddress(false);
	}

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
			setPanoIdx(data.time.length - 1);
		});
	}

	const onPermitHover = permit => {
		const pid = new Date(permit.Issued ?? permit.Applied ?? permit.Completed);
		let closestDiff = Infinity;
		let closestPano = undefined;
		for (let i = 0; i < panos.length; i++) {
			const diff = Math.abs(panos[i].Jo - pid);
			if (diff > closestDiff) continue;
			closestDiff = diff;
			closestPano = i;
		}
		setPanoIdx(closestPano);
	}

	if (!permits.length || loadingPermits) {
		if (!loadingPermits) fetchPermits();
		return <h2>Loading ...</h2>;
	}

	if (address === null) {
		if (location.state?.address !== undefined) {
			setAddress(location.state.address);
			return;
		} else {
			if (!loadingAddress) fetchAddress();
			return <h2>Loading ...</h2>
		}
	}

	if (!permits.length) return <h2>No permits available for this address.</h2>;

	const center = { lat: address.Latitude, lng: address.Longitude };

	return (<>
		<Map center={center} zoom={11}>
			<Marker position={center} />
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
		<PermitTable address={address} permits={permits} setPermits={setPermits} onPermitHover={onPermitHover} />
	</>);

}

export default Address;
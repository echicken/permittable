import React, { useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { Table, Input } from 'reactstrap';
import { Marker, StreetViewPanorama, StreetViewService } from '@react-google-maps/api';
import Map from './Map';

const Sorter = props => {

	const sort = dir => {
		const s = props.data.slice(0).sort((a, b) => {
			if (a[props.sortBy] < b[props.sortBy]) {
				return dir === 'ascending' ? -1 : 1;
			}
			if (a[props.sortBy] > b[props.sortBy]) {
				return dir === 'ascending' ? 1: -1;
			}
			return 0;
		});
		props.setter(s);
	}

	return (<>
		<span className="sort-button" onClick={() => sort('ascending')}>▲</span>
		<span className="sort-button" onClick={() => sort('descending')}>▼</span>
	</>);

}

const PermitListItem = props => {
	return (
		<tr onMouseOver={() => props.onHover(props.permit)}>
			<td>
				<Link to={`/view-permit/${props.permit.Number}/${props.permit.Revision}`} state={props.permit}>
					{props.permit.Number}
				</Link>
			</td>
			<td>{props.permit.Revision}</td>
			<td>{props.permit.PermitType}</td>
			<td>{props.permit.Issued}</td>
			<td>{props.permit.Completed}</td>
			<td>{props.permit.ShortDescription}</td>
		</tr>
	);
}

const PermitList = props => {
	const list = props.data.map(e => <PermitListItem key={`${e.Number},${e.Revision}`} permit={e} onHover={props.onPermitHover} />);
	return <>{list}</>;
}

const PermitTable = props => {
	return (<>
		<h2>Permits for {props.address.Text}</h2>
		<Table hover responsive>
			<thead>
				<tr>
					<th>Number <Sorter data={props.permits} sortBy="Number" setter={props.setPermits} /></th>
					<th>Revision <Sorter data={props.permits} sortBy="Revision" setter={props.setPermits} /></th>
					<th>Type <Sorter data={props.permits} sortBy="PermitType" setter={props.setPermits} /></th>
					<th>Issued <Sorter data={props.permits} sortBy="Issued" setter={props.setPermits} /></th>
					<th>Completed <Sorter data={props.permits} sortBy="Completed" setter={props.setPermits} /></th>
					<th>Description <Sorter data={props.permits} sortBy="ShortDescription" setter={props.setPermits} /></th>
				</tr>
			</thead>
			<tbody>
				<PermitList data={props.permits} onPermitHover={props.onPermitHover} />
			</tbody>
		</Table>
	</>);
}

const PanoRanger = props => {
	if (!props.panos || props.panos.length < 2) return;
	return (
		<Input
			type="range"
			name="range"
			min="0"
			max={props.panos.length - 1}
			value={props.panoIdx}
			step={1}
			onChange={evt => props.setPanoIdx(evt.target.value)}
		/>
	);
}

const Address = () => {

	const [ permits, setPermits ] = useState(null);
	const [ loadingPermits, setLoadingPermits ] = useState(false);
	const [ address, setAddress ] = useState(null);
	const [ loadingAddress, setLoadingAddress ] = useState(false);
	const [ panoIdx, setPanoIdx ] = useState(0);
	const [ panos, setPanos ] = useState([]);

	const { geoid } = useParams();
	const location = useLocation();

	const fetchPermits = async () => {
		setLoadingPermits(true);
		try {
			const response = await fetch(`/api/permit/address/${geoid}/permits`, { credentials: 'same-origin' });
			const data = await response.json();
			if (data.length) {
				const p = data.sort((a, b) => a.Issued > b.Issued ? -1 : 1);
				setPermits(p);
			}
		} catch (err) {
			console.log('Error fetching address data', err);
		}
		setLoadingPermits(false);
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
				zoom: 1,
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
		const pid = new Date(permit.Issued);
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

	if (permits === null) {
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
			/>
			<StreetViewService onLoad={onService} />
		</Map>
		<PanoRanger panos={panos} panoIdx={panoIdx} setPanoIdx={setPanoIdx} />
		<PermitTable address={address} permits={permits} setPermits={setPermits} onPermitHover={onPermitHover} />
	</>);

}

export default Address;
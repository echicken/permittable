import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';

const PermitRow = props => {
	return (
		<Row>
			<Col className="col-2">
				{props.label}
			</Col>
			<Col className="col-10">
				{props.data}
			</Col>
		</Row>
	)
}

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
	} else if (!props.data && !loading) {
		fetchData();
	}

	return;

}

const Permit = () => {

	const [ permit, setPermit ] = useState(null);
	const [ address, setAddress ] = useState(null);
	const { permitNumber, permitRevision } = useParams();
	const location = useLocation();

	if (!permit) {
		const od = d => {
			setPermit(d);
			setAddress(d.Address);
		}
		return <Loader path={`/api/permit/${permitNumber}/${permitRevision}`} data={location.state?.permit || permit} onData={od} />;
	}

	if (!address) {
		return <Loader path={`/api/address/by-id/${permit.AddressGeoID}`} data={location.state?.address || address} onData={setAddress} />
	}

	return(
		<Container>
			<Row>
				<Col>
					<h2>Permit {permit.Number} revision {permit.Revision}</h2>
				</Col>
			</Row>
			<PermitRow label="Status" data={permit.Status} />
			<PermitRow label="Permit Type" data={permit.PermitType} />
			<PermitRow label="Description" data={permit.ShortDescription} />
			<PermitRow label="Details" data={permit.LongDescription} />
			<PermitRow label="Applied" data={permit.Applied} />
			<PermitRow label="Issued" data={permit.Issued} />
			<PermitRow label="Completed" data={permit.Completed} />
			<PermitRow label="Address" data={address.Text} />
			<PermitRow label="Structure Type" data={permit.StructureType} />
			<PermitRow label="Current Use" data={permit.CurrentUse} />
			<PermitRow label="Proposed Use" data={permit.ProposedUse} />
			<PermitRow label="Dwellings Created" data={permit.DwellingsCreated} />
			<PermitRow label="Dwellings Lost" data={permit.DwellingsLost} />
			<PermitRow label="Estimated Cost" data={permit.EstimatedCost.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })} />
		</Container>
	);
}

export default Permit;
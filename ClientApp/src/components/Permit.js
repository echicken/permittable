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

const Permit = () => {

	const [ permit, setPermit ] = useState(null);
	const [ loadingPermit, setLoadingPermit ] = useState(false);
	const [ address, setAddress ] = useState(null);
	const [ loadingAddress, setLoadingAddress ] = useState(false);
	const { permitNumber, permitRevision } = useParams();
	const location = useLocation();

	const fetchPermit = async (num, rev) => {
		setLoadingPermit(true);
		try {
			const response = await fetch(`/api/permit/${num}/${rev}`, { credentials: 'same-origin' });
			const data = await response.json();
			setPermit(data);
			setAddress(data.Address.Text);
		} catch (err) {
			console.log('Error fetching permit', err);
		} finally {
			setLoadingPermit(false);
		}
	}

	const fetchAddress = async id => {
		setLoadingAddress(true);
		try {
			const response = await fetch(`/api/address/by-id/${id}`, { credentials: 'same-origin' });
			const data = await response.json();
			setAddress(data.Text);
		} catch (err) {
			console.log('Error fetching address', err);
		} finally {
			setLoadingAddress(false);
		}
	}

	if (!permit) {
		if (location.state?.permit) {
			setPermit(location.state.permit);
		} else if (!loadingPermit) {
			fetchPermit(permitNumber, permitRevision);
		}
		return;
	}

	if (!address) {
		if (location.state?.address) {
			setAddress(location.state.address);
		} else if (!loadingAddress) {
			fetchAddress(permit.AddressGeoID);
		}
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
			<PermitRow label="Address" data={address} />
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
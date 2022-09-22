import React, { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, Container, Row, Col } from 'reactstrap';
import Loader from './Loader';

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

const PermitContainer = props => {
	const { address, permit } = props;
	return(
		<Container>
			<Row>
				<Col>
					<Breadcrumb>
						<BreadcrumbItem>
							<Link to={`/view-address/${address.GeoID}`} state={{ address: props.address }}>
								{address.Text}
							</Link>
						</BreadcrumbItem>
						<BreadcrumbItem active>
							{permit.Number} {permit.Revision}
						</BreadcrumbItem>
					</Breadcrumb>
				</Col>
			</Row>
			<Row>
				<Col>
					<h3>Permit {permit.Number} revision {permit.Revision}</h3>
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

const Permit = () => {

	const [ permit, setPermit ] = useState(null);
	const [ address, setAddress ] = useState(null);
	const { permitNumber, permitRevision } = useParams();
	const location = useLocation();

	return (<>
		<Loader path={`/api/permit/${permitNumber}/${permitRevision}`} data={location.state?.permit} onData={setPermit} />
		{permit && <Loader path={`/api/address/by-id/${permit.AddressGeoID}`} data={location.state?.address} onData={setAddress} /> }
		{address && <PermitContainer permit={permit} address={address} />}
	</>);

}

export default Permit;
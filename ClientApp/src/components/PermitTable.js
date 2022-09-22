import React from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'reactstrap';
import Sorter from './Sorter';

const PermitListItem = props => {
	return (
		<tr onMouseOver={() => props.onHover(props.permit)}>
			<td>
				<Link to={`/view-permit/${props.permit.Number}/${props.permit.Revision}`} state={{ address: props.address, permit: props.permit }}>
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
	const list = props.data.map(e => {
		return (
			<PermitListItem
				key={`${e.Number},${e.Revision}`}
				address={props.address}
				permit={e}
				onHover={props.onPermitHover}
			/>
		);
	});
	return (
		<tbody>
			{list}
		</tbody>
	);
}

const PermitTable = props => {

	if (!props.permits.length) return <h2>No permits on file for {props.address.Text}</h2>;

	return (<>
		<h2>Permits for {props.address.Text}</h2>
		<Table hover responsive>
			<thead>
				<tr>
					<th>Number <Sorter data={props.permits} sortBy="Number" setter={props.setPermits} /></th>
					<th>Revision <Sorter data={props.permits} sortBy="Revision" setter={props.setPermits} /></th>
					<th>Type <Sorter data={props.permits} sortBy="PermitType" setter={props.setPermits} /></th>
					<th>Issued <Sorter data={props.permits} sortBy="Issued" setter={props.setPermits} parser={v => new Date(v)} /></th>
					<th>Completed <Sorter data={props.permits} sortBy="Completed" setter={props.setPermits} parser={v => new Date(v)} /></th>
					<th>Description <Sorter data={props.permits} sortBy="ShortDescription" setter={props.setPermits} /></th>
				</tr>
			</thead>
			<PermitList data={props.permits} address={props.address} onPermitHover={props.onPermitHover} />
		</Table>
	</>);

}

export default PermitTable;
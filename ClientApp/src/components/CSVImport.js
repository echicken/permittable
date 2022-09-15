import React, { useState } from 'react';
import { Input, InputGroup, InputGroupText, Spinner } from 'reactstrap';
import Papa from 'papaparse';

const pmap = {
	GEO_ID: 'AddressGeoID',
	PERMIT_NUM: 'Number',
	REVISION_NUM: 'Revision',
	PERMIT_TYPE: 'PermitType',
	STRUCTURE_TYPE: 'StructureType',
	WORK: 'ShortDescription',
	DESCRIPTION: 'LongDescription',
	STATUS: 'Status',
	CURRENT_USE: 'CurrentUse',
	PROPOSED_USE: 'ProposedUse',
};

const CSVImport = props => {

	const [file, setFile] = useState(false);

	const formatAddress = permit => {
		return {
			Text: `${permit.STREET_NUM} ${permit.STREET_NAME} ${permit.STREET_TYPE} ${permit.STREET_DIRECTION}`,
			Postal: permit.POSTAL,
			GeoID: permit.GEO_ID,
			WardGrid: permit.WARD_GRID,
		};
	}

	const formatPermit = permit => {
		const estimatedCost = parseFloat(permit.EST_CONST_COST, 10);
		const jp = {
			Applied: new Date(permit.APPLICATION_DATE || 0),
			Issued: new Date(permit.ISSUED_DATE || 0),
			Completed: new Date(permit.COMPLETED_DATE || 0),
			DwellingsCreated: parseInt(permit.DWELLING_UNITS_CREATED || 0, 10),
			DwellingsLost: parseInt(permit.DWELLING_UNITS_LOST || 0, 10),
			EstimatedCost: isNaN(estimatedCost) ? 0 : estimatedCost,
		};
		for (const p in pmap) {
			if (permit[p] === undefined) continue;
			jp[pmap[p]] = permit[p];
		}
		return jp;
	}

	const postAddresses = async batch => {
		const jas = batch.map(formatAddress);
		console.debug(`Posting ${jas.length} addresses`);
		const response = await fetch('/api/address/batch', {
			method: 'POST',
			headers: {
				'Authorization': document.getElementById('password-input').value,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(jas),
		});
		if (!response.ok) throw new Error(`Error posting address batch: ${response.status} ${response.statusText}`);
	}

	const postPermits = async batch => {
		const jps = batch.map(formatPermit);
		console.debug(`Posting ${jps.length} permits`);
		const response = await fetch('/api/permit/batch', {
			method: 'POST',
			headers: {
				'Authorization': document.getElementById('password-input').value,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(jps),
		});
		if (!response.ok) throw new Error(`Error posting permit batch: ${response.status} ${response.statusText}`);
	}

	const onFile = evt => {

		setFile(true);

		const addresses = [];
		const keys = [];
		const dupes = [];
		const addressBatch = [];
		const permitBatch = [];
		const batchSize = 500;

		const parseCfg = {
			header: true,
			dynamicTyping: false,
			worker: false,
			step: async (results, parser) => {
				parser.pause();
				if (!addresses.includes(results.data.GEO_ID)) {
					addresses.push(results.data.GEO_ID);
					addressBatch.push(results.data);
				}
				const key = `${results.data.PERMIT_NUM},${results.data.REVISION_NUM}`;
				if (keys.includes(key)) {
					dupes.push(key);
				} else {
					keys.push(key);
					permitBatch.push(results.data);
					if (permitBatch.length >= batchSize) {
						try {
							await postAddresses(addressBatch.splice(0));
							await postPermits(permitBatch.splice(0));
						} catch (err) {
							console.error('Import aborted', err);
							parser.abort();
							return;
						}
					}
				}
				parser.resume();
			},
			complete: async () => {
				if (addressBatch.length) await postAddresses(addressBatch.splice(0));
				if (permitBatch.length) await postPermits(permitBatch.splice(0));
				console.debug(`Posted ${addresses.length} addresses`);
				console.debug(`Posted ${keys.length} records, filtered ${dupes.length} duplicates`);
				setFile(false);
			},
		};

		Papa.parse(evt.target.files[0], parseCfg);

	}

	return (
		<>
			A place where I can import new CSV files as they become available.
			<p />
			<Input className={file ? 'd-none' : 'd-inline'} type="file" name="file" onInput={onFile} />
			<Spinner className={file ? 'd-flex' : 'd-none'} type="border" color="primary" />
			<p />
			<InputGroup>
				<InputGroupText>
					Password
				</InputGroupText>
				<Input id="password-input" type="password" name="password" />
			</InputGroup>
			<p />
			You don't know the password, but trust me, you aren't missing much. Performing an import isn't very exciting.
		</>
	);

}

export default CSVImport;
import React, { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Loader from './Loader';
import Panorama from './Panorama';
import PermitTable from './PermitTable';

const Address = () => {

	const [ permits, setPermits ] = useState(null);
	const [ address, setAddress ] = useState(null);
	const [ permitDate, setPermitDate ] = useState(new Date());

	const { geoid } = useParams();
	const location = useLocation();

	const fetchPermits = async () => {
		let pstore = [];
		for (let page = 0;; page++) {
			try {
				const response = await fetch(`/api/permit/address/${geoid}/permits/${page}`, { credentials: 'same-origin' });
				const data = await response.json();
				if (data.length) {
					pstore = pstore.concat(data);
				} else {
					setPermits(pstore.sort((a, b) => a.Issued < b.Issued ? -1 : 1));
					break;
				}
			} catch (err) {
				console.log('Error fetching address data', err);
				break;
			}
		}
	}

	const onPermitHover = permit => setPermitDate(new Date(permit.Issued ?? permit.Applied ?? permit.Completed));

	return (<>
		{(permits && address) && <>
			<Panorama address={address} date={permitDate} />
			<PermitTable address={address} permits={permits} setPermits={setPermits} onPermitHover={onPermitHover} />
		</>}
		<Loader fetchData={fetchPermits} />
		<Loader path={`/api/address/by-id/${geoid}`} data={location.state?.address} onData={setAddress} />
	</>);

}

export default Address;
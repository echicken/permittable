import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Table } from 'reactstrap';

const PermitListGroupItem = props => {
    return (
        <tr>
            <td>
                <Link to={`/view-permit/${props.permit.Number}/${props.permit.Revision}`} state={props.permit}>
                    {props.permit.Number}
                </Link>
            </td>
            <td>{props.permit.PermitType}</td>
            <td>{props.permit.Applied}</td>
            <td>{props.permit.Issued}</td>
            <td>{props.permit.Completed}</td>
            <td>{props.permit.ShortDescription}</td>
        </tr>
    );
}

const Address = () => {

    const [ permits, setPermits ] = useState(null);
    const [ address, setAddress ] = useState('');
    const { geoid } = useParams();

    const fetchPermits = async () => {
        if (permits !== null) return;
        try {
            const response = await fetch(`/api/permit/address/${geoid}/permits`, { credentials: 'same-origin' });
            const data = await response.json();
            if (data.length) {
                const p = data.map(e => <PermitListGroupItem key={e.Number} permit={e} />);
                setPermits(p);
                setAddress(data[0].Address.Text);
            }
        } catch (err) {
            console.log('Error fetching address data', err);
        }
    }

    if (permits === null) {
        fetchPermits();
        return <h2>Loading ...</h2>;
    }

    if (!permits.length) {
        return <h2>No permits available for this address.</h2>
    }

    return (
        <>
            <h2>Permits for {address}</h2>
            <Table hover responsive>
                <thead>
                    <tr>
                        <th>Number</th>
                        <th>Type</th>
                        <th>Applied</th>
                        <th>Issued</th>
                        <th>Completed</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {permits}
                </tbody>
            </Table>
        </>
    );

}

export default Address;
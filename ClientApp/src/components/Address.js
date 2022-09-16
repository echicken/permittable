import React, { useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { Table } from 'reactstrap';
import { Marker, StreetViewPanorama } from '@react-google-maps/api';
import Map from './Map';

const PermitListGroupItem = props => {
    return (
        <tr>
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

const Address = () => {

    const [ permits, setPermits ] = useState(null);
    const [ loadingPermits, setLoadingPermits ] = useState(false);
    const [ address, setAddress ] = useState(null);
    const [ loadingAddress, setLoadingAddress ] = useState(false);

    const { geoid } = useParams();
    const location = useLocation();

    const fetchPermits = async () => {
        setLoadingPermits(true);
        try {
            const response = await fetch(`/api/permit/address/${geoid}/permits`, { credentials: 'same-origin' });
            const data = await response.json();
            if (data.length) {
                const p = data.sort((a, b) => a.Issued > b.Issued ? -1 : 1).map(e => <PermitListGroupItem key={`${e.Number},${e.Revision}`} permit={e} />);
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

    if (!permits.length) {
        return <h2>No permits available for this address.</h2>
    }

    const center = { lat: address.Latitude, lng: address.Longitude };

    return (
        <>
            <Map center={center} zoom={11}>
                <Marker position={center} />
                <StreetViewPanorama position={center} visible={true} onLoad={onPanorama} />
            </Map>
            <h2>Permits for {address.Text}</h2>
            <Table hover responsive>
                <thead>
                    <tr>
                        <th>Number</th>
                        <th>Revision</th>
                        <th>Type</th>
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
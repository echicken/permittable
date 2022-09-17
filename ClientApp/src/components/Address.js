import React, { useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { Table } from 'reactstrap';
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

    return (
        <>
            <span className="sort-button" onClick={() => sort('ascending')}>▲</span>
            <span className="sort-button" onClick={() => sort('descending')}>▼</span>
        </>
    );
}

const PermitListItem = props => {
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

const PermitList = props => {
    const list = props.data.map(e => <PermitListItem key={`${e.Number},${e.Revision}`} permit={e} />);
    return <>{list}</>
}

const Address = () => {

    const [ permits, setPermits ] = useState(null);
    const [ loadingPermits, setLoadingPermits ] = useState(false);
    const [ address, setAddress ] = useState(null);
    const [ loadingAddress, setLoadingAddress ] = useState(false);
    const [ pano, setPano ] = useState(undefined);
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

    const onService = svs => {
        svs.getPanorama(
            { location: center, radius: 50 },
            (data, status) => {
                if (status !== 'OK') return;
                console.debug(data.time);
                setPanos(data.time);

                // On mouseover of item in PermitList, find best match in 'panos' (panos[n].Jo) for the issue(?) date of the permit
                // and then update 'pano' (setPano) to panos[n].pano to display that historical image.

                // This will do a slideshow of all available panos for our location:

                // let n = 0;
                // setInterval(() => {
                //     setPano(data.time[n].pano);
                //     n++;
                //     if (n >= data.time.length) n = 0;
                // }, 5000);

            }
        );
    }

    return (
        <>
            <Map center={center} zoom={11}>
                <Marker position={center} />
                <StreetViewPanorama options={{ imageDateControl: true }} pano={pano} position={center} visible={true} onLoad={onPanorama} />
                <StreetViewService onLoad={onService} />
            </Map>
            <h2>Permits for {address.Text}</h2>
            <Table hover responsive>
                <thead>
                    <tr>
                        <th>Number <Sorter data={permits} sortBy="Number" setter={setPermits} /></th>
                        <th>Revision <Sorter data={permits} sortBy="Revision" setter={setPermits} /></th>
                        <th>Type <Sorter data={permits} sortBy="PermitType" setter={setPermits} /></th>
                        <th>Issued <Sorter data={permits} sortBy="Issued" setter={setPermits} /></th>
                        <th>Completed <Sorter data={permits} sortBy="Completed" setter={setPermits} /></th>
                        <th>Description <Sorter data={permits} sortBy="ShortDescription" setter={setPermits} /></th>
                    </tr>
                </thead>
                <tbody>
                    <PermitList data={permits} />
                </tbody>
            </Table>
        </>
    );

}

export default Address;
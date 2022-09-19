import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputGroup, InputGroupText } from 'reactstrap';
import { Typeahead, withAsync } from 'react-bootstrap-typeahead';
import { Marker } from '@react-google-maps/api';
import Map from './Map';
import 'react-bootstrap-typeahead/css/Typeahead.css';

const AsyncTypeahead = withAsync(Typeahead);

const Search = props => {

    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [activeMarker, setActiveMarker] = useState(null);
    const [center, setCenter] = useState(null);
    const [loadingCenter, setLoadingCenter] = useState(false);
    const navigate = useNavigate();

    function getMarker(address, active) {
        return (<Marker
            key={address.GeoID}
            position={{lat: address.Latitude, lng: address.Longitude}}
            onClick={() => navigate(`/address/${address.GeoID}`)}
            animation={active ? 1 : 0}
            zIndex={active ? -1 : undefined}
        />);
    }

    async function fetchCenter() {
		setLoadingCenter(true);
        try {
            const response = await fetch(`/api/map/center`, { credentials: 'same-origin' });
            const data = await response.json();
            setLoadingCenter(false);
			setCenter({ lat: data.Latitude, lng: data.Longitude });
        } catch (err) {
            console.log('Error fetchinig Google Maps API key', err);
        }
	}

    async function search(query) {
        setLoading(true);
        try {
            const response = await fetch(`/api/address/${query}`, { credentials: 'same-origin' });
            const data = await response.json();
            setOptions(data.sort((a, b) => a.Text < b.Text ? -1 : (a.Text > b.Text ? 1 : 0)));
            setLoading(false);
            setMarkers(data.map(e => getMarker(e, false)));
        } catch (err) {
            console.log('Error during search', err);
        }
    }

    function handleChange(selected) {
        if (selected.length) navigate(`/view-address/${selected[0].GeoID}`, { state: { address: selected[0] }});
    }

    function renderMenuItemChild(option) {
        return (
            <div onMouseEnter={() => setActiveMarker(getMarker(option, true))} onMouseLeave={() => setActiveMarker(null)}>
                {option.Text}
            </div>
        );
    }

    function setMapBounds(map) {
        const bounds = new window.google.maps.LatLngBounds({ lat: 43.581005, lng: -79.639268 }, { lat: 43.855466, lng: -79.115246 });
        map.fitBounds(bounds, 0);
    };

    if (!center) {
        if (!loadingCenter) fetchCenter();
        return;
    }

    // console.log(center);

    return (
        <>
            <Map center={center} onLoad={setMapBounds}>
                {activeMarker || markers}
            </Map>
            <br />
            <InputGroup>
                <InputGroupText>
                    Address
                </InputGroupText>
                <AsyncTypeahead
                    id="search-bar"
                    autoFocus={true}
                    placeholder="eg. 237 Glebemount Avenue"
                    minLength={1}
                    delay={1000}
                    labelKey="Text"
                    highlightOnlyResult={true}
                    isLoading={loading}
                    options={options}
                    onSearch={search}
                    filterBy={() => true}
                    renderMenuItemChildren={renderMenuItemChild}
                    onChange={handleChange}
                />
            </InputGroup>
        </>
    )
}

export default Search;
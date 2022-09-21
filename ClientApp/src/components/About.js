import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PermitLink = props => {
	return (
		<Link to={`/view-permit/${props.permit.Number}/${props.permit.Revision}`} state={props.permit}>
			{props.permit.Number}
		</Link>
	);
}

const Stats = () => {

	const [ stats, setStats ] = useState(null);
	const [ loadingStats, setLoadingStats ] = useState(false);

	const fetchStats = async () => {
		setLoadingStats(true);
		try {
			const response = await fetch('/api/stats');
			const data = await response.json();
			setStats(data);
			setLoadingStats(false);
			console.debug(data);
		} catch (err) {
			console.error('Error loading stats', err);
		}
	}

	if (!stats) {
		if (!loadingStats) fetchStats();
		return;
	}

	return (<>
		There are <strong>{stats.PermitCount}</strong> building permits in the database.
		<br />
		The oldest permit <em>application</em> is <PermitLink permit={stats.OldestApplied} /> on <strong>{stats.OldestApplied.Applied}</strong>
		<br />
		The newest permit <em>application</em> is <PermitLink permit={stats.NewestApplied} /> on <strong>{stats.NewestApplied.Applied}</strong>
		<br />
		The oldest permit <em>issued</em> is <PermitLink permit={stats.OldestIssued} /> on <strong>{stats.OldestIssued.Issued}</strong>
		<br />
		The newest permit <em>issued</em> is <PermitLink permit={stats.NewestIssued} /> on <strong>{stats.NewestIssued.Issued}</strong>
		<br />
		The oldest <em>completed</em> permit is <PermitLink permit={stats.OldestCompleted} /> on <strong>{stats.OldestCompleted.Completed}</strong>
		<br />
		The newest <em>completed</em> permit is <PermitLink permit={stats.NewestCompleted} /> on <strong>{stats.NewestCompleted.Completed}</strong>
		<br />
		The oldest <em>open</em> permit is <PermitLink permit={stats.OldestOpen} />, <em>issued</em> on <strong>{stats.OldestOpen.Issued}</strong>
		<br />
		The newest <em>open</em> permit is <PermitLink permit={stats.NewestOpen} />, <em>issued</em> on <strong>{stats.NewestOpen.Issued}</strong>
		<p />
		There are <strong>{stats.AddressCount}</strong> street addresses in the database.
		<br />
		That's an average of <strong>{(stats.PermitCount / stats.AddressCount).toFixed(2)}</strong> building permits per address.
		<br />
		<Link to={`/view-address/${stats.MostPermits.GeoID}`} state={{ address: stats.MostPermits }}>{stats.MostPermits.Text}</Link> has the most building permits, with <strong>{stats.MostPermitsCount}</strong> on file.
	</>);

}

const About = () => {

	return (<>
		<strong>permittable</strong> allows you to search building permits from the City of Toronto's <a href="https://open.toronto.ca/dataset/building-permits-cleared-permits-prior-years/">Open Data Catalogue</a>.
		<p />
		<strong>permittable</strong> was created as a learning exercise, so expect bugs and oddities. Bug reports and feature requests are welcome on <a href="https://github.com/echicken/permittable">GitHub</a>; please feel free to create an <a href="https://github.com/echicken/permittable/issues">issue</a>.
		<p />
		<Stats />
	</>);

}

export default About;
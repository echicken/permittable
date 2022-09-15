import React, { useState } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarText, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';

const NavMenu = props => {

	const [ collapsed, setCollapsed ] = useState(true);

	const toggleNavbar = () => {
		setCollapsed(!collapsed);
	}

	return (
		<header>
			<Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" container light>
				<NavbarBrand tag={Link} to="/">permittable</NavbarBrand>
				<NavbarText>Toronto building permits database</NavbarText>
				<NavbarToggler onClick={toggleNavbar} className="mr-2" />
				<Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!collapsed} navbar>
					<ul className="navbar-nav flex-grow">
						<NavItem>
							<NavLink tag={Link} className="text-dark" to="/">Home</NavLink>
						</NavItem>
						<NavItem>
							<NavLink tag={Link} className="text-dark" to="/about">About</NavLink>
						</NavItem>
						<NavItem>
							<NavLink tag={Link} className="text-dark" to="/csv-import">CSV Import</NavLink>
						</NavItem>
					</ul>
				</Collapse>
			</Navbar>
		</header>
	);

}

export default NavMenu;
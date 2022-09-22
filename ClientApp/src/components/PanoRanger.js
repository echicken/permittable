import React from 'react';
import { Container, Row, Col, Input } from 'reactstrap';

const PanoRanger = props => {
	if (!props.panos || props.panos.length < 2) return;
	const fd = (props.panos[0].Jo || props.panos[0].Ko)?.getFullYear();
	const ld = (props.panos[props.panos.length - 1].Jo || props.panos[props.panos.length - 1].Ko)?.getFullYear();
	return (
		<Container>
			<Row>
				<Col className="col-1">
					{fd}
				</Col>
				<Col className="col-10">
					<Input
						type="range"
						name="range"
						min="0"
						max={props.panos.length - 1}
						value={props.panoIdx}
						step={1}
						onChange={evt => props.setPanoIdx(evt.target.value)}
					/>
				</Col>
				<Col className="col-1 text-end">
					{ld}
				</Col>
			</Row>
		</Container>
	);
}

export default PanoRanger;
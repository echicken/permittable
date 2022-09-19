import React from 'react';
import { Container, Row, Col, Input } from 'reactstrap';

const PanoRanger = props => {
	if (!props.panos || props.panos.length < 2) return;
	return (
		<Container>
			<Row>
				<Col className="col-1">
					{props.panos[0].Jo.getFullYear()}
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
					{props.panos[props.panos.length - 1].Jo.getFullYear()}
				</Col>
			</Row>
		</Container>
	);
}

export default PanoRanger;
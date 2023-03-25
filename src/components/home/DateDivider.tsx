import React from "react";
import styled from "styled-components";

type Props = {
	children: React.ReactNode;
};

function DateDivider({ children }: Props) {
	return (
		<Container>
			<div className="text">{children}</div>
			<div className="line" />
		</Container>
	);
}

export default DateDivider;

const Container = styled.div`
	color: #828282;
	font-size: 1.2rem;
	font-weight: 600;
	position: relative;
	display: flex;
	justify-content: center;

	.text {
		position: relative;
		z-index: 2;
		background-color: #252329;
		padding: 0 2.2rem;
	}

	.line {
		z-index: 1;
		position: absolute;
		width: 100%;
		height: 1px;
		background-color: #828282;
		top: 0.9rem;
	}
`;

import React from 'react';

export const PaginationList = ({
	pageNumber,
	href,
	onClick,
	isCurrent,
	...rest
}) => {
	const getPaginationOptions = () => {
		const classes = [];

		isCurrent && classes.push('is-current');

		return classes.join(' ');
	};

	return (
		<li>
			<a
				href={href}
				className={`pagination-link ${getPaginationOptions()}`}
				aria-label={`Go to page ${pageNumber}`}
				onClick={onClick}
				{...rest}
				aria-current={isCurrent ? 'page' : 'false'}
			>
				{pageNumber}
			</a>
		</li>
	);
};

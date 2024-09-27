import React from 'react';

export const IconButton = ({
	children,
	isBold,
	isPrimary,
	isSuccess,
	isInfo,
	isWarning,
	isDanger,
	textLower,
	isBig,
	isHuge,
	isCircle,
	isRounded,
	isLight,
	isOutlined,
	isLoading,
	elevated,
	isRaised,
	icon,
	iconSmall,
	iconType,
	onClick,
	disabled,
	...rest
}) => {
	const getButtonClasses = () => {
		const classes = [];

		isCircle && classes.push('is-circle');
		isRounded && classes.push('is-rounded');

		isPrimary && classes.push('is-primary');
		isSuccess && classes.push('is-success');
		isInfo && classes.push('is-info');
		isWarning && classes.push('is-warning');
		isDanger && classes.push('is-danger');
		isLight && classes.push('is-light');

		isRaised && classes.push('is-raised');
		elevated && classes.push('is-elevated');

		textLower && classes.push('is-lower');
		isBold && classes.push('is-bold');

		isBig && classes.push('is-big');
		isHuge && classes.push('is-huge');

		isOutlined && classes.push('is-outlined');

		isLoading && classes.push('is-loading');

		return classes.join(' ');
	};

	return (
		<>
			<button
				onClick={onClick}
				{...rest}
				className={`button ${getButtonClasses()}`}
				disabled={disabled}
			>
				{icon && (
					<span className={`icon ${iconSmall && 'is-small'}`}>{icon}</span>
				)}
				{children}
			</button>
		</>
	);
};

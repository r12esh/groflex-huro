import React, { useEffect } from 'react';
import { formatCurrency } from '../../../helpers/formatCurrency';

export const CustomShowHeaderSum = ({ value, headerName, api }) => {
	const calculateSum = () => {
		const column = api.getColumnDef(value);
		const rowData = [];
		api.forEachNode((node) => rowData.push(node.data));
		const sum = rowData.reduce((total, item) => total + item[column.field], 0);

		return ` ${formatCurrency(sum)}`;
	};

	useEffect(() => {
		api.addEventListener('firstDataRendered', () => {
			api.refreshHeader();
		});
	}, [api]);

	return (
		<div className="ag-header-cell-text">
			<span>{headerName}</span>
			<br />
			<span>{calculateSum()}</span>
		</div>
	);
};

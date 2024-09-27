import React, { useContext } from 'react';
import Modal from '../modal/Modal';
import { GridApiContext } from './ListAdvancedComponent';

export const ListExportPopup = ({
	showExportPopup,
	setShowExportPopup,
	selectedRows,
}) => {
	const { gridApi } = useContext(GridApiContext);

	const handleSubmit = () => {
		if (selectedRows.length > 0) {
			const params = {
				fileName: 'selected_rows.csv',
				onlySelected: true,
			};
			gridApi.exportDataAsCsv(params);
		} else {
			gridApi.exportDataAsCsv();
		}
		setShowExportPopup(false);
	};

	return (
		<div>
			<Modal
				isSmall
				isActive={showExportPopup}
				setIsAcive={setShowExportPopup}
				title={'Export Data'}
				onSubmit={handleSubmit}
			>
				<h4>
					Do you want to continue to export the selected articles in .CSV
					format?
				</h4>
			</Modal>
		</div>
	);
};

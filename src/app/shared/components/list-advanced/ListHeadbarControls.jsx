import React, { useContext, useEffect, useState } from 'react';
import { ButtonAddons } from '../button/btn-addons/ButtonAddons';
import { Addon } from '../button/btn-addons/Addon';
import { Button } from '../button/Button';
import { ListColumnSettings } from './ListColumnSettings';
import { GridApiContext } from './ListAdvancedComponent';
import { ListExportPopup } from './ListExportPopup';
import PopOver from '../popOver/PopOver';
import { FeatherIcon } from '../../featherIcon/FeatherIcon';

export const ListHeadbarControls = ({ isFiltered, elements }) => {
	const { gridApi } = useContext(GridApiContext);
	const [showColumnOptions, setShowColumnOptions] = useState(false);
	const [showExportPopup, setShowExportPopup] = useState(false);
	const [selectedRows, setSelectedRows] = useState([]);

	useEffect(() => {
		gridApi?.addEventListener('selectionChanged', handleSelectionChanged);

		return () => {
			gridApi?.removeEventListener('selectionChanged', handleSelectionChanged);
		};
	}, [gridApi]);

	const handleSelectionChanged = () => {
		const selectedRows = gridApi.getSelectedRows();
		setSelectedRows(selectedRows);
	};

	const handleListFilterReset = () => {
		gridApi.setFilterModel(null);
	};

	return (
		<div className="list-container__headerbar-controls">
			<ButtonAddons>
				<Addon>
					<Button
						icon={
							<i style={{ color: '#00A353' }} className={`fas fa-gear`}></i>
						}
					>
						<div style={{ display: 'flex', alignItems: 'center' }}>
							Settings

						{elements?
							<PopOver
								label={<FeatherIcon name={"ChevronDown"} />}
								elements={elements}
							/> : ''
						}

						</div>
					</Button>
				</Addon>

				<Addon>
					<Button
						icon={
							<i
								style={{ color: isFiltered ? '#00A353' : '' }}
								className={`fas fa-filter-circle-xmark`}
							></i>
						}
						onClick={handleListFilterReset}
					>
						Clear
					</Button>
				</Addon>

				<Addon>
					<Button
						icon={
							<i style={{ color: '#00A353' }} className={`fas fa-sliders`}></i>
						}
						onClick={() => setShowColumnOptions(true)}
					>
						Customize columns
					</Button>
				</Addon>

				<Addon>
					<Button
						icon={
							<i
								style={{ color: selectedRows.length > 0 ? '#00A353' : '' }}
								className={`fas fa-download`}
							></i>
						}
						onClick={() => setShowExportPopup(true)}
						isDisabled={selectedRows.length < 1}
					>
						Export
					</Button>
				</Addon>
			</ButtonAddons>

			<>
				<ListColumnSettings
					showColumnOptions={showColumnOptions}
					setShowColumnOptions={setShowColumnOptions}
				/>
			</>

			<>
				<ListExportPopup
					showExportPopup={showExportPopup}
					setShowExportPopup={setShowExportPopup}
					selectedRows={selectedRows}
				/>
			</>
		</div>
	);
};

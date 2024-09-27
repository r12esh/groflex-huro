import moment from 'moment';

// ["2244", "345", "00134", "1234"] will be sorted
// ["345", "1234", "2244", "00134"] instead of
// ["00134", "1234", "2244", "345"]
export const lengthThenLocaleCompare = (valueA, valueB) => {
	valueA = valueA || '';
	valueB = valueB || '';

	return valueA.length - valueB.length || valueA.localeCompare(valueB);
};

// ["Birnen", "Äpfel", "Mangos", "Kiwis"] will be sorted
// ["Äpfel", "Birnen", "Kiwis", "Mangos"] instead of
// ["Birnen", "Kiwis", "Mangos", "Äpfel"]
export const localeCompare = (valueA, valueB) => {
	valueA = valueA || '';
	valueB = valueB || '';

	return valueA.localeCompare(valueB);
};

// ["Birnen", "Äpfel", "Mangos", "Kiwis"] will be sorted
// ["Äpfel", "Birnen", "Kiwis", "Mangos"] instead of
// ["Birnen", "Kiwis", "Mangos", "Äpfel"]
export const localeCompareNumeric = (valueA, valueB) => {
	valueA = valueA || '';
	valueB = valueB || '';

	return valueA.toString().localeCompare(valueB.toString(), undefined, {
		numeric: true,
		sensitivity: 'base',
	});
};

// Comparator for filtering date values
export const dateCompare = (filterLocalDateAtMidnight, cellValue, format) => {
	const valueAsDate = cellValue && moment(cellValue, format || 'DD-MM-YYYY');

	filterLocalDateAtMidnight =
		filterLocalDateAtMidnight && moment(filterLocalDateAtMidnight, format || 'DD-MM-YYYY').toDate();

	if (!valueAsDate) return -1;

	const cellDate = valueAsDate.toDate();

	if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
		return 0;
	}

	if (cellDate < filterLocalDateAtMidnight) {
		return -1;
	}

	if (cellDate > filterLocalDateAtMidnight) {
		return 1;
	}
};


// Comparator for sorting date values
export const dateCompareSort = (date1, date2, format) => {
	const date1Obj = date1 && moment(date1, format || 'DD-MM-YYYY').toDate();
	const date2Obj = date1 && moment(date2, format || 'DD-MM-YYYY').toDate();

	if ((date1Obj === null && date2Obj === null) || (date1Obj === '' && date2Obj === '')) {
		return 0;
	}

	if (date1Obj === null || date1Obj === '') {
		return -1;
	}

	if (date2Obj === null || date2Obj === '') {
		return 1;
	}

	return date1Obj.getTime() - date2Obj.getTime();
};


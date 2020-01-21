// OnLoad Run
window.addEventListener('load', function() {
	SetupComplexTableListeners();
});

function SetupComplexTableListeners() {
	Array.from(document.querySelectorAll('[data-table-complex]')).forEach(function(table) {
		let table_filtered_cells = [];
		let table_filtered_values = [];
		let table_filtered_match_type = [];

		// thead tr row with data-filter-input definitions needs to be first-child based on query below
		Array.from(table.querySelectorAll('thead tr:first-child')).forEach(function(row) {
			Array.from(row.cells).forEach(function(cell) {
				if (cell.hasAttribute('data-filter-input')) {
					table_filtered_cells.push(cell.cellIndex);

					let cell_filter_type = cell.getAttribute('data-filter-match-type');

					if (cell_filter_type !== null) {
						table_filtered_match_type[cell.cellIndex] = cell_filter_type;
					}
					else {
						table_filtered_match_type[cell.cellIndex] = 'contains';
					}

					document.getElementById(cell.getAttribute('data-filter-input')).addEventListener('change', function() {
						let update_table_filtered_values = table.getAttribute('data-table-complex-filter-values').split(',');

						this.value = this.value.trim();

						if (this.value) {
							update_table_filtered_values[cell.cellIndex] = this.value.toLowerCase();
						}
						else {
							update_table_filtered_values[cell.cellIndex] = undefined;
						}

						table.setAttribute('data-table-complex-filter-values', update_table_filtered_values);

						EvaluateComplexTableResults(table);
						DisplayComplexTableResults(table);
					});
				}
				else {
					table_filtered_match_type[cell.cellIndex] = undefined;
				}

				table_filtered_values[cell.cellIndex] = undefined;
			});
		});

		table.setAttribute('data-table-complex-filter-values', table_filtered_values);
		table.setAttribute('data-table-complex-filtered-cells', table_filtered_cells);
		table.setAttribute('data-table-complex-match-types', table_filtered_match_type);
	});
}

function ComplexTableFilterCount(table) {
	let table_filtered_values = table.getAttribute('data-table-complex-filter-values').split(',');

	let filter_count = 0;

	table_filtered_values.forEach(function(value) {
		if (value !== '') {
			filter_count += 1;
		}
	});

	return filter_count;
}

function ResetComplexTableResults(table) {
	if (ComplexTableFilterCount(table) > 0) {
		Array.from(table.querySelectorAll('tbody tr')).forEach(function(row) {
			row.setAttribute('data-table-complex-match-count', 0);
		});
	}
	else {
		Array.from(table.querySelectorAll('tbody tr')).forEach(function(row) {
			row.setAttribute('data-table-complex-match-count', 1);
		});
	}

}

function EvaluateComplexTableResults(table) {
	ResetComplexTableResults(table);

	let table_filtered_values = table.getAttribute('data-table-complex-filter-values').split(',');
	let table_filtered_cells = table.getAttribute('data-table-complex-filtered-cells').split(',');
	let table_filtered_match_type = table.getAttribute('data-table-complex-match-types').split(',');

	Array.from(table.querySelectorAll('tbody tr')).forEach(function(row) {
		Array.from(row.cells).forEach(function(cell) {
			if (table_filtered_cells.includes(cell.cellIndex.toString())) {
				switch (table_filtered_match_type[cell.cellIndex]) {
					case 'exact':
						if (cell.innerHTML.trim().toLowerCase() === table_filtered_values[cell.cellIndex]) {
							row.setAttribute('data-table-complex-match-count', parseInt(row.getAttribute('data-table-complex-match-count')) + 1);
						}
						break;

					case 'contains':
						if (table_filtered_values[cell.cellIndex] !== '' && cell.innerHTML.trim().toLowerCase().indexOf(table_filtered_values[cell.cellIndex]) !== -1) {
							row.setAttribute('data-table-complex-match-count', parseInt(row.getAttribute('data-table-complex-match-count')) + 1);
						}
						break;

					default:
						break;
				}
			}
		});
	});
}

function DisplayComplexTableResults(table) {
	let table_filter_count = ComplexTableFilterCount(table);

	Array.from(table.querySelectorAll('tbody tr')).forEach(function(row) {
		if (row.getAttribute('data-table-complex-match-count') === table_filter_count.toString() || table_filter_count === 0) {
			row.removeAttribute('hidden');
		}
		else {
			row.setAttribute('hidden', true);
		}
	});
}
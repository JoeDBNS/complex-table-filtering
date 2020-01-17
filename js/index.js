// OnLoad Run
window.addEventListener('load', function() {
	SetupComplexTableListeners();
});


let table_filtered_cells = [];
let table_filtered_values = [];
let table_filtered_match_type = [];

function SetupComplexTableListeners() {
	Array.from(document.querySelectorAll('[data-table-complex]')).forEach(function(table) {
		Array.from(table.querySelectorAll('thead tr')).forEach(function(row) {
			Array.from(row.cells).forEach(function(cell) {
				if (cell.hasAttribute('data-filter-input')) {
					table_filtered_cells.push(cell.cellIndex);

					let cell_filter_type = cell.getAttribute('data-filter-match-type');

					if (cell_filter_type) {
						table_filtered_match_type[cell.cellIndex] = cell_filter_type;
					}
					else {
						table_filtered_match_type[cell.cellIndex] = 'contains';
					}

					document.getElementById(cell.getAttribute('data-filter-input')).addEventListener('change', function() {
						this.value = this.value.trim();

						if (this.value) {
							table_filtered_values[cell.cellIndex] = this.value.toLowerCase();
						}
						else {
							table_filtered_values[cell.cellIndex] = undefined;
						}

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

		table.setAttribute('data-table-complex-filtered-cells', table_filtered_cells);

		ResetComplexTableResults(table);
	});
}

function ComplexTableFilterCount() {
	let filter_count = 0;

	table_filtered_values.forEach(function(value) {
		if (typeof value !== 'undefined' && value !== '') {
			filter_count += 1;
		}
	});

	return filter_count;
}

function ResetComplexTableResults(table) {
	if (ComplexTableFilterCount() > 0) {
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

	Array.from(table.querySelectorAll('tbody tr')).forEach(function(row) {
		Array.from(row.cells).forEach(function(cell) {
			if (table_filtered_cells.includes(cell.cellIndex)) {
				switch (table_filtered_match_type[cell.cellIndex]) {
					case 'exact':
						if (cell.innerHTML.toLowerCase() === table_filtered_values[cell.cellIndex]) {
							row.setAttribute('data-table-complex-match-count', parseInt(row.getAttribute('data-table-complex-match-count')) + 1);
						}
						break;

					default:
						if (cell.innerHTML.toLowerCase().indexOf(table_filtered_values[cell.cellIndex]) !== -1) {
							row.setAttribute('data-table-complex-match-count', parseInt(row.getAttribute('data-table-complex-match-count')) + 1);
						}
						break;
				}
			}
		});
	});
}

function DisplayComplexTableResults(table) {
	Array.from(table.querySelectorAll('tbody tr')).forEach(function(row) {
		if (row.getAttribute('data-table-complex-match-count') === ComplexTableFilterCount().toString() || ComplexTableFilterCount() === 0) {
			row.removeAttribute('hidden');
		}
		else {
			row.setAttribute('hidden', true);
		}
	});
}
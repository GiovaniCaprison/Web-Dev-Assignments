let j = 12345678;
let k = 6;
let namesIndex = 0;
let isEditMode = false;
let rowsToDelete = [];
let columnsToDelete = [];

document.addEventListener('DOMContentLoaded', function() {
    const table = document.getElementById('gradesTable');
    const rows = table.querySelectorAll('tbody tr');
    const columns = table.querySelectorAll('thead th');
    // Function to recalculate averages
    function recalculateAverages() {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const grades = row.querySelectorAll('td:not(.name):not(.id):not(:last-child)');
            let sum = 0;
            let count = 0;
            grades.forEach(cell => {
                const grade = parseInt(cell.textContent);
                if (!isNaN(grade)) {
                    sum += grade;
                    count++;
                }
            });
            const averageCell = row.querySelector('td:last-child');
            if (count > 0) {
                const average = Math.round(sum / count);
                averageCell.textContent = `${average}%`;
                averageCell.classList.toggle('low-grade', average < 60);
            } else {
                averageCell.textContent = '-';
            }
        });
    }

    function updateTableDisplay() {
        const rows = table.querySelectorAll('tbody tr');
        let unsubmittedCount = 0;

        rows.forEach(row => {
            const gradeCells = row.querySelectorAll('td:not(.name):not(.id):not(:last-child)');
            gradeCells.forEach(cell => {
                if (cell.textContent === '-') {
                    cell.classList.add('unsubmitted');
                    unsubmittedCount++;
                } else {
                    cell.classList.remove('unsubmitted');
                }
            });
        });

        // Update unsubmitted assignments count display
        // Assume there's an element with ID 'unsubmittedCount' for displaying the count
        const unsubmittedDisplay = document.getElementById('unsubmittedCount');
        if (unsubmittedDisplay) {
            unsubmittedDisplay.textContent = `Unsubmitted Assignments: ${unsubmittedCount}`;
        }

        recalculateAverages();
    }

    function validateAndFormatCell(cell) {
        let value = cell.textContent;
        const numberValue = parseInt(value, 10);

        if (isNaN(numberValue) || numberValue < 0 || numberValue > 100) {
            cell.textContent = '-';
        } else {
            cell.textContent = numberValue.toString(); // Ensures formatting consistency
        }

        updateTableDisplay(); // Reflect changes
    }

    // Add event listeners to grade cells for validation
    function addValidationToCells() {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const gradeCells = row.querySelectorAll('td:not(.name):not(.id):not(:last-child)');
            gradeCells.forEach(cell => {
                cell.setAttribute('contenteditable', 'true');
                cell.addEventListener('focusout', () => validateAndFormatCell(cell));
            });
        });
    }

    function toggleGradePresentation() {
        const currentPresentation = table.getAttribute('data-grade-presentation') || 'percentage';
        let nextPresentation;

        if (currentPresentation === 'percentage') {
            nextPresentation = 'letter';
        } else if (currentPresentation === 'letter') {
            nextPresentation = '4.0';
        } else if (currentPresentation === '4.0') {
            nextPresentation = 'percentage';
        }

        table.setAttribute('data-grade-presentation', nextPresentation);

        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const gradeCells = row.querySelectorAll('td:not(.name):not(.id):not(:last-child)');
            let sum = 0;
            let count = 0;
            gradeCells.forEach(cell => {
                const grade = parseInt(cell.textContent);
                if (!isNaN(grade)) {
                    sum += grade;
                    count++;
                }
            });
            const average = count > 0 ? Math.round(sum / count) : NaN;
            const averageCell = row.querySelector('td:last-child');

            const conversionResult = convertGrade(average, nextPresentation);
            averageCell.textContent = conversionResult.display;

            // Save the original percentage if not already saved
            if (!averageCell.dataset.originalPercentage) {
                averageCell.dataset.originalPercentage = average;
            }
        });
    }

    function convertGrade(grade, presentation) {
        let display = '-';

        if (presentation === 'percentage' && !isNaN(grade)) {
            return { display: `${grade}%` };

        } else if (presentation === 'letter') {
            if (grade >= 93) {
                display = 'A';
            } else if (grade >= 90) {
                display = 'A-';
            } else if (grade >= 87) {
                display = 'B+';
            } else if (grade >= 83) {
                display = 'B';
            } else if (grade >= 80) {
                display = 'B-';
            } else if (grade >= 77) {
                display = 'C+';
            } else if (grade >= 73) {
                display = 'C';
            } else if (grade >= 70) {
                display = 'C-';
            } else if (grade >= 67) {
                display = 'D+';
            } else if (grade >= 63) {
                display = 'D';
            } else if (grade >= 60) {
                display = 'D-';
            } else if (grade >= 0) {
                display = 'F';
            } else {
                display = '-';
            }
        } else if (presentation === '4.0') {
            if (grade >= 93) {
                display = '4.0';
            } else if (grade >= 90) {
                display = '3.7';
            } else if (grade >= 87) {
                display = '3.3';
            } else if (grade >= 83) {
                display = '3.0';
            } else if (grade >= 80) {
                display = '2.7';
            } else if (grade >= 77) {
                display = '2.3';
            } else if (grade >= 73) {
                display = '2.0';
            } else if (grade >= 70) {
                display = '1.7';
            } else if (grade >= 67) {
                display = '1.3';
            } else if (grade >= 63) {
                display = '1.0';
            } else if (grade >= 60) {
                display = '0.7';
            } else if (grade >= 0) {
                display = '0.0';
            } else {
                display = '-';
            }
        } return { display: display };
    }

    // Event listener for toggling grade presentation
    const averageHeader = table.querySelector('th:last-child');
    averageHeader.addEventListener('click', toggleGradePresentation);

    function addNewRow() {
        const tableBody = table.querySelector('tbody');
        const newRow = document.createElement('tr');

        for (let i = 0; i < 8; i++) {
            const newCell = document.createElement('td');
            if (i < 2) { // Name and ID cells
                newCell.setAttribute('contenteditable', 'true');
                newCell.classList.add(i === 0 ? 'name' : 'id');
                if (i === 0) {
                    if (namesIndex < names.length) {
                        newCell.textContent = names[namesIndex++];
                    } else {
                        newCell.textContent = 'New Student';
                    }
                } else {
                    newCell.textContent = j++;
                }
            } else if (i === 7) {
                newCell.textContent = '-';
            } else {
                newCell.setAttribute('contenteditable', 'true');
                newCell.textContent = '-';
            }
            newRow.appendChild(newCell);
        }

        tableBody.appendChild(newRow);
        addValidationToCells(); // Ensure new cells have validation
        updateTableDisplay(); // Update table display, including unsubmitted count

        // Add event listener for the new row
        newRow.addEventListener('click', function() {
            if (isEditMode) {
                const rowIndex = Array.from(tableBody.children).indexOf(newRow);
                const index = rowsToDelete.indexOf(rowIndex);
                if (index > -1) {
                    rowsToDelete.splice(index, 1);
                    newRow.classList.remove('marked-for-deletion');
                } else {
                    rowsToDelete.push(rowIndex);
                    newRow.classList.add('marked-for-deletion');
                }
            }
        });
    }

    document.getElementById('addRowButton').addEventListener('click', addNewRow);

    function addNewColumn() {
        const headerRow = table.querySelector('thead tr');
        const newHeaderCell = document.createElement('th');
        newHeaderCell.textContent = 'Assignment ' + k++; // Placeholder title
        // Insert before the last header cell (Average)
        headerRow.insertBefore(newHeaderCell, headerRow.lastElementChild);

        const bodyRows = table.querySelectorAll('tbody tr');
        bodyRows.forEach(row => {
            const newCell = document.createElement('td');
            newCell.setAttribute('contenteditable', 'true');
            newCell.textContent = '-';
            // Insert before the last cell (Average)
            row.insertBefore(newCell, row.lastElementChild);
        });

        addValidationToCells(); // Ensure new cells have validation
        updateTableDisplay(); // Update table display
    }

    document.getElementById('addColumnButton').addEventListener('click', addNewColumn);

    function deleteRow(rowIndex) {
        const tableBody = document.querySelector('tbody');
        const rowToDelete = tableBody.children[rowIndex];
        if (rowToDelete) {
            tableBody.removeChild(rowToDelete);
        }
    }

    function deleteColumn(columnIndex) {
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
            if (row.cells.length > columnIndex) {
                row.deleteCell(columnIndex);
            }
        });
        updateTableDisplay(); // Update table display
    }

    let names = ["Alice Smith", "Bob Johnson", "Charlie Brown", "Dorothy Parker", "Eve White", "Frank Black", "Grace Green", "Henry Orange", "Ivy Blue", "Jack Red"];
    for (let name of names) {
        addNewRow();
    }
    addValidationToCells();
    updateTableDisplay();

    document.getElementById('editModeButton').addEventListener('click', function() {
        isEditMode = !isEditMode;
        rowsToDelete = [];
        columnsToDelete = [];

        // Toggle contenteditable attribute of the cells
        const cells = Array.from(document.querySelectorAll('td'));
        cells.forEach(cell => {
            if (isEditMode) {
                // Store the original value of the contenteditable attribute
                cell.dataset.originalContentEditable = cell.getAttribute('contenteditable');
                // Disable editing of the cell
                cell.setAttribute('contenteditable', 'false');
            } else {
                // Restore the original value of the contenteditable attribute
                cell.setAttribute('contenteditable', cell.dataset.originalContentEditable);
            }
        });
    });

    rows.forEach((row, rowIndex) => {
        const cells = Array.from(row.querySelectorAll('td'));
        cells.forEach((cell) => {
            cell.addEventListener('click', function() {
                if (isEditMode) {
                    const index = rowsToDelete.indexOf(rowIndex);
                    if (index > -1) {
                        rowsToDelete.splice(index, 1);
                        row.classList.remove('marked-for-deletion');
                    } else {
                        rowsToDelete.push(rowIndex);
                        row.classList.add('marked-for-deletion');
                    }
                }
            });
        });
    });

    columns.forEach((column, columnIndex) => {
        column.addEventListener('click', function() {
            if (isEditMode) {
                const index = columnsToDelete.indexOf(columnIndex);
                if (index > -1) {
                    columnsToDelete.splice(index, 1);
                    column.classList.remove('marked-for-deletion');
                } else {
                    columnsToDelete.push(columnIndex);
                    column.classList.add('marked-for-deletion');
                }
            }
        });
    });

    document.getElementById('confirmDeletionButton').addEventListener('click', function() {
        if (isEditMode) {
            rowsToDelete.sort((a, b) => b - a);
            columnsToDelete.sort((a, b) => b - a);

            for (let rowIndex of rowsToDelete) {
                deleteRow(rowIndex);
            }

            for (let columnIndex of columnsToDelete) {
                deleteColumn(columnIndex);
            }

            isEditMode = false;
            rowsToDelete = [];
            columnsToDelete = [];
        }
    });
});

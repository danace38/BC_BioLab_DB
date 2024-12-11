import React, { useState, useEffect } from 'react';
import Nav from "./Nav";
import Edit from './Edit';
import Delete from './Delete';
import './Query.css';

const Query = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [keyword, setKeyword] = useState('');
    const [tableName, setTableName] = useState('experiment');
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [editingRow, setEditingRow] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [allData, setAllData] = useState([]); // Store unfiltered data

    const tables = [
        'experiment', 'run', 'barcode', 'computer', 'library_prep',
        'minion', 'operator', 'participant', 'sample', 'sequencing_unit'
    ];

    useEffect(() => {
        fetchData();
    }, [currentPage, tableName]);

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null); // Reset success message on new fetch
        try {
            const url = `http://localhost:8000/api/data/${tableName}?page=${currentPage}&limit=50`;
            const response = await fetch(url);
            const result = await response.json();

            if (response.ok) {
                setAllData(result);
                applySearch(result); // Filter the data based on the keyword
            } else {
                throw new Error(result.message || 'Error fetching data');
            }
        } catch (error) {
            setError(`Failed to fetch data: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const applySearch = (fetchedData) => {
        if (!keyword.trim()) {
            setData(fetchedData);
            return;
        }

        const filteredData = fetchedData.filter(row =>
            Object.values(row).some(value =>
                value?.toString().toLowerCase().includes(keyword.toLowerCase())
            )
        );

        setData(filteredData);
    };

    const handleSearch = () => {
        applySearch(allData); // Apply the filter on allData
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const handleNextPage = () => {
        setCurrentPage(prev => prev + 1);
    };

    const handleTableChange = (e) => {
        setTableName(e.target.value);
        setCurrentPage(1);
        setKeyword('');
        fetchData(); // Fetch new table data
    };

    const handleEdit = (row) => {
        setEditingRow(row);
    };

    const handleSave = async (editedRow) => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/api/data/${tableName}/${editedRow.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editedRow),
            });
            if (response.ok) {
                setData(prevData => prevData.map(item => item.id === editedRow.id ? editedRow : item));
                setEditingRow(null);
                setSuccessMessage('Row updated successfully!');
            } else {
                throw new Error('Failed to update data');
            }
        } catch (error) {
            setError(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (row) => {
        if (window.confirm('Are you sure you want to delete this row?')) {
            setIsLoading(true);
            try {
                const url = `http://localhost:8000/api/data/delete/${tableName}/${row.id}`;
                const response = await fetch(url, { method: 'DELETE' });

                if (response.ok) {
                    const result = await response.json();
                    setData(prevData => prevData.filter(item => item.id !== row.id));
                    setSuccessMessage('Row deleted successfully!');
                } else {
                    throw new Error('Failed to delete row');
                }
            } catch (error) {
                setError(`Error: ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const filterIdColumn = (row) => {
        // Return the row excluding the 'id' field
        const { id, ...rest } = row;
        return rest;
    };

    return (
        <div className="container">
            <Nav />
            <h1 className="header">Database Query with Search</h1>

            <div className="controls">
                <div>
                    <label htmlFor="tableSelect">Select Table:</label>
                    <select id="tableSelect" value={tableName} onChange={handleTableChange} className="select">
                        {tables.map(table => (
                            <option key={table} value={table}>{table}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Enter keyword to search"
                        className="input"
                    />
                    <button onClick={handleSearch} className="button">Search</button>
                </div>
            </div>

            {isLoading ? (
                <p className="loading">Loading...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : (
                <>
                    {successMessage && <p className="success">{successMessage}</p>}
                    <div className="table-container">
                        <table className="query-table">
                            <thead>
                                <tr>
                                    {data.length > 0 && Object.keys(data[0]).filter(key => key !== 'id').map(key => (
                                        <th key={key} className="query-th">{key}</th>
                                    ))}
                                    <th className="query-th">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row, index) => (
                                    editingRow === row ? (
                                        <Edit
                                            key={index}
                                            row={row}
                                            onSave={handleSave}
                                            onCancel={() => setEditingRow(null)}
                                        />
                                    ) : (
                                        <tr key={index}>
                                            {Object.entries(filterIdColumn(row)).map(([key, value], idx) => (
                                                <td key={idx} className="query-td">{value}</td>
                                            ))}
                                            <td className="query-td">
                                                <button
                                                    onClick={() => handleEdit(row)}
                                                    className="edit-button"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(row)}
                                                    className="delete-button"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            <div className="pagination">
                <button onClick={handlePrevPage} className="pagination-button" disabled={currentPage === 1}>Previous Page</button>
                <span>Page: {currentPage}</span>
                <button onClick={handleNextPage} className="pagination-button">Next Page</button>
            </div>
        </div>
    );
};

export default Query;

import React, { useState, useEffect } from 'react';
import './Edit.css';

const Edit = ({ row, onSave, onCancel }) => {
  const [editedRow, setEditedRow] = useState(row);

  // Update state when row prop changes
  useEffect(() => {
      setEditedRow(row);
  }, [row]);

  const handleInputChange = (e, key) => {
      setEditedRow({ ...editedRow, [key]: e.target.value });
  };

  // Function to format the date before sending to the backend
  const formatDateForMySQL = (date) => {
      const d = new Date(date);
      return d.toISOString().slice(0, 19).replace('T', ' ');
  };

  const handleSave = () => {
      // Ensure the date is formatted correctly before saving
      if (editedRow.date) {
          editedRow.date = formatDateForMySQL(editedRow.date);
      }
      // Call the onSave callback with the edited row
      onSave(editedRow);
  };

  return (
      <tr className="edit-row">
          {Object.entries(editedRow).map(([key, value]) => (
              <td key={key}>
                  <input
                      type="text"
                      value={value}
                      onChange={(e) => handleInputChange(e, key)}
                      className="edit-input"
                  />
              </td>
          ))}
          <td>
              <button onClick={handleSave} className="save-button">Save</button>
              <button onClick={onCancel} className="cancel-button">Cancel</button>
          </td>
      </tr>
  );
};

export default Edit;

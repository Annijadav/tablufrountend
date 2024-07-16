"use client"
import React, { useState } from 'react';
import axios from 'axios';

const AddLeaveRuleForm = () => {
  const [ruleName, setRuleName] = useState('');
  const [leaveTypes, setLeaveTypes] = useState([{ leaveName: '', disbursementCycle: '', leaveCount: 0, status: 'inactive' }]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newLeaveRule = { ruleName, leaveTypes };
      await axios.post('/api/leave-rules', newLeaveRule);
      console.log('Leave rule created successfully');
      // Optionally, you can redirect or show a success message
    } catch (error) {
      console.error('Error creating leave rule:', error);
    }
  };

  const handleLeaveTypeChange = (index, field, value) => {
    const updatedLeaveTypes = [...leaveTypes];
    updatedLeaveTypes[index][field] = value;
    setLeaveTypes(updatedLeaveTypes);
  };

  const handleAddLeaveType = () => {
    setLeaveTypes([...leaveTypes, { leaveName: '', disbursementCycle: '', leaveCount: 0, status: 'inactive' }]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Rule Name:</label>
        <input type="text" value={ruleName} onChange={(e) => setRuleName(e.target.value)} required />
      </div>
      {leaveTypes.map((leaveType, index) => (
        <div key={index}>
          <h3>Leave Type {index + 1}</h3>
          <label>Leave Name:</label>
          <input type="text" value={leaveType.leaveName} onChange={(e) => handleLeaveTypeChange(index, 'leaveName', e.target.value)} required />
          <label>Disbursement Cycle:</label>
          <input type="text" value={leaveType.disbursementCycle} onChange={(e) => handleLeaveTypeChange(index, 'disbursementCycle', e.target.value)} required />
          <label>Leave Count:</label>
          <input type="number" value={leaveType.leaveCount} onChange={(e) => handleLeaveTypeChange(index, 'leaveCount', parseInt(e.target.value))} required />
          <label>Status:</label>
          <select value={leaveType.status} onChange={(e) => handleLeaveTypeChange(index, 'status', e.target.value)} required>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      ))}
      <button type="button" onClick={handleAddLeaveType}>Add Leave Type</button>
      <button type="submit">Create Leave Rule</button>
    </form>
  );
};

export default AddLeaveRuleForm;


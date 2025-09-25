import React, { useState, useEffect } from 'react';
import { FiTrash2, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';

const LogForm = ({ onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    plastic: '',
    organic: '',
    paper: '',
    glass: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        plastic: initialData.plastic || '',
        organic: initialData.organic || '',
        paper: initialData.paper || '',
        glass: initialData.glass || '',
        date: initialData.date || new Date().toISOString().split('T')[0]
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate that at least one field has a value
    const hasValue = Object.values(formData).some(val => val && val !== '' && val !== '0');
    if (!hasValue) {
      toast.error('Please enter at least one waste value');
      return;
    }

    // Convert empty strings to 0
    const dataToSubmit = {
      plastic: parseFloat(formData.plastic) || 0,
      organic: parseFloat(formData.organic) || 0,
      paper: parseFloat(formData.paper) || 0,
      glass: parseFloat(formData.glass) || 0,
      date: formData.date
    };

    await onSubmit(dataToSubmit);
  };

  const wasteTypes = [
    { name: 'plastic', label: 'Plastic', color: 'blue', icon: '🥤', unit: 'kg' },
    { name: 'organic', label: 'Organic', color: 'green', icon: '🥗', unit: 'kg' },
    { name: 'paper', label: 'Paper', color: 'yellow', icon: '📄', unit: 'kg' },
    { name: 'glass', label: 'Glass/Metal', color: 'purple', icon: '🍾', unit: 'kg' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {wasteTypes.map((type) => (
          <div key={type.name} className={`border-l-4 border-${type.color}-500 pl-3`}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <span className="mr-2">{type.icon}</span>
              {type.label} ({type.unit})
            </label>
            <input
              type="number"
              name={type.name}
              value={formData[type.name]}
              onChange={handleChange}
              step="0.01"
              min="0"
              placeholder="0.00"
              className="input-field"
            />
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date
        </label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          max={new Date().toISOString().split('T')[0]}
          className="input-field"
        />
      </div>

      <button
        type="submit"
        className="btn-primary w-full flex items-center justify-center"
      >
        <FiSave className="mr-2" />
        {initialData ? 'Update' : 'Save'} Waste Log
      </button>
    </form>
  );
};

export default LogForm;
import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import { emergencyExitService, eventService } from '../services';
import { FiPlus, FiEdit, FiTrash2, FiAlertTriangle } from 'react-icons/fi';

const EmergencyExits = () => {
  const [exits, setExits] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExit, setEditingExit] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: '',
    currentCrowdLevel: '',
    event: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [exitsRes, eventsRes] = await Promise.all([
        emergencyExitService.getAll(),
        eventService.getAll()
      ]);
      setExits(exitsRes.data.data);
      setEvents(eventsRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingExit) {
        await emergencyExitService.update(editingExit._id, formData);
      } else {
        await emergencyExitService.create(formData);
      }
      fetchData();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving exit:', error);
      alert('Failed to save exit');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this exit?')) {
      try {
        await emergencyExitService.delete(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting exit:', error);
        alert('Failed to delete exit');
      }
    }
  };

  const handleEdit = (exit) => {
    setEditingExit(exit);
    setFormData({
      name: exit.name,
      location: exit.location,
      capacity: exit.capacity,
      currentCrowdLevel: exit.currentCrowdLevel,
      event: exit.event._id
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingExit(null);
    setFormData({
      name: '',
      location: '',
      capacity: '',
      currentCrowdLevel: '',
      event: ''
    });
  };

  const calculatePercentage = (current, capacity) => {
    return ((current / capacity) * 100).toFixed(0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Emergency Exits</h1>
        <Button onClick={() => setShowModal(true)} icon={FiPlus}>
          Add Exit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exits.map((exit) => (
          <Card key={exit._id}>
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{exit.name}</h3>
                  <p className="text-sm text-gray-600">{exit.event?.name}</p>
                </div>
                <StatusBadge status={exit.status} type="exit" />
              </div>
              
              <div className="space-y-2">
                <p className="text-sm"><span className="font-semibold">Location:</span> {exit.location}</p>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold">Capacity:</span>
                    <span>{exit.currentCrowdLevel} / {exit.capacity}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        exit.status === 'clear' ? 'bg-green-600' :
                        exit.status === 'moderate' ? 'bg-yellow-600' :
                        'bg-red-600'
                      }`}
                      style={{ width: `${calculatePercentage(exit.currentCrowdLevel, exit.capacity)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 text-right">
                    {calculatePercentage(exit.currentCrowdLevel, exit.capacity)}% occupied
                  </p>
                </div>

                <p className="text-xs text-gray-500">
                  Last updated: {new Date(exit.lastUpdated).toLocaleString()}
                </p>
              </div>

              <div className="flex space-x-2 pt-3 border-t">
                <Button 
                  variant="secondary" 
                  onClick={() => handleEdit(exit)}
                  icon={FiEdit}
                  className="flex-1"
                >
                  Edit
                </Button>
                <Button 
                  variant="danger" 
                  onClick={() => handleDelete(exit._id)}
                  icon={FiTrash2}
                  className="flex-1"
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {exits.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No emergency exits found.</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingExit ? 'Edit Emergency Exit' : 'Add Emergency Exit'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Exit Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Crowd Level</label>
              <input
                type="number"
                value={formData.currentCrowdLevel}
                onChange={(e) => setFormData({ ...formData, currentCrowdLevel: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event</label>
            <select
              value={formData.event}
              onChange={(e) => setFormData({ ...formData, event: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              required
            >
              <option value="">Select Event</option>
              {events.map((event) => (
                <option key={event._id} value={event._id}>{event.name}</option>
              ))}
            </select>
          </div>

          {formData.currentCrowdLevel && formData.capacity && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm">
                <span className="font-semibold">Status: </span>
                {calculatePercentage(formData.currentCrowdLevel, formData.capacity) > 80 ? (
                  <span className="text-red-600">Crowded</span>
                ) : calculatePercentage(formData.currentCrowdLevel, formData.capacity) > 50 ? (
                  <span className="text-yellow-600">Moderate</span>
                ) : (
                  <span className="text-green-600">Clear</span>
                )}
              </p>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1">
              {editingExit ? 'Update Exit' : 'Create Exit'}
            </Button>
            <Button type="button" variant="secondary" onClick={handleCloseModal} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EmergencyExits;

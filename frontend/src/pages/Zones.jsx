import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import { zoneService, eventService } from '../services';
import { FiPlus, FiEdit, FiTrash2, FiUpload } from 'react-icons/fi';

const Zones = () => {
  const [zones, setZones] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingZone, setEditingZone] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    event: '',
    capacity: '',
    area: '',
    currentCount: '',
    image: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [zonesRes, eventsRes] = await Promise.all([
        zoneService.getAll(),
        eventService.getAll()
      ]);
      setZones(zonesRes.data.data);
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
      if (editingZone) {
        await zoneService.update(editingZone._id, formData);
      } else {
        await zoneService.create(formData);
      }
      fetchData();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving zone:', error);
      alert('Failed to save zone');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this zone?')) {
      try {
        await zoneService.delete(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting zone:', error);
        alert('Failed to delete zone');
      }
    }
  };

  const handleEdit = (zone) => {
    setEditingZone(zone);
    setFormData({
      name: zone.name,
      event: zone.event._id,
      capacity: zone.capacity,
      area: zone.area,
      currentCount: zone.currentCount,
      image: zone.image
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingZone(null);
    setFormData({
      name: '',
      event: '',
      capacity: '',
      area: '',
      currentCount: '',
      image: ''
    });
  };

  const simulateAIDensityAnalysis = (currentCount, area) => {
    const density = currentCount / area;
    if (density > 200) return 'crowded';
    if (density > 100) return 'moderate';
    return 'low';
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
        <h1 className="text-3xl font-bold text-gray-900">Zone Management</h1>
        <Button onClick={() => setShowModal(true)} icon={FiPlus}>
          Add Zone
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {zones.map((zone) => (
          <Card key={zone._id}>
            <div className="space-y-3">
              {zone.image && (
                <img 
                  src={zone.image} 
                  alt={zone.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
              
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{zone.name}</h3>
                  <p className="text-sm text-gray-600">{zone.event?.name}</p>
                </div>
                <StatusBadge status={zone.densityStatus} type="density" />
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Capacity:</span>
                  <span className="font-semibold">{zone.capacity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Count:</span>
                  <span className="font-semibold">{zone.currentCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Area:</span>
                  <span className="font-semibold">{zone.area} sq m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Density:</span>
                  <span className="font-semibold">{(zone.currentCount / zone.area).toFixed(2)} per sq m</span>
                </div>
              </div>

              <div className="flex space-x-2 pt-3 border-t">
                <Button 
                  variant="secondary" 
                  onClick={() => handleEdit(zone)}
                  icon={FiEdit}
                  className="flex-1"
                >
                  Edit
                </Button>
                <Button 
                  variant="danger" 
                  onClick={() => handleDelete(zone._id)}
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

      {zones.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No zones found. Create your first zone!</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingZone ? 'Edit Zone' : 'Add New Zone'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Zone Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              required
            />
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Area (sq m)</label>
              <input
                type="number"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Count</label>
            <input
              type="number"
              value={formData.currentCount}
              onChange={(e) => setFormData({ ...formData, currentCount: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (for AI Analysis)</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">
              AI will analyze crowd density: &gt;200 per sq m = Crowded, 100-200 = Moderate, &lt;100 = Low
            </p>
          </div>

          {formData.currentCount && formData.area && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">AI Density Prediction: </span>
                <StatusBadge 
                  status={simulateAIDensityAnalysis(formData.currentCount, formData.area)} 
                  type="density" 
                />
              </p>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1">
              {editingZone ? 'Update Zone' : 'Create Zone'}
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

export default Zones;

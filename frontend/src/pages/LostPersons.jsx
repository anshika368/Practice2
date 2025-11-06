import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import StatCard from '../components/StatCard';
import { lostPersonService, eventService } from '../services';
import { FiPlus, FiEdit, FiUsers, FiCheckCircle, FiSearch } from 'react-icons/fi';

const LostPersons = () => {
  const [lostPersons, setLostPersons] = useState([]);
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({ totalReported: 0, found: 0, searching: 0, reported: 0 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'male',
    photo: '',
    location: '',
    lastSeenTime: '',
    description: '',
    reporterName: '',
    reporterContact: '',
    event: '',
    status: 'reported'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [personsRes, eventsRes, statsRes] = await Promise.all([
        lostPersonService.getAll(),
        eventService.getAll(),
        lostPersonService.getStats()
      ]);
      setLostPersons(personsRes.data.data);
      setEvents(eventsRes.data.data);
      setStats(statsRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPerson) {
        await lostPersonService.update(editingPerson._id, formData);
      } else {
        await lostPersonService.create(formData);
      }
      fetchData();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving lost person:', error);
      alert('Failed to save report');
    }
  };

  const handleEdit = (person) => {
    setEditingPerson(person);
    setFormData({
      name: person.name,
      age: person.age,
      gender: person.gender,
      photo: person.photo,
      location: person.location,
      lastSeenTime: person.lastSeenTime.split('T')[0],
      description: person.description,
      reporterName: person.reporterName,
      reporterContact: person.reporterContact,
      event: person.event._id,
      status: person.status
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPerson(null);
    setFormData({
      name: '',
      age: '',
      gender: 'male',
      photo: '',
      location: '',
      lastSeenTime: '',
      description: '',
      reporterName: '',
      reporterContact: '',
      event: '',
      status: 'reported'
    });
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
        <h1 className="text-3xl font-bold text-gray-900">Lost Person Reports</h1>
        <Button onClick={() => setShowModal(true)} icon={FiPlus}>
          Add Report
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Reported"
          value={stats.totalReported}
          icon={FiUsers}
          color="blue"
        />
        <StatCard
          title="Found"
          value={stats.found}
          icon={FiCheckCircle}
          color="green"
        />
        <StatCard
          title="Searching"
          value={stats.searching}
          icon={FiSearch}
          color="yellow"
        />
        <StatCard
          title="Reported"
          value={stats.reported}
          icon={FiUsers}
          color="red"
        />
      </div>

      {/* Lost Persons List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {lostPersons.map((person) => (
          <Card key={person._id}>
            <div className="flex space-x-4">
              {person.photo && (
                <img 
                  src={person.photo} 
                  alt={person.name}
                  className="w-24 h-24 rounded-lg object-cover"
                />
              )}
              
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{person.name}</h3>
                    <p className="text-sm text-gray-600">{person.age} years old, {person.gender}</p>
                  </div>
                  <StatusBadge status={person.status} type="lostPerson" />
                </div>
                
                <div className="text-sm space-y-1">
                  <p><span className="font-semibold">Location:</span> {person.location}</p>
                  <p><span className="font-semibold">Last Seen:</span> {new Date(person.lastSeenTime).toLocaleString()}</p>
                  <p><span className="font-semibold">Event:</span> {person.event?.name}</p>
                  <p><span className="font-semibold">Description:</span> {person.description}</p>
                  <p className="text-gray-600"><span className="font-semibold">Reporter:</span> {person.reporterName} ({person.reporterContact})</p>
                </div>

                <div className="pt-2">
                  <Button 
                    variant="secondary" 
                    onClick={() => handleEdit(person)}
                    icon={FiEdit}
                    className="w-full"
                  >
                    Update Status
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {lostPersons.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No lost person reports found.</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingPerson ? 'Update Lost Person Report' : 'Add Lost Person Report'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                required
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                required
              >
                <option value="reported">Reported</option>
                <option value="searching">Searching</option>
                <option value="found">Found</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Photo URL</label>
            <input
              type="url"
              value={formData.photo}
              onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              placeholder="https://example.com/photo.jpg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Seen Time</label>
              <input
                type="datetime-local"
                value={formData.lastSeenTime}
                onChange={(e) => setFormData({ ...formData, lastSeenTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              rows="3"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Reporter Name</label>
              <input
                type="text"
                value={formData.reporterName}
                onChange={(e) => setFormData({ ...formData, reporterName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reporter Contact</label>
              <input
                type="text"
                value={formData.reporterContact}
                onChange={(e) => setFormData({ ...formData, reporterContact: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1">
              {editingPerson ? 'Update Report' : 'Create Report'}
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

export default LostPersons;

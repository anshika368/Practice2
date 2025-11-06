import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { feedbackService, eventService } from '../services';
import { FiPlus, FiStar } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Feedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [events, setEvents] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [formData, setFormData] = useState({
    event: '',
    userName: '',
    category: 'safety',
    rating: 5,
    comment: ''
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

  useEffect(() => {
    fetchData();
  }, [selectedEvent]);

  const fetchData = async () => {
    try {
      const [feedbackRes, eventsRes, analyticsRes] = await Promise.all([
        selectedEvent ? feedbackService.getByEvent(selectedEvent) : feedbackService.getAll(),
        eventService.getAll(),
        selectedEvent ? feedbackService.getAnalytics(selectedEvent) : feedbackService.getAnalytics()
      ]);
      setFeedback(feedbackRes.data.data);
      setEvents(eventsRes.data.data);
      setAnalytics(analyticsRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await feedbackService.create(formData);
      fetchData();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving feedback:', error);
      alert('Failed to save feedback');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      event: '',
      userName: '',
      category: 'safety',
      rating: 5,
      comment: ''
    });
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FiStar
        key={index}
        className={`inline ${index < rating ? 'fill-current text-yellow-500' : 'text-gray-300'}`}
      />
    ));
  };

  const prepareChartData = () => {
    if (!analytics) return [];
    return Object.entries(analytics.categories).map(([category, data]) => ({
      name: category.replace('_', ' ').toUpperCase(),
      rating: parseFloat(data.averageRating),
      count: data.count
    }));
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
        <h1 className="text-3xl font-bold text-gray-900">Feedback & Analytics</h1>
        <div className="flex space-x-3">
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Events</option>
            {events.map((event) => (
              <option key={event._id} value={event._id}>{event.name}</option>
            ))}
          </select>
          <Button onClick={() => setShowModal(true)} icon={FiPlus}>
            Add Feedback
          </Button>
        </div>
      </div>

      {/* Analytics Overview */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Average Ratings by Category">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={prepareChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="rating" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Feedback Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={prepareChartData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, count }) => `${name}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {prepareChartData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {/* Overall Statistics */}
      {analytics && (
        <Card title="Overall Statistics">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Feedback</p>
              <p className="text-3xl font-bold text-blue-600">{analytics.overall.totalFeedback}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Average Rating</p>
              <p className="text-3xl font-bold text-green-600">{analytics.overall.averageRating}</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-gray-600">Best Category</p>
              <p className="text-sm font-bold text-yellow-600">
                {Object.entries(analytics.categories)
                  .reduce((a, b) => parseFloat(a[1].averageRating) > parseFloat(b[1].averageRating) ? a : b)[0]
                  .replace('_', ' ').toUpperCase()}
              </p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-600">Needs Improvement</p>
              <p className="text-sm font-bold text-red-600">
                {Object.entries(analytics.categories)
                  .filter(([_, data]) => data.count > 0)
                  .reduce((a, b) => parseFloat(a[1].averageRating) < parseFloat(b[1].averageRating) ? a : b)[0]
                  .replace('_', ' ').toUpperCase()}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Feedback List */}
      <Card title="User Feedback">
        <div className="space-y-4">
          {feedback.map((item) => (
            <div key={item._id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900">{item.userName}</h4>
                  <p className="text-sm text-gray-600">{item.event?.name}</p>
                </div>
                <div className="text-right">
                  <div className="flex space-x-1">
                    {renderStars(item.rating)}
                  </div>
                  <span className="text-xs text-gray-500 capitalize">
                    {item.category.replace('_', ' ')}
                  </span>
                </div>
              </div>
              {item.comment && (
                <p className="text-sm text-gray-700">{item.comment}</p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                {new Date(item.submittedAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {feedback.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No feedback found.</p>
          </div>
        )}
      </Card>

      {/* Add Feedback Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title="Add Feedback"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">User Name</label>
            <input
              type="text"
              value={formData.userName}
              onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              required
            >
              <option value="safety">Safety</option>
              <option value="facilities">Facilities</option>
              <option value="organization">Organization</option>
              <option value="crowd_management">Crowd Management</option>
              <option value="medical">Medical</option>
              <option value="overall">Overall</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="focus:outline-none"
                >
                  <FiStar
                    className={`text-3xl ${star <= formData.rating ? 'fill-current text-yellow-500' : 'text-gray-300'}`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Comment (Optional)</label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              rows="3"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1">
              Submit Feedback
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

export default Feedback;

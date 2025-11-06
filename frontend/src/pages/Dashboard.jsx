import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import Card from '../components/Card';
import { 
  FiCalendar, 
  FiUsers, 
  FiAlertTriangle, 
  FiActivity,
  FiTrendingUp 
} from 'react-icons/fi';
import { eventService, lostPersonService, emergencyExitService } from '../services';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    events: { total: 0, upcoming: 0, ongoing: 0, completed: 0 },
    lostPersons: { totalReported: 0, found: 0, searching: 0, reported: 0 },
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [eventsRes, lostPersonsRes, eventsListRes] = await Promise.all([
        eventService.getStats(),
        lostPersonService.getStats(),
        eventService.getAll()
      ]);

      setStats({
        events: eventsRes.data.data,
        lostPersons: lostPersonsRes.data.data,
      });

      setRecentEvents(eventsListRes.data.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const eventChartData = [
    { name: 'Upcoming', count: stats.events.upcoming },
    { name: 'Ongoing', count: stats.events.ongoing },
    { name: 'Completed', count: stats.events.completed },
  ];

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
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Link
          to="/events"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Manage Events
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Events"
          value={stats.events.total}
          icon={FiCalendar}
          color="blue"
        />
        <StatCard
          title="Ongoing Events"
          value={stats.events.ongoing}
          icon={FiTrendingUp}
          color="green"
        />
        <StatCard
          title="Lost Persons"
          value={stats.lostPersons.totalReported}
          icon={FiUsers}
          color="yellow"
        />
        <StatCard
          title="Found"
          value={stats.lostPersons.found}
          icon={FiActivity}
          color="green"
        />
      </div>

      {/* Charts and Recent Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Events Chart */}
        <Card title="Events Overview">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={eventChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Recent Events */}
        <Card title="Recent Events">
          <div className="space-y-3">
            {recentEvents.length > 0 ? (
              recentEvents.map((event) => (
                <div key={event._id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">{event.name}</h4>
                      <p className="text-sm text-gray-600">{event.location}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      event.status === 'ongoing' 
                        ? 'bg-green-100 text-green-800' 
                        : event.status === 'upcoming'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No events found</p>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card title="Quick Actions">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/events"
            className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-center"
          >
            <FiCalendar className="text-3xl text-blue-600 mx-auto mb-2" />
            <p className="font-semibold text-gray-900">Events</p>
          </Link>
          <Link
            to="/zones"
            className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-center"
          >
            <FiUsers className="text-3xl text-green-600 mx-auto mb-2" />
            <p className="font-semibold text-gray-900">Zones</p>
          </Link>
          <Link
            to="/lost-persons"
            className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors text-center"
          >
            <FiAlertTriangle className="text-3xl text-yellow-600 mx-auto mb-2" />
            <p className="font-semibold text-gray-900">Lost Persons</p>
          </Link>
          <Link
            to="/medical"
            className="p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-center"
          >
            <FiActivity className="text-3xl text-red-600 mx-auto mb-2" />
            <p className="font-semibold text-gray-900">Medical</p>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;

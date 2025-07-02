import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useContacts } from '../context/ContactContext';
import { format, isWithinInterval, subDays } from 'date-fns';

const { FiUsers, FiMessageSquare, FiTrendingUp, FiCalendar, FiArrowRight, FiPhone, FiMail } = FiIcons;

const Dashboard = () => {
  const { contacts, interactions } = useContacts();

  const stats = [
    {
      title: 'Total Contacts',
      value: contacts.length,
      icon: FiUsers,
      color: 'bg-blue-500',
      change: '+12%',
    },
    {
      title: 'This Week',
      value: interactions.filter(i => 
        isWithinInterval(new Date(i.date), { start: subDays(new Date(), 7), end: new Date() })
      ).length,
      icon: FiMessageSquare,
      color: 'bg-green-500',
      change: '+8%',
    },
    {
      title: 'High Priority',
      value: contacts.filter(c => c.priority === 'High').length,
      icon: FiTrendingUp,
      color: 'bg-orange-500',
      change: '+3%',
    },
    {
      title: 'Follow-ups',
      value: contacts.filter(c => {
        const lastContact = new Date(c.lastContact || c.createdAt);
        return isWithinInterval(lastContact, { start: subDays(new Date(), 14), end: subDays(new Date(), 7) });
      }).length,
      icon: FiCalendar,
      color: 'bg-purple-500',
      change: '-2%',
    },
  ];

  const recentContacts = contacts
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const recentInteractions = interactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your contacts.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <SafeIcon icon={stat.icon} className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Contacts */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Contacts</h2>
              <Link
                to="/contacts"
                className="flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View all
                <SafeIcon icon={FiArrowRight} className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentContacts.map((contact) => (
                <div key={contact.id} className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {contact.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{contact.name}</p>
                    <p className="text-sm text-gray-500 truncate">{contact.company}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-1.5 text-gray-400 hover:text-gray-600">
                      <SafeIcon icon={FiPhone} className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-gray-600">
                      <SafeIcon icon={FiMail} className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Recent Interactions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
              <Link
                to="/interactions"
                className="flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View all
                <SafeIcon icon={FiArrowRight} className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentInteractions.map((interaction) => {
                const contact = contacts.find(c => c.id === interaction.contactId);
                return (
                  <div key={interaction.id} className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <SafeIcon icon={FiMessageSquare} className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {interaction.type} with {contact?.name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{interaction.subject}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {format(new Date(interaction.date), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
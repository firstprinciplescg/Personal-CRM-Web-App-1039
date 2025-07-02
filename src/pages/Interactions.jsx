import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useContacts } from '../context/ContactContext';
import { format, subDays, isWithinInterval } from 'date-fns';

const { FiMessageSquare, FiPhone, FiMail, FiBuilding, FiFilter, FiSearch } = FiIcons;

const Interactions = () => {
  const { contacts, interactions } = useContacts();
  const [filterType, setFilterType] = useState('All');
  const [filterDate, setFilterDate] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const getInteractionIcon = (type) => {
    switch (type) {
      case 'Email': return FiMail;
      case 'Call': return FiPhone;
      case 'Meeting': return FiBuilding;
      default: return FiMessageSquare;
    }
  };

  const filterByDate = (interaction) => {
    const interactionDate = new Date(interaction.date);
    const now = new Date();
    
    switch (filterDate) {
      case 'Today':
        return format(interactionDate, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd');
      case 'This Week':
        return isWithinInterval(interactionDate, { start: subDays(now, 7), end: now });
      case 'This Month':
        return isWithinInterval(interactionDate, { start: subDays(now, 30), end: now });
      default:
        return true;
    }
  };

  const filteredInteractions = interactions
    .filter(interaction => {
      const contact = contacts.find(c => c.id === interaction.contactId);
      const matchesSearch = contact?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           interaction.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           interaction.notes?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'All' || interaction.type === filterType;
      const matchesDate = filterByDate(interaction);
      return matchesSearch && matchesType && matchesDate;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const interactionTypes = ['All', ...new Set(interactions.map(i => i.type))];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Interactions</h1>
        <p className="text-gray-600">Track all your communication history</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search interactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <SafeIcon icon={FiFilter} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
            >
              {interactionTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <select
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="All">All Time</option>
            <option value="Today">Today</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
          </select>
        </div>
      </div>

      {/* Interactions List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {filteredInteractions.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredInteractions.map((interaction) => {
              const contact = contacts.find(c => c.id === interaction.contactId);
              return (
                <motion.div
                  key={interaction.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <SafeIcon 
                        icon={getInteractionIcon(interaction.type)} 
                        className="w-6 h-6 text-gray-600" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-medium text-gray-900">
                            {interaction.subject}
                          </h3>
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                            {interaction.type}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {format(new Date(interaction.date), 'MMM d, yyyy h:mm a')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-sm text-gray-600">with</span>
                        <Link
                          to={`/contacts/${contact?.id}`}
                          className="text-sm font-medium text-primary-600 hover:text-primary-700"
                        >
                          {contact?.name}
                        </Link>
                        {contact?.company && (
                          <>
                            <span className="text-sm text-gray-500">at</span>
                            <span className="text-sm text-gray-600">{contact.company}</span>
                          </>
                        )}
                      </div>
                      {interaction.notes && (
                        <p className="text-sm text-gray-700">{interaction.notes}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <SafeIcon icon={FiMessageSquare} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No interactions found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Interactions;
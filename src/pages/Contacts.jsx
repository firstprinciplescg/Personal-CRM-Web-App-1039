import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useContacts } from '../context/ContactContext';
import ContactForm from '../components/ContactForm';
import { format } from 'date-fns';

const { FiPlus, FiSearch, FiFilter, FiPhone, FiMail, FiBuilding, FiEdit3, FiTrash2 } = FiIcons;

const Contacts = () => {
  const { contacts, deleteContact } = useContacts();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'All' || contact.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      deleteContact(id);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contacts</h1>
          <p className="text-gray-600">Manage your professional relationships</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 sm:mt-0 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium flex items-center transition-colors"
        >
          <SafeIcon icon={FiPlus} className="w-5 h-5 mr-2" />
          Add Contact
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div className="relative">
          <SafeIcon icon={FiFilter} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredContacts.map((contact) => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {contact.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      to={`/contacts/${contact.id}`}
                      className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                    >
                      <SafeIcon icon={FiEdit3} className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(contact.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{contact.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{contact.position}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <SafeIcon icon={FiBuilding} className="w-4 h-4 mr-2" />
                    {contact.company}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <SafeIcon icon={FiMail} className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="truncate">{contact.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <SafeIcon icon={FiPhone} className="w-4 h-4 mr-2 text-gray-400" />
                    {contact.phone}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(contact.priority)}`}>
                    {contact.priority}
                  </span>
                  <span className="text-xs text-gray-500">
                    {format(new Date(contact.lastContact || contact.createdAt), 'MMM d')}
                  </span>
                </div>

                {contact.tags && contact.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {contact.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                    {contact.tags.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                        +{contact.tags.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredContacts.length === 0 && (
        <div className="text-center py-12">
          <SafeIcon icon={FiSearch} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Contact Form Modal */}
      <AnimatePresence>
        {showForm && (
          <ContactForm onClose={() => setShowForm(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Contacts;
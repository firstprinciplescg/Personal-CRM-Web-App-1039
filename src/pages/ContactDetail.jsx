import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useContacts } from '../context/ContactContext';
import ContactForm from '../components/ContactForm';
import InteractionForm from '../components/InteractionForm';
import { format } from 'date-fns';

const { FiArrowLeft, FiEdit3, FiTrash2, FiPhone, FiMail, FiBuilding, FiPlus, FiMessageSquare } = FiIcons;

const ContactDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { contacts, deleteContact, getContactInteractions } = useContacts();
  const [showEditForm, setShowEditForm] = useState(false);
  const [showInteractionForm, setShowInteractionForm] = useState(false);

  const contact = contacts.find(c => c.id === id);
  const interactions = getContactInteractions(id);

  if (!contact) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Not Found</h2>
        <button
          onClick={() => navigate('/contacts')}
          className="text-primary-600 hover:text-primary-700"
        >
          Back to Contacts
        </button>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this contact? This will also delete all associated interactions.')) {
      deleteContact(id);
      navigate('/contacts');
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

  const getInteractionIcon = (type) => {
    switch (type) {
      case 'Email': return FiMail;
      case 'Call': return FiPhone;
      case 'Meeting': return FiBuilding;
      default: return FiMessageSquare;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 max-w-5xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/contacts')}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <SafeIcon icon={FiArrowLeft} className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{contact.name}</h1>
            <p className="text-gray-600">{contact.position} at {contact.company}</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowEditForm(true)}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <SafeIcon icon={FiEdit3} className="w-4 h-4 mr-2" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <SafeIcon icon={FiTrash2} className="w-4 h-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Information */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">
                  {contact.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">{contact.name}</h2>
              <p className="text-gray-600">{contact.position}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiMail} className="w-5 h-5 text-gray-400" />
                <a href={`mailto:${contact.email}`} className="text-primary-600 hover:text-primary-700">
                  {contact.email}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiPhone} className="w-5 h-5 text-gray-400" />
                <a href={`tel:${contact.phone}`} className="text-primary-600 hover:text-primary-700">
                  {contact.phone}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiBuilding} className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">{contact.company}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-700">Priority</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(contact.priority)}`}>
                  {contact.priority}
                </span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-700">Relationship</span>
                <span className="text-sm text-gray-600">{contact.relationship}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Last Contact</span>
                <span className="text-sm text-gray-600">
                  {format(new Date(contact.lastContact || contact.createdAt), 'MMM d, yyyy')}
                </span>
              </div>
            </div>

            {contact.tags && contact.tags.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {contact.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {contact.notes && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Notes</h3>
                <p className="text-sm text-gray-600">{contact.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Interactions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Interaction History</h2>
                <button
                  onClick={() => setShowInteractionForm(true)}
                  className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
                  Add Interaction
                </button>
              </div>
            </div>
            <div className="p-6">
              {interactions.length > 0 ? (
                <div className="space-y-4">
                  {interactions
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((interaction) => (
                      <div key={interaction.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <SafeIcon 
                              icon={getInteractionIcon(interaction.type)} 
                              className="w-5 h-5 text-gray-600" 
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-medium text-gray-900">{interaction.subject}</h3>
                              <span className="text-sm text-gray-500">
                                {format(new Date(interaction.date), 'MMM d, yyyy h:mm a')}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              <span className="font-medium">{interaction.type}</span>
                            </p>
                            {interaction.notes && (
                              <p className="text-sm text-gray-700">{interaction.notes}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <SafeIcon icon={FiMessageSquare} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No interactions yet</h3>
                  <p className="text-gray-600 mb-4">Start tracking your communication with this contact.</p>
                  <button
                    onClick={() => setShowInteractionForm(true)}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Add first interaction
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Contact Form */}
      <AnimatePresence>
        {showEditForm && (
          <ContactForm
            contact={contact}
            onClose={() => setShowEditForm(false)}
          />
        )}
      </AnimatePresence>

      {/* Add Interaction Form */}
      <AnimatePresence>
        {showInteractionForm && (
          <InteractionForm
            contactId={id}
            onClose={() => setShowInteractionForm(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ContactDetail;
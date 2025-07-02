import React, { createContext, useContext, useState, useEffect } from 'react';

const ContactContext = createContext();

export const useContacts = () => {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error('useContacts must be used within a ContactProvider');
  }
  return context;
};

export const ContactProvider = ({ children }) => {
  const [contacts, setContacts] = useState([]);
  const [interactions, setInteractions] = useState([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedContacts = localStorage.getItem('crm-contacts');
    const savedInteractions = localStorage.getItem('crm-interactions');
    
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    } else {
      // Initialize with sample data
      const sampleContacts = [
        {
          id: '1',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@email.com',
          phone: '+1 (555) 123-4567',
          company: 'Tech Solutions Inc.',
          position: 'Product Manager',
          relationship: 'Professional',
          priority: 'High',
          tags: ['Client', 'Tech'],
          notes: 'Key contact for the upcoming project. Very responsive and professional.',
          createdAt: new Date('2024-01-15').toISOString(),
          lastContact: new Date('2024-01-20').toISOString(),
        },
        {
          id: '2',
          name: 'Michael Chen',
          email: 'michael.chen@startup.com',
          phone: '+1 (555) 987-6543',
          company: 'InnovateCorp',
          position: 'CTO',
          relationship: 'Professional',
          priority: 'Medium',
          tags: ['Startup', 'Tech'],
          notes: 'Interested in our services. Follow up next month.',
          createdAt: new Date('2024-01-10').toISOString(),
          lastContact: new Date('2024-01-18').toISOString(),
        }
      ];
      setContacts(sampleContacts);
      localStorage.setItem('crm-contacts', JSON.stringify(sampleContacts));
    }

    if (savedInteractions) {
      setInteractions(JSON.parse(savedInteractions));
    } else {
      // Initialize with sample interactions
      const sampleInteractions = [
        {
          id: '1',
          contactId: '1',
          type: 'Email',
          subject: 'Project Discussion',
          notes: 'Discussed project requirements and timeline.',
          date: new Date('2024-01-20').toISOString(),
        },
        {
          id: '2',
          contactId: '2',
          type: 'Call',
          subject: 'Initial Consultation',
          notes: '30-minute call about potential collaboration.',
          date: new Date('2024-01-18').toISOString(),
        }
      ];
      setInteractions(sampleInteractions);
      localStorage.setItem('crm-interactions', JSON.stringify(sampleInteractions));
    }
  }, []);

  // Save contacts to localStorage whenever they change
  useEffect(() => {
    if (contacts.length > 0) {
      localStorage.setItem('crm-contacts', JSON.stringify(contacts));
    }
  }, [contacts]);

  // Save interactions to localStorage whenever they change
  useEffect(() => {
    if (interactions.length > 0) {
      localStorage.setItem('crm-interactions', JSON.stringify(interactions));
    }
  }, [interactions]);

  const addContact = (contact) => {
    const newContact = {
      ...contact,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setContacts(prev => [...prev, newContact]);
  };

  const updateContact = (id, updates) => {
    setContacts(prev => prev.map(contact => 
      contact.id === id ? { ...contact, ...updates } : contact
    ));
  };

  const deleteContact = (id) => {
    setContacts(prev => prev.filter(contact => contact.id !== id));
    setInteractions(prev => prev.filter(interaction => interaction.contactId !== id));
  };

  const addInteraction = (interaction) => {
    const newInteraction = {
      ...interaction,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    setInteractions(prev => [...prev, newInteraction]);
    
    // Update lastContact for the contact
    updateContact(interaction.contactId, { lastContact: new Date().toISOString() });
  };

  const getContactInteractions = (contactId) => {
    return interactions.filter(interaction => interaction.contactId === contactId);
  };

  const value = {
    contacts,
    interactions,
    addContact,
    updateContact,
    deleteContact,
    addInteraction,
    getContactInteractions,
  };

  return (
    <ContactContext.Provider value={value}>
      {children}
    </ContactContext.Provider>
  );
};
import React from 'react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useContacts } from '../context/ContactContext';
import { format, subDays, isWithinInterval, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

const { FiTrendingUp, FiUsers, FiMessageSquare, FiCalendar } = FiIcons;

const Analytics = () => {
  const { contacts, interactions } = useContacts();

  // Priority distribution
  const priorityData = contacts.reduce((acc, contact) => {
    acc[contact.priority] = (acc[contact.priority] || 0) + 1;
    return acc;
  }, {});

  // Interaction types
  const interactionTypeData = interactions.reduce((acc, interaction) => {
    acc[interaction.type] = (acc[interaction.type] || 0) + 1;
    return acc;
  }, {});

  // Weekly interaction trend
  const weekStart = startOfWeek(new Date());
  const weekEnd = endOfWeek(new Date());
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  const weeklyData = weekDays.map(day => {
    const dayInteractions = interactions.filter(interaction => 
      format(new Date(interaction.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    ).length;
    return {
      date: format(day, 'EEE'),
      count: dayInteractions
    };
  });

  // Company breakdown
  const companyData = contacts.reduce((acc, contact) => {
    if (contact.company) {
      acc[contact.company] = (acc[contact.company] || 0) + 1;
    }
    return acc;
  }, {});

  const topCompanies = Object.entries(companyData)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  // Chart options
  const priorityChartOption = {
    title: {
      text: 'Contact Priority Distribution',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold' }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    series: [{
      name: 'Priority',
      type: 'pie',
      radius: '70%',
      data: Object.entries(priorityData).map(([key, value]) => ({
        value,
        name: key,
        itemStyle: {
          color: key === 'High' ? '#ef4444' : key === 'Medium' ? '#f59e0b' : '#10b981'
        }
      })),
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };

  const interactionChartOption = {
    title: {
      text: 'Interaction Types',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold' }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    xAxis: {
      type: 'category',
      data: Object.keys(interactionTypeData)
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: Object.values(interactionTypeData),
      type: 'bar',
      itemStyle: {
        color: '#0ea5e9'
      }
    }]
  };

  const weeklyTrendOption = {
    title: {
      text: 'Weekly Interaction Trend',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold' }
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: weeklyData.map(d => d.date)
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: weeklyData.map(d => d.count),
      type: 'line',
      smooth: true,
      itemStyle: {
        color: '#10b981'
      },
      areaStyle: {
        color: 'rgba(16, 185, 129, 0.1)'
      }
    }]
  };

  const stats = [
    {
      title: 'Total Contacts',
      value: contacts.length,
      icon: FiUsers,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Interactions',
      value: interactions.length,
      icon: FiMessageSquare,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'This Week',
      value: interactions.filter(i => 
        isWithinInterval(new Date(i.date), { start: subDays(new Date(), 7), end: new Date() })
      ).length,
      icon: FiCalendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Avg per Day',
      value: Math.round(interactions.length / 30),
      icon: FiTrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-600">Insights into your contact management and interactions</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <SafeIcon icon={stat.icon} className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Priority Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <ReactECharts option={priorityChartOption} style={{ height: '300px' }} />
        </motion.div>

        {/* Interaction Types */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <ReactECharts option={interactionChartOption} style={{ height: '300px' }} />
        </motion.div>
      </div>

      {/* Weekly Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
      >
        <ReactECharts option={weeklyTrendOption} style={{ height: '300px' }} />
      </motion.div>

      {/* Top Companies */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Companies</h2>
        <div className="space-y-4">
          {topCompanies.map(([company, count], index) => (
            <div key={company} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-semibold text-sm">{index + 1}</span>
                </div>
                <span className="font-medium text-gray-900">{company}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full"
                    style={{ width: `${(count / Math.max(...Object.values(companyData))) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-600">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Analytics;
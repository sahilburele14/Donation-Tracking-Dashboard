import React, { useState, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';

// Dummy donation data generator
const generateDummyData = () => {
  const donors = [
    'John Smith', 'Sarah Johnson', 'Michael Brown', 'Emily Davis',
    'David Wilson', 'Lisa Anderson', 'James Taylor', 'Jennifer Martinez',
    'Robert Garcia', 'Mary Rodriguez', 'William Lopez', 'Patricia Lee',
    'Richard White', 'Linda Harris', 'Thomas Clark', 'Barbara Lewis'
  ];

  const donations = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  for (let i = 0; i < 50; i++) {
    const amount = Math.floor(Math.random() * 950) + 50;
    const monthIndex = Math.floor(Math.random() * 12);
    const day = Math.floor(Math.random() * 28) + 1;
    
    donations.push({
      id: i + 1,
      donor: donors[Math.floor(Math.random() * donors.length)],
      amount: amount,
      date: `2024-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      month: months[monthIndex],
      category: ['One-time', 'Monthly', 'Annual'][Math.floor(Math.random() * 3)]
    });
  }
  
  return donations.sort((a, b) => new Date(b.date) - new Date(a.date));
};

const DonationDashboard = () => {
  const [donations] = useState(generateDummyData());

  // Calculate statistics
  const stats = useMemo(() => {
    const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);
    const uniqueDonors = new Set(donations.map(d => d.donor)).size;
    const avgDonation = totalDonations / donations.length;

    // Monthly trend data
    const monthlyData = donations.reduce((acc, d) => {
      const existing = acc.find(item => item.month === d.month);
      if (existing) {
        existing.amount += d.amount;
        existing.count += 1;
      } else {
        acc.push({ month: d.month, amount: d.amount, count: 1 });
      }
      return acc;
    }, []);

    // Sort by month order
    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    monthlyData.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));

    // Category breakdown
    const categoryData = donations.reduce((acc, d) => {
      const existing = acc.find(item => item.name === d.category);
      if (existing) {
        existing.value += d.amount;
      } else {
        acc.push({ name: d.category, value: d.amount });
      }
      return acc;
    }, []);

    return {
      totalDonations,
      uniqueDonors,
      avgDonation,
      monthlyData,
      categoryData,
      donationCount: donations.length
    };
  }, [donations]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Donation Tracking Dashboard</h1>
          <p className="text-gray-600">Monitor and analyze donation performance in real-time</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Total Donations</p>
                <h3 className="text-3xl font-bold text-gray-800">
                  ${stats.totalDonations.toLocaleString()}
                </h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Number of Donors</p>
                <h3 className="text-3xl font-bold text-gray-800">{stats.uniqueDonors}</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Average Donation</p>
                <h3 className="text-3xl font-bold text-gray-800">
                  ${Math.round(stats.avgDonation).toLocaleString()}
                </h3>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Total Transactions</p>
                <h3 className="text-3xl font-bold text-gray-800">{stats.donationCount}</h3>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Trend Bar Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Monthly Donation Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => `$${value.toLocaleString()}`}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
                />
                <Legend />
                <Bar dataKey="amount" fill="#3b82f6" name="Donation Amount" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Line Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Donation Count by Month</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  name="Number of Donations"
                  dot={{ fill: '#10b981', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown and Recent Donations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pie Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Donation Categories</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Donations Table */}
          <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Donations</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Donor</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.slice(0, 10).map((donation) => (
                    <tr key={donation.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-800">{donation.donor}</td>
                      <td className="py-3 px-4 font-semibold text-green-600">
                        ${donation.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{donation.date}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          donation.category === 'One-time' ? 'bg-blue-100 text-blue-800' :
                          donation.category === 'Monthly' ? 'bg-green-100 text-green-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {donation.category}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationDashboard;
import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area 
} from 'recharts';
import { 
  Upload, Database, TrendingUp, AlertTriangle, CloudRain, 
  Thermometer, Download, Plus, Search, Filter,
  ArrowUpDown, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { DroughtData } from '../types';
import { motion } from 'motion/react';

interface ResearcherDashboardProps {
  data: DroughtData[];
  onUpload: (newData: DroughtData[]) => void;
}

export default function ResearcherDashboard({ data, onUpload }: ResearcherDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof DroughtData; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const stats = [
    { label: 'Total Records', value: data.length, icon: Database, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Avg Rainfall', value: `${(data.reduce((acc, d) => acc + d.rainfall, 0) / data.length || 0).toFixed(1)}mm`, icon: CloudRain, color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { label: 'Active Alerts', value: data.filter(d => d.severity === 'alert').length, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Avg SPI', value: (data.reduce((acc, d) => acc + d.spi, 0) / data.length || 0).toFixed(2), icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const handleSort = (key: keyof DroughtData) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset to first page on sort
  };

  const filteredData = data.filter(d => 
    (d.location.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterSeverity === 'all' || d.severity === filterSeverity)
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Mock CSV upload logic
    const mockNewData: DroughtData = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      location: 'New District',
      rainfall: Math.floor(Math.random() * 50),
      spi: +(Math.random() * 4 - 2).toFixed(2),
      smi: +(Math.random()).toFixed(2),
      temperature: 30 + Math.floor(Math.random() * 15),
      humidity: 20 + Math.floor(Math.random() * 60),
      soilMoisture: 10 + Math.floor(Math.random() * 50),
      severity: 'normal'
    };
    onUpload([...data, mockNewData]);
  };

  const handleExport = () => {
    const headers = ['Date', 'Location', 'Rainfall(mm)', 'SPI', 'SMI', 'Temperature(C)', 'Humidity(%)', 'Soil Moisture(%)', 'Severity'];
    const csvContent = [
      headers.join(','),
      ...data.map(d => [
        d.date,
        `"${d.location}"`,
        d.rainfall,
        d.spi,
        d.smi,
        d.temperature,
        d.humidity,
        d.soilMoisture,
        d.severity
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `drought_pulse_data_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Researcher Command Center</h1>
          <p className="text-gray-500">Monitor drought indices and validate climate models</p>
        </div>
        <div className="flex gap-3">
          <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 cursor-pointer transition">
            <Upload className="w-4 h-4 mr-2" />
            Upload Dataset (CSV)
            <input type="file" className="hidden" accept=".csv" onChange={handleFileUpload} />
          </label>
          <button 
            onClick={handleExport}
            className="flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition shadow-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Rainfall & SPI Trend */}
        <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Rainfall & SPI Temporal Trends</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="rainfall" stroke="#2563eb" fillOpacity={1} fill="url(#colorRain)" />
                <Line type="monotone" dataKey="spi" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Soil Moisture Analysis */}
        <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Soil Moisture & SMI Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="location" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" />
                <Bar dataKey="soilMoisture" fill="#059669" radius={[4, 4, 0, 0]} />
                <Bar dataKey="smi" fill="#fbbf24" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-gray-900">Validating Field Datasets</h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search location..."
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-sm"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={filterSeverity}
              onChange={e => setFilterSeverity(e.target.value)}
            >
              <option value="all">All Severity</option>
              <option value="alert">Alert</option>
              <option value="warning">Warning</option>
              <option value="normal">Normal</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th 
                  className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center gap-1">
                    Date
                    <ArrowUpDown size={12} className={sortConfig?.key === 'date' ? 'text-blue-600' : 'text-gray-300'} />
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => handleSort('location')}
                >
                  <div className="flex items-center gap-1">
                    Location
                    <ArrowUpDown size={12} className={sortConfig?.key === 'location' ? 'text-blue-600' : 'text-gray-300'} />
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => handleSort('rainfall')}
                >
                  <div className="flex items-center gap-1">
                    Rain (mm)
                    <ArrowUpDown size={12} className={sortConfig?.key === 'rainfall' ? 'text-blue-600' : 'text-gray-300'} />
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => handleSort('spi')}
                >
                  <div className="flex items-center gap-1">
                    SPI
                    <ArrowUpDown size={12} className={sortConfig?.key === 'spi' ? 'text-blue-600' : 'text-gray-300'} />
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => handleSort('temperature')}
                >
                  <div className="flex items-center gap-1">
                    Temp (°C)
                    <ArrowUpDown size={12} className={sortConfig?.key === 'temperature' ? 'text-blue-600' : 'text-gray-300'} />
                  </div>
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Severity</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedData.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono italic">{d.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{d.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">{d.rainfall.toFixed(1)}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-mono ${d.spi < -1 ? 'text-red-600 font-bold' : 'text-gray-600'}`}>
                    {d.spi.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">{d.temperature}°</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase transition ${
                      d.severity === 'alert' ? 'bg-red-100 text-red-700' :
                      d.severity === 'warning' ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {d.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button className="text-blue-600 hover:text-blue-900 font-medium">Verify</button>
                    <span className="mx-2 text-gray-300">|</span>
                    <button className="text-gray-400 hover:text-red-600 font-medium">Flag</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(currentPage * itemsPerPage, sortedData.length)}</span> of <span className="font-semibold text-gray-900">{sortedData.length}</span> results
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-200 rounded-xl bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                    currentPage === i + 1 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-200 hover:text-blue-600'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-200 rounded-xl bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

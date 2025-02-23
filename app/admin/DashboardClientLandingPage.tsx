'use client'
import React, { useState, useEffect, useTransition } from 'react';
import { ArrowUpRight, Users, Package, BookOpen, Folders, FileText, DollarSign, RefreshCw, ShoppingCart, UserCheck, TrendingUp, Clock, Filter, Download, Search } from 'lucide-react';
import { Button } from '@heroui/button';
import { useRouter } from 'next/navigation';

export function DashboardClientLandingPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  async function Relaoad() {
    startTransition(async () => {

      router.refresh()

    });
  }
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Simulated data
  const data = {
    netSales: 150000,
    totalRefunds: 5000,
    netPurchases: 1200,
    refundedPurchases: 50,
    averageNetPurchasesPerCustomer: 2.5,
    totalStudents: 800,
    totalProducts: 25,
    totalCourses: 15,
    totalCourseSections: 45,
    totalLessons: 180,
    lastUpdated: new Date().toLocaleTimeString(),
    recentPurchases: [
      { id: 1, customer: 'John Doe', product: 'Advanced React Course', amount: 199, date: '2024-03-15', status: 'completed' },
      { id: 2, customer: 'Jane Smith', product: 'TypeScript Masterclass', amount: 149, date: '2024-03-14', status: 'completed' },
      { id: 3, customer: 'Bob Johnson', product: 'Node.js Basics', amount: 99, date: '2024-03-14', status: 'refunded' },
      { id: 4, customer: 'Alice Brown', product: 'Web Security Course', amount: 179, date: '2024-03-13', status: 'completed' },
      { id: 5, customer: 'Charlie Wilson', product: 'GraphQL Advanced', amount: 159, date: '2024-03-13', status: 'pending' },
    ],
    topProducts: [
      { name: 'Advanced React Course', sales: 245, revenue: 48755, rating: 4.8 },
      { name: 'TypeScript Masterclass', sales: 189, revenue: 28161, rating: 4.9 },
      { name: 'Node.js Basics', sales: 156, revenue: 15444, rating: 4.7 },
      { name: 'Web Security Course', sales: 134, revenue: 23986, rating: 4.6 },
      { name: 'GraphQL Advanced', sales: 112, revenue: 17808, rating: 4.8 },
    ]
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div >
      <div className="container mx-auto px-4 py-8">

        {/*Header*/}
        <div className="flex items-center justify-between mb-8  shadow border  rounded-medium p-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
            <p className="text-gray-600 mt-2 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Last updated: {data.lastUpdated}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            <Button isLoading={isPending} onPress={() => Relaoad()} variant='solid' color='success'
              startContent={!isPending && <RefreshCw className="w-4 h-4" />}>
              Refresh
            </Button>

          </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {/* Financial Stats */}
          <div className="col-span-full xl:col-span-2 shadow border  rounded-medium">
            <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-700">Financial Overview</h2>
              </div>
              <p className="text-sm text-gray-500 mb-4">Track your revenue and refunds</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StatCard
                  title="Net Sales"
                  value={formatPrice(data.netSales)}
                  icon={DollarSign}
                  trend="+12.5%"
                  className="bg-green-50 border-green-200"
                  description="Total revenue after refunds"
                />
                <StatCard
                  title="Total Refunds"
                  value={formatPrice(data.totalRefunds)}
                  icon={RefreshCw}
                  trend="-2.3%"
                  className="bg-red-50 border-red-200"
                  description="Amount refunded to customers"
                />
              </div>
            </div>
          </div>

          {/* Purchase Stats */}
          <div className="col-span-full xl:col-span-3  shadow border  rounded-medium">
            <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-700">Purchase Metrics</h2>
              </div>
              <p className="text-sm text-gray-500 mb-4">Monitor purchase activity and customer behavior</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                  title="Active Purchases"
                  value={formatNumber(data.netPurchases)}
                  icon={ShoppingCart}
                  trend="+8.1%"
                  description="Current active purchases"
                />
                <StatCard
                  title="Refunded Purchases"
                  value={formatNumber(data.refundedPurchases)}
                  icon={RefreshCw}
                  trend="-5.2%"
                  description="Total refunded orders"
                />
                <StatCard
                  title="Purchases/User"
                  value={formatNumber(data.averageNetPurchasesPerCustomer)}
                  icon={UserCheck}
                  trend="+3.7%"
                  description="Average purchases per customer"
                />
              </div>
            </div>
          </div>

          {/* Platform Stats */}
          <div className="col-span-full  shadow border  rounded-medium">
            <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-700">Platform Statistics</h2>
              </div>
              <p className="text-sm text-gray-500 mb-4">Overview of platform content and user engagement</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard
                  title="Total Students"
                  value={formatNumber(data.totalStudents)}
                  icon={Users}
                  trend="+15.3%"
                  description="Active enrolled students"
                />
                <StatCard
                  title="Products"
                  value={formatNumber(data.totalProducts)}
                  icon={Package}
                  trend="+2.8%"
                  description="Available products"
                />
                <StatCard
                  title="Courses"
                  value={formatNumber(data.totalCourses)}
                  icon={BookOpen}
                  trend="+4.2%"
                  description="Total active courses"
                />
                <StatCard
                  title="Course Sections"
                  value={formatNumber(data.totalCourseSections)}
                  icon={Folders}
                  trend="+6.7%"
                  description="Course content sections"
                />
                <StatCard
                  title="Lessons"
                  value={formatNumber(data.totalLessons)}
                  icon={FileText}
                  trend="+9.1%"
                  description="Individual lesson content"
                />
              </div>
            </div>
          </div>

          {/* Detailed Tables Section */}
          <div className="col-span-full  shadow border  rounded-medium">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-4">
                  <button
                    className={`px-4 py-2 rounded-lg transition-colors duration-200 ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    onClick={() => setActiveTab('overview')}
                  >
                    Recent Purchases
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg transition-colors duration-200 ${activeTab === 'products' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    onClick={() => setActiveTab('products')}
                  >
                    Top Products
                  </button>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg hover:bg-gray-100">
                    <Filter className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-gray-100">
                    <Download className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {activeTab === 'overview' ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Customer</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Product</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Amount</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recentPurchases.map((purchase) => (
                        <tr key={purchase.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-800">{purchase.customer}</td>
                          <td className="px-4 py-3 text-sm text-gray-800">{purchase.product}</td>
                          <td className="px-4 py-3 text-sm text-gray-800">{formatPrice(purchase.amount)}</td>
                          <td className="px-4 py-3 text-sm text-gray-800">{purchase.date}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${purchase.status === 'completed' ? 'bg-green-100 text-green-800' :
                              purchase.status === 'refunded' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                              {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Product Name</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Total Sales</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Revenue</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.topProducts.map((product, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-800">{product.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-800">{formatNumber(product.sales)}</td>
                          <td className="px-4 py-3 text-sm text-gray-800">{formatPrice(product.revenue)}</td>
                          <td className="px-4 py-3 text-sm text-gray-800">
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-500">★</span>
                              {product.rating}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  trend: string;
  className?: string;
  description?: string;
}

function StatCard({ title, value, icon: Icon, trend, className = '', description }: StatCardProps) {
  const isPositive = trend.startsWith('+');

  return (
    <div className={`rounded-xl border p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-5 h-5 text-gray-600" />
        <span className={`text-sm font-medium flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
          {trend}
          <ArrowUpRight className={`w-4 h-4 ${isPositive ? '' : 'rotate-180'}`} />
        </span>
      </div>
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
      {description && (
        <p className="text-xs text-gray-500 mt-2">{description}</p>
      )}
    </div>
  );
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  }).format(num);
}


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientLayout from '@/components/client/ClientLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Plus, 
  Search, 
  Filter, 
  GraduationCap,
  BookOpen,
  FileText,
  Award,
  Brain,
  PenTool,
  Calculator,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  Eye,
  Edit,
  Sparkles,
  Trophy,
  Target,
  Activity,
  TrendingUp,
  Star,
  BookMarked,
  ArrowUpDown,
  Download,
  MoreHorizontal
} from 'lucide-react';
import { motion } from 'framer-motion';

const Orders = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Enhanced sample data with academic services
  const orders = [
    {
      id: '1',
      orderNumber: 'MEP250001',
      serviceName: 'مراجعة أكاديمية شاملة',
      serviceType: 'academic_review',
      status: 'processing',
      total: 750,
      currency: 'ريال',
      createdAt: '2024-01-20',
      deadline: '2024-02-05',
      description: 'مراجعة شاملة للبحث الأكاديمي مع تقييم المنهجية والتحليل النقدي',
      progress: 65,
      priority: 'high',
      category: 'Research'
    },
    {
      id: '2',
      orderNumber: 'MEP250002', 
      serviceName: 'استشارة أكاديمية متقدمة',
      serviceType: 'consultation',
      status: 'completed',
      total: 1299,
      currency: 'ريال',
      createdAt: '2024-01-18',
      deadline: '2024-01-25',
      description: 'استشارة متخصصة في البحث العلمي والمنهجية مع خطة عمل مفصلة',
      progress: 100,
      priority: 'medium',
      category: 'Consultation'
    },
    {
      id: '3',
      orderNumber: 'MEP250003',
      serviceName: 'تحليل إحصائي متقدم', 
      serviceType: 'statistical_analysis',
      status: 'paid',
      total: 899,
      currency: 'ريال',
      createdAt: '2024-01-15',
      deadline: '2024-02-01',
      description: 'تحليل إحصائي شامل للبيانات البحثية باستخدام SPSS و R',
      progress: 45,
      priority: 'medium',
      category: 'Analysis'
    },
    {
      id: '4',
      orderNumber: 'MEP250004',
      serviceName: 'مراجعة لغوية أكاديمية',
      serviceType: 'language_review',
      status: 'draft',
      total: 450,
      currency: 'ريال',
      createdAt: '2024-01-12',
      deadline: '2024-01-30',
      description: 'مراجعة لغوية ونحوية متخصصة للنص الأكاديمي مع تحسين الأسلوب',
      progress: 20,
      priority: 'low',
      category: 'Language'
    },
    {
      id: '5',
      orderNumber: 'MEP250005',
      serviceName: 'تصميم إطار نظري',
      serviceType: 'theoretical_framework',
      status: 'pending',
      total: 1100,
      currency: 'ريال',
      createdAt: '2024-01-10',
      deadline: '2024-02-10',
      description: 'تطوير إطار نظري شامل للدراسة مع مراجعة الأدبيات ذات الصلة',
      progress: 0,
      priority: 'high',
      category: 'Theory'
    }
  ];

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'academic_review': return GraduationCap;
      case 'consultation': return Brain;
      case 'statistical_analysis': return Calculator;
      case 'language_review': return PenTool;
      case 'theoretical_framework': return BookOpen;
      default: return FileText;
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'processing': return {
        label: 'قيد المعالجة',
        color: 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white',
        icon: Activity,
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700'
      };
      case 'completed': return {
        label: 'مكتمل',
        color: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white',
        icon: CheckCircle,
        bgColor: 'bg-green-50',
        textColor: 'text-green-700'
      };
      case 'paid': return {
        label: 'مدفوع',
        color: 'bg-gradient-to-r from-purple-500 to-violet-600 text-white',
        icon: Trophy,
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-700'
      };
      case 'draft': return {
        label: 'مسودة',
        color: 'bg-gradient-to-r from-gray-500 to-slate-600 text-white',
        icon: Edit,
        bgColor: 'bg-gray-50',
        textColor: 'text-gray-700'
      };
      case 'pending': return {
        label: 'في الانتظار',
        color: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white',
        icon: Clock,
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-700'
      };
      default: return {
        label: status,
        color: 'bg-gradient-to-r from-gray-500 to-slate-600 text-white',
        icon: AlertCircle,
        bgColor: 'bg-gray-50',
        textColor: 'text-gray-700'
      };
    }
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'high': return {
        label: 'عالية',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      };
      case 'medium': return {
        label: 'متوسطة',
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200'
      };
      case 'low': return {
        label: 'منخفضة',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      };
      default: return {
        label: priority,
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200'
      };
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const sortedOrders = [...orders].sort((a, b) => {
    let aValue = a[sortBy as keyof typeof a];
    let bValue = b[sortBy as keyof typeof b];
    
    if (sortBy === 'createdAt') {
      aValue = new Date(a.createdAt).getTime();
      bValue = new Date(b.createdAt).getTime();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const filteredOrders = sortedOrders.filter(order => {
    const matchesSearch = order.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statsData = {
    total: orders.length,
    completed: orders.filter(o => o.status === 'completed').length,
    processing: orders.filter(o => o.status === 'processing').length,
    totalValue: orders.reduce((sum, order) => sum + order.total, 0)
  };

  return (
    <ClientLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 lg:p-6" dir="rtl">
        {/* Academic Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-2xl lg:rounded-[2rem] bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 p-6 lg:p-12 text-white mb-6 lg:mb-8 shadow-2xl"
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"
            />
            <motion.div
              animate={{ rotate: [360, 0], scale: [1.1, 1, 1.1] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"
            />
          </div>
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between mb-8">
              <div className="flex items-center mb-4 lg:mb-0">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 1, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 lg:w-20 lg:h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center ml-4 lg:ml-6 shadow-2xl border border-white/30"
                >
                  <BookMarked className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                </motion.div>
                <div>
                  <motion.h1 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-3xl lg:text-6xl font-black mb-2 leading-tight"
                  >
                    سجل الطلبات الأكاديمية
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="text-white/90 text-lg lg:text-xl font-medium"
                  >
                    إدارة وتتبع جميع مشاريعك البحثية والأكاديمية
                  </motion.p>
                </div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="flex gap-4"
              >
                <Button 
                  size="lg"
                  className="bg-white text-indigo-600 hover:bg-white/95 font-bold shadow-xl px-8 py-4 text-lg rounded-xl"
                  onClick={() => navigate('/orders/new')}
                >
                  <Plus className="w-5 h-5 ml-2" />
                  مشروع جديد
                </Button>
              </motion.div>
            </div>

            {/* Enhanced Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
            >
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm font-medium">إجمالي المشاريع</p>
                    <p className="text-2xl lg:text-3xl font-black text-white">{statsData.total}</p>
                  </div>
                  <Trophy className="w-8 h-8 text-white/80" />
                </div>
              </div>
              
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm font-medium">مكتملة</p>
                    <p className="text-2xl lg:text-3xl font-black text-white">{statsData.completed}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-white/80" />
                </div>
              </div>
              
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm font-medium">قيد المعالجة</p>
                    <p className="text-2xl lg:text-3xl font-black text-white">{statsData.processing}</p>
                  </div>
                  <Activity className="w-8 h-8 text-white/80" />
                </div>
              </div>
              
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm font-medium">القيمة الإجمالية</p>
                    <p className="text-lg lg:text-xl font-black text-white">{statsData.totalValue.toLocaleString()} ر.س</p>
                  </div>
                  <Star className="w-8 h-8 text-white/80" />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Advanced Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute right-4 top-4 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="البحث في المشاريع أو أرقام الطلبات..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-12 h-12 text-lg border-2 focus:border-primary/50 rounded-xl"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48 h-12 border-2 rounded-xl">
                      <Filter className="w-5 h-5 ml-2" />
                      <SelectValue placeholder="حالة المشروع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="draft">مسودة</SelectItem>
                      <SelectItem value="pending">في الانتظار</SelectItem>
                      <SelectItem value="processing">قيد المعالجة</SelectItem>
                      <SelectItem value="paid">مدفوع</SelectItem>
                      <SelectItem value="completed">مكتمل</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
              <CardTitle className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-indigo-600" />
                جدول المشاريع الأكاديمية
                <Badge variant="secondary" className="mr-auto">
                  {filteredOrders.length} مشروع
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {filteredOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-slate-50 to-gray-50 hover:bg-slate-100">
                        <TableHead className="text-right font-bold text-gray-900 p-4">
                          <Button 
                            variant="ghost" 
                            onClick={() => handleSort('serviceName')}
                            className="font-bold text-gray-900 hover:text-indigo-600"
                          >
                            اسم الخدمة
                            <ArrowUpDown className="w-4 h-4 mr-2" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-center font-bold text-gray-900 p-4">رقم الطلب</TableHead>
                        <TableHead className="text-center font-bold text-gray-900 p-4">
                          <Button 
                            variant="ghost" 
                            onClick={() => handleSort('status')}
                            className="font-bold text-gray-900 hover:text-indigo-600"
                          >
                            الحالة
                            <ArrowUpDown className="w-4 h-4 mr-2" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-center font-bold text-gray-900 p-4">الأولوية</TableHead>
                        <TableHead className="text-center font-bold text-gray-900 p-4">
                          <Button 
                            variant="ghost" 
                            onClick={() => handleSort('total')}
                            className="font-bold text-gray-900 hover:text-indigo-600"
                          >
                            القيمة
                            <ArrowUpDown className="w-4 h-4 mr-2" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-center font-bold text-gray-900 p-4">التقدم</TableHead>
                        <TableHead className="text-center font-bold text-gray-900 p-4">
                          <Button 
                            variant="ghost" 
                            onClick={() => handleSort('createdAt')}
                            className="font-bold text-gray-900 hover:text-indigo-600"
                          >
                            تاريخ الإنشاء
                            <ArrowUpDown className="w-4 h-4 mr-2" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-center font-bold text-gray-900 p-4">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order, index) => {
                        const ServiceIcon = getServiceIcon(order.serviceType);
                        const statusConfig = getStatusConfig(order.status);
                        const priorityConfig = getPriorityConfig(order.priority);
                        
                        return (
                          <motion.tr
                            key={order.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="border-b hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 group"
                          >
                            <TableCell className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                                  <ServiceIcon className="w-5 h-5 text-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="font-bold text-gray-900 truncate">{order.serviceName}</p>
                                  <p className="text-sm text-gray-600 truncate">{order.category}</p>
                                </div>
                              </div>
                            </TableCell>
                            
                            <TableCell className="p-4 text-center">
                              <Badge variant="outline" className="font-mono font-bold bg-slate-50 border-slate-200">
                                {order.orderNumber}
                              </Badge>
                            </TableCell>
                            
                            <TableCell className="p-4 text-center">
                              <Badge className={`${statusConfig.color} border-0 shadow-sm px-3 py-1`}>
                                {statusConfig.label}
                              </Badge>
                            </TableCell>
                            
                            <TableCell className="p-4 text-center">
                              <Badge 
                                variant="outline"
                                className={`${priorityConfig.bgColor} ${priorityConfig.color} ${priorityConfig.borderColor} border font-medium px-3 py-1`}
                              >
                                {priorityConfig.label}
                              </Badge>
                            </TableCell>
                            
                            <TableCell className="p-4 text-center">
                              <div className="font-bold text-lg text-indigo-600">
                                {order.total.toLocaleString()} {order.currency}
                              </div>
                            </TableCell>
                            
                            <TableCell className="p-4 text-center">
                              <div className="flex flex-col items-center gap-2">
                                <div className="w-full max-w-20 bg-gray-200 rounded-full h-2 overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300"
                                    style={{ width: `${order.progress}%` }}
                                  />
                                </div>
                                <span className="text-sm font-bold text-indigo-600">{order.progress}%</span>
                              </div>
                            </TableCell>
                            
                            <TableCell className="p-4 text-center">
                              <div className="flex flex-col items-center gap-1">
                                <span className="font-semibold text-gray-900">{order.createdAt}</span>
                                <span className="text-xs text-gray-500">الموعد: {order.deadline}</span>
                              </div>
                            </TableCell>
                            
                            <TableCell className="p-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => navigate(`/orders/${order.id}`)}
                                  className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                
                                {order.status === 'draft' && (
                                  <Button
                                    size="sm"
                                    onClick={() => navigate(`/orders/${order.id}/edit`)}
                                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </motion.tr>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, type: "spring" }}
                    className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <Search className="w-12 h-12 text-indigo-400" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">لا توجد مشاريع</h3>
                  <p className="text-gray-600 text-lg mb-6">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'لم يتم العثور على مشاريع تطابق معايير البحث'
                      : 'لم تقم بإنشاء أي مشاريع أكاديمية بعد'
                    }
                  </p>
                  
                  {!searchTerm && statusFilter === 'all' && (
                    <Button 
                      size="lg"
                      onClick={() => navigate('/orders/new')}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold px-8 py-4 text-lg rounded-xl shadow-lg"
                    >
                      <Plus className="w-5 h-5 ml-2" />
                      ابدأ مشروعك الأول
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Floating Action Button */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, delay: 1, type: "spring", stiffness: 200 }}
          className="fixed bottom-6 left-6 z-50"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              size="lg"
              className="rounded-full w-16 h-16 shadow-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border-4 border-white"
              onClick={() => navigate('/orders/new')}
            >
              <Plus className="w-7 h-7" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </ClientLayout>
  );
};

export default Orders;
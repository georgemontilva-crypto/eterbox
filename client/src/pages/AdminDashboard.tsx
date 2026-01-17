import { useState, useEffect } from 'react';
import { trpc } from '../lib/trpc';
import { useLocation } from 'wouter';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import {
  Users, DollarSign, TrendingUp, Activity, Mail, Shield,
  Settings, UserPlus, Calendar, AlertCircle, CheckCircle, XCircle,
  Edit, Trash2, Send, Clock, Eye, Ban, Check, X, ArrowLeft, Search
} from 'lucide-react';
import { toast } from 'sonner';

type Period = 'day' | 'week' | 'month' | 'year';

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [period, setPeriod] = useState<Period>('month');
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'revenue' | 'admins'>('overview');

  // Check if user is admin
  const { data: adminCheck, isLoading: checkingAdmin } = trpc.admin.isAdmin.useQuery();

  // Get analytics data
  const { data: analytics, isLoading: loadingAnalytics } = trpc.admin.getAnalytics.useQuery(
    { period },
    { enabled: !!adminCheck?.isAdmin }
  );

  // Get all plans
  const { data: plans } = trpc.plans.list.useQuery();

  // Redirect if not admin
  useEffect(() => {
    if (!checkingAdmin && adminCheck) {
      if (adminCheck.isAdmin === false) {
        console.log('[AdminDashboard] User is not admin, redirecting to 404');
        setLocation('/404');
      }
    }
  }, [adminCheck, checkingAdmin, setLocation]);

  if (checkingAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-accent/20 border-t-accent mx-auto mb-4"></div>
            <Shield className="w-6 h-6 text-accent absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-muted-foreground font-medium">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // If adminCheck loaded but user is not admin, redirect
  if (adminCheck && adminCheck.isAdmin === false) {
    setLocation('/404');
    return null;
  }

  // If adminCheck is still loading or undefined, show loading
  if (!adminCheck || !adminCheck.isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-accent/20 border-t-accent mx-auto mb-4"></div>
            <Shield className="w-6 h-6 text-accent absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-muted-foreground font-medium">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Premium Header with Glassmorphism */}
      <header className="border-b border-border/20 bg-card/80 backdrop-blur-xl sticky top-0 z-50 shadow-lg shadow-black/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center shadow-lg shadow-accent/30 ring-2 ring-accent/20">
                <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Panel de Administración
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">EterBox Admin Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as Period)}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 bg-background/50 backdrop-blur-sm border border-border/20 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all hover:bg-background/80"
              >
                <option value="day">Último día</option>
                <option value="week">Última semana</option>
                <option value="month">Último mes</option>
                <option value="year">Último año</option>
              </select>
              <button
                onClick={() => setLocation('/dashboard')}
                className="flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-accent to-accent/90 text-white rounded-xl hover:shadow-lg hover:shadow-accent/30 transition-all font-medium text-sm whitespace-nowrap"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Volver</span>
              </button>
            </div>
          </div>

          {/* Premium Tabs with Gradient Active State */}
          <div className="flex gap-2 mt-4 sm:mt-6 overflow-x-auto scrollbar-hide pb-2">
            {[
              { id: 'overview', label: 'Resumen', icon: Activity },
              { id: 'users', label: 'Usuarios', icon: Users },
              { id: 'revenue', label: 'Ingresos', icon: DollarSign },
              { id: 'admins', label: 'Admins', icon: Shield },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-all whitespace-nowrap font-medium text-sm ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-accent to-accent/90 text-white shadow-lg shadow-accent/30 scale-105'
                    : 'bg-card/50 backdrop-blur-sm hover:bg-card border border-border/20 hover:border-accent/30 hover:scale-105'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {loadingAnalytics ? (
          <div className="text-center py-16 sm:py-20">
            <div className="relative inline-block">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-accent/20 border-t-accent"></div>
              <Activity className="w-6 h-6 text-accent absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-muted-foreground mt-4 font-medium">Cargando datos...</p>
          </div>
        ) : activeTab === 'overview' ? (
          <OverviewTab analytics={analytics} period={period} colors={COLORS} />
        ) : activeTab === 'users' ? (
          <UsersTab />
        ) : activeTab === 'revenue' ? (
          <RevenueTab period={period} colors={COLORS} />
        ) : (
          <AdminsTab permissions={adminCheck.permissions} />
        )}
      </main>
    </div>
  );
}

// Premium Overview Tab with Modern Stats Cards
function OverviewTab({ analytics, period, colors }: any) {
  if (!analytics) return <div className="text-center py-12">No hay datos disponibles</div>;

  const stats = [
    {
      title: 'Total Usuarios',
      value: analytics.totalUsers,
      change: `+${analytics.newUsers} nuevos`,
      icon: Users,
      gradient: 'from-blue-500 via-blue-600 to-blue-700',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-500',
      ringColor: 'ring-blue-500/20',
    },
    {
      title: 'Ingresos Totales',
      value: `$${analytics.totalRevenue.toFixed(2)}`,
      change: `+$${analytics.periodRevenue.toFixed(2)} este período`,
      icon: DollarSign,
      gradient: 'from-green-500 via-green-600 to-green-700',
      bgColor: 'bg-green-500/10',
      textColor: 'text-green-500',
      ringColor: 'ring-green-500/20',
    },
    {
      title: 'Suscripciones Activas',
      value: analytics.activeSubscriptions,
      change: `${((analytics.activeSubscriptions / analytics.totalUsers) * 100).toFixed(1)}% del total`,
      icon: TrendingUp,
      gradient: 'from-purple-500 via-purple-600 to-purple-700',
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-500',
      ringColor: 'ring-purple-500/20',
    },
    {
      title: 'Nuevos Registros',
      value: analytics.newUsers,
      change: `En el último ${period === 'day' ? 'día' : period === 'week' ? 'semana' : period === 'month' ? 'mes' : 'año'}`,
      icon: UserPlus,
      gradient: 'from-orange-500 via-orange-600 to-orange-700',
      bgColor: 'bg-orange-500/10',
      textColor: 'text-orange-500',
      ringColor: 'ring-orange-500/20',
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Premium Stats Grid with Hover Effects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="group bg-card/50 backdrop-blur-sm border border-border/20 rounded-2xl p-5 sm:p-6 hover:shadow-2xl hover:shadow-accent/10 hover:scale-105 hover:border-accent/30 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg ring-2 ${stat.ringColor} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-1 font-medium">{stat.title}</p>
            <h3 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {stat.value}
            </h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Grid with Premium Design */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Daily Registrations Chart */}
        <div className="bg-card/50 backdrop-blur-sm border border-border/20 rounded-2xl p-5 sm:p-6 hover:shadow-xl hover:shadow-accent/5 transition-all">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h3 className="text-base sm:text-lg font-bold">Registros Diarios</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Evolución de nuevos usuarios</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg ring-2 ring-blue-500/20">
              <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={analytics.dailyRegistrations}>
              <defs>
                <linearGradient id="colorRegistrations" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.2} />
              <XAxis dataKey="date" stroke="#888" fontSize={11} />
              <YAxis stroke="#888" fontSize={11} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Area type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRegistrations)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Users by Plan Chart */}
        <div className="bg-card/50 backdrop-blur-sm border border-border/20 rounded-2xl p-5 sm:p-6 hover:shadow-xl hover:shadow-accent/5 transition-all">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h3 className="text-base sm:text-lg font-bold">Usuarios por Plan</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Distribución de suscripciones</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg ring-2 ring-purple-500/20">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={analytics.usersByPlan}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {analytics.usersByPlan.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue Over Time Chart - Full Width */}
      <div className="bg-card/50 backdrop-blur-sm border border-border/20 rounded-2xl p-5 sm:p-6 hover:shadow-xl hover:shadow-accent/5 transition-all">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h3 className="text-base sm:text-lg font-bold">Ingresos en el Tiempo</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">Evolución de ingresos diarios</p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg ring-2 ring-green-500/20">
            <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={analytics.dailyRevenue}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.2} />
            <XAxis dataKey="date" stroke="#888" fontSize={11} />
            <YAxis stroke="#888" fontSize={11} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--card)', 
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }} 
            />
            <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Premium Users Tab with Enhanced Table
function UsersTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlan, setFilterPlan] = useState('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'restricted'>('all');

  const { data: users, isLoading } = trpc.admin.listUsers.useQuery();
  const { data: plans } = trpc.plans.list.useQuery();
  const updateUserMutation = trpc.admin.updateUser.useMutation();
  const deleteUserMutation = trpc.admin.deleteUser.useMutation();
  const utils = trpc.useUtils();

  const handleChangePlan = async (userId: number, planId: number) => {
    try {
      await updateUserMutation.mutateAsync({ userId, planId });
      await utils.admin.listUsers.invalidate();
      toast.success('Plan actualizado correctamente');
    } catch (error) {
      toast.error('Error al actualizar el plan');
    }
  };

  const handleRestrictUser = async (userId: number) => {
    try {
      await updateUserMutation.mutateAsync({ userId, isRestricted: true });
      await utils.admin.listUsers.invalidate();
      toast.success('Usuario restringido correctamente');
    } catch (error) {
      toast.error('Error al restringir usuario');
    }
  };

  const handleApproveUser = async (userId: number) => {
    try {
      await updateUserMutation.mutateAsync({ userId, isRestricted: false });
      await utils.admin.listUsers.invalidate();
      toast.success('Usuario aprobado correctamente');
    } catch (error) {
      toast.error('Error al aprobar usuario');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) return;
    
    try {
      await deleteUserMutation.mutateAsync({ userId });
      await utils.admin.listUsers.invalidate();
      toast.success('Usuario eliminado correctamente');
    } catch (error) {
      toast.error('Error al eliminar usuario');
    }
  };

  const handleExportEmails = () => {
    if (!users || users.length === 0) {
      toast.error('No hay usuarios para exportar');
      return;
    }

    // Create CSV content
    const csvHeader = 'Name,Email,Plan,Status,Created At\n';
    const csvRows = users.map((user: any) => {
      const name = (user.name || '').replace(/,/g, ' ');
      const email = user.email || '';
      const plan = user.plan_name || 'Free';
      const status = user.is_restricted ? 'Restricted' : 'Active';
      const createdAt = user.created_at ? new Date(user.created_at).toLocaleDateString('es-ES') : '';
      return `${name},${email},${plan},${status},${createdAt}`;
    }).join('\n');
    
    const csvContent = csvHeader + csvRows;
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `eterbox-users-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`${users.length} emails exportados correctamente`);
  };

  const filteredUsers = users?.filter((user: any) => {
    const matchesSearch = (user.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                         (user.email?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesPlan = filterPlan === 'all' || user.plan_name?.toLowerCase() === filterPlan;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && !user.is_restricted) ||
                         (filterStatus === 'restricted' && user.is_restricted);
    return matchesSearch && matchesPlan && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="text-center py-16">
        <div className="relative inline-block">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-accent/20 border-t-accent"></div>
          <Users className="w-6 h-6 text-accent absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-muted-foreground mt-4 font-medium">Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Premium Filters */}
      <div className="bg-card/50 backdrop-blur-sm border border-border/20 rounded-2xl p-5 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Nombre o email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-background/50 border border-border/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Plan</label>
            <select
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value)}
              className="w-full px-4 py-2.5 bg-background/50 border border-border/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent transition-all"
            >
              <option value="all">Todos los planes</option>
              {plans?.map((plan) => (
                <option key={plan.id} value={plan.name.toLowerCase()}>
                  {plan.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Estado</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full px-4 py-2.5 bg-background/50 border border-border/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent transition-all"
            >
              <option value="all">Todos</option>
              <option value="active">Activos</option>
              <option value="restricted">Restringidos</option>
            </select>
          </div>
        </div>
        
        {/* Export Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleExportEmails}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/30 transition-all font-semibold"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Exportar Emails ({users?.length || 0})
          </button>
        </div>
      </div>

      {/* Premium Users Table */}
      <div className="bg-card/50 backdrop-blur-sm border border-border/20 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30 backdrop-blur-sm border-b border-border/20">
              <tr>
                <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-bold">Usuario</th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-bold hidden sm:table-cell">Plan</th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-bold hidden md:table-cell">Días Restantes</th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-bold">Estado</th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-bold hidden lg:table-cell">Registro</th>
                <th className="px-4 sm:px-6 py-4 text-right text-xs sm:text-sm font-bold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {filteredUsers?.map((user: any) => (
                <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 sm:px-6 py-4">
                    <div>
                      <p className="font-semibold text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                    <select
                      value={user.plan_id}
                      onChange={(e) => handleChangePlan(user.id, parseInt(e.target.value))}
                      className="px-3 py-1.5 bg-background/50 border border-border/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                      disabled={updateUserMutation.isPending}
                    >
                      {plans?.map((plan) => (
                        <option key={plan.id} value={plan.id}>
                          {plan.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                    {user.days_remaining !== null && user.days_remaining !== undefined ? (
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                        user.days_remaining <= 3 ? 'bg-red-500/10 text-red-500 ring-1 ring-red-500/20' :
                        user.days_remaining <= 7 ? 'bg-orange-500/10 text-orange-500 ring-1 ring-orange-500/20' :
                        'bg-green-500/10 text-green-500 ring-1 ring-green-500/20'
                      }`}>
                        <Clock className="w-3 h-3" />
                        {user.days_remaining} días
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">Sin límite</span>
                    )}
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    {user.is_restricted ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-500 rounded-lg text-xs font-semibold ring-1 ring-red-500/20">
                        <Ban className="w-3 h-3" />
                        <span className="hidden sm:inline">Restringido</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-500 rounded-lg text-xs font-semibold ring-1 ring-green-500/20">
                        <CheckCircle className="w-3 h-3" />
                        <span className="hidden sm:inline">Activo</span>
                      </span>
                    )}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-muted-foreground hidden lg:table-cell">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString('es-ES') : 'N/A'}
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {user.is_restricted ? (
                        <button
                          onClick={() => handleApproveUser(user.id)}
                          disabled={updateUserMutation.isPending}
                          className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded-lg transition-all disabled:opacity-50 hover:scale-110 ring-1 ring-green-500/20"
                          title="Aprobar usuario"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRestrictUser(user.id)}
                          disabled={updateUserMutation.isPending}
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-all disabled:opacity-50 hover:scale-110 ring-1 ring-red-500/20"
                          title="Restringir usuario"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={deleteUserMutation.isPending}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-all disabled:opacity-50 hover:scale-110 ring-1 ring-red-500/20"
                        title="Eliminar usuario"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers?.length === 0 && (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">No se encontraron usuarios</p>
          </div>
        )}
      </div>
    </div>
  );
}


// Premium Revenue Tab with Enhanced Charts
function RevenueTab({ period, colors }: any) {
  const { data: revenueData, isLoading } = trpc.admin.getRevenue.useQuery({ period });
  const { data: transactions } = trpc.admin.getTransactions.useQuery({ limit: 50 });

  if (isLoading) {
    return (
      <div className="text-center py-16">
        <div className="relative inline-block">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-accent/20 border-t-accent"></div>
          <DollarSign className="w-6 h-6 text-accent absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-muted-foreground mt-4 font-medium">Cargando datos de ingresos...</p>
      </div>
    );
  }

  if (!revenueData) {
    return <div className="text-center py-12">No hay datos disponibles</div>;
  }

  const growthPercentage = revenueData.summary.growth_percentage || 0;
  const isPositiveGrowth = growthPercentage >= 0;

  return (
    <div className="space-y-6">
      {/* Premium Revenue Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="group bg-card/50 backdrop-blur-sm border border-border/20 rounded-2xl p-5 sm:p-6 hover:shadow-xl hover:shadow-green-500/10 hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg ring-2 ring-green-500/20 group-hover:scale-110 transition-transform">
              <DollarSign className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mb-1 font-medium">Ingresos Totales</p>
          <h3 className="text-2xl sm:text-3xl font-bold text-green-500 mb-2">
            ${parseFloat(revenueData.summary.total_amount || '0').toFixed(2)}
          </h3>
          <div className={`flex items-center gap-1 text-xs sm:text-sm font-semibold ${isPositiveGrowth ? 'text-green-500' : 'text-red-500'}`}>
            <TrendingUp className={`w-4 h-4 ${!isPositiveGrowth && 'rotate-180'}`} />
            {Math.abs(growthPercentage).toFixed(1)}% vs período anterior
          </div>
        </div>

        <div className="group bg-card/50 backdrop-blur-sm border border-border/20 rounded-2xl p-5 sm:p-6 hover:shadow-xl hover:shadow-blue-500/10 hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg ring-2 ring-blue-500/20 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mb-1 font-medium">Total Transacciones</p>
          <h3 className="text-2xl sm:text-3xl font-bold mb-2">{revenueData.summary.total_transactions}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">En el período seleccionado</p>
        </div>

        <div className="group bg-card/50 backdrop-blur-sm border border-border/20 rounded-2xl p-5 sm:p-6 hover:shadow-xl hover:shadow-purple-500/10 hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg ring-2 ring-purple-500/20 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mb-1 font-medium">Promedio por Transacción</p>
          <h3 className="text-2xl sm:text-3xl font-bold text-purple-500 mb-2">
            ${parseFloat(revenueData.summary.average_amount || '0').toFixed(2)}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">Ticket promedio</p>
        </div>

        <div className="group bg-card/50 backdrop-blur-sm border border-border/20 rounded-2xl p-5 sm:p-6 hover:shadow-xl hover:shadow-orange-500/10 hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg ring-2 ring-orange-500/20 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mb-1 font-medium">Ingresos Hoy</p>
          <h3 className="text-2xl sm:text-3xl font-bold text-orange-500 mb-2">
            ${parseFloat(revenueData.summary.today_revenue || '0').toFixed(2)}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">Últimas 24 horas</p>
        </div>
      </div>

      {/* Premium Revenue Chart */}
      <div className="bg-card/50 backdrop-blur-sm border border-border/20 rounded-2xl p-5 sm:p-6 hover:shadow-xl hover:shadow-accent/5 transition-all">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h3 className="text-base sm:text-lg font-bold">Ingresos en el Tiempo</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">Evolución de ingresos y transacciones</p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg ring-2 ring-green-500/20">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={revenueData.daily}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorTransactions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.2} />
            <XAxis dataKey="date" stroke="#888" fontSize={11} />
            <YAxis stroke="#888" fontSize={11} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--card)', 
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }} 
            />
            <Legend />
            <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" name="Ingresos ($)" />
            <Area type="monotone" dataKey="transactions" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorTransactions)" name="Transacciones" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Premium Transactions Table */}
      <div className="bg-card/50 backdrop-blur-sm border border-border/20 rounded-2xl overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-border/20">
          <h3 className="text-base sm:text-lg font-bold">Transacciones Recientes</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">Últimas 50 transacciones</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30 backdrop-blur-sm border-b border-border/20">
              <tr>
                <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-bold">Usuario</th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-bold hidden sm:table-cell">Plan</th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-bold">Monto</th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-bold hidden md:table-cell">Fecha</th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-bold">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {transactions?.map((transaction: any) => (
                <tr key={transaction.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 sm:px-6 py-4">
                    <div>
                      <p className="font-semibold text-sm">{transaction.user_name}</p>
                      <p className="text-xs text-muted-foreground">{transaction.user_email}</p>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                    <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-accent/10 text-accent ring-1 ring-accent/20">
                      {transaction.plan_name}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className="font-bold text-green-500">${parseFloat(transaction.amount).toFixed(2)}</span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-muted-foreground hidden md:table-cell">
                    {new Date(transaction.created_at).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-500 rounded-lg text-xs font-semibold ring-1 ring-green-500/20">
                      <CheckCircle className="w-3 h-3" />
                      <span className="hidden sm:inline">Completado</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {transactions?.length === 0 && (
          <div className="text-center py-16">
            <DollarSign className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">No hay transacciones</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AdminsTab({ permissions }: any) {
  const [email, setEmail] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  
  // Check if user can manage admins (either super admin or has can_manage_admins permission)
  const canManageAdmins = permissions?.is_super_admin || permissions?.can_manage_admins || false;

  const { data: admins } = trpc.admin.listAdmins.useQuery();
  const addAdminMutation = trpc.admin.addAdmin.useMutation();
  const removeAdminMutation = trpc.admin.removeAdmin.useMutation();
  const utils = trpc.useUtils();

  const availablePermissions = [
    { id: 'manage_users', label: 'Gestionar Usuarios', description: 'Crear, editar y eliminar usuarios' },
    { id: 'manage_plans', label: 'Gestionar Planes', description: 'Modificar planes y precios' },
    { id: 'view_analytics', label: 'Ver Analíticas', description: 'Acceso a estadísticas y reportes' },
    { id: 'manage_admins', label: 'Gestionar Admins', description: 'Agregar y remover administradores' },
  ];

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || selectedPermissions.length === 0) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    // Convert array of permission IDs to permission object
    const permissionsObject = {
      can_view_users: selectedPermissions.includes('manage_users'),
      can_edit_users: selectedPermissions.includes('manage_users'),
      can_delete_users: selectedPermissions.includes('manage_users'),
      can_view_analytics: selectedPermissions.includes('view_analytics'),
      can_send_bulk_emails: selectedPermissions.includes('send_emails'),
      can_view_revenue: selectedPermissions.includes('manage_plans'),
      can_manage_admins: selectedPermissions.includes('manage_admins'),
    };

    try {
      await addAdminMutation.mutateAsync({
        email,
        permissions: permissionsObject,
      });
      await utils.admin.listAdmins.invalidate();
      toast.success('Administrador agregado correctamente');
      setEmail('');
      setSelectedPermissions([]);
    } catch (error) {
      toast.error('Error al agregar administrador');
    }
  };

  const handleRemoveAdmin = async (userId: number) => {
    if (!confirm('¿Estás seguro de que quieres remover este administrador?')) return;
    
    try {
      await removeAdminMutation.mutateAsync({ userId });
      await utils.admin.listAdmins.invalidate();
      toast.success('Administrador removido correctamente');
    } catch (error) {
      toast.error('Error al remover administrador');
    }
  };

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(p => p !== permissionId)
        : [...prev, permissionId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Premium Add Admin Form */}
      {canManageAdmins && (
        <div className="bg-card/50 backdrop-blur-sm border border-border/20 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg ring-2 ring-purple-500/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Agregar Administrador</h3>
              <p className="text-sm text-muted-foreground">Otorga permisos de administrador</p>
            </div>
          </div>

          <form onSubmit={handleAddAdmin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Email del Usuario</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@ejemplo.com"
                className="w-full px-4 py-2.5 bg-background/50 border border-border/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3">Permisos</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availablePermissions.map((perm) => (
                  <div
                    key={perm.id}
                    onClick={() => togglePermission(perm.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedPermissions.includes(perm.id)
                        ? 'border-accent bg-accent/10 ring-2 ring-accent/20'
                        : 'border-border/20 hover:border-accent/30 bg-background/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center mt-0.5 transition-colors ${
                        selectedPermissions.includes(perm.id)
                          ? 'border-accent bg-accent'
                          : 'border-border/40'
                      }`}>
                        {selectedPermissions.includes(perm.id) && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{perm.label}</p>
                        <p className="text-xs text-muted-foreground">{perm.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={addAdminMutation.isPending}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-accent to-accent/90 text-white rounded-xl hover:shadow-lg hover:shadow-accent/30 transition-all font-semibold disabled:opacity-50"
            >
              <UserPlus className="w-5 h-5" />
              {addAdminMutation.isPending ? 'Agregando...' : 'Agregar Administrador'}
            </button>
          </form>
        </div>
      )}

      {/* Premium Admins List */}
      <div className="bg-card/50 backdrop-blur-sm border border-border/20 rounded-2xl overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-border/20">
          <h3 className="text-lg font-bold">Administradores Actuales</h3>
          <p className="text-sm text-muted-foreground">Lista de usuarios con permisos administrativos</p>
        </div>
        <div className="divide-y divide-border/10">
          {admins?.map((admin: any) => (
            <div key={admin.id} className="p-5 sm:p-6 hover:bg-muted/20 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center shadow-lg ring-2 ring-accent/20">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">{admin.name}</p>
                      <p className="text-sm text-muted-foreground">{admin.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {admin.permissions?.map((perm: string) => (
                      <span key={perm} className="inline-flex items-center px-3 py-1 bg-accent/10 text-accent rounded-lg text-xs font-semibold ring-1 ring-accent/20">
                        {availablePermissions.find(p => p.id === perm)?.label || perm}
                      </span>
                    ))}
                  </div>
                </div>
                {canManageAdmins && (
                  <button
                    onClick={() => handleRemoveAdmin(admin.id)}
                    disabled={removeAdminMutation.isPending}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-all disabled:opacity-50 hover:scale-110 ring-1 ring-red-500/20"
                    title="Remover administrador"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        {admins?.length === 0 && (
          <div className="text-center py-16">
            <Shield className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">No hay administradores</p>
          </div>
        )}
      </div>
    </div>
  );
}

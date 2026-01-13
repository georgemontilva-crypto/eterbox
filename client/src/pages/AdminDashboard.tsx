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
  Edit, Trash2, Send, Clock, Eye, Ban, Check, X
} from 'lucide-react';
import { toast } from 'sonner';

type Period = 'day' | 'week' | 'month' | 'year';

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [period, setPeriod] = useState<Period>('month');
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'revenue' | 'emails' | 'admins'>('overview');

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando permisos...</p>
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/20 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Panel de Administración</h1>
                <p className="text-sm text-muted-foreground">EterBox Admin Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as Period)}
                className="px-4 py-2 bg-background border border-border/20 rounded-[15px] text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              >
                <option value="day">Último día</option>
                <option value="week">Última semana</option>
                <option value="month">Último mes</option>
                <option value="year">Último año</option>
              </select>
              <button
                onClick={() => setLocation('/dashboard')}
                className="px-4 py-2 bg-accent text-white rounded-[15px] hover:bg-accent/90 transition-all"
              >
                Volver al Dashboard
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-6 overflow-x-auto scrollbar-hide">
            {[
              { id: 'overview', label: 'Resumen', icon: Activity },
              { id: 'users', label: 'Usuarios', icon: Users },
              { id: 'revenue', label: 'Ingresos', icon: DollarSign },
              { id: 'emails', label: 'Emails Masivos', icon: Mail },
              { id: 'admins', label: 'Administradores', icon: Shield },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-[15px] transition-all whitespace-nowrap font-medium ${
                  activeTab === tab.id
                    ? 'bg-accent text-white shadow-lg shadow-accent/30'
                    : 'bg-card hover:bg-muted border border-border/20'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {loadingAnalytics ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando datos...</p>
          </div>
        ) : activeTab === 'overview' ? (
          <OverviewTab analytics={analytics} period={period} colors={COLORS} />
        ) : activeTab === 'users' ? (
          <UsersTab />
        ) : activeTab === 'revenue' ? (
          <RevenueTab period={period} colors={COLORS} />
        ) : activeTab === 'emails' ? (
          <EmailsTab />
        ) : (
          <AdminsTab permissions={adminCheck.permissions} />
        )}
      </main>
    </div>
  );
}

// Overview Tab Component with Modern Stats Cards
function OverviewTab({ analytics, period, colors }: any) {
  if (!analytics) return <div>No hay datos disponibles</div>;

  const stats = [
    {
      title: 'Total Usuarios',
      value: analytics.totalUsers,
      change: `+${analytics.newUsers} nuevos`,
      icon: Users,
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-500',
    },
    {
      title: 'Ingresos Totales',
      value: `$${analytics.totalRevenue.toFixed(2)}`,
      change: `+$${analytics.periodRevenue.toFixed(2)} este período`,
      icon: DollarSign,
      gradient: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
      textColor: 'text-green-500',
    },
    {
      title: 'Suscripciones Activas',
      value: analytics.activeSubscriptions,
      change: `${((analytics.activeSubscriptions / analytics.totalUsers) * 100).toFixed(1)}% del total`,
      icon: TrendingUp,
      gradient: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-500',
    },
    {
      title: 'Nuevos Registros',
      value: analytics.newUsers,
      change: `En el último ${period === 'day' ? 'día' : period === 'week' ? 'semana' : period === 'month' ? 'mes' : 'año'}`,
      icon: UserPlus,
      gradient: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-500/10',
      textColor: 'text-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Modern Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-card border border-border/20 rounded-[20px] p-6 hover:shadow-lg hover:shadow-accent/10 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-14 h-14 rounded-[15px] ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-7 h-7 ${stat.textColor}`} />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
            <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Registrations Chart */}
        <div className="bg-card border border-border/20 rounded-[20px] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Registros Diarios</h3>
            <div className="w-10 h-10 rounded-[15px] bg-blue-500/10 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analytics.dailyRegistrations}>
              <defs>
                <linearGradient id="colorRegistrations" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
              <XAxis dataKey="date" stroke="#888" fontSize={12} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '12px'
                }} 
              />
              <Area type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorRegistrations)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Users by Plan Chart */}
        <div className="bg-card border border-border/20 rounded-[20px] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Usuarios por Plan</h3>
            <div className="w-10 h-10 rounded-[15px] bg-purple-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-500" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.usersByPlan}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
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
                  padding: '12px'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Revenue Chart */}
        <div className="bg-card border border-border/20 rounded-[20px] p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Ingresos Diarios</h3>
            <div className="w-10 h-10 rounded-[15px] bg-green-500/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.dailyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
              <XAxis dataKey="date" stroke="#888" fontSize={12} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '12px'
                }} 
              />
              <Legend />
              <Bar dataKey="amount" fill="#10b981" radius={[8, 8, 0, 0]} name="Ingresos ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card border border-border/20 rounded-[20px] p-6">
        <h3 className="text-lg font-semibold mb-4">Actividad Reciente</h3>
        <div className="space-y-3">
          {analytics.recentActivity?.slice(0, 5).map((activity: any, index: number) => (
            <div key={index} className="flex items-center gap-4 p-3 bg-muted/50 rounded-[15px]">
              <div className={`w-10 h-10 rounded-[10px] ${
                activity.type === 'registration' ? 'bg-blue-500/10' :
                activity.type === 'payment' ? 'bg-green-500/10' :
                'bg-purple-500/10'
              } flex items-center justify-center`}>
                {activity.type === 'registration' ? <UserPlus className="w-5 h-5 text-blue-500" /> :
                 activity.type === 'payment' ? <DollarSign className="w-5 h-5 text-green-500" /> :
                 <Activity className="w-5 h-5 text-purple-500" />}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{activity.description}</p>
                <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
              </div>
            </div>
          )) || (
            <p className="text-center text-muted-foreground py-4">No hay actividad reciente</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Users Tab Component with Advanced Management
function UsersTab() {
  const { data: users, isLoading, refetch } = trpc.admin.listUsers.useQuery();
  const { data: plans } = trpc.plans.list.useQuery();
  
  // Debug: Log users data
  useEffect(() => {
    if (users) {
      console.log('[UsersTab] Total users:', users.length);
      console.log('[UsersTab] First user:', JSON.stringify(users[0]));
      console.log('[UsersTab] Users array:', users);
    }
  }, [users]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState<'all' | 'free' | 'premium' | 'enterprise'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'restricted'>('all');

  const updateUserMutation = trpc.admin.updateUser.useMutation({
    onSuccess: () => {
      toast.success('Usuario actualizado exitosamente');
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || 'Error al actualizar usuario');
    },
  });

  const deleteUserMutation = trpc.admin.deleteUser.useMutation({
    onSuccess: () => {
      toast.success('Usuario eliminado exitosamente');
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || 'Error al eliminar usuario');
    },
  });

  const handleApproveUser = (userId: number) => {
    updateUserMutation.mutate({ userId, isRestricted: false });
  };

  const handleRestrictUser = (userId: number) => {
    if (confirm('¿Estás seguro de que quieres restringir este usuario?')) {
      updateUserMutation.mutate({ userId, isRestricted: true });
    }
  };

  const handleChangePlan = (userId: number, planId: number) => {
    updateUserMutation.mutate({ userId, planId });
  };

  const handleDeleteUser = (userId: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.')) {
      deleteUserMutation.mutate({ userId });
    }
  };

  const filteredUsers = users?.filter((user: any) => {
    const matchesSearch = (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by plan name
    const matchesPlan = filterPlan === 'all' || 
                       (user.plan_name || '').toLowerCase() === filterPlan.toLowerCase();
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'restricted' && user.is_restricted) ||
                         (filterStatus === 'active' && !user.is_restricted);
    return matchesSearch && matchesPlan && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
        <p className="text-muted-foreground">Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border/20 rounded-[15px] p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[10px] bg-blue-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{users?.length || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border/20 rounded-[15px] p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[10px] bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Activos</p>
              <p className="text-2xl font-bold">{users?.filter((u: any) => !u.is_restricted).length || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border/20 rounded-[15px] p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[10px] bg-red-500/10 flex items-center justify-center">
              <Ban className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Restringidos</p>
              <p className="text-2xl font-bold">{users?.filter((u: any) => u.is_restricted).length || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border/20 rounded-[15px] p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[10px] bg-purple-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Premium</p>
              <p className="text-2xl font-bold">{users?.filter((u: any) => u.plan_name !== 'Free').length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border/20 rounded-[20px] p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Buscar</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nombre o email..."
              className="w-full px-4 py-2 bg-background border border-border/20 rounded-[15px] focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Plan</label>
            <select
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value as any)}
              className="w-full px-4 py-2 bg-background border border-border/20 rounded-[15px] focus:outline-none focus:ring-2 focus:ring-accent"
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
            <label className="block text-sm font-medium mb-2">Estado</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full px-4 py-2 bg-background border border-border/20 rounded-[15px] focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="all">Todos</option>
              <option value="active">Activos</option>
              <option value="restricted">Restringidos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card border border-border/20 rounded-[20px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border/20">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Usuario</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Plan</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Días Restantes</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Estado</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Registro</th>
                <th className="px-6 py-4 text-right text-sm font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {filteredUsers?.map((user: any) => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.plan_id}
                      onChange={(e) => handleChangePlan(user.id, parseInt(e.target.value))}
                      className="px-3 py-1.5 bg-background border border-border/20 rounded-[8px] text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                      disabled={updateUserMutation.isPending}
                    >
                      {plans?.map((plan) => (
                        <option key={plan.id} value={plan.id}>
                          {plan.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    {user.days_remaining !== null && user.days_remaining !== undefined ? (
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-[8px] text-sm font-medium ${
                        user.days_remaining <= 3 ? 'bg-red-500/10 text-red-500' :
                        user.days_remaining <= 7 ? 'bg-orange-500/10 text-orange-500' :
                        'bg-green-500/10 text-green-500'
                      }`}>
                        <Clock className="w-3 h-3" />
                        {user.days_remaining} días
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">Sin límite</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {user.is_restricted ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-500/10 text-red-500 rounded-[8px] text-sm font-medium">
                        <Ban className="w-3 h-3" />
                        Restringido
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/10 text-green-500 rounded-[8px] text-sm font-medium">
                        <CheckCircle className="w-3 h-3" />
                        Activo
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString('es-ES') : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {user.is_restricted ? (
                        <button
                          onClick={() => handleApproveUser(user.id)}
                          disabled={updateUserMutation.isPending}
                          className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded-[8px] transition-colors disabled:opacity-50"
                          title="Aprobar usuario"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRestrictUser(user.id)}
                          disabled={updateUserMutation.isPending}
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-[8px] transition-colors disabled:opacity-50"
                          title="Restringir usuario"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={deleteUserMutation.isPending}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-[8px] transition-colors disabled:opacity-50"
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
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No se encontraron usuarios</p>
          </div>
        )}
      </div>
    </div>
  );
}


// Revenue Tab Component with Charts and Transaction History
function RevenueTab({ period, colors }: any) {
  const { data: revenueData, isLoading } = trpc.admin.getRevenue.useQuery({ period });
  const { data: transactions } = trpc.admin.getTransactions.useQuery({ limit: 50 });

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
        <p className="text-muted-foreground">Cargando datos de ingresos...</p>
      </div>
    );
  }

  if (!revenueData) {
    return <div className="text-center py-12">No hay datos disponibles</div>;
  }

  // Calculate growth percentage
  const growthPercentage = revenueData.summary.growth_percentage || 0;
  const isPositiveGrowth = growthPercentage >= 0;

  return (
    <div className="space-y-6">
      {/* Revenue Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card border border-border/20 rounded-[20px] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-[15px] bg-green-500/10 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Ingresos Totales</p>
          <h3 className="text-3xl font-bold text-green-500 mb-2">
            ${parseFloat(revenueData.summary.total_amount || '0').toFixed(2)}
          </h3>
          <div className={`flex items-center gap-1 text-sm ${isPositiveGrowth ? 'text-green-500' : 'text-red-500'}`}>
            <TrendingUp className={`w-4 h-4 ${!isPositiveGrowth && 'rotate-180'}`} />
            {Math.abs(growthPercentage).toFixed(1)}% vs período anterior
          </div>
        </div>

        <div className="bg-card border border-border/20 rounded-[20px] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-[15px] bg-blue-500/10 flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Total Transacciones</p>
          <h3 className="text-3xl font-bold mb-2">{revenueData.summary.total_transactions}</h3>
          <p className="text-sm text-muted-foreground">En el período seleccionado</p>
        </div>

        <div className="bg-card border border-border/20 rounded-[20px] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-[15px] bg-purple-500/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-500" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Promedio por Transacción</p>
          <h3 className="text-3xl font-bold text-purple-500 mb-2">
            ${parseFloat(revenueData.summary.average_amount || '0').toFixed(2)}
          </h3>
          <p className="text-sm text-muted-foreground">Ticket promedio</p>
        </div>

        <div className="bg-card border border-border/20 rounded-[20px] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-[15px] bg-orange-500/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-500" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Ingresos Hoy</p>
          <h3 className="text-3xl font-bold text-orange-500 mb-2">
            ${parseFloat(revenueData.summary.today_revenue || '0').toFixed(2)}
          </h3>
          <p className="text-sm text-muted-foreground">Últimas 24 horas</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-card border border-border/20 rounded-[20px] p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Ingresos en el Tiempo</h3>
            <p className="text-sm text-muted-foreground">Evolución de ingresos y transacciones</p>
          </div>
          <div className="w-12 h-12 rounded-[15px] bg-green-500/10 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-green-500" />
          </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={revenueData.daily}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorTransactions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
            <XAxis dataKey="date" stroke="#888" fontSize={12} />
            <YAxis stroke="#888" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--card)', 
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '12px'
              }} 
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="total" 
              stroke="#10b981" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
              name="Ingresos ($)" 
            />
            <Area 
              type="monotone" 
              dataKey="transactions" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorTransactions)" 
              name="Transacciones" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Transaction History */}
      <div className="bg-card border border-border/20 rounded-[20px] p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Historial de Transacciones</h3>
            <p className="text-sm text-muted-foreground">Últimas 50 transacciones</p>
          </div>
          <div className="w-10 h-10 rounded-[15px] bg-blue-500/10 flex items-center justify-center">
            <Activity className="w-5 h-5 text-blue-500" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border/20">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Usuario</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Plan</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Monto</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Estado</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {transactions?.map((tx: any) => (
                <tr key={tx.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-sm">{tx.user_name}</p>
                      <p className="text-xs text-muted-foreground">{tx.user_email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-[8px] text-xs font-medium ${
                      tx.plan_name === 'Enterprise' ? 'bg-purple-500/10 text-purple-500' :
                      tx.plan_name === 'Premium' ? 'bg-blue-500/10 text-blue-500' :
                      'bg-gray-500/10 text-gray-500'
                    }`}>
                      {tx.plan_name}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-green-500">${parseFloat(tx.amount).toFixed(2)}</span>
                  </td>
                  <td className="px-4 py-3">
                    {tx.status === 'completed' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-500/10 text-green-500 rounded-[8px] text-xs font-medium">
                        <CheckCircle className="w-3 h-3" />
                        Completado
                      </span>
                    ) : tx.status === 'pending' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-500/10 text-orange-500 rounded-[8px] text-xs font-medium">
                        <Clock className="w-3 h-3" />
                        Pendiente
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-500/10 text-red-500 rounded-[8px] text-xs font-medium">
                        <XCircle className="w-3 h-3" />
                        Fallido
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {new Date(tx.created_at).toLocaleString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!transactions || transactions.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No hay transacciones registradas</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Emails Tab Component with Form and History Side by Side
function EmailsTab() {
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [targetUsers, setTargetUsers] = useState<'all' | 'free' | 'premium'>('all');

  const { data: emailHistory, refetch: refetchHistory } = trpc.admin.getEmailHistory.useQuery();

  const sendEmailMutation = trpc.admin.sendBulkEmail.useMutation({
    onSuccess: (data) => {
      toast.success(`Emails enviados: ${data.sent}, Omitidos: ${data.skipped || 0}, Fallidos: ${data.failed || 0}`);
      setSubject('');
      setTitle('');
      setBody('');
      refetchHistory();
    },
    onError: (error) => {
      toast.error(error.message || 'Error al enviar emails');
    },
  });

  const { data: expiringUsers } = trpc.admin.getExpiringSubscriptions.useQuery({ daysBeforeExpiry: 5 });
  const sendRemindersMutation = trpc.admin.sendPaymentReminders.useMutation({
    onSuccess: (data) => {
      toast.success(`Recordatorios enviados: ${data.sent}`);
      refetchHistory();
    },
    onError: (error) => {
      toast.error(error.message || 'Error al enviar recordatorios');
    },
  });

  return (
    <div className="space-y-6">
      {/* Payment Reminders Banner */}
      <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-[20px] p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-[15px] bg-orange-500/20 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Recordatorios de Pago</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {expiringUsers?.length || 0} usuarios con suscripciones por vencer en los próximos 5 días
              </p>
              {expiringUsers && expiringUsers.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {expiringUsers.slice(0, 3).map((user: any) => (
                    <div key={user.id} className="inline-flex items-center gap-2 px-3 py-1.5 bg-card rounded-[10px] text-sm">
                      <span className="font-medium">{user.name}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-orange-500">{user.plan_name}</span>
                    </div>
                  ))}
                  {expiringUsers.length > 3 && (
                    <div className="inline-flex items-center px-3 py-1.5 bg-card rounded-[10px] text-sm text-muted-foreground">
                      +{expiringUsers.length - 3} más
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => sendRemindersMutation.mutate()}
            disabled={sendRemindersMutation.isPending || !expiringUsers?.length}
            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-[15px] font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {sendRemindersMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Enviar Recordatorios
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Form on Left, History on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email Form */}
        <div className="bg-card border border-border/20 rounded-[20px] p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-[15px] bg-accent/20 flex items-center justify-center">
              <Mail className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Enviar Email Masivo</h3>
              <p className="text-sm text-muted-foreground">Componer y enviar email a usuarios</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Destinatarios</label>
              <select
                value={targetUsers}
                onChange={(e) => setTargetUsers(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-background border border-border/20 rounded-[15px] focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              >
                <option value="all">Todos los usuarios</option>
                <option value="free">Solo usuarios gratuitos</option>
                <option value="premium">Solo usuarios premium</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Asunto del Email</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ej: Nuevas funciones en EterBox"
                className="w-full px-4 py-2.5 bg-background border border-border/20 rounded-[15px] focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Título Principal</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: ¡Descubre las novedades!"
                className="w-full px-4 py-2.5 bg-background border border-border/20 rounded-[15px] focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Contenido (HTML)</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="<p>Escribe el contenido del email en HTML...</p>"
                rows={8}
                className="w-full px-4 py-2.5 bg-background border border-border/20 rounded-[15px] focus:outline-none focus:ring-2 focus:ring-accent font-mono text-sm transition-all resize-none"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Puedes usar HTML para dar formato al email
              </p>
            </div>

            <button
              onClick={() => sendEmailMutation.mutate({ subject, title, body, targetUsers })}
              disabled={sendEmailMutation.isPending || !subject || !title || !body}
              className="w-full px-6 py-3.5 bg-accent hover:bg-accent/90 text-white rounded-[15px] font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {sendEmailMutation.isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Enviando Email...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Enviar Email Masivo
                </>
              )}
            </button>
          </div>
        </div>

        {/* Email History */}
        <div className="bg-card border border-border/20 rounded-[20px] p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-[15px] bg-purple-500/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Historial de Envíos</h3>
              <p className="text-sm text-muted-foreground">Últimos emails masivos enviados</p>
            </div>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-hide">
            {emailHistory && emailHistory.length > 0 ? (
              emailHistory.map((email: any) => (
                <div key={email.id} className="p-4 bg-muted/30 border border-border/20 rounded-[15px] hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">{email.subject}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">{email.title}</p>
                    </div>
                    <div className={`px-2.5 py-1 rounded-[8px] text-xs font-medium ${
                      email.status === 'sent' ? 'bg-green-500/10 text-green-500' :
                      email.status === 'sending' ? 'bg-orange-500/10 text-orange-500' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {email.status === 'sent' ? '✓ Enviado' :
                       email.status === 'sending' ? '⏳ Enviando' :
                       '✗ Error'}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {email.recipients_count || 0} destinatarios
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(email.created_at).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  {email.sent_count !== undefined && (
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 transition-all"
                          style={{ width: `${(email.sent_count / email.recipients_count) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-green-500">
                        {email.sent_count}/{email.recipients_count}
                      </span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No hay emails enviados aún</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Los emails que envíes aparecerán aquí
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Admins Tab Component
function AdminsTab({ permissions }: any) {
  const { data: admins, isLoading, refetch } = trpc.admin.listAdmins.useQuery(undefined, {
    enabled: permissions?.is_super_admin || permissions?.can_manage_admins
  });

  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPerms, setNewAdminPerms] = useState({
    can_view_users: true,
    can_edit_users: false,
    can_delete_users: false,
    can_send_bulk_emails: false,
    can_view_revenue: false,
    can_manage_admins: false,
    can_view_analytics: true,
  });

  const addAdminMutation = trpc.admin.addAdmin.useMutation({
    onSuccess: () => {
      refetch();
      setNewAdminEmail('');
      toast.success('Administrador agregado exitosamente');
    },
    onError: (error) => {
      toast.error(error.message || 'Error al agregar administrador');
    },
  });

  const removeAdminMutation = trpc.admin.removeAdmin.useMutation({
    onSuccess: () => {
      refetch();
      toast.success('Administrador removido exitosamente');
    },
    onError: (error) => {
      toast.error(error.message || 'Error al remover administrador');
    },
  });

  if (!permissions?.is_super_admin && !permissions?.can_manage_admins) {
    return (
      <div className="bg-card border border-border/20 rounded-[20px] p-12 text-center">
        <div className="w-16 h-16 rounded-[15px] bg-red-500/10 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Acceso Denegado</h3>
        <p className="text-muted-foreground">No tienes permisos para gestionar administradores</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
        <p className="text-muted-foreground">Cargando administradores...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Admin Form */}
      <div className="bg-card border border-border/20 rounded-[20px] p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-[15px] bg-accent/20 flex items-center justify-center">
            <UserPlus className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Agregar Nuevo Administrador</h3>
            <p className="text-sm text-muted-foreground">Asignar permisos de administrador a un usuario</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email del Usuario</label>
            <input
              type="email"
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              placeholder="usuario@ejemplo.com"
              className="w-full px-4 py-2.5 bg-background border border-border/20 rounded-[15px] focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Permisos</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(newAdminPerms).map(([key, value]) => (
                <label key={key} className="flex items-center gap-3 p-3 bg-muted/30 rounded-[15px] cursor-pointer hover:bg-muted/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setNewAdminPerms({ ...newAdminPerms, [key]: e.target.checked })}
                    className="w-4 h-4 rounded border-border/20 text-accent focus:ring-accent"
                  />
                  <span className="text-sm">
                    {key.replace(/_/g, ' ').replace(/^can /, '').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={() => addAdminMutation.mutate({ email: newAdminEmail, permissions: newAdminPerms })}
            disabled={addAdminMutation.isPending || !newAdminEmail}
            className="w-full px-6 py-3 bg-accent hover:bg-accent/90 text-white rounded-[15px] font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {addAdminMutation.isPending ? 'Agregando...' : 'Agregar Administrador'}
          </button>
        </div>
      </div>

      {/* Admins List */}
      <div className="bg-card border border-border/20 rounded-[20px] p-6">
        <h3 className="text-lg font-semibold mb-6">Administradores Actuales</h3>
        <div className="space-y-3">
          {admins?.map((admin: any) => (
            <div key={admin.id} className="p-4 bg-muted/30 border border-border/20 rounded-[15px]">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">{admin.name}</h4>
                    {admin.is_super_admin && (
                      <span className="px-2 py-0.5 bg-purple-500/10 text-purple-500 rounded-[6px] text-xs font-medium">
                        Super Admin
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{admin.email}</p>
                  <div className="flex flex-wrap gap-2">
                    {admin.permissions && Object.entries(admin.permissions).map(([key, value]) => (
                      value && (
                        <span key={key} className="px-2 py-1 bg-accent/10 text-accent rounded-[6px] text-xs">
                          {key.replace(/_/g, ' ').replace(/^can /, '')}
                        </span>
                      )
                    ))}
                  </div>
                </div>
                {!admin.is_super_admin && (
                  <button
                    onClick={() => {
                      if (confirm(`¿Remover permisos de administrador a ${admin.name}?`)) {
                        removeAdminMutation.mutate({ userId: admin.id });
                      }
                    }}
                    disabled={removeAdminMutation.isPending}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-[8px] transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

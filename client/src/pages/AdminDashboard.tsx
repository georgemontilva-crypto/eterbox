import { useState, useEffect } from 'react';
import { trpc } from '../lib/trpc';
import { useLocation } from 'wouter';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import {
  Users, DollarSign, TrendingUp, Activity, Mail, Shield,
  Settings, UserPlus, Calendar, AlertCircle
} from 'lucide-react';

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

  // Redirect if not admin
  useEffect(() => {
    if (!checkingAdmin && !adminCheck?.isAdmin) {
      setLocation('/dashboard');
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

  if (!adminCheck?.isAdmin) {
    return null;
  }

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Shield className="w-8 h-8 text-accent" />
              <div>
                <h1 className="text-2xl font-bold">Panel de Administración</h1>
                <p className="text-sm text-muted-foreground">EterBox Admin Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as Period)}
                className="px-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="day">Último día</option>
                <option value="week">Última semana</option>
                <option value="month">Último mes</option>
                <option value="year">Último año</option>
              </select>
              <button
                onClick={() => setLocation('/dashboard')}
                className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
              >
                Volver al Dashboard
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4 overflow-x-auto">
            {[
              { id: 'overview', label: 'Resumen', icon: Activity },
              { id: 'users', label: 'Usuarios', icon: Users },
              { id: 'revenue', label: 'Ingresos', icon: DollarSign },
              { id: 'emails', label: 'Emails', icon: Mail },
              { id: 'admins', label: 'Administradores', icon: Shield },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-accent text-white'
                    : 'bg-background hover:bg-muted'
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

// Overview Tab Component
function OverviewTab({ analytics, period, colors }: any) {
  if (!analytics) return <div>No hay datos disponibles</div>;

  const stats = [
    {
      title: 'Total Usuarios',
      value: analytics.totalUsers,
      change: `+${analytics.newUsers} nuevos`,
      icon: Users,
      color: 'bg-blue-500/10 text-blue-500',
    },
    {
      title: 'Ingresos Totales',
      value: `$${analytics.totalRevenue.toFixed(2)}`,
      change: `+$${analytics.periodRevenue.toFixed(2)} este período`,
      icon: DollarSign,
      color: 'bg-green-500/10 text-green-500',
    },
    {
      title: 'Suscripciones Activas',
      value: analytics.activeSubscriptions,
      change: `${((analytics.activeSubscriptions / analytics.totalUsers) * 100).toFixed(1)}% del total`,
      icon: TrendingUp,
      color: 'bg-purple-500/10 text-purple-500',
    },
    {
      title: 'Nuevos Registros',
      value: analytics.newUsers,
      change: `En el último ${period === 'day' ? 'día' : period === 'week' ? 'semana' : period === 'month' ? 'mes' : 'año'}`,
      icon: UserPlus,
      color: 'bg-orange-500/10 text-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Registrations Chart */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Registros Diarios</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analytics.dailyRegistrations}>
              <defs>
                <linearGradient id="colorRegistrations" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#888" fontSize={12} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
              <Area type="monotone" dataKey="count" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRegistrations)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Users by Plan Chart */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Usuarios por Plan</h3>
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
              <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Revenue Chart */}
        <div className="bg-card border border-border rounded-xl p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Ingresos Diarios</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.dailyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#888" fontSize={12} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
              <Legend />
              <Bar dataKey="total" fill="#10b981" name="Ingresos ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// Users Tab Component
function UsersTab() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  
  const { data: usersData, isLoading, refetch } = trpc.admin.listUsers.useQuery({
    page,
    pageSize: 20,
    search: search || undefined,
  });

  const deleteMutation = trpc.admin.deleteUser.useMutation({
    onSuccess: () => {
      refetch();
      alert('Usuario eliminado exitosamente');
    },
  });

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="bg-card border border-border rounded-xl p-6">
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      {/* Users Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Usuario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">2FA</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Registro</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-muted-foreground">
                    Cargando...
                  </td>
                </tr>
              ) : usersData?.users.map((user) => (
                <tr key={user.id} className="hover:bg-muted/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium">{user.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-accent/10 text-accent">
                      Plan {user.planId || 'Free'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.twoFactorEnabled ? (
                      <span className="text-green-500">✓</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => {
                        if (confirm('¿Estás seguro de eliminar este usuario?')) {
                          deleteMutation.mutate({ userId: user.id });
                        }
                      }}
                      className="text-red-500 hover:text-red-400"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {usersData && usersData.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-border flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Página {usersData.page} de {usersData.totalPages} ({usersData.total} usuarios)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 bg-muted rounded-lg disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === usersData.totalPages}
                className="px-4 py-2 bg-muted rounded-lg disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Revenue Tab Component
function RevenueTab({ period, colors }: any) {
  const { data: revenueData, isLoading } = trpc.admin.getRevenue.useQuery({ period });

  if (isLoading) {
    return <div className="text-center py-12">Cargando datos de ingresos...</div>;
  }

  if (!revenueData) {
    return <div className="text-center py-12">No hay datos disponibles</div>;
  }

  return (
    <div className="space-y-6">
      {/* Revenue Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-sm text-muted-foreground mb-1">Total Transacciones</p>
          <h3 className="text-3xl font-bold">{revenueData.summary.total_transactions}</h3>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-sm text-muted-foreground mb-1">Ingresos Totales</p>
          <h3 className="text-3xl font-bold">${parseFloat(revenueData.summary.total_amount || '0').toFixed(2)}</h3>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-sm text-muted-foreground mb-1">Promedio por Transacción</p>
          <h3 className="text-3xl font-bold">${parseFloat(revenueData.summary.average_amount || '0').toFixed(2)}</h3>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Ingresos Diarios</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={revenueData.daily}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="date" stroke="#888" fontSize={12} />
            <YAxis stroke="#888" fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
            <Legend />
            <Line type="monotone" dataKey="total" stroke="#10b981" strokeWidth={2} name="Ingresos ($)" />
            <Line type="monotone" dataKey="transactions" stroke="#3b82f6" strokeWidth={2} name="Transacciones" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Emails Tab Component
function EmailsTab() {
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [targetUsers, setTargetUsers] = useState<'all' | 'free' | 'premium'>('all');

  const sendEmailMutation = trpc.admin.sendBulkEmail.useMutation({
    onSuccess: (data) => {
      alert(`Emails enviados: ${data.sent}, Omitidos: ${data.skipped || 0}, Fallidos: ${data.failed || 0}`);
      setSubject('');
      setTitle('');
      setBody('');
    },
  });

  const { data: expiringUsers } = trpc.admin.getExpiringSubscriptions.useQuery({ daysBeforeExpiry: 5 });
  const sendRemindersMutation = trpc.admin.sendPaymentReminders.useMutation({
    onSuccess: (data) => {
      alert(`Recordatorios enviados: ${data.sent}`);
    },
  });

  return (
    <div className="space-y-6">
      {/* Payment Reminders */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Recordatorios de Pago</h3>
            <p className="text-sm text-muted-foreground">
              {expiringUsers?.length || 0} usuarios con suscripciones por vencer en los próximos 5 días
            </p>
          </div>
          <button
            onClick={() => sendRemindersMutation.mutate()}
            disabled={sendRemindersMutation.isPending || !expiringUsers?.length}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 disabled:opacity-50"
          >
            {sendRemindersMutation.isPending ? 'Enviando...' : 'Enviar Recordatorios'}
          </button>
        </div>
        {expiringUsers && expiringUsers.length > 0 && (
          <div className="space-y-2">
            {expiringUsers.slice(0, 5).map((user: any) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{user.plan_name}</p>
                  <p className="text-xs text-muted-foreground">
                    Vence: {new Date(user.subscription_end_date).toLocaleDateString('es-ES')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bulk Email Sender */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Enviar Email Masivo</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Destinatarios</label>
            <select
              value={targetUsers}
              onChange={(e) => setTargetUsers(e.target.value as any)}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="all">Todos los usuarios</option>
              <option value="free">Solo usuarios gratuitos</option>
              <option value="premium">Solo usuarios premium</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Asunto</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Asunto del email"
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título principal del email"
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Contenido (HTML)</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="<p>Contenido del email en HTML...</p>"
              rows={6}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent font-mono text-sm"
            />
          </div>
          <button
            onClick={() => sendEmailMutation.mutate({ subject, title, body, targetUsers })}
            disabled={sendEmailMutation.isPending || !subject || !title || !body}
            className="w-full px-4 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 disabled:opacity-50"
          >
            {sendEmailMutation.isPending ? 'Enviando...' : 'Enviar Email Masivo'}
          </button>
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
      alert('Administrador agregado exitosamente');
    },
  });

  const removeAdminMutation = trpc.admin.removeAdmin.useMutation({
    onSuccess: () => {
      refetch();
      alert('Administrador removido exitosamente');
    },
  });

  if (!permissions?.is_super_admin && !permissions?.can_manage_admins) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 text-center">
        <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No tienes permisos para gestionar administradores</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Admin */}
      {permissions?.is_super_admin && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Agregar Administrador</h3>
          <div className="space-y-4">
            <input
              type="email"
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              placeholder="Email del nuevo administrador"
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(newAdminPerms).map(([key, value]) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setNewAdminPerms({ ...newAdminPerms, [key]: e.target.checked })}
                    className="w-4 h-4 text-accent"
                  />
                  <span className="text-sm">{key.replace(/_/g, ' ').replace('can ', '')}</span>
                </label>
              ))}
            </div>
            <button
              onClick={() => addAdminMutation.mutate({ email: newAdminEmail, permissions: newAdminPerms })}
              disabled={addAdminMutation.isPending || !newAdminEmail}
              className="w-full px-4 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 disabled:opacity-50"
            >
              {addAdminMutation.isPending ? 'Agregando...' : 'Agregar Administrador'}
            </button>
          </div>
        </div>
      )}

      {/* Admins List */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold">Administradores Actuales</h3>
        </div>
        <div className="divide-y divide-border">
          {isLoading ? (
            <div className="px-6 py-4 text-center text-muted-foreground">Cargando...</div>
          ) : admins?.map((admin: any) => (
            <div key={admin.id} className="px-6 py-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{admin.name}</p>
                    {admin.is_super_admin && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-accent text-white">
                        Super Admin
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{admin.email}</p>
                  <div className="flex flex-wrap gap-2">
                    {admin.can_view_users && <span className="px-2 py-1 text-xs rounded-full bg-muted">Ver usuarios</span>}
                    {admin.can_edit_users && <span className="px-2 py-1 text-xs rounded-full bg-muted">Editar usuarios</span>}
                    {admin.can_delete_users && <span className="px-2 py-1 text-xs rounded-full bg-muted">Eliminar usuarios</span>}
                    {admin.can_send_bulk_emails && <span className="px-2 py-1 text-xs rounded-full bg-muted">Enviar emails</span>}
                    {admin.can_view_revenue && <span className="px-2 py-1 text-xs rounded-full bg-muted">Ver ingresos</span>}
                    {admin.can_manage_admins && <span className="px-2 py-1 text-xs rounded-full bg-muted">Gestionar admins</span>}
                  </div>
                </div>
                {permissions?.is_super_admin && !admin.is_super_admin && (
                  <button
                    onClick={() => {
                      if (confirm('¿Estás seguro de remover este administrador?')) {
                        removeAdminMutation.mutate({ userId: admin.id });
                      }
                    }}
                    className="text-red-500 hover:text-red-400 text-sm"
                  >
                    Remover
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

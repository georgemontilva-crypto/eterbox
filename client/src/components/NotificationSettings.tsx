import { useState, useEffect } from 'react';
import { trpc } from '../lib/trpc';
import { Bell, Mail, Shield, TrendingUp, Activity, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function NotificationSettings() {
  const { t } = useLanguage();
  const [preferences, setPreferences] = useState({
    security_alerts: true,
    marketing_promos: true,
    product_updates: true,
    account_activity: true
  });
  const [saving, setSaving] = useState(false);
  const [testingSecurity, setTestingSecurity] = useState(false);
  const [testingMarketing, setTestingMarketing] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Fetch current preferences
  const { data, refetch } = trpc.notifications.getPreferences.useQuery();
  const updateMutation = trpc.notifications.updatePreferences.useMutation();
  const testNotificationMutation = trpc.notifications.sendTestNotification.useMutation();

  useEffect(() => {
    if (data) {
      setPreferences({
        security_alerts: data.security_alerts ?? true,
        marketing_promos: data.marketing_promos ?? true,
        product_updates: data.product_updates ?? true,
        account_activity: data.account_activity ?? true
      });
    }
  }, [data]);

  const handleToggle = async (key: keyof typeof preferences) => {
    const newValue = !preferences[key];
    setPreferences(prev => ({ ...prev, [key]: newValue }));
    
    setSaving(true);
    try {
      await updateMutation.mutateAsync({ [key]: newValue });
      setSaveMessage('✓ Preferencias guardadas');
      setTimeout(() => setSaveMessage(''), 2000);
    } catch (error) {
      console.error('Error updating preferences:', error);
      // Revert on error
      setPreferences(prev => ({ ...prev, [key]: !newValue }));
      setSaveMessage('✗ Error al guardar');
      setTimeout(() => setSaveMessage(''), 2000);
    } finally {
      setSaving(false);
    }
  };

  const handleTestNotification = async (type: 'security' | 'marketing') => {
    if (type === 'security') {
      setTestingSecurity(true);
    } else {
      setTestingMarketing(true);
    }

    try {
      await testNotificationMutation.mutateAsync({ type });
      alert(`✓ Notificación de prueba enviada. Revisa tu email.`);
    } catch (error) {
      console.error('Error sending test notification:', error);
      alert('✗ Error al enviar notificación de prueba');
    } finally {
      setTestingSecurity(false);
      setTestingMarketing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-accent" />
          <div>
            <h2 className="text-2xl font-bold">Notificaciones por Email</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Configura qué notificaciones deseas recibir por correo electrónico
            </p>
          </div>
        </div>
        {saveMessage && (
          <span className="text-sm text-accent font-medium">{saveMessage}</span>
        )}
      </div>

      {/* Security Alerts */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-red-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">Alertas de Seguridad</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Recibe notificaciones sobre actividad sospechosa, nuevos inicios de sesión, cambios de contraseña y configuración de seguridad.
              </p>
              <ul className="text-xs text-muted-foreground mt-3 space-y-1">
                <li>• Nuevos inicios de sesión desde dispositivos desconocidos</li>
                <li>• Cambios en tu contraseña maestra</li>
                <li>• Activación/desactivación de 2FA</li>
                <li>• Actividad sospechosa detectada</li>
              </ul>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleTestNotification('security')}
              disabled={testingSecurity || !preferences.security_alerts}
              className="px-3 py-1.5 text-xs bg-muted hover:bg-muted/80 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {testingSecurity ? 'Enviando...' : 'Probar'}
            </button>
            <button
              onClick={() => handleToggle('security_alerts')}
              disabled={saving}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                preferences.security_alerts ? 'bg-accent' : 'bg-muted'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  preferences.security_alerts ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Marketing & Promotions */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">Promociones y Marketing</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Recibe ofertas especiales, descuentos exclusivos y noticias sobre nuevas características.
              </p>
              <ul className="text-xs text-muted-foreground mt-3 space-y-1">
                <li>• Ofertas y descuentos exclusivos</li>
                <li>• Anuncios de nuevas características</li>
                <li>• Consejos y mejores prácticas</li>
                <li>• Eventos y webinars</li>
              </ul>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleTestNotification('marketing')}
              disabled={testingMarketing || !preferences.marketing_promos}
              className="px-3 py-1.5 text-xs bg-muted hover:bg-muted/80 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {testingMarketing ? 'Enviando...' : 'Probar'}
            </button>
            <button
              onClick={() => handleToggle('marketing_promos')}
              disabled={saving}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                preferences.marketing_promos ? 'bg-accent' : 'bg-muted'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  preferences.marketing_promos ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Product Updates */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-green-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">Actualizaciones de Producto</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Mantente informado sobre actualizaciones importantes, cambios en el servicio y mejoras de seguridad.
              </p>
              <ul className="text-xs text-muted-foreground mt-3 space-y-1">
                <li>• Nuevas versiones y actualizaciones</li>
                <li>• Cambios en términos y políticas</li>
                <li>• Mejoras de seguridad importantes</li>
                <li>• Mantenimiento programado</li>
              </ul>
            </div>
          </div>
          <button
            onClick={() => handleToggle('product_updates')}
            disabled={saving}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              preferences.product_updates ? 'bg-accent' : 'bg-muted'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                preferences.product_updates ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Account Activity */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Activity className="w-5 h-5 text-purple-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">Actividad de Cuenta</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Recibe resúmenes de actividad, recordatorios y notificaciones sobre tu cuenta.
              </p>
              <ul className="text-xs text-muted-foreground mt-3 space-y-1">
                <li>• Resúmenes semanales de actividad</li>
                <li>• Recordatorios de renovación de suscripción</li>
                <li>• Confirmaciones de pago</li>
                <li>• Notificaciones de soporte</li>
              </ul>
            </div>
          </div>
          <button
            onClick={() => handleToggle('account_activity')}
            disabled={saving}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              preferences.account_activity ? 'bg-accent' : 'bg-muted'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                preferences.account_activity ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-accent/5 border border-accent/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Sobre las notificaciones por email</p>
            <ul className="space-y-1">
              <li>• Todas las notificaciones se envían a tu email registrado</li>
              <li>• Las alertas de seguridad son altamente recomendadas para proteger tu cuenta</li>
              <li>• Puedes cambiar estas preferencias en cualquier momento</li>
              <li>• Los emails incluyen enlaces para desuscribirse directamente</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

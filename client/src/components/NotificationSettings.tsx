import { useState, useEffect } from 'react';
import { trpc } from '../lib/trpc';
import { Bell, Mail, Shield, TrendingUp, Activity, Check, ChevronDown, ChevronUp } from 'lucide-react';
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
  
  // Collapsible states
  const [expandedSecurity, setExpandedSecurity] = useState(false);
  const [expandedMarketing, setExpandedMarketing] = useState(false);
  const [expandedUpdates, setExpandedUpdates] = useState(false);
  const [expandedActivity, setExpandedActivity] = useState(false);

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
      setSaveMessage(t('notifications.saved'));
      setTimeout(() => setSaveMessage(''), 2000);
    } catch (error) {
      console.error('Error updating preferences:', error);
      // Revert on error
      setPreferences(prev => ({ ...prev, [key]: !newValue }));
      setSaveMessage(t('notifications.error'));
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
      const result = await testNotificationMutation.mutateAsync({ type });
      if (result && result.success) {
        alert(t('notifications.testSent'));
      } else {
        alert(t('notifications.testError'));
      }
    } catch (error) {
      console.error('Error sending test notification:', error);
      alert(t('notifications.testError'));
    } finally {
      setTestingSecurity(false);
      setTestingMarketing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-accent" />
          <div>
            <h2 className="text-xl font-bold">{t('notifications.title')}</h2>
            <p className="text-xs text-muted-foreground mt-1">
              {t('notifications.subtitle')}
            </p>
          </div>
        </div>
        {saveMessage && (
          <span className="text-xs text-accent font-medium">{saveMessage}</span>
        )}
      </div>

      {/* Security Alerts - Collapsible */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <button
          onClick={() => setExpandedSecurity(!expandedSecurity)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-card/50 transition-colors"
        >
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-red-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold">{t('notifications.security.title')}</h3>
              <p className="text-xs text-muted-foreground truncate">
                {t('notifications.security.desc')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleTestNotification('security');
              }}
              disabled={testingSecurity || !preferences.security_alerts}
              className="px-2 py-1 text-xs bg-muted hover:bg-muted/80 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {testingSecurity ? '...' : t('notifications.security.test')}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggle('security_alerts');
              }}
              disabled={saving}
              className={`relative w-10 h-5 rounded-full transition-colors ${
                preferences.security_alerts ? 'bg-accent' : 'bg-muted'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                  preferences.security_alerts ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            {expandedSecurity ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>
        {expandedSecurity && (
          <div className="px-4 pb-4 pt-0 border-t border-border/20">
            <p className="text-xs text-muted-foreground whitespace-pre-line mt-3">
              {t('notifications.security.items')}
            </p>
          </div>
        )}
      </div>

      {/* Marketing & Promotions - Collapsible */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <button
          onClick={() => setExpandedMarketing(!expandedMarketing)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-card/50 transition-colors"
        >
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold">{t('notifications.marketing.title')}</h3>
              <p className="text-xs text-muted-foreground truncate">
                {t('notifications.marketing.desc')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleTestNotification('marketing');
              }}
              disabled={testingMarketing || !preferences.marketing_promos}
              className="px-2 py-1 text-xs bg-muted hover:bg-muted/80 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {testingMarketing ? '...' : t('notifications.security.test')}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggle('marketing_promos');
              }}
              disabled={saving}
              className={`relative w-10 h-5 rounded-full transition-colors ${
                preferences.marketing_promos ? 'bg-accent' : 'bg-muted'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                  preferences.marketing_promos ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            {expandedMarketing ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>
        {expandedMarketing && (
          <div className="px-4 pb-4 pt-0 border-t border-border/20">
            <p className="text-xs text-muted-foreground mt-3">
              {t('notifications.marketing.desc')}
            </p>
          </div>
        )}
      </div>

      {/* Product Updates - Collapsible */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <button
          onClick={() => setExpandedUpdates(!expandedUpdates)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-card/50 transition-colors"
        >
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-green-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold">{t('notifications.updates.title')}</h3>
              <p className="text-xs text-muted-foreground truncate">
                {t('notifications.updates.desc')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggle('product_updates');
              }}
              disabled={saving}
              className={`relative w-10 h-5 rounded-full transition-colors ${
                preferences.product_updates ? 'bg-accent' : 'bg-muted'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                  preferences.product_updates ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            {expandedUpdates ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>
        {expandedUpdates && (
          <div className="px-4 pb-4 pt-0 border-t border-border/20">
            <p className="text-xs text-muted-foreground mt-3">
              {t('notifications.updates.desc')}
            </p>
          </div>
        )}
      </div>

      {/* Account Activity - Collapsible */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <button
          onClick={() => setExpandedActivity(!expandedActivity)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-card/50 transition-colors"
        >
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Activity className="w-5 h-5 text-purple-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold">{t('notifications.activity.title')}</h3>
              <p className="text-xs text-muted-foreground truncate">
                {t('notifications.activity.desc')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggle('account_activity');
              }}
              disabled={saving}
              className={`relative w-10 h-5 rounded-full transition-colors ${
                preferences.account_activity ? 'bg-accent' : 'bg-muted'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                  preferences.account_activity ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            {expandedActivity ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>
        {expandedActivity && (
          <div className="px-4 pb-4 pt-0 border-t border-border/20">
            <p className="text-xs text-muted-foreground mt-3">
              {t('notifications.activity.desc')}
            </p>
          </div>
        )}
      </div>

      {/* About Notifications */}
      <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border/50">
        <div className="flex items-start gap-2">
          <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium">{t('notifications.about')}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {t('notifications.aboutText')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

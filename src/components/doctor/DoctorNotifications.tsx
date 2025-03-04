import React, { useState, useEffect } from 'react';
import { Bell, Mail, AlertCircle, Check, Clock, Globe2, ChevronRight, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'announcement' | 'alert' | 'update';
  read: boolean;
  created_at: string;
}

export default function DoctorNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch notifications from the database
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('doctor_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(notifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      ));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('read', false);

      if (error) throw error;

      setNotifications(notifications.map(notification => ({
        ...notification,
        read: true
      })));
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  const filteredNotifications = activeTab === 'all'
    ? notifications
    : notifications.filter(n => !n.read);

  const unreadCount = notifications.filter(n => !n.read).length;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
          <p className="text-gray-600">Stay updated with important announcements</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg
                   transition-colors flex items-center gap-2"
          >
            <Check className="w-5 h-5" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm mb-6 p-1">
        <div className="flex">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all
              ${activeTab === 'all'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-emerald-600'
              }`}
          >
            All Notifications
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all
              ${activeTab === 'unread'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-emerald-600'
              }`}
          >
            Unread ({unreadCount})
          </button>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <Bell className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No {activeTab === 'unread' ? 'unread ' : ''}notifications
          </h3>
          <p className="text-gray-600">
            {activeTab === 'unread'
              ? "You're all caught up!"
              : "You don't have any notifications yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all
                       transform hover:-translate-y-1 duration-300 relative
                       ${!notification.read ? 'border-l-4 border-emerald-500' : ''}`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${
                  notification.type === 'announcement'
                    ? 'bg-emerald-100 text-emerald-600'
                    : notification.type === 'alert'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-blue-100 text-blue-600'
                }`}>
                  {notification.type === 'announcement' ? (
                    <Mail className="w-6 h-6" />
                  ) : notification.type === 'alert' ? (
                    <AlertCircle className="w-6 h-6" />
                  ) : (
                    <Bell className="w-6 h-6" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{notification.title}</h3>
                      <p className="text-gray-600">{notification.message}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {new Date(notification.created_at).toLocaleDateString()}
                      </span>
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <Check className="w-4 h-4 text-emerald-500" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>
                        {new Date(notification.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    {notification.type === 'announcement' && (
                      <div className="flex items-center gap-1 text-gray-500">
                        <Globe2 className="w-4 h-4" />
                        <span>System Announcement</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
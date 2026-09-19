import React, { useCallback, useEffect } from 'react';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import {
  Bell,
  CheckCheck,
} from 'lucide-react-native';

import {
  colors,
  typography,
  spacing,
  radius,
} from '../../theme';

import {
  useNotificationStore,
} from '../../store/notificationStore';

import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';

export default function NotificationsScreen() {
  const {
    notifications,
    loading,
    error,
    fetchNotifications,
    markAsRead,
  } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleNotificationPress = useCallback(
    async (notification) => {
      if (!notification.isRead) {
        await markAsRead(notification._id);
      }

      // Later you can navigate based on
      // notification.type / notification.data.
    },
    [markAsRead]
  );

  const renderNotification = ({
    item,
  }) => {
    const isUnread = !item.isRead;

    return (
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() =>
          handleNotificationPress(item)
        }
        style={[
          styles.notification,
          isUnread &&
            styles.unreadNotification,
        ]}
      >
        <View style={styles.iconContainer}>
          <Bell
            size={20}
            color={colors.primary}
          />
        </View>

        <View style={styles.content}>
          <Text
            style={[
              styles.title,
              isUnread &&
                styles.unreadTitle,
            ]}
            numberOfLines={2}
          >
            {item.title ||
              item.type ||
              'Notification'}
          </Text>

          <Text
            style={styles.message}
            numberOfLines={3}
          >
            {item.message ||
              'You have a new notification.'}
          </Text>

          {item.createdAt && (
            <Text style={styles.date}>
              {new Date(
                item.createdAt
              ).toLocaleString()}
            </Text>
          )}
        </View>

        {isUnread && (
          <View style={styles.unreadDot} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>
            Notifications
          </Text>

          <Text style={styles.subtitle}>
            Stay updated with your appointments
          </Text>
        </View>

        <CheckCheck
          size={22}
          color={colors.primary}
        />
      </View>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState
          message={error}
          onRetry={fetchNotifications}
        />
      ) : notifications.length === 0 ? (
        <EmptyState
          title="No notifications"
          subtitle="You're all caught up."
        />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={renderNotification}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            styles.listContent
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 55,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },

  heading: {
    ...typography.h2,
    color: colors.textPrimary,
  },

  subtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 3,
  },

  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },

  notification: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },

  unreadNotification: {
    borderColor: colors.primary,
  },

  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },

  content: {
    flex: 1,
  },

  title: {
    ...typography.label,
    color: colors.textPrimary,
    marginBottom: 4,
  },

  unreadTitle: {
    fontWeight: '700',
  },

  message: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 20,
  },

  date: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },

  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: spacing.xs,
    marginTop: 5,
  },
});
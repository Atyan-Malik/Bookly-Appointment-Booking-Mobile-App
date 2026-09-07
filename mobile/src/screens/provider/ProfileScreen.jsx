import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { User, Briefcase, HelpCircle, LogOut, ChevronRight } from 'lucide-react-native';
import { colors, typography, spacing, radius, shadows } from '../../theme';
import { useAuthStore } from '../../store/authStore';

function Row({ icon, label, onPress, danger }) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <View style={styles.rowLeft}>
        {icon}
        <Text style={[styles.rowLabel, danger && { color: colors.error }]}>{label}</Text>
      </View>
      {!danger && <ChevronRight size={18} color={colors.textMuted} />}
    </TouchableOpacity>
  );
}

export default function ProviderProfileScreen() {
  const { user, logout } = useAuthStore();

  const confirmLogout = () => {
    Alert.alert('Log out?', '', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{user?.name?.charAt(0)}</Text></View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.card}>
        <Row icon={<User size={20} color={colors.textSecondary} />} label="Edit Profile" />
        <Row icon={<Briefcase size={20} color={colors.textSecondary} />} label="Business Details" />
        <Row icon={<HelpCircle size={20} color={colors.textSecondary} />} label="Help & Support" />
      </View>

      <View style={styles.card}>
        <Row icon={<LogOut size={20} color={colors.error} />} label="Logout" onPress={confirmLogout} danger />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 60, padding: spacing.lg },
  header: { alignItems: 'center', marginBottom: spacing.xl },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.secondaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  avatarText: { ...typography.h1, color: colors.secondaryDark },
  name: { ...typography.h3 },
  email: { ...typography.bodySecondary },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, marginBottom: spacing.md, ...shadows.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  rowLabel: { ...typography.body },
});

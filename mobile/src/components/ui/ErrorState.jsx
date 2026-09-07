import React from 'react';
import { AlertCircle } from 'lucide-react-native';
import { colors } from '../../theme';
import EmptyState from './EmptyState';

export default function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <EmptyState
      icon={<AlertCircle size={48} color={colors.error} />}
      title="Couldn't load this"
      subtitle={message}
      actionLabel={onRetry ? 'Retry' : undefined}
      onAction={onRetry}
    />
  );
}
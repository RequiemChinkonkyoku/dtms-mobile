import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from '../../styles/TrainerScheduleStyles';

export const EmptyState = () => (
    <View style={styles.emptyStateContainer}>
        <MaterialIcons name="event-busy" size={50} color="#666" />
        <Text style={styles.emptyStateTitle}>
            No Teaching Schedule Yet
        </Text>
        <Text style={styles.emptyStateSubtitle}>
            Pull down to refresh when new slots are assigned
        </Text>
    </View>
);
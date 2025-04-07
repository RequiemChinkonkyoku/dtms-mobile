import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from '../../styles/TrainerScheduleStyles';
import { format } from 'date-fns';

export const SlotItem = ({ date, slots, formatTime }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, 'EEEE, MMMM d, yyyy');
    };

    return (
        <View style={styles.slotContainer}>
            <View style={styles.dateContainer}>
                <MaterialIcons name="event" size={20} color="#007AFF" />
                <Text style={styles.dateText}>
                    {formatDate(date)}
                </Text>
            </View>
            
            {slots.map(slot => (
                <View key={slot.slotId} style={styles.slotItemContainer}>
                    <View style={styles.slotContent}>
                        <View style={styles.timeContainer}>
                            <MaterialIcons name="access-time" size={20} color="#007AFF" />
                            <Text style={styles.timeText}>
                                {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                            </Text>
                        </View>

                        {slot.lessonName && (
                            <View style={styles.lessonContainer}>
                                <MaterialIcons name="book" size={20} color="#007AFF" />
                                <Text style={styles.lessonText}>
                                    {slot.lessonName}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            ))}
        </View>
    );
};
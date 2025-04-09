import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../../styles/TrainerScheduleStyles';
import { SlotItem } from './SlotItem';

export const ClassCard = ({ classId, classSlots, isExpanded, onToggle, onSlotPress, formatTime, onRefresh }) => {
    const groupedSlots = classSlots.reduce((acc, slot) => {
        if (!acc[slot.slotDate]) {
            acc[slot.slotDate] = [];
        }
        acc[slot.slotDate].push(slot);
        return acc;
    }, {});

    const sortedDates = Object.keys(groupedSlots).sort();
    sortedDates.forEach(date => {
        groupedSlots[date].sort((a, b) => a.startTime.localeCompare(b.startTime));
    });

    return (
        <LinearGradient
            colors={['#ffffff', '#f8f9fa']}
            style={styles.classCard}
        >
            <TouchableOpacity
                onPress={() => onSlotPress(classId)}
                style={styles.classHeader}
            >
                <View style={styles.headerLeft}>
                    <MaterialIcons name="class" size={24} color="#007AFF" />
                    <Text style={styles.className}>
                        {classSlots[0].className}
                    </Text>
                </View>
                <View style={styles.headerRight}>
                    <Text style={styles.slotCount}>
                        {classSlots.length} sessions
                    </Text>
                    <MaterialIcons 
                        name="chevron-right"
                        size={24} 
                        color="#007AFF" 
                    />
                </View>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.expandButton}
                onPress={() => onToggle(classId)}
            >
                <MaterialIcons 
                    name={isExpanded ? "expand-less" : "expand-more"} 
                    size={24} 
                    color="#666" 
                />
            </TouchableOpacity>

            {isExpanded && sortedDates.map(date => (
                <SlotItem
                    key={date}
                    date={date}
                    slots={groupedSlots[date]}
                    formatTime={formatTime}
                    onRefresh={onRefresh}
                />
            ))}
        </LinearGradient>
    );
};
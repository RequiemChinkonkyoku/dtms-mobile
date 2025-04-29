import { View, Text, TextInput } from 'react-native';
import Feather from '@expo/vector-icons/Feather'
import CourseList from '../../components/Explore/CourseList';
import { useState } from 'react';
import { styles } from '../../styles/ExploreStyles';

export default function Explore() {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <View style={styles.iconContainer}>
                    <Feather name="book-open" size={20} color="#fff" />
                </View>
                <Text style={styles.title}>
                    Explore Courses
                </Text>
            </View>
            <Text style={styles.subtitle}>
                Find the perfect training course for your dogs
            </Text>

            {/* SearchBar */}
            <View style={styles.searchContainer}>
                <Feather name="search" size={20} color="#666" />
                <TextInput
                    placeholder='Search for courses...'
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    style={styles.searchInput}
                    placeholderTextColor="#999"
                />
            </View>

            <CourseList searchQuery={searchQuery} />
        </View>
    );
}
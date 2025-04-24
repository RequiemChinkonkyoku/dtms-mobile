import { View, Text, TextInput } from 'react-native';
import Feather from '@expo/vector-icons/Feather'
import CourseList from '../../components/Explore/CourseList';
import { useState } from 'react';

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={{
      padding: 20,
      backgroundColor: '#f5f5f5'
    }}>

      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
      }}>
        <View style={{
          backgroundColor: '#007AFF',
          padding: 6,
          borderRadius: 10,
          marginRight: 10,
        }}>
          <Feather name="book-open" size={20} color="#fff" />
        </View>
        <Text style={{
          fontFamily: 'outfit-bold',
          fontSize: 24,
          color: '#1a1a1a',
        }}>
          Explore Courses
        </Text>
      </View>
      <Text style={{
        fontFamily: 'outfit',
        fontSize: 14,
        color: '#666',
        lineHeight: 18,
        paddingLeft: 36,
      }}>
        Find the perfect training course for your dogs
      </Text>

      {/* SearchBar */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 16,
        marginTop: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      }}>
        <Feather name="search" size={20} color="#666" />
        <TextInput
          placeholder='Search for courses...'
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{
            fontFamily: 'outfit',
            fontSize: 15,
            flex: 1,
            marginLeft: 8,
            paddingVertical: 4,
          }}
          placeholderTextColor="#999"
        />
      </View>

      <CourseList searchQuery={searchQuery} />

    </View>
  );
}
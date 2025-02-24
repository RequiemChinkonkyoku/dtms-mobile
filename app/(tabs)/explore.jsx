import { View, Text, TextInput } from 'react-native';
import Feather from '@expo/vector-icons/Feather'
import CourseList from '../../components/Explore/CourseList';

export default function Explore() {
  return (
    <View style={{
      padding: 20
    }}>
      <Text style={{
        fontFamily: 'outfit-bold',
        fontSize: 30
      }}>
        Explore Courses
      </Text>

      {/* SearchBar */}
      <View style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
        marginVertical: 10,
        marginTop: 15,
        borderRadius: 8,
        borderWidth: 1,
      }}>
        <Feather name="search" size={24} />
        <TextInput placeholder='Search...'
          style={{
            fontFamily: 'outfit',
            fontSize: 17
          }}
        />
      </View>

      <CourseList />

    </View>
  );
}
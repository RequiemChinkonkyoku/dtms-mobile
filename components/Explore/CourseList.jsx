import { View, FlatList, ScrollView } from 'react-native';
import CourseCard from './CourseCard';

const courses = [
    { id: '0', title: 'React Native for Beginners', instructor: 'John Doe', image: require('./../../assets/images/dog.png') },
    { id: '1', title: 'Advanced JavaScript', instructor: 'Jane Smith', image: require('./../../assets/images/dog.png') },
    { id: '2', title: 'UI/UX Design Fundamentals', instructor: 'Alex Johnson', image: require('./../../assets/images/dog.png') },
    { id: '3', title: 'Design Fundamentals', instructor: 'Alex Johnson', image: require('./../../assets/images/dog.png') },
    { id: '4', title: 'Fundamentals', instructor: 'Alex Johnson', image: require('./../../assets/images/dog.png') },
    { id: '5', title: 'Fundamentals', instructor: 'Alex Johnson', image: require('./../../assets/images/dog.png') },
];

export default function CourseList() {
    return (
        <ScrollView>
            <FlatList
                style={{
                    padding: 10
                }}
                data={courses}
                scrollEnabled
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <CourseCard course={item} />}
                contentContainerStyle={{ paddingBottom: 20 }}
            />

            <View style={{
                height: 100
            }}>
            </View>
        </ScrollView>
    );
}

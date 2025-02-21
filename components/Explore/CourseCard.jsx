import { View, Text, Image, TouchableOpacity } from 'react-native';

export default function CourseCard({ course }) {
    return (
        <TouchableOpacity style={{
            backgroundColor: '#fff',
            padding: 10,
            borderRadius: 8,
            marginBottom: 10,
            borderWidth: 1,
        }}>
            <Image source={typeof course.image === 'string' ? { uri: course.image } : course.image}
                style={{
                    height: 150, 
                    borderRadius: 8,
                    width: '100%',
                    resizeMode: 'stretch',
                }}
            />
            <Text style={{ fontFamily: 'outfit-bold', fontSize: 18, marginTop: 5 }}>{course.title}</Text>
            <Text style={{ fontFamily: 'outfit', fontSize: 14, color: 'gray' }}>{course.instructor}</Text>
        </TouchableOpacity>
    );
}
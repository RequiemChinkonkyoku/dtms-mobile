import { View, Text } from 'react-native';
import UserIntro from '../../components/Profile/UserIntro';
import MenuList from '../../components/Profile/MenuList';
import Feather from '@expo/vector-icons/Feather';
import { styles } from '../../styles/ProfileStyles';

export default function Profile() {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <View style={styles.iconContainer}>
                    <Feather name="user" size={18} color="#007AFF" />
                </View>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>
                        Profile
                    </Text>
                    <Text style={styles.subtitle}>
                        Manage your account and settings
                    </Text>
                </View>
            </View>

            <UserIntro />

            <MenuList />
        </View>
    );
}
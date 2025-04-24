import { View, Text } from 'react-native';
import UserIntro from '../../components/Profile/UserIntro';
import MenuList from '../../components/Profile/MenuList';
import Feather from '@expo/vector-icons/Feather'

export default function Profile() {
  return (
    <View style={{
      padding: 20,
      backgroundColor: '#f5f5f5'
    }}>

      {/* Header */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
        }}>
          <View style={{
            backgroundColor: '#e6f3ff',
            padding: 8,
            borderRadius: 10,
          }}>
            <Feather name="user" size={18} color="#007AFF" />
          </View>
          <View>
            <Text style={{
              fontFamily: 'outfit-bold',
              fontSize: 20,
              color: '#333',
            }}>
              Profile
            </Text>
            <Text style={{
              fontFamily: 'outfit',
              fontSize: 13,
              color: '#666',
              marginTop: 1,
            }}>
              Manage your account and settings
            </Text>
          </View>
        </View>

      <UserIntro />

      <MenuList />

    </View>
  );

}
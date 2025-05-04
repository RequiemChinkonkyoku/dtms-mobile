import { View, Text, FlatList, Image, TouchableOpacity, Share, Alert } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { useAuth } from '../../contexts/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';

export default function MenuList() {
  
    const router = useRouter();
    const { logout } = useAuth();
    const { userInfo } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            router.replace('/login');
        } catch (error) {
            Alert.alert('Error', 'Failed to logout. Please try again.');
        }
    };

    const onMenuClick=(item)=>{
        if (item.path === 'logout') {
            Alert.alert(
                'Logout',
                'Are you sure you want to logout?',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel'
                    },
                    {
                        text: 'Logout',
                        onPress: handleLogout,
                        style: 'destructive'
                    }
                ]
            );
            return;
        }

        if (item.path == 'share'){
            Share.share(
                {
                    message: 'Share the Dog Training App' 
                })
            return ;
        }
        router.push(item.path)
    }

    const menuList = [
        // Trainer-specific menu items
        ...(userInfo?.role?.includes('Trainer') ? [
            {
                id: 1,
                name: 'Schedule',
                icon: require('./../../assets/images/schedule.png'),
                path: '/schedule/trainer-schedule'
            },
            {
                id: 2,
                name: 'Attendances',
                icon: require('./../../assets/images/attendance.png'),
                path: '/schedule/trainer-schedule'
            }
        ] : []),
        
        // Customer-specific menu items
        ...(userInfo?.role?.includes('Customer') ? [
            {
                id: 2,
                name: 'Add Dog',
                icon: require('./../../assets/images/add.png'),
                path: '/dog/add-dog'
            },
            {
                id: 3,
                name: 'My Dogs',
                icon: require('./../../assets/images/dog.png'),
                path: '/dog/my-dog'
            },
            {
                id: 4,
                name: 'Transactions',
                icon: require('./../../assets/images/transaction.png'),
                path: '/transaction/transaction-history'
            },
            {
                id: 5,
                name: 'Wishlists',
                icon: require('./../../assets/images/wishlist.png'),
                path: '/wishlist/my-wishlist'
            }
        ] : []),

        // Common menu items for all roles
        {
            id: 6,
            name: 'Share App',
            icon: require('./../../assets/images/share_1.png'),
            path: 'share'
        },
        {
            id: 7,
            name: 'Logout',
            icon: require('./../../assets/images/logout.png'),
            path: 'logout'
        }
    ];

    return (
    <View style={{
        marginTop:50
    }}>
      <FlatList
        data={menuList}
        numColumns={2}
        renderItem={({item, index}) =>(
            <TouchableOpacity 
            onPress={()=>onMenuClick(item)}
            style={{
                display:'flex',
                flexDirection:'row',
                alignItems:'center',
                gap:8,
                flex:1,
                padding:12,
                borderRadius:15,
                borderWidth:1,
                margin:8,
                backgroundColor:'#fff',
                minHeight: 80,
            }}>
                <Image source={item.icon} 
                    style={{
                        width: 40,
                        height: 40,
                        marginRight: 4
                    }}
                />

                <Text style={{
                    fontSize:15,
                    flex:1,
                    flexWrap: 'wrap',
                    textAlign: 'left',
                }}>{item.name}</Text>

            </TouchableOpacity>
        )}
      />

      <Text style={{
        textAlign:'center',
        marginTop:50,
      }}>Project by DTMS @ 2025</Text>
    </View>
  )
}
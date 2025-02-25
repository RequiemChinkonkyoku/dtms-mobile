import { View, Text, FlatList, Image, TouchableOpacity, Share, Alert } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { useAuth } from '../../contexts/AuthContext';

export default function MenuList() {
  
    const router = useRouter();
    const { logout } = useAuth();

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

    const menuList=[
        {
            id:1,
            name:'Add Dog',
            icon:require('./../../assets/images/add.png'),
            path:'/dog/add-dog'
        },
        {
            id:2,
            name:'My Dogs',
            icon:require('./../../assets/images/dog.png'),
            path:'/dog/my-dog'
        },
        {
            id:3,
            name:'Share App',
            icon:require('./../../assets/images/share_1.png'),
            path:'share'
        },
        {
            id:4,
            name:'Logout',
            icon:require('./../../assets/images/logout.png'),
            path:'logout'
        },
    ]

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
                gap:10,
                flex:1,
                padding:10,
                borderRadius:15,
                borderWidth:1,
                margin:10,
                backgroundColor:'#fff',
            }}>
                <Image source={item.icon} 
                    style={{
                        width:50,
                        height:50
                    }}
                />

                <Text style={{
                    fontSize:20,
                    flex:1
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
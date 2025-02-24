import { View, Text, Image, TextInput } from 'react-native'
import React from 'react'
import Feather from '@expo/vector-icons/Feather';

export default function Header() {
    return (
        <View style={{
            padding: 20,
            paddingTop: 20,
            borderBottomLeftRadius:20,
            borderBottomRightRadius:20
        }}>
            <View style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10
            }}>
                <View>
                    <Text style={{
                        color: "black",
                        fontSize: 19,
                    }}>Welcome, </Text>
                    <Text style={{
                        fontSize: 19,
                        color:'#fff'
                    }}></Text>
                </View>
            </View>

            {/*Search bar*/}
            <View style={{
                display:'flex',
                flexDirection:'row',
                gap:10,
                alignItems:'center',
                backgroundColor:'#fff',
                padding:10,
                marginVertical:10,
                marginTop:15,
                borderRadius:8
            }}>
                <Feather name="search" size={24} />
                <TextInput placeholder='Search...'
                    style={{
                        fontSize:17
                    }}
                />
            </View>
        </View>
    )
}
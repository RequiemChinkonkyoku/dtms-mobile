import { View, Text, Image } from 'react-native'
import React from 'react'

export default function UserIntro() {
  
  
    return (
    <View style={{
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        marginTop:30
    }}>
      <Image source={{uri: 'https://res.cloudinary.com/djy6ydaxz/image/upload/v1739695785/wxsydxyqpedbnbelinhe.jpg'}}
        style={{
            width:100,
            height:100,
            borderRadius:99
        }}
      />

      <Text style={{
        fontSize:20
      }}>UserName</Text>

      <Text style={{
        fontSize:16
      }}>Email Address</Text>

    </View>
  )
}
/* eslint-disable */

import React, { Component } from 'react'
import { View, TouchableOpacity, Image } from 'react-native'
import Dialog from "react-native-dialog";
import Text from '../Component/Text'
export default GoogleButton = (props) =>
    <TouchableOpacity style={{
        height: 50, width: 160, alignItems: "center", flexDirection: "row",
        borderRadius: 25, backgroundColor: "#fff", paddingHorizontal: 12
    }} {...props} >
        <Image source={require('../assets/google_logo_new.png')}
            style={{
                height: 37, width: '95%', resizeMode: "contain",
                borderRadius: 25, marginTop: 5, alignSelf: "center"
            }}
        />
       
    </TouchableOpacity>

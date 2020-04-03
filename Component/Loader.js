/* eslint-disable */

import React, { Component } from 'react';
import { Button, Icon } from 'react-native-elements';
import { TouchableOpacity, View, Dimensions, ActivityIndicator } from 'react-native'
import { themeColor, pinkColor, } from '../Constant/index';
import LinearGradient from 'react-native-linear-gradient';
import Text from './Text'
const Height = Dimensions.get('screen').height
export default Loader = ({isVisible}) => (
    isVisible ? 
    <View style={{
        flex: 1, height: Height - 30, position: "absolute", width: "100%",
        justifyContent: "center", alignItems: "center" , zIndex : 1200
    }}>
        <View style={{
            height: 100, width: 100, backgroundColor: "#fff", borderRadius: 12,
            justifyContent: "center", alignItems: "center"
        }}>
            <ActivityIndicator color = {'grey'} size = {'large'}  />
        </View>
    </View> : null
);
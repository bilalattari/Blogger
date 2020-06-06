/* eslint-disable */

import React, {Component} from 'react';
import {Header, Input, Icon} from 'react-native-elements';
import {StatusBar, View, Image, TouchableOpacity, Platform} from 'react-native';
import {themeColor, pinkColor} from '../Constant/index';
import Text from '../Component/Text'
import Logo from '../Component/LogoImage';
export default (CustomHeader = props => (
  <View>
    {/* {console.log(props)} */}
    <StatusBar backgroundColor={themeColor} translucent />
    <Header
      barStyle="light-content" // or directly
      containerStyle={{
        backgroundColor: themeColor,
        borderBottomColor: themeColor,
      }}
      leftComponent={{
        icon: props.home ? 'menu' : 'arrow-back',
        color: '#fff',
        onPress: () =>
          props.onPressBack
            ? props.onPressBack()
            : props.home
            ? props.onPress()
            : props.navigation.goBack(),
      }}
      centerComponent={
        <Text
          text={props.title}
          bold={true}
          fontFamily={props.fontFamily ? props.fontFamily : null}
        />
      }
      rightComponent={
        props.customImage ? (
          <Image
            source={{uri: props.customImage}}
            style={{
              height: 50,
              width: 50,
              borderRadius: 125,
              marginTop: 12,
              marginRight: 8,
              resizeMode: 'contain',
            }}
          />
        ) : props.icon ? (
          <TouchableOpacity
            style={{
              height: 60,
              width: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => props.navigation.navigate('Feedback')}>
            <Icon
              type={'font-awesome'}
              name={'bell-o'}
              color={'#fff'}
              style={{paddingTop: 12}}
              size={20}
            />
          </TouchableOpacity>
        ) : props.shop ? (
          <TouchableOpacity
            onPress={() => props.navigation.navigate('Yourchart')}>
            <Image
              source={require('../assets/cart.png')}
              style={{width: 30, height: 30}}
            />
          </TouchableOpacity>
        ) : props.home && props.bookmark ? (
          <Icon
            type={'font-awesome'}
            name={'bookmark-o'}
            color={'#fff'}
            size={20}
          />
        ) : props.rightIcon ? (
          <Icon type={'feather'} name={'user-plus'} color={'#fff'} size={20} />
        ) : null
      }
    />
  </View>
));

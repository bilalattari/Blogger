/* eslint-disable */
import React, {Component} from 'react';
import {Text} from 'react-native';
import {themeColor, pinkColor} from '../Constant/index';

let removeMediumOrRegular = font => {
  let checkMedium = font.indexOf('Medium') !== -1 ? true : false;
  let checkRegular = font.indexOf('Regular') !== -1 ? true : false;
  let updatedFont;
  if (checkMedium) {
    updatedFont = font.replace('Medium', 'Bold');
  }
  if (checkRegular) {
    updatedFont = font.replace('Regular', 'Bold');
  }
  console.log(updatedFont)
  return updatedFont;
};

export default (CustomText = props => {
 
  return (
    <Text
      style={[
        {
          fontSize: props.font ? props.font : 16,
          textAlign: props.align ? props.align : 'center',
          fontWeight: 'normal',
          letterSpacing: 0.3,
          fontFamily:
            props.fontFamily && props.bold
              ? removeMediumOrRegular(props.fontFamily)
              : props.fontFamily
              ? props.fontFamily
              : null,
          color: props.color ? props.color : '#fff',
          marginLeft: props.marginLeft ? props.marginLeft : 0,
        },
        props.style,
      ]}
      numberOfLines={props.numberOfLines ? props.numberOfLines : null}>
      {props.text}
    </Text>
  );
});

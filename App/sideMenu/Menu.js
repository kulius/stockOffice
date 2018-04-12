import {
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text
} from 'react-native';
import React from 'react';
import PropTypes from 'prop-types';
//component
import { Actions }   from 'react-native-router-flux';
//menuList
import sign          from '../screens/sign';
import URLinput      from '../screens/URLinput';
import orderList     from '../screens/orderList';
import stockCheck    from '../screens/stockCheck';
//menustyle
import inputDataFuncs from '../libs/dataFuncs.js';
import menuStyles    from '../styles/menuStyles';


const uri   = 'https://pickaface.net/gallery/avatar/Opi51c74d0125fd4.png';


export default function Menu() {

  return (
    <ScrollView
      scrollsToTop={false}
      style={menuStyles.menu}>

      <View style={menuStyles.avatarContainer}>
        <Image
          style={menuStyles.avatar}
          source={{ uri }} />

      </View>

      <View style={menuStyles.viewItemContainer}>
        <Text style={menuStyles.name}>Your name</Text>
      </View>


      <View style={menuStyles.viewItemContainer}>
        <TouchableOpacity
          style={menuStyles.itemContainer}
          onPress={() => { Actions.orderList(); } } >
          <Image
            style={menuStyles.icon}
            source={ require('../assets/ic_view_list.png') } />
          <Text style={menuStyles.item}>
            盤點
          </Text>
        </TouchableOpacity>
      </View>

      <View style={menuStyles.viewItemContainer}>
        <TouchableOpacity
          style={menuStyles.itemContainer}
          onPress={() => { Actions.sign(); } } >
          <Image
            style={menuStyles.icon}
            source={ require('../assets/ic_account_circle.png') } />
          <Text style={menuStyles.item}>
            登入
          </Text>
        </TouchableOpacity>
      </View>

      <View style={menuStyles.viewItemContainer}>
        <TouchableOpacity
          style={menuStyles.itemContainer}
          onPress={() => { inputDataFuncs.getFormattedDatetime(); } } >
          <Image
            style={menuStyles.icon}
            source={ require('../assets/ic_settings_ethernet.png') } />
          <Text
            style={menuStyles.item}>
            URL設定
          </Text>
        </TouchableOpacity>
      </View>


    </ScrollView>
  );
}

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
import ModalDropdown from 'react-native-modal-dropdown';
//menuList
import sign          from '../screens/sign';
import URLinput      from '../screens/URLinput';
import orderList     from '../screens/orderList';
import stockCheck    from '../screens/stockCheck';
//menustyle
import menuStyles    from '../styles/menuStyles';


const uri   = 'https://pickaface.net/gallery/avatar/Opi51c74d0125fd4.png';


export default function Menu() {

  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
      manager: false,
      realm: null,
    };
  }

  componentWillMount() {
    Realm.open({
      schema: [
        {name:       'options',
         properties: {URL:         {type: 'string'},
                      userAccount: {type: 'string'},
                      userPwd:     {type: 'string'},
                      accIdentity: {type: 'int'},
                      manager:     {type: 'bool'}
                      }
        }
      ]
    }).then(realm => {
      let rmObjectOptions = realm.objects('options');

      if (rmObjectOptions.length==0) {
        realm.write(() => {
          realm.create('options', {
            URL:         "http://60.250.59.24:8069",
            userAccount: "",
            userPwd:     "",
            accIdentity: 0,
            manager:     false
          });
        });
        console.log(rmObjectOptions[0].URL);
      }

      this.setState({manager: rmObjectOptions[0].manager});
      this.setState({ realm });

    });
  }

  return (
    <ScrollView scrollsToTop={false} style={menuStyles.menu}>
      <View style={menuStyles.avatarContainer}>
        <Image
          style={menuStyles.avatar}
          source={{ uri }} />
        <Text style={menuStyles.name}>Your name</Text>
      </View>

      <View>
        <TouchableOpacity
          style={menuStyles.itemContainer}
          onPress={() => { Actions.orderList(); } } >
          <Image
            style={menuStyles.icon}
            source={ require('../assets/ic_view_list.png') } />
          <Text
            style={styles.item}>
            盤點
          </Text>
        </TouchableOpacity>
      </View>

      <View>
        <TouchableOpacity
          style={menuStyles.itemContainer}
          onPress={() => { Actions.sign(); } } >
          <Image
            style={menuStyles.icon}
            source={ require('../assets/ic_account_circle.png') } />
          <Text
            style={styles.item}>
            登入
          </Text>
        </TouchableOpacity>
      </View>

      <View>
        <TouchableOpacity
          style={menuStyles.itemContainer}
          onPress={() => { Actions.URLinput(); } } >
          <Image
            style={menuStyles.icon}
            source={ require('../assets/ic_settings_ethernet.png') } />
          <Text
            style={styles.item}>
            URL設定
          </Text>
        </TouchableOpacity>
      </View>


    </ScrollView>
  );
}

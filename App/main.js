import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  Platform,
  TextInput,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import SideMenu   from 'react-native-side-menu';

import Menu       from './sideMenu/Menu';
import mainStyles from './styles/mainStyles';

const image = require('./assets/menu.png');

export default class main extends Component<{}> {

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

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  updateMenuState(isOpen) {
    this.setState({ isOpen });
  }

  onMenuItemSelected = item =>
    this.setState({
      isOpen: false,
      selectedItem: item,
    });

  errorHandler(code, message) {
    this.setState({
      error: !code ? null :
        {
          code,
          message,
        }
    })
  }

  render() {
    const menu = <Menu/>;
    return (
      <SideMenu
        menuPosition='right'
        menu={menu}
        isOpen={this.state.isOpen}
        onChange={isOpen => this.updateMenuState(isOpen)}>
        <View style={mainStyles.signContainer}>

          <TouchableOpacity
            onPress={this.toggle}
            style={mainStyles.button}>
            <Image
              source={image}
              style={{ width: 32, height: 32}}/>
          </TouchableOpacity>

        </View>
      </SideMenu>
    );
  }
}

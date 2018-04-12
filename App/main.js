import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  Platform,
  TextInput,
  StyleSheet,
  AsyncStorage,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import SideMenu       from 'react-native-side-menu';
import { Actions }    from 'react-native-router-flux';
import Menu           from './sideMenu/Menu';
import mainStyles     from './styles/mainStyles';
import inputDataFuncs from './libs/dataFuncs.js';
const Realm = require('realm');
const image = require('./assets/menu.png');

export default class main extends Component<{}> {

  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
      realm: null,
    };
  }

  componentWillMount() {
    Realm.open({
      schema: [
        {name:       'orderList',
         primaryKey: 'odCode',
         properties: {odCode:      {type: 'string'},
                      odNameCht:   {type: 'string', default: ""},
                      odChkSta :   {type: 'string', default: "0"},
                      goodsDetail: {type: 'list', objectType:'listComponent', default: []}
                     }
        },
        {name:       'listComponent',
         properties: {odCode:       {type: 'string' , default: ""},
                      goodCode:     {type: 'string'},
                      goodNameCht:  {type: 'string' , default: ""},
                      goodAmoOdoo:  {type: 'string'},
                      goodAmoFir:   {type: 'string', default: "0"},
                      goodAmoSec:   {type: 'string', default: "0"},
                      goodChkStaFir:{type: 'string', default: "0"},
                      goodChkStaSec:{type: 'string', default: "2"}
                     }
        },
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
            URL:         "http://60.250.59.19:8069",
            userAccount: "",
            userPwd:     "",
            accIdentity: 0,
            manager:     false
          });
        });
      }

      this.setState({ realm });

      realm.close();
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

  render() {
    const menu = <Menu/>;
    return (
      <SideMenu
        menuPosition='right'
        menu={menu}
        isOpen={this.state.isOpen}
        onChange={isOpen => this.updateMenuState(isOpen)}>


        <View style={mainStyles.signContainer}>
          <ImageBackground
            source={ require('./assets/mainBackground.png') }
            style={{height:667,width:360}}>

            <View style={mainStyles.toogleContainer}>
              <TouchableOpacity
                onPress={this.toggle}
                style={mainStyles.button}>
                <Image
                  source={image}
                  style={{ width: 32, height: 32}}/>
                </TouchableOpacity>
            </View>


            <View style={mainStyles.container}>



              <TouchableOpacity
                onPress={() => { Actions.orderList(); } }
                style={mainStyles.viewItemContainer}>
                <Image
                  source={ require('./assets/icon01_barcode.png') }
                  style={{ width: 35, height: 35}}/>

                  <Text style={mainStyles.itemFont}>
                    盤點
                  </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => { Actions.sign(); } }
                style={mainStyles.viewItemContainer}>
                <Image
                  source={ require('./assets/icon02_login.png') }
                  style={{ width: 35, height: 35}}/>

                  <Text style={mainStyles.itemFont}>
                    登入
                  </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => { inputDataFuncs.getFormattedDatetime(); } }
                style={mainStyles.viewItemContainer}>
                <Image
                  source={ require('./assets/icon03_URL.png') }
                  style={{ width: 35, height: 35}}/>

                  <Text style={mainStyles.itemFont}>
                    URL設定
                  </Text>
              </TouchableOpacity>


            </View>
          </ImageBackground>
        </View>

      </SideMenu>


    );
  }
}

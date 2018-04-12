import React, { Component } from 'react';
import { Text, View, Alert, TouchableOpacity, ImageBackground } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { FormLabel, FormInput, FormValidationMessage, Button } from 'react-native-elements'

import signStyles from '../styles/signStyles.js';
const Realm = require('realm');

export default class URLinput extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      stateURL:       "",
      realm   :       null,
      optionsObject:  null,
      errorState  :   0,
      errorMessage:   "data error!",
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

        if (rmObjectOptions.length>0) {
          this.setState({
            stateURL: rmObjectOptions[0].URL,
          });
        }
        this.setState({ optionsObject: rmObjectOptions[0] });
        this.setState({ realm });
      });
    }

  //func for inputText change URL
  changeStateURL(inputURL) {
    this.setState({
      stateURL: inputURL
    });
  }

  //input the settings to Realm
  inputDataRealmOptions() {
    this.state.realm.write(() => {
      this.state.optionsObject.URL = this.state.stateURL;
    })

    Alert.alert(
      'Success',
      '資料儲存成功',
      [ {text: 'OK', onPress: () => this.pressOK()} ],
      { cancelable: false }
    )
  }

  pressOK() {
    this.setState({visible: false});
    Actions.pop();
  }

  render() {
   return (
     <ImageBackground source={ require('../assets/mainBackground.png') } style={{height:667,width:360}}>

       <View style={signStyles.signContainer}>

         <View style={signStyles.inContainer}>
           <FormLabel>URL設定</FormLabel>
           <FormInput
             ref={"inputURL"}
             placeholder={this.state.stateURL}
             placeholderTextColor='#5F769A'
             onChangeText={(text)=>this.changeStateURL(text)}  />
         </View>

         { this.state.errorState == 1 &&
           <View style={signStyles.inContainer}>
             <FormValidationMessage>{this.state.errorMessage}</FormValidationMessage>
           </View>
         }

         <View style={signStyles.inContainer}>
           <TouchableOpacity style={signStyles.loginBtn} onPress={ _ => this.inputDataRealmOptions()}>
             <Text style={signStyles.loginText}>
               設定
             </Text>

           </TouchableOpacity>
         </View>

       </View>
     </ImageBackground>
    );
  }
}

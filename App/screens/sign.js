import React, { Component }  from 'react';
import { Text, View, Alert, AsyncStorage, TouchableOpacity, ImageBackground } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'

import signStyles from '../styles/signStyles.js';
const Realm = require('realm');

export default class sign extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      stateAcc:       "",
      statePwd:       "",
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
            stateAcc: rmObjectOptions[0].userAccount,
            statePwd: rmObjectOptions[0].userPwd
          });
        }
        this.setState({ optionsObject: rmObjectOptions[0] });
        this.setState({ realm });
      });

  }

  //func for inputText change Account
  changeStateAcc(inputAcc) {
    this.setState({
      stateAcc: inputAcc
    });
  }

  //func for inputText change Password
  changeStatePwd(inputPwd) {
    this.setState({
      statePwd: inputPwd
    });
  }

  //input the settings to Realm
  inputDataRealmOptions() {
    this.state.realm.write(() => {
      this.state.optionsObject.userAccount = this.state.stateAcc;
      this.state.optionsObject.userPwd     = this.state.statePwd;
      if ( this.state.stateAcc=="admin" && this.state.statePwd=="admin" ){
        AsyncStorage.multiSet([ ['identity', "yes"] ]);
        this.state.optionsObject.manager=true;
      } else {
        AsyncStorage.multiSet([ ['identity', "no"] ]);
        this.state.optionsObject.manager=false;
      }
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
     <ImageBackground
       source={ require('../assets/mainBackground.png') }
       style={{height:667,width:360}}>

       <View style={signStyles.signContainer}>

         <View style={signStyles.inContainer}>
           <Text style={signStyles.helloText}>Hello!</Text>
           <Text style={signStyles.welcomeText}>Welcome To Stocktake System.</Text>
         </View>

         <View style={signStyles.inContainer}>
           <FormLabel>Account</FormLabel>
           <FormInput
            ref={"inputAccount"}
            placeholder={this.state.stateAcc}
            placeholderTextColor='#5F769A'
            onChangeText={(text)=>this.changeStateAcc(text)} />
         </View>

         <View style={signStyles.inContainer}>
           <FormLabel>Password</FormLabel>
           <FormInput
            ref={"inputPassword"}
            onChangeText={(text)=>this.changeStatePwd(text)}
            secureTextEntry={true}/>

           {this.state.errorState == 1 &&
            <FormValidationMessage>{this.state.errorMessage}</FormValidationMessage> }
         </View>

         <View style={signStyles.inContainer}>
           <TouchableOpacity style={signStyles.loginBtn} onPress={ _ => this.inputDataRealmOptions()}>
             <Text style={signStyles.loginText}>
               Login
             </Text>
           </TouchableOpacity>
         </View>

       </View>

     </ImageBackground>
    );
  }
}

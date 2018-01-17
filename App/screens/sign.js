import React, { Component }  from 'react';
import { Text, View, Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { FormLabel, FormInput, FormValidationMessage, Button } from 'react-native-elements'

import mainStyles  from '../styles/mainStyles';
const Realm = require('realm');

export default class sign extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      stateAcc: "",
      statePwd: "",
      realm   : null,
      optionsObject: null,
      errorState  : 0,
      errorMessage: "data error!",
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
       <View style={mainStyles.signContainer}>
         <FormLabel>Account</FormLabel>
         <FormInput
           ref={"inputAccount"}
           placeholder={this.state.stateAcc}
           onChangeText={(text)=>this.changeStateAcc(text)} />


         <FormLabel>Password</FormLabel>
         <FormInput
           ref={"inputPassword"}
           onChangeText={(text)=>this.changeStatePwd(text)}
           secureTextEntry={true}
         />

         { this.state.errorState == 1 &&
           <FormValidationMessage>{this.state.errorMessage}</FormValidationMessage>
         }

         <Button
           iconRight={{name:'forward'}}
           title='確認'
           onPress={() => { this.inputDataRealmOptions() } }
         />

       </View>
    );
  }
}

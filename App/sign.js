import React, { Component } from 'react';
import { Text, View, }      from 'react-native';

import mainStyles  from './styles/mainStyles';
import { Actions } from 'react-native-router-flux';
import { FormLabel, FormInput, FormValidationMessage, Button } from 'react-native-elements'
const Realm = require('realm');

export default class sign extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      stateURL: "",
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
                      userPwd:     {type: 'string'}
                      }
        }
      ]
      }).then(realm => {
        let rmObjectOptions = realm.objects('options');

        if (rmObjectOptions.length>0) {
          this.setState({
            stateURL: rmObjectOptions[0].URL,
            stateAcc: rmObjectOptions[0].userAccount,
            statePwd: rmObjectOptions[0].userPwd
          });
          console.log(rmObjectOptions[0].URL);
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
      this.state.optionsObject.URL         = this.state.stateURL;
      this.state.optionsObject.userAccount = this.state.stateAcc;
      this.state.optionsObject.userPwd     = this.state.statePwd;
    })
  }


  render() {
   return (
       <View style={mainStyles.signContainer}>
         <FormLabel>URL</FormLabel>
         <FormInput
           ref={"inputURL"}
           placeholder={this.state.stateURL}
           onChangeText={(text)=>this.changeStateURL(text)}  />

         <FormLabel>Account(可忽略)</FormLabel>
         <FormInput
           ref={"inputAccount"}
           placeholder={this.state.stateAcc}
           onChangeText={(text)=>this.changeStateAcc(text)} />


         <FormLabel>Password(可忽略)</FormLabel>
         <FormInput
           ref={"inputPassword"}
           placeholder={this.state.statePwd}
           onChangeText={(text)=>this.changeStatePwd(text)} />


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

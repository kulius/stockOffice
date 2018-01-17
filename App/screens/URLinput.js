import React, { Component } from 'react';
import { Text, View, Alert } from 'react-native';

import mainStyles from '../styles/mainStyles';
import { Actions } from 'react-native-router-flux';
import { FormLabel, FormInput, FormValidationMessage, Button } from 'react-native-elements'
const Realm = require('realm');

export default class URLinput extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      stateURL: "",
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
            stateURL: rmObjectOptions[0].URL,
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
       <View style={mainStyles.signContainer}>
         <FormLabel>URL</FormLabel>
         <FormInput
           ref={"inputURL"}
           placeholder={this.state.stateURL}
           onChangeText={(text)=>this.changeStateURL(text)}  />

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

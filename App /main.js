import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput
} from 'react-native';
import mainStyles from './styles/mainStyles';


export default class main extends Component<{}> {

  constructor(props) {
      super(props);
      this.state = { text: 'Useless Placeholder' };
  }

  render() {
    return (
      <View style={mainStyles.signContainer}>
        <TextInput
          style={{height: 40}}
          placeholder="Type here to translate!"
          onChangeText={(text) => this.setState({text})}
        />
        <Text style={{padding: 10, fontSize: 42}}>
          {this.state.text.split(' ').map((word) => word && '🍕').join(' ')}
        </Text>
      </View>
    );
  }
}

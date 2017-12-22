import React, { Component } from 'react';
import {
  Platform,
  ListView,
  Text,
  View,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
	TouchableHighlight,
  KeyboardAvoidingView,
} from 'react-native';
import Tabbar from 'react-native-tabbar';
import { Button } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import stockStyles from '../styles/stockStyles';
import DataFuncs   from '../libs/dataFuncs';

const Realm = require('realm');

export default class orderList extends Component<{}> {

  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      listViewData: Array(),
      order: "",
      realm: null,
    };
  }

  //realm first setting , schema description at bottom
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
         properties: {odCode:      {type: 'string' , default: ""},
                      goodCode:    {type: 'string'},
                      goodNameCht: {type: 'string' , default: ""},
                      goodAmoOdoo: {type: 'string'},
                      goodAmoFir:  {type: 'string', default: "0"},
                      goodAmoSec:  {type: 'string', default: "0"}
                     }
        },
        {name:       'options',
         properties: {URL:         {type: 'string'},
                      userAccount: {type: 'string'},
                      userPwd:     {type: 'string'}
                      }
        }
      ]
    }).then(realm => {
      const newData = [...this.state.listViewData];
      let rmObjectOrderList = realm.objects('orderList');
      if (rmObjectOrderList.length > 0) {
        for (var loop = 0 ; loop < rmObjectOrderList.length ; loop ++ ) {
          newData.push(rmObjectOrderList[loop].odCode);
        }
      }
      let rmObjectOptions = realm.objects('options');

      if (rmObjectOptions.length==0) {
        realm.write(() => {
          realm.create('options', {
            URL:         "http://60.250.59.24:8069",
            userAccount: "",
            userPwd:     ""
          });
        });
        console.log(rmObjectOptions[0].URL);
      }

      this.setState({listViewData: newData});
      this.setState({ realm });

    });
  }

  //func for inputText change
  changeState(order) {
    this.setState({
      order: order
      });
  }

  //func for list delete
  deleteRow(secId, rowId, rowMap) {
    console.log(secId + "  " + rowId + "  " + rowMap);
    rowMap[`${secId}${rowId}`].closeRow();
    const newData = [...this.state.listViewData];

    this.deleteDataRealm(newData[rowId]);

    newData.splice(rowId, 1);
    this.setState({listViewData: newData});
  }

  //func for appned list
  pushRow(odCode) {
    if (odCode != "") {
      const newData = [...this.state.listViewData];
      newData.push(odCode);
      this.setState({listViewData: newData});

      this.cleanUpTextInput("orderNumber");
      this.refs["orderNumber"].focus();
      this.setState({order: ""});

      this.fetchData(odCode);

    }
    //todo if else alert window
    //todo disable keyboard on oder textinput
  }

  //when delete row, it will delete data of order and goods in realm
  deleteDataRealm(orderCode) {
    var compare = "odCode == '" + orderCode + "'";
    if (orderCode != ""){
      let rmObjectOrderList = this.state.realm.objects('orderList').filtered(compare)[0];
      this.state.realm.write(() => {
        this.state.realm.delete(rmObjectOrderList);
      })

    }
  }

  //creat new data of order list
  creatRealmListData(iOdCode) {
    this.state.realm.write(() => {
      this.state.realm.create('orderList', {
        odCode:    iOdCode
      });
    });
  }

  //creat new data of goods detail by push data like list into schema 'orderList'
  creatRealmGoodData(iOdCode, iGoodCode, iGoodAmoOdoo) {
    console.log(iGoodCode);
    this.state.realm.write(() => {
      var listObject = this.state.realm.objects('orderList').filtered("odCode == '" + iOdCode + "'");
      listObject[0].goodsDetail.push({
        goodCode:    iGoodCode,
        goodAmoOdoo: iGoodAmoOdoo,
      });
      for(var i = 0; i< listObject[0].goodsDetail.length;i++)
        console.log(listObject[0].goodsDetail[i].goodCode);
    });
  }

  // connect to odoo to get goods detail from order list
  fetchData (orderCode) {
    // var queryURL = 'http://60.250.59.24:8069/alltopcheck/alltopcheck/json';

    var queryURL = this.state.realm.objects('options')[0].URL + "/alltopcheck/alltopcheck/json";
    console.log(queryURL);
    fetch(queryURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        params: {"odCode": orderCode }
      })
    })
    .then((responseData) => responseData.json() )
    .then((responseData) => {
      if (responseData) {
        //creat list first
        this.creatRealmListData(orderCode);

        //creat goods detail second
        var jsString = responseData.result.replace("{","");
        for (var i = 0 ; i<responseData.result.length ; i++) {
          jsString = jsString.replace('"',"").replace("data","").replace(":","").replace("[","").replace("]","").replace("}","").replace(",","");
        }
        var jsArray = jsString.split("{");

        for (var i = 1 ; i<jsArray.length ; i++) {
          var tempArray = jsArray[i].split(" ");
          this.creatRealmGoodData(orderCode, tempArray[3], tempArray[1])
        }
      }
    })
    .catch((error) => {
      console.warn(error);
    })
    .done();
  }

  //change page to stockCheck with params of order number
  changeToCheck(orderNumber, checkState) {
    Actions.stockCheck({orderNumber: orderNumber, checkState: checkState});
  }

  //change page to settings
  changeToSettings() {
    Actions.settings();
  }

  //func used inside pushRow
  cleanUpTextInput(inputRef){
    this.refs[inputRef].setNativeProps({text: ''});
  }


  render() {
    console.ignoredYellowBox = ['Remote debugger'];
    return (
      <KeyboardAwareScrollView>
      <View style={stockStyles.mainContainer}>

        <View style={stockStyles.viewContainerR}/>



        <View style={stockStyles.viewContainerR}>

          <TouchableOpacity
            onPress={ _ => this.changeToSettings()}

            >
            <Image
              source={require('../assets/ic_settings.png')}/>
          </TouchableOpacity>


          <Text style={{fontSize:20, textAlign:'center', left:10}}>
            盤點單條碼：
          </Text>

          <TextInput
            autoFocus={true}
            placeholder='請掃描QRCode'
            clearButtonMode='always'
            style={stockStyles.textInputContainer}
            onChangeText={(text)=>this.changeState(text)}
            ref={"orderNumber"}
            />
        </View>

        <View style={stockStyles.viewContainerR}>
          <TouchableOpacity
            style={stockStyles.tabItem}
            onPress={ _ => this.pushRow(this.state.order)}>
            <Image
              style={{width: 118*0.75, height: 43*0.75}}
              source={require('../assets/checkButton.png')}/>
          </TouchableOpacity>
        </View>

        <View style={stockStyles.viewRowBarContainer}>

          <View style={stockStyles.viewRowBar1}>

            <Text style={{fontSize:20, textAlign:'center', color:'white'}} >
              盤點單條碼
            </Text>

          </View>
        </View>

        <View style={stockStyles.viewContainerL}>


          {
  					this.state.listViewData.length > 0 &&

  					<SwipeListView
  						dataSource={this.ds.cloneWithRows(this.state.listViewData)}
  						renderRow={ (data, secId, rowId) => (
  							<TouchableHighlight
  								onPress={ _ => console.log('You touched me') }
  								style={stockStyles.rowFront}
  								underlayColor={'#AAA'}
  							>
  								<View style={stockStyles.rowView}>
                    <View style={{flex: 3}}>
  								     <Text style={stockStyles.listText}>{data}</Text>
                    </View>

                    <TouchableOpacity
                      onPress={ _ => this.changeToCheck(data, 0)}
                      >
                      <Image
                        style={{width: 118*0.75, height: 43*0.75}}
                        source={require('../assets/firstCheck.png')}/>
                    </TouchableOpacity>


                    <TouchableOpacity
                      onPress={ _ => this.changeToCheck(data, 1)}
                      >
                      <Image
                        style={{width: 118*0.75, height: 43*0.75, left: 10, right: 5}}
                        source={require('../assets/secondCheck.png')}/>
                    </TouchableOpacity>
  								</View>

  							</TouchableHighlight>
  						)}
  						renderHiddenRow={ (data, secId, rowId, rowMap) => (
  							<View style={stockStyles.rowBack}>

  								<TouchableOpacity style={stockStyles.backRightBtn} onPress={ _ => this.deleteRow(secId, rowId, rowMap) }>
  									<Text style={stockStyles.backTextWhite}>刪除</Text>
  								</TouchableOpacity>
  							</View>
  						)}
  						rightOpenValue={-75}
  					/>
  				}


        </View>

      </View>
    </KeyboardAwareScrollView>
    );
  }
}

/*
schema: [
   name:       'orderList',
   primaryKey: 'odCode',
   properties: {odCode:      {type: 'string'},
                code of order
                odNameCht:   {type: 'string'},
                chinese name of order
                odNameCht:   {type: 'string'},

                odChkSta :   {type: 'string'},
                goodsDetail: {type: 'list', objectType:'listComponent'}

   name:       'listComponent',
   properties: {odCode:      {type: 'string'},
                goodCode:    {type: 'string'},
                goodNameCht: {type: 'string'},
                goodAmoOdoo: {type: 'int'},
                goodAmoFir:  {type: 'int', default: 0},
                goodAmoSec:  {type: 'int', default: 0}

  name:       'options',
   properties: {URL:         {type: 'string'},
                userAccount: {type: 'string'},
                userPwd:     {type: 'string'}


*/

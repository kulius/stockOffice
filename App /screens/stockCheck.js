import React, { Component } from 'react';
import {
  Platform,
  ListView,
  Text,
  View,
  Alert,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
	TouchableHighlight,
  WritableMap
} from 'react-native';
import FormData from 'form-data';
import Tabbar from 'react-native-tabbar';
import { Button } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import AwesomeAlert from 'react-native-awesome-alerts';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import stockStyles from '../styles/stockStyles';
import DataFuncs   from '../libs/dataFuncs';

const Realm = require('realm');

export default class stockCheck extends Component<{}> {
  constructor(props) {
    super(props);
    this.dsNUM = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.dsAMO = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      listViewDataNUM:     Array(),
      listViewDataAMO:     Array(),
      listViewDataAMOodoo: Array(),
      dataGoodState:       Array(),
      arForSecSee:         Array(),
      showAlert: false,
      stockAmount: "",
      stockNum: "",
      realm: null,
      findcount: "",
      orderNumber: this.props.orderNumber,
      checkState:  this.props.checkState,
    };
  }

  //funcs about alert
  showAlert = () => {
    this.setState({
      showAlert: true
    });
  };

  //realm first setting
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
        const newDataNUM     = [...this.state.listViewDataNUM];
        const newDataAMO     = [...this.state.listViewDataAMO];
        const newDataAMOodoo = [...this.state.listViewDataAMOodoo];
        const newDataSee     = [...this.state.arForSecSee];
        const newDataSta     = [...this.state.dataGoodState];

        let rmObjectOrderList = realm.objects('orderList').filtered("odCode == '" + this.state.orderNumber + "'")[0];


        if (rmObjectOrderList) {
          for (var loop = 0 ; loop < rmObjectOrderList.goodsDetail.length ; loop ++ ) {
            newDataNUM.push(rmObjectOrderList.goodsDetail[loop].goodCode);
            if (this.state.checkState == 0) {
              newDataAMO.push(rmObjectOrderList.goodsDetail[loop].goodAmoFir);
            } else if (this.state.checkState == 1) {
              newDataAMO.push(rmObjectOrderList.goodsDetail[loop].goodAmoSec);
              newDataSee.push(rmObjectOrderList.goodsDetail[loop].goodAmoFir);
            }

            newDataAMOodoo.push(rmObjectOrderList.goodsDetail[loop].goodAmoOdoo);
            newDataSta.push("0");
          }
        }
        this.setState({listViewDataNUM: newDataNUM, listViewDataAMO: newDataAMO,
                       listViewDataAMOodoo: newDataAMOodoo, dataGoodState: newDataSta,
                       arForSecSee: newDataSee});

        this.setState({ realm });
      });
    }

  //func for inputText change number
  changeStateNum(stockNum) {
    this.setState({
      stockNum: stockNum
    });
    var index = this.state.listViewDataNUM.indexOf(stockNum);
    if (index>=0) {
      this.refs["textAmount"].focus();
      if (this.state.checkState==0){
        this.setState({findcount: this.state.listViewDataAMOodoo[index]});
      } else if (this.state.checkState==1) {
        this.setState({findcount: this.state.arForSecSee[index]});
      }

    }
  }

  //func for inputText change amount
  changeStateAmount(stockAmount) {
    this.setState({
      stockAmount: stockAmount
    });
  }

  //delete data in list
  deleteRow(secId, rowId, rowMap) {
    this.deleteGoodRealm(this.state.listViewDataNUM[rowId]);

    rowMap[`${secId}${rowId}`].closeRow();

    const newDataNUM = [...this.state.listViewDataNUM];
    newDataNUM.splice(rowId, 1);
    this.setState({listViewDataNUM: newDataNUM});

    const newDataAMO = [...this.state.listViewDataAMO];
    newDataAMO.splice(rowId, 1);
    this.setState({listViewDataAMO: newDataAMO});

    const newDataAMOodoo = [...this.state.listViewDataAMOodoo];
    newDataAMOodoo.splice(rowId, 1);
    this.setState({listViewDataAMOodoo: newDataAMOodoo});

    const newDataGoodState = [...this.state.dataGoodState];
    newDataGoodState.splice(rowId, 1);
    this.setState({dataGoodState: newDataGoodState});

    const newDataSecSee = [...this.state.arForSecSee];
    newDataSecSee.splice(rowId, 1);
    this.setState({arForSecSee: newDataSecSee});
  }

  //push data to list
  pushRow(Num, Amount) {
    if (Num != "" && Amount != ""){
      var index = this.state.listViewDataNUM.indexOf(Num);
      if (index >= 0){
        this.updateSingleGoodsRealm(Num, Amount);
        const newDataNUM = Array();
        var tempNum = [...this.state.listViewDataNUM];
        tempNum.splice(index,1);
        newDataNUM.push(Num);
        newDataNUM.push(...tempNum);
        this.setState({listViewDataNUM: newDataNUM});

        const newDataAMO = Array();
        var tempAmo = [...this.state.listViewDataAMO];
        tempAmo.splice(index,1);
        newDataAMO.push(Amount);
        newDataAMO.push(...tempAmo);
        this.setState({listViewDataAMO: newDataAMO});

        const newDataAMOodoo = Array();
        var tempOdoo = [...this.state.listViewDataAMOodoo];
        newDataAMOodoo.push(tempOdoo[index]);
        tempOdoo.splice(index,1),
        newDataAMOodoo.push(...tempOdoo);
        this.setState({listViewDataAMOodoo: newDataAMOodoo});

        const newDataGoodState = Array();
        var tempState = [...this.state.dataGoodState];
        newDataGoodState.push(tempState[index]);
        tempState.splice(index,1),
        newDataGoodState.push(...tempState);
        this.setState({dataGoodState: newDataGoodState});

        const newDataSecSee = Array();
        var tempSecSee = [...this.state.arForSecSee];
        newDataSecSee.push(tempSecSee[index]);
        tempSecSee.splice(index,1),
        newDataSecSee.push(...tempSecSee);
        this.setState({arForSecSee: newDataSecSee});
      } else {
        this.updataCreatNewRealm(Num, Amount);
        const newDataNUM = Array();
        newDataNUM.push(Num);
        newDataNUM.push(...this.state.listViewDataNUM);
        this.setState({listViewDataNUM: newDataNUM});

        const newDataAMO = Array();
        newDataAMO.push(Amount);
        newDataAMO.push(...this.state.listViewDataAMO);
        this.setState({listViewDataAMO: newDataAMO});

        const newDataAMOodoo = Array();
        newDataAMOodoo.push("0");
        newDataAMOodoo.push(...this.state.listViewDataAMOodoo);
        this.setState({listViewDataAMOodoo: newDataAMOodoo});

        const newDataGoodState = Array();
        newDataGoodState.push("1");
        newDataGoodState.push(...this.state.listViewDataAMOodoo);
        this.setState({dataGoodState: newDataGoodState});

        const newDataSecSee = Array();
        newDataSecSee.push("0");
        newDataSecSee.push(...this.state.arForSecSee);
        this.setState({arForSecSee: newDataSecSee});
      }
      this.cleanUpTextInput("textQRcode");
      this.cleanUpTextInput("textAmount");
      this.refs["textQRcode"].focus();
      this.setState({findcount: ""});
    } else if (Num == "" && Amount == "") {
      Alert.alert(
        '錯誤',
        '編號及數量欄位為空，請重新輸入',
        [ {text: 'OK', onPress: () => this.setState({visible: false})} ],
        { cancelable: false }
      )
      this.refs["textQRcode"].focus();
    } else if (Amount == "") {
      Alert.alert(
        '錯誤',
        '數量欄位為空，請重新輸入',
        [ {text: 'OK', onPress: () => this.setState({visible: false})} ],
        { cancelable: false }
      )
      this.refs["textAmount"].focus();
    } else if (Num == "") {
      Alert.alert(
        '錯誤',
        '編號欄位為空，請重新輸入',
        [ {text: 'OK', onPress: () => this.setState({visible: false})} ],
        { cancelable: false }
      )
      this.refs["textQRcode"].focus();
    }
  }

  //use to clean up a textInput
  cleanUpTextInput(inputRef){
    this.refs[inputRef].setNativeProps({text: ''});
  }

  //delete single goods in a order
  deleteGoodRealm(stockNum) {
    this.state.realm.write(() => {
      var rmObject = this.state.realm.objects("orderList").filtered("odCode=='" + this.state.orderNumber + "'")[0];

      for(var x = 0; x < rmObject.goodsDetail.length; x++) {
        if (rmObject.goodsDetail[x].goodCode == stockNum) {
          var newGoodsDetail = [...rmObject.goodsDetail];
          newGoodsDetail.splice(x,1);
          rmObject.goodsDetail = newGoodsDetail;
        }
      }
    });
  }

  //update single goods in a order
  updateSingleGoodsRealm(stockNum, stockAmount) {
    this.state.realm.write(() => {
      var rmObject = this.state.realm.objects("orderList").filtered("odCode=='" + this.state.orderNumber + "'")[0];

      var index = -1;
      for (var x = 0; x < rmObject.goodsDetail.length; x++) {
        if (rmObject.goodsDetail[x].goodCode == stockNum) {
          index = x;
        }
      }

      if (this.state.checkState==0) {
        rmObject.goodsDetail[index].goodAmoFir = stockAmount;
        rmObject.goodsDetail[index].goodAmoSec = stockAmount;
      } else {
        rmObject.goodsDetail[index].goodAmoSec = stockAmount;
      }

    });
  }

  updataCreatNewRealm(stockNum, stockAmount) {
    this.state.realm.write(() => {
      var rmObject = this.state.realm.objects("orderList").filtered("odCode=='" + this.state.orderNumber + "'")[0];
      if (this.state.checkState == 0) {
        rmObject.goodsDetail.push({
          goodCode   : stockNum,
          goodAmoOdoo: "0",
          goodAmoFir : stockAmount,
        });
      } else if (this.state.checkState == 1) {
        rmObject.goodsDetail.push({
          goodCode   : stockNum,
          goodAmoOdoo: "0",
          goodAmoSec : stockAmount,
        });
      }
    })
  }

  //update goods inventory to realm
  updateGoodsChkSta(upCheck) {
    this.state.realm.write(() => {
      var rmObject = this.state.realm.objects("orderList").filtered("odCode=='" + this.state.orderNumber + "'")[0];
      if (upCheck == 0){
        rmObject.odChkSta = (this.state.checkState+1).toString();
      }
    });
  }

  //update goods inventory to odoo
  updateGoodsDetailOdoo() {
    var queryURL = this.state.realm.objects('options')[0].URL + '/alltopcheck/alltopcheck';
    var formData = new FormData();

    for(var i=0 ; i<this.state.listViewDataNUM.length ; i++) {
      formData.append("data" , {"goodState": parseInt(this.state.dataGoodState[i]),
                      "odCode": this.state.orderNumber,
                      "goodAmo": parseInt(this.state.listViewDataAMO[i]),
                      "goodCode": this.state.listViewDataNUM[i],
                      "goodOdState": this.state.checkState})
    }

    fetch(queryURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "params" : formData
      })
    })
    .then((responseData) => responseData.json() )
    .then((responseData) => {
      this.updateGoodsChkSta(0);
      Actions.pop({refresh: ({key: Math.random()})})
    })
    .catch((error) => {
      console.warn(error);
      Alert.alert(
        '錯誤',
        '無法順利上傳資料，\n請確認網路或網址正常',
        [ {text: 'OK', onPress: () => this.setState({visible: false})} ],
        { cancelable: false }
      )
    })
    .done();
  }

  //updata both of realm and odoo
  updateBoth() {
    this.updateGoodsDetailOdoo();
  }

  //only update realm data
  updateRealmOnly() {
    //the command below can pop the scene and refresh the scene
    Actions.pop({refresh: ({key: Math.random()})})
  }

  render() {
    return (

<KeyboardAwareScrollView>

      <View style={stockStyles.mainContainer}>

        <View style={stockStyles.viewContainerR}>

          <Text style={{fontSize:20, textAlign:'center'}} >
            條碼：
          </Text>

          <TextInput
            placeholder='請掃描QRCode'
            clearButtonMode='always'
            autoFocus= {true}
            style={stockStyles.textInputContainer}
            onChangeText={(text)=>this.changeStateNum(text)}
            ref={"textQRcode"}/>

          <Text style={{fontSize:20, textAlign:'center', paddingLeft: 5}} >
            {this.state.findcount}
          </Text>
        </View>



        <View style={stockStyles.viewContainerR}>
          <Text style={{fontSize:20, textAlign:'center'}} >
            數量：
          </Text>

          <TextInput
            placeholder='請輸入數量'
            clearButtonMode='always'
            style={stockStyles.textInputContainer}
            onChangeText={(text)=>this.changeStateAmount(text)}
            keyboardType='phone-pad'
            ref={"textAmount"}/>

            <TouchableOpacity
              style={stockStyles.tabItem}
              onPress={ _ => this.pushRow(this.state.stockNum, this.state.stockAmount)}>
              <Image
                style={{width: 118*0.75, height: 43*0.75}}
                source={require('../assets/checkButton.png')}/>
            </TouchableOpacity>
        </View>

        <View style={stockStyles.viewRowBarContainer}>

          <View style={stockStyles.viewRowBar1}>

            <Text style={{fontSize:20, textAlign:'center', color:'white'}} >
              條碼
            </Text>

          </View>
          <View style={stockStyles.viewRowBar2}>

            <Text style={{fontSize:20, textAlign:'center', color:'white'}} >
              odoo
            </Text>

          </View>
          <View style={stockStyles.viewRowBar2}>

            <Text style={{fontSize:20, textAlign:'center', color:'white'}} >
              數量
            </Text>

          </View>
        </View>

        <View style={stockStyles.viewContainerL}>


          {
  					this.state.listViewDataNUM.length > 0 &&

  					<SwipeListView
  						dataSource={this.dsNUM.cloneWithRows(this.state.listViewDataNUM)}
  						renderRow={ (data, secId, rowId) => (
  							<TouchableHighlight
  								onPress={ _ => console.log('You touched me') }
  								style={stockStyles.rowFront}
  								underlayColor={'#AAA'}
  							>
  								<View style={stockStyles.rowView}>
                    <View style={{flex:3.8}}>
  								    <Text style={stockStyles.rowTextNum}>{data}</Text>
                    </View>
                    <View style={{flex:1}}>
                      <Text style={stockStyles.rowTextAmo}>{this.state.listViewDataAMOodoo[rowId]}</Text>
                    </View>
                    <View style={{flex:1}}>
                      <Text style={stockStyles.rowTextAmo}>{this.state.listViewDataAMO[rowId]}</Text>
                    </View>
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

        <View style={stockStyles.tabContainer}>

          <TouchableOpacity
            style={stockStyles.tabItem}
            onPress={ _ => this.updateBoth()}>
            <Image
              style={{width: 125*1, height: 96*0.6}}
              source={require('../assets/endOrder.png')}/>
          </TouchableOpacity>

          <TouchableOpacity
            style={stockStyles.tabItem}
            onPress={ _ => this.updateRealmOnly()}>
            <Image
              style={{width: 125*1, height: 96*0.6}}
              source={require('../assets/onlySave.png')}/>

          </TouchableOpacity>


        </View>


      </View>
</KeyboardAwareScrollView>
    );
  }
}

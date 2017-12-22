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
  WritableMap
} from 'react-native';
import FormData from 'form-data';
import Tabbar from 'react-native-tabbar';
import { Button } from 'react-native-elements';
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
      deleteGoodRealmNUM:  Array(),
      stockAmount: "",
      stockNum: "",
      realm: null,
      orderNumber: this.props.orderNumber,
      checkState:  this.props.checkState,
    };
  }

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

        const newDataSta     = [...this.state.dataGoodState];

        let rmObjectOrderList = realm.objects('orderList').filtered("odCode == '" + this.state.orderNumber + "'")[0];


        if (rmObjectOrderList) {
          for (var loop = 0 ; loop < rmObjectOrderList.goodsDetail.length ; loop ++ ) {
            newDataNUM.push(rmObjectOrderList.goodsDetail[loop].goodCode);
            if(this.state.checkState==0){
              newDataAMO.push(rmObjectOrderList.goodsDetail[loop].goodAmoFir);
            }else{
              newDataAMO.push(rmObjectOrderList.goodsDetail[loop].goodAmoSec);
            }
            newDataAMOodoo.push(rmObjectOrderList.goodsDetail[loop].goodAmoOdoo);
            newDataSta.push("0");
          }
        }
        this.setState({listViewDataNUM: newDataNUM});
        this.setState({listViewDataAMO: newDataAMO});
        this.setState({listViewDataAMOodoo: newDataAMOodoo});
        this.setState({dataGoodState: newDataSta});

        this.setState({ realm });
      });
    }

  //func for inputText change number
  changeStateNum(stockNum) {
    this.setState({
      stockNum: stockNum
    });
    if (this.state.listViewDataNUM.indexOf(stockNum)>=0) {
      this.refs["textAmount"].focus();
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
  }

  pushRow(Num, Amount) {
    if (Num != "" && Amount != ""){
      var index = this.state.listViewDataNUM.indexOf(Num);
      if (index >= 0){
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
      } else {
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
      }
      this.cleanUpTextInput("textQRcode");
      this.cleanUpTextInput("textAmount");
      this.refs["textQRcode"].focus();
    }
    // else if (Num == "" && Amount == "") {
    //
    // }else if (Amount == "") {
    //
    // }else if (Num == "") {
    //
    // }
    //todo if else elert window
  }

  cleanUpTextInput(inputRef){
    this.refs[inputRef].setNativeProps({text: ''});
  }

  deleteGoodRealm(stockNum) {

  }

  //update goods inventory to realm
  updateGoodsDetail() {
    this.state.realm.write(() => {
      var rmObject = this.state.realm.objects("orderList").filtered("odCode=='" + this.state.orderNumber + "'")[0];

        for(var i = 0;i<this.state.listViewDataNUM.length;i++) {
          var index = -1;
          for(var x = 0; x < rmObject.goodsDetail.length; x++) {
              if (rmObject.goodsDetail[x].goodCode == this.state.listViewDataNUM[i]) {
                index = x;
              }
          }

          if (index>=0){
            console.log(this.state.listViewDataAMO[i]);
            if (this.state.checkState==0) {
              rmObject.goodsDetail[index].goodAmoFir = this.state.listViewDataAMO[i];
            } else {
              rmObject.goodsDetail[index].goodAmoSec = this.state.listViewDataAMO[i];
            }
          }else{
            rmObject.goodsDetail.push({
              goodCode   : this.state.listViewDataNUM[i],
              goodAmoOdoo: "0",
              goodAmoFir : this.state.listViewDataAMO[i],
            });
          }
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
    console.log(formData);


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

    })
    .catch((error) => {
      console.warn(error);
    })
    .done();
  }

  //updata both of realm and odoo
  updateBoth() {
    this.updateGoodsDetail();
    this.updateGoodsDetailOdoo();
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
  								     <Text>{data}</Text>
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
              source={require('../assets/btnSendOut.png')}/>
          </TouchableOpacity>

          <TouchableOpacity
            style={stockStyles.tabItem}
            // onClick={DataFuncs.getFormattedDatetime()}
            >
            <Image
              style={{width: 125*1, height: 96*0.6}}
              source={require('../assets/btnCleanUp.png')}/>

          </TouchableOpacity>


        </View>


      </View>
</KeyboardAwareScrollView>
    );
  }
}

import React, { Component } from 'react';
import {
  Text,
  View,
  Alert,
  Image,
  Platform,
  ListView,
  TextInput,
  StyleSheet,
  WritableMap,
  ImageBackground,
  TouchableOpacity,
	TouchableHighlight,
} from 'react-native';
import FormData from 'form-data';
import { Actions } from 'react-native-router-flux';
import AwesomeAlert from 'react-native-awesome-alerts';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import PopupDialog, { slideAnimation, DialogTitle, DialogButton }  from 'react-native-popup-dialog';
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
      listGoodNumUpper:    Array(),
      dataGoodState:       Array(),
      arForSecSee:         Array(),
      realm:               null,
      showAlert:           false,
      stockAmount:         "",
      findcount:           "",
      stockNum:            "",
      dialogGood:          "",
      dialogCount:         "",
      dialogTempCount:     "",
      orderNumber:         this.props.orderNumber,
      checkState:          this.props.checkState,
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
        const newDataNUM     = [...this.state.listViewDataNUM];
        const newDataAMO     = [...this.state.listViewDataAMO];
        const newDataAMOodoo = [...this.state.listViewDataAMOodoo];
        const newDataSee     = [...this.state.arForSecSee];
        const newDataSta     = [...this.state.dataGoodState];
        const newGoodNumUpper= [...this.state.listGoodNumUpper];

        let rmObjectOrderList = realm.objects('orderList').filtered("odCode == '" + this.state.orderNumber + "'")[0];


        if (rmObjectOrderList) {
          for (var loop = 0 ; loop < rmObjectOrderList.goodsDetail.length ; loop ++ ) {
            newDataNUM.push(rmObjectOrderList.goodsDetail[loop].goodCode);
            newGoodNumUpper.push(rmObjectOrderList.goodsDetail[loop].goodCode.toUpperCase());
            if (this.state.checkState == 0) {
              newDataAMO.push(rmObjectOrderList.goodsDetail[loop].goodAmoFir);
              newDataSta.push(rmObjectOrderList.goodsDetail[loop].goodChkStaFir);
            } else if (this.state.checkState == 1) {
              newDataAMO.push(rmObjectOrderList.goodsDetail[loop].goodAmoSec);
              newDataSee.push(rmObjectOrderList.goodsDetail[loop].goodAmoFir);
              newDataSta.push(rmObjectOrderList.goodsDetail[loop].goodChkStaSec);
            }
            newDataAMOodoo.push(rmObjectOrderList.goodsDetail[loop].goodAmoOdoo);
          }
        }
        this.setState({listViewDataNUM: newDataNUM, listViewDataAMO: newDataAMO,
                       listViewDataAMOodoo: newDataAMOodoo, dataGoodState: newDataSta,
                       arForSecSee: newDataSee, listGoodNumUpper: newGoodNumUpper});

        this.setState({ realm });
      });
    }

  //func for inputText change number
  changeStateNum(stockNum) {
    this.setState({
      stockNum: stockNum.toUpperCase()
    });
    var index = this.state.listGoodNumUpper.indexOf(stockNum.toUpperCase());
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

  //func for inputText change amount in dialog
  changeStateDialogAmount(stockAmount) {
    this.setState({
      dialogTempCount: stockAmount
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

  //funcs about alert
  showAlert = () => {
    this.setState({
      showAlert: true
    });
  };

  //push data to list
  pushRow(Num, Amount) {
    if (Num != "" && Amount != ""){
      var index = this.state.listViewDataNUM.indexOf(Num);
      if (index >= 0){
        this.updateSingleGoodsRealm(Num, Amount, "2");
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
        tempOdoo.splice(index,1);
        newDataAMOodoo.push(...tempOdoo);
        this.setState({listViewDataAMOodoo: newDataAMOodoo});

        const newDataGoodState = Array();
        var tempState = [...this.state.dataGoodState];
        tempState.splice(index,1);
        newDataGoodState.push("2");
        newDataGoodState.push(...tempState);
        this.setState({dataGoodState: newDataGoodState});

        const newDataSecSee = Array();
        var tempSecSee = [...this.state.arForSecSee];
        newDataSecSee.push(tempSecSee[index]);
        tempSecSee.splice(index,1);
        newDataSecSee.push(...tempSecSee);
        this.setState({arForSecSee: newDataSecSee});

        const newDataUpperGoodNum = Array();
        var tempStateUpper = [...this.state.listGoodNumUpper];
        newDataUpperGoodNum.push(tempStateUpper[index]);
        tempStateUpper.splice(index,1);
        newDataUpperGoodNum.push(...tempStateUpper);
        this.setState({listGoodNumUpper: newDataUpperGoodNum});
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
        newDataGoodState.push(...this.state.dataGoodState);
        this.setState({dataGoodState: newDataGoodState});

        const newDataSecSee = Array();
        newDataSecSee.push("0");
        newDataSecSee.push(...this.state.arForSecSee);
        this.setState({arForSecSee: newDataSecSee});

        const newDataUpperGoodNum = Array();
        newDataUpperGoodNum.push(Num.toUpperCase());
        newDataUpperGoodNum.push(...this.state.listGoodNumUpper);
        this.setState({listGoodNumUpper: newDataUpperGoodNum});
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
  updateSingleGoodsRealm(stockNum, stockAmount, updateSta) {
    this.state.realm.write(() => {
      var rmObject = this.state.realm.objects("orderList").filtered("odCode=='" + this.state.orderNumber + "'")[0];

      var index = -1;
      for (var x = 0; x < rmObject.goodsDetail.length; x++) {
        if (rmObject.goodsDetail[x].goodCode == stockNum) {
          index = x;
        }
      }

      if (this.state.checkState == 0) {
        rmObject.goodsDetail[index].goodAmoFir = stockAmount;
        rmObject.goodsDetail[index].goodAmoSec = stockAmount;
      } else {
        rmObject.goodsDetail[index].goodAmoSec = stockAmount;
      }

      if (this.state.checkState == 0) {
        rmObject.goodsDetail[index].goodChkStaFir = updateSta;
      } else if  (this.state.checkState == 1) {
        rmObject.goodsDetail[index].goodChkStaSec = updateSta;
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
          goodAmoSec : stockAmount,
          goodChkStaFir: "1",
          goodChkStaSec: "2",
        });
      } else if (this.state.checkState == 1) {
        rmObject.goodsDetail.push({
          goodCode   : stockNum,
          goodAmoOdoo: "0",
          goodAmoFir : stockAmount,
          goodAmoSec : stockAmount,
          goodChkStaFir: "1",
          goodChkStaSec: "1",
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
      console.log(responseData);
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
    Actions.pop({refresh: ({key: Math.random()})});
  }

  showDialog(goodNumber, goodCount) {
    this.setState({
      dialogGood: goodNumber,
      dialogCount: goodCount,
    });
    this.popupDialog.show();
  }

  dismissDialog() {
    this.pushRow(this.state.dialogGood, this.state.dialogTempCount);
    this.popupDialog.dismiss();
    this.changeStateDialogAmount(0);
  }



  render() {
    return (
<ImageBackground
  source={ require('../assets/mainBackground.png') }
  style={{height:667,width:360}}>


      <View style={stockStyles.mainContainer}>
        <KeyboardAwareScrollView>
        <View style={stockStyles.viewContainerR}>

          <TextInput
            placeholder='請掃描QRCode'
            clearButtonMode='always'
            autoFocus= {true}
            style={stockStyles.textInputContainer}
            placeholderTextColor='#5F769A'
            onChangeText={(text)=>this.changeStateNum(text)}
            ref={"textQRcode"}/>

          <Text style={{fontSize:20, textAlign:'center', paddingLeft: 5}} >
            {this.state.findcount}
          </Text>
        </View>

        <View style={stockStyles.viewContainerR}>

          <TextInput
            placeholder='請輸入數量'
            clearButtonMode='always'
            style={stockStyles.textInputAmountContainer}
            onChangeText={(text)=>this.changeStateAmount(text)}
            placeholderTextColor='#5F769A'
            keyboardType='phone-pad'
            ref={"textAmount"}/>

            <TouchableOpacity
              style={stockStyles.checkButton2}
              onPress={ _ => this.pushRow(this.state.stockNum, this.state.stockAmount)}>
              <Text style={stockStyles.checkText}>
                確認
              </Text>
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
              ref='list'
  						dataSource={this.dsNUM.cloneWithRows(this.state.listViewDataNUM)}
  						renderRow={ (data, secId, rowId) => (
  							<TouchableHighlight
  								onPress={ _ => this.showDialog(data, this.state.listViewDataAMO[rowId]) }
  								style={stockStyles.rowFront}
  								underlayColor={'#AAA'}
  							>
  								<View style={stockStyles.rowView}>
                    { this.state.dataGoodState[rowId]=="0" &&
                    <View style={{flex:3.8}}>
                      <Text style={stockStyles.rowTextNumUnoreder}>{data}</Text>
                    </View>
                    }
                    { (this.state.dataGoodState[rowId]=="1" || this.state.dataGoodState[rowId]=="2") &&
                    <View style={{flex:3.8}}>
                      <Text style={stockStyles.rowTextNum}>{data}</Text>
                    </View>
                    }

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

          <View style={stockStyles.tabContainer}>

            <TouchableOpacity
              style={stockStyles.tabItem}
              onPress={ _ => this.updateRealmOnly()}>
              <Image
                source={ require('../assets/icon05_saveLocal.png') }
                style={{ width: 35, height: 35, marginTop: 11, marginBottom: 6}}/>

                <Text style={stockStyles.itemFont}>
                  暫存手機
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={stockStyles.tabItem2}
              onPress={ _ => this.updateBoth()}>
              <Image
                source={ require('../assets/icon04_savephone.png') }
                style={{ width: 35, height: 35, marginTop: 11, marginBottom: 6}}/>

                <Text style={stockStyles.itemFont}>
                  匯出並結束
                </Text>
            </TouchableOpacity>
          </View>

        </View>
        </KeyboardAwareScrollView>

        <PopupDialog
            dialogTitle={<DialogTitle title="更改數量" />}
            actions={
              [
                <DialogButton text="OK"
                              onPress={ _ => this.dismissDialog() }
                              buttonStyle={stockStyles.dialogButtonStyle2}
                              key="button-1"/>,
                <DialogButton text="cancel"
                              onPress={ _ => this.popupDialog.dismiss() }
                              buttonStyle={stockStyles.dialogButtonStyle}
                              key="button-2"/>
                ]}
            ref={(popupDialog) => { this.popupDialog = popupDialog; }}
            dialogAnimation={slideAnimation}
            >
              <View style={stockStyles.viewDialog}>
                <Text style={stockStyles.dialogText}>目前修改：{this.state.dialogGood}</Text>
                <Text style={stockStyles.dialogText}>當前數量：{this.state.dialogCount}</Text>
                <Text style={stockStyles.dialogText}>修改數量：</Text>
                <TextInput
                  placeholder='數量'
                  clearButtonMode='always'
                  autoFocus= {true}
                  style={stockStyles.dialogInputContainer}
                  onChangeText={(text)=>this.changeStateDialogAmount(text)}/>
              </View>
            </PopupDialog>

      </View>


</ImageBackground>
    );
  }
}

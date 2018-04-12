import { Actions }   from 'react-native-router-flux';
import { AsyncStorage, Alert } from 'react-native';

const DataFuncs = {

  getFormattedDatetime: () => {
    AsyncStorage.multiGet(['identity']).then((data)=>{
      console.log(data[0][1]);
      if (data[0][1]=="yes") {
        Actions.URLinput();
      } else {
        Alert.alert(
          '錯誤',
          '你的帳號無權限，請更換成管理員帳號',
          [ {text: 'OK'} ],
          { cancelable: false }
        )
      }
    });
  },
  transData: (getData) => {

    return console.log("success");
  }
}

export default DataFuncs;

// How to use:
// import inputDataFuncs from './libs/DataFuncs.js';
// DataFuncs.getFormattedDatetime();

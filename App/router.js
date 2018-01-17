import React, { Component } from 'react';
import { Scene, Router }    from 'react-native-router-flux';

import main          from './main';
import sign          from './screens/sign';
import URLinput      from './screens/URLinput';
import orderList     from './screens/orderList';
import stockCheck    from './screens/stockCheck';

const router =() =>{
  return (
      <Router>
      <Scene key="root">
        <Scene key="main" component={ main } hideNavBar/>
        <Scene key="orderList" component={ orderList }/>
        <Scene key="sign" component={ sign }/>
        <Scene key="URLinput" component={ URLinput }/>
        <Scene key="stockCheck" component={ stockCheck }/>
      </Scene>
    </Router>
  );
};

export default router;

import React, { Component } from 'react';
import { Scene, Router }    from 'react-native-router-flux';

import sign          from './sign';
import main          from './main';
import orderList from './screens/orderList';
import stockCheck    from './screens/stockCheck';

const router =() =>{
  return (
      <Router>
      <Scene key="root">
        <Scene key="orderList" component={ orderList } hideNavBar/>
        <Scene key="settings" component={ sign }/>
        <Scene key="main" component={ main } hideNavBar/>
        <Scene key="stockCheck" component={ stockCheck }/>
      </Scene>
    </Router>
  );
};

export default router;

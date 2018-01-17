import { StyleSheet } from 'react-native';

export default stockStyles = StyleSheet.create({
  mainContainer :{
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignItems: 'stretch',
  },
  viewContainerR: {
    flex: 0.5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    height: 40,
  },
  listText: {
    justifyContent: 'center',
    alignItems:'center',
    fontSize: 20,
  },
  viewRowBarContainer: {
    flex: 0.8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'center'
  },
  rowView: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  rowTextAmo: {
    fontSize:20,
    textAlign: 'right',
  },
  rowTextNum: {
    fontSize:20,
    textAlign: 'center',
  },
  viewRowBar1: {
    height: 40,
    flex: 6,
    backgroundColor:'#0064A6',
    borderWidth: 1,
    borderColor: 'white',
    justifyContent: 'center',
  },
  viewRowBar2: {
    height: 40,
    flex: 1.5,
    backgroundColor:'#0064A6',
    borderWidth: 1,
    borderColor: 'white',
    justifyContent: 'center',
  },
  viewContainerL: {
    flex: 8,
    width: '100%',
  },
  tabContainer: {
    flex: 0.15,
    borderWidth: 1,
    borderColor: 'lightgray',
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  settingContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'lightgray',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 2,
  },
  textInputContainer:{
    fontSize:20,
    borderColor: '#0f0f0f',
    padding: 4,
    flex: 0.8
  },
  backRightBtn: {
    backgroundColor: 'red',
		alignItems: 'center',
		justifyContent: 'center',
		position: 'absolute',
    alignSelf: 'flex-end',
    width: 75,
    bottom: 0,
    right: 0,
		top: 0,
	},
  backTextWhite: {
		color: '#FFF'
	},
  rowFront: {
		alignItems: 'stretch',
		backgroundColor: 'white',
		borderBottomColor: 'black',
		borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    justifyContent: 'space-around',
		height: 50,
	},
	rowBack: {
		alignItems: 'center',
		backgroundColor: '#DDD',
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingLeft: 15,
	},
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },


});

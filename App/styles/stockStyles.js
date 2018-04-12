import { StyleSheet } from 'react-native';

export default stockStyles = StyleSheet.create({
  mainContainer :{
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
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
    marginTop: 20
  },
  listText: {
    justifyContent: 'center',
    alignItems:'center',
    fontSize: 20,
    marginLeft: 26,
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
  rowTextNumUnoreder: {
    color:"red",
    fontSize:20,
    textAlign: 'center',
  },
  viewRowBar1: {
    height: 46,
    flex: 6,
    backgroundColor:'#5F769A',
    justifyContent: 'center',
  },
  viewRowBar2: {
    height: 46,
    flex: 1.5,
    backgroundColor:'#5F769A',
    borderLeftWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
  },
  viewContainerL: {
    flex: 1,
    marginBottom: 110,
    width: '100%',
  },
  viewDialog:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContainer: {
    flex: 0.15,
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  textInputContainer:{
    fontSize:30,
    borderColor: '#0f0f0f',
    padding: 4,
    flex: 0.8,
    borderBottomWidth: 2,
    borderColor: '#FFBE31',
    marginLeft: 22,
    marginRight: 22,
  },
  textInputAmountContainer: {
    fontSize:30,
    borderColor: '#0f0f0f',
    padding: 4,
    flex: 1,
    borderBottomWidth: 2,
    borderColor: '#FFBE31',
    marginLeft: 22,
    marginRight: 22,
    width: 300,
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
    borderWidth: 1,
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
    flex: 0.5,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: '#FFBE31',
    marginLeft: 21,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tabItem2: {
    flex: 0.5,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: '#FFBE31',
    marginRight: 21,
    marginLeft: 33,
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkBtnOpacity: {
    flex: 1,
    alignSelf: 'flex-end',
  },
  dialogText: {
		color: 'black',
    fontSize: 20,
	},
  dialogInputContainer: {
    fontSize: 20,
    borderColor: '#575757',
    flex: 1,
    width: 100,
  },
  dialogButtonStyle: {
    position: 'absolute',
    bottom: 0,
    right:10,
    padding: 10,
  },
  dialogButtonStyle2: {
    position: 'absolute',
    bottom: 0,
    left:10,
    padding: 10,
  },
  checkButton: {
    backgroundColor: '#FF6E02',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginLeft: 20,
    marginRight: 20,
  },
  checkButton2: {
    backgroundColor: '#FF6E02',
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginRight: 20,
  },
  checkText: {
    fontSize: 20,
    color: 'white',
    marginTop: 6,
    marginBottom: 6,
  },
  firstCheck: {
    backgroundColor: '#FE5F0E',
    borderRadius: 5,
    marginRight: 10,
    flex: 1
  },
  secondCheck: {
    backgroundColor: '#FEC10E',
    borderRadius: 5,
    marginRight: 20,
    flex: 1
  },
  buttonCheck: {
    fontSize: 17,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 6,
    color: 'white'
  },
  itemFont: {
    fontSize: 15,
    fontWeight: '300',
    color: '#FFBE31',
    marginBottom: 7,
  },


});

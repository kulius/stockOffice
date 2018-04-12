import { StyleSheet } from 'react-native';

export default mainStyles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 10,
    top: 10,
    padding: 10,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginBottom: 10,
  },
  toogleContainer: {
    flex: 0.1,
    flexDirection: 'row',
    alignSelf: 'stretch',
    backgroundColor: '#2A3446',
  },
  viewItemContainer: {
    width: 90,
    height: 90,
    borderWidth: 1,
    borderColor: '#FFBE31',
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  containerD: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  itemFont: {
    fontSize: 15,
    fontWeight: '300',
    color: '#FFBE31',
  },
});

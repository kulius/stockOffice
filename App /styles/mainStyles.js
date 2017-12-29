import { StyleSheet } from 'react-native';

export default mainStyles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 10,
    top: 20,
    padding: 10,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    backgroundColor: '#F5FCFF',
  },
  containerD: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    backgroundColor: '#F5FCFF',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  signContainer: {
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#F5FCFF',
  }
});

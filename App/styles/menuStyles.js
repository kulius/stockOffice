import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
  menu: {
    flex: 1,
    width: window.width,
    height: window.height,
    backgroundColor: 'gray',
    padding: 20,
  },
  avatarContainer: {
    marginBottom: 20,
    marginTop: 20,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    width: window.width,
  },
  icon: {
    width: 48,
    height: 48,
    flex: 1,
  },
  name: {
    position: 'absolute',
    left: 70,
    top: 20,
    color: '#178d92',
  },
  item: {
    fontSize: 20,
    fontWeight: '400',
    paddingTop: 12,
    paddingLeft: 10,
    flex: 3
  },
  dropdown: {
    width: 150,
    height: 300,
    borderColor: 'cornflowerblue',
    borderWidth: 2,
    borderRadius: 3,
  },
});

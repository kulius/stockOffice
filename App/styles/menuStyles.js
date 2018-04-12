import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
  menu: {
    flex: 1,
    width: window.width,
    height: window.height,
    backgroundColor: '#FF6E02',
    padding: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 35,
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: window.width,
    marginTop: 5,
  },
  icon: {
    width: 25,
    height: 25,
  },
  name: {
    fontSize: 30,
    color: 'white',
  },
  item: {
    fontSize: 22,
    fontWeight: '300',
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
  viewItemContainer: {
    alignItems: 'center',
    marginTop: 1,
    marginBottom: 1,
  }
});

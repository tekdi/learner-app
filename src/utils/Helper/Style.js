import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  heading: {
    fontSize: 24,
    color: '#4D4639',
    fontWeight: '500',
    fontFamily: 'Poppins-Regular',
  },
  heading2: {
    fontSize: 18,
    color: '#000',
    fontWeight: '400',
    fontFamily: 'Poppins-Regular',
  },
  heading3: {
    fontSize: 22,
    color: '#000',
    fontWeight: '400',
    fontFamily: 'Poppins-Regular',
  },
  subHeading: {
    fontSize: 16,
    color: '#000',
    fontWeight: '400',
    fontFamily: 'Poppins-Regular',
  },

  text: {
    fontSize: 14,
    color: '#000',
    fontWeight: '400',
    fontFamily: 'Poppins-Regular',
  },

  flexrow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    height: 50,
    width: 50,
    marginVertical: 15,
  },

  checkbox: {
    margin: 2,
    color: 'red',
    backgroundColor: 'red',
  },
  controlContainer: {
    borderRadius: 4,
    margin: 2,
    borderWidth: 1,
    height: 25,
  },

  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default globalStyles;

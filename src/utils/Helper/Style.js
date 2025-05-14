import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
  },
  h1: {
    fontFamily: 'Poppins-Medium',
    fontSize: 32,
    color: '#1F1B13',
    fontWeight: 'bold',
  },
  h2: {
    fontFamily: 'Poppins-Medium',
    fontSize: 28,
    color: '#1F1B13',
    fontWeight: 'bold',
  },
  h3: {
    fontFamily: 'Poppins-Medium',
    fontSize: 24,
    color: '#1F1B13',
    fontWeight: '600',
  },
  h4: {
    fontFamily: 'Poppins-Medium',
    fontSize: 20,
    color: '#1F1B13',
    fontWeight: '600',
  },
  h5: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: '#1F1B13',
    fontWeight: '500',
  },
  h6: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#1F1B13',
    fontWeight: '500',
  },

  text: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#3B383E',
    fontWeight: '400',
  },
  text2: {
    fontFamily: 'Poppins-Reqular',
    fontSize: 12,
    color: '#3B383E',
    fontWeight: '400',
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

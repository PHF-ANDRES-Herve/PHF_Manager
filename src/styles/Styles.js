import { StyleSheet } from 'react-native';

/**
 * STYLE GENERAL POUR L'APPLICATION
 */
const Styles = StyleSheet.create({
  button: {
    margin: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 5,
    backgroundColor: '#AEDEF4',
  },
  buttonContainer: {
    backgroundColor: '#de7022',
    paddingVertical: 15,
  },
  buttonText: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    textAlignVertical: 'center',
  },
  blocTitle: {
    backgroundColor: '#346598',
    color: '#fff',
    fontSize: 16,
    justifyContent: 'center',
    height: 50,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  blocBullCard: {
    backgroundColor: '#de7022',
    color: '#fff',
    fontSize: 16,
    justifyContent: 'center',
    height: 40,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  blocSemiTitle: {
    color: '#fff',
    fontSize: 16,
    justifyContent: 'center',
    height: 50,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  italic: {
    fontStyle: 'italic',
  },
  marginTop20: {
    marginTop: 20,
  },
  text: {
    color: '#fff',
    fontSize: 18,
  },
});

export default Styles;

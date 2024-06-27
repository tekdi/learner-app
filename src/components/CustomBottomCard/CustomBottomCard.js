import { View, StyleSheet } from 'react-native'
import React from 'react'
import CustomButton from '../CustomButton/CustomButton'
import { Layout , Text} from '@ui-kitten/components'

const CustomBottomCard = ({onPress}) => {
  return (
    <View style={styles.overlap}>
        <Layout style={{justifyContent:'center', alignItems:'center'}}>
            <CustomButton onPress ={onPress}text="Continue"></CustomButton>
            <Text category='p2' style={{color: '#635E57',  fontFamily: 'Poppins-Regular',
}}>You can change the language any time later</Text>
        </Layout>    
    </View>
  )
}
const styles=StyleSheet.create({
    overlap:{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 3,
        borderWidth: 0.7,
        elevation: 10,
        borderColor: "#cccccc",
        shadowColor: '#000000',
        shadowOffset: { width: 3, height: 4 },
        shadowOpacity: 0.7,  // Increase this value for a darker shadow
        shadowRadius: 10,
    }
})
export default CustomBottomCard
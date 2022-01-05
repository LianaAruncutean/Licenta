import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const Announcement = ({item}) => {
    return (
        <View style={styles.container}>
            <Text style={{fontWeight: '700', marginBottom: 5, marginTop: 5}}>{item.titlu}</Text>
            <Text style={{marginBottom: 3}}>{item.text}</Text>
            <Text style={{color: "#6b0000", marginBottom: 5, textAlign: "right"}}>{item.data}</Text>
        </View>
    )
}

export default Announcement

const styles = StyleSheet.create({
    container: {
        borderBottomColor: "#ccc",
        borderBottomWidth: 1
    }
})

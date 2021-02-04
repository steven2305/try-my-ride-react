import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
    contenedor: {
        flex: 1,
        marginTop: 20,
        marginHorizontal: '2.5%'
    },
    btnContenedor: {
        padding: 5,
        margin: 10
    },
    btnContenedorDelete: {
        padding: 5,
        margin: 10,
        color: 'red',
        backgroundColor: 'red'
    },
    titulo: {
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 30,
        fontSize: 26
    },
});

export default globalStyles;
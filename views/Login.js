import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { TextInput, Headline, Button, Paragraph, Dialog, Portal } from 'react-native-paper';
import globalStyles from '../styles/global';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Login = ({navigation, route}) => {

    const { guardarConsultarAPI } = route.params;

    // campos formulario
    const [ email, guardarEmail] = useState('');
    const [ password, guardarPassword] = useState('');
    const [ alerta, guardarAlerta] = useState(false);


    // almacena el usuario en la BD
    const guardarUsuario = async () => {
        // validar
        if(email === '' || password === '' ) {
            guardarAlerta(true)
            return;
        }

        //login
        try {
            await axios.post('https://try-my-ride.herokuapp.com/api/login', cliente)
                        .then(function (response) {
                            const user = {
                                'id': response.data['user']['id'],
                                'token': response.data['token']
                            }
                            guardarUser(JSON.stringify(user))
                            });
        } catch (error) {
            console.log(error);
        }


        // redireccionar
        navigation.navigate('Inicio');

        // limpiar el form (opcional)
        guardarEmail('');
        guardarPassword('');

        // cambiar a true para traernos el nuevo cliente
        guardarConsultarAPI(true);
    }

    const guardarUser = async (user) => {
        try {
            await AsyncStorage.setItem('user', user)
        } catch (error) {
            console.log(error);
        }
    }

    const obtenerToken = async () => {
        try {
            token = JSON.parse(await AsyncStorage.getItem('user'))
            return token
        } catch (error) {
            console.log(error);
        }
    }

    return ( 
        <View style={globalStyles.contenedor}>

            <Headline style={globalStyles.titulo}>Añadir Usuario</Headline>

            <TextInput
                label="email"
                placeholder="email@email.com"
                onChangeText={ texto => guardarEmail(texto) }
                value={email}
                style={styles.input}
            />
            <TextInput
                label="Password"
                placeholder="password"
                secureTextEntry={true}
                onChangeText={ texto => guardarPassword(texto) }
                value={password}
                style={styles.input}
            />

            

            <Button icon="pencil-circle" mode="contained" onPress={() => guardarUsuario() }>
                Ingresar
            </Button>

            <Portal>
                <Dialog
                    visible={alerta}
                    onDismiss={ () => guardarAlerta(false) }
                 >
                   <Dialog.Title>Error</Dialog.Title>
                   <Dialog.Content>
                        <Paragraph>Todos los campos son obligatorios</Paragraph>
                   </Dialog.Content>
                   <Dialog.Actions>
                       <Button onPress={ () => guardarAlerta(false) }>OK</Button>
                   </Dialog.Actions>
                </Dialog>
            </Portal>
             
        </View>
     );
}

const styles = StyleSheet.create({
    input: {
        marginBottom: 20,
        backgroundColor: 'transparent'
    }
})
 
export default Login;
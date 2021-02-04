import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { TextInput, Headline, Button, Paragraph, Dialog, Portal } from 'react-native-paper';
import globalStyles from '../styles/global';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Registro = ({navigation, route}) => {

    const { guardarConsultarAPI } = route.params;

    // campos formulario
    const [ nombre, guardarNombre] = useState('');
    const [ email, guardarEmail] = useState('');
    const [ password, guardarPassword] = useState('');
    const [ alerta, guardarAlerta] = useState(false);

    // detectar si estamos editando o no
    useEffect(() => {
        console.log(route.params)
        if(route.params.usuario) {
            
            const { name, email } = route.params.usuario;

            guardarNombre(name);
            guardarEmail(email);
        } 
    }, []);

    // almacena el usuario en la BD
    const guardarUsuario = async () => {
        // validar
        if(nombre === '' || email === '' || password === '' ) {
            guardarAlerta(true)
            return;
        }
    
        // generar el usuario
        const usuario = { 
            'name': nombre, 
            'password':password, 
            'email':email 
        };
        console.log(cliente);

        // Si estamos editando o creando un nuevo usuario
        if(route.params.usuario) {

            const { id } = route.params.usuario;
            usuario.id = id;
            const url = `http://localhost:8000/api/user/${id}`;
            const token = obtenerToken()
            console.log(token)

            try {
                await axios.put(url, cliente,
                {
                    headers: {
                        'Authorization': 'Bearer '+token['token']
                    }
                }
                );
            } catch (error) {
                console.log(error);
            }

        } else {
            // guardar el cliente en la API
            try {
                await axios.post('http://10.0.2.2:8000/api/register', cliente)
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
        }
        

        // redireccionar
        navigation.navigate('Inicio');

        // limpiar el form (opcional)
        guardarNombre('');
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
                label="nombre"
                placeholder="Juan"
                onChangeText={ texto => guardarNombre(texto) }
                value={nombre}
                style={styles.input}
            />
            <TextInput
                label="email"
                placeholder="email@email.com"
                onChangeText={ texto => guardarEmail(texto) }
                value={email}
                style={styles.input}
            />
            {  !route.params.usuario ?
                <View>
                    <TextInput
                        label="Password"
                        placeholder="password"
                        secureTextEntry={true}
                        onChangeText={ texto => guardarPassword(texto) }
                        value={password}
                        style={styles.input}
                    />
                </View>
                :
                <View>
                </View>    
            }
            

            <Button icon="pencil-circle" mode="contained" onPress={() => guardarUsuario() }>
                Guardar Usuario
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
 
export default Registro;
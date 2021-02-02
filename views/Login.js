import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { TextInput, Headline, Button, Paragraph, Dialog, Portal } from 'react-native-paper';
import globalStyles from '../styles/global';
import axios from 'axios';

const Registro = ({navigation, route}) => {

    const { guardarConsultarAPI } = route.params;

    // campos formulario
    const [ correo, guardarCorreo] = useState('');
    const [ password, guardarPassword] = useState('');
    const [ alerta, guardarAlerta] = useState(false);

    // detectar si estamos editando o no
    useEffect(() => {
        if(route.params.cliente) {
            const { correo, password } = route.params.cliente;

            guardarCorreo(correo);
            guardarPassword(password);
        } 
    }, []);

    // almacena el cliente en la BD
    const guardarCliente = async () => {
        // validar
        if(correo === '' || password === '' ) {
            guardarAlerta(true)
            return;
        }
    
        // generar el cliente
        const cliente = {password, correo };
        console.log(cliente);

        // Si estamos editando o creando un nuevo cliente
        if(route.params.cliente) {

            const { id } = route.params.cliente;
            cliente.id = id;
            const url = `http://localhost:3000/clientes/${id}`;

            try {
                await axios.put(url, cliente);
            } catch (error) {
                console.log(error);
            }

        } else {
            // guardar el cliente en la API
            try {
                if(Platform.OS === 'ios') {
                    await axios.post('http://localhost:3000/clientes', cliente)
                } else {
                    await axios.post('http://10.0.2.2:3000/clientes', cliente);
                }
            } catch (error) {
                console.log(error);
            }
        }

        // redireccionar
        navigation.navigate('Inicio');

        // limpiar el form (opcional)
        guardarCorreo('');
        guardarPassword('');

        // cambiar a true para traernos el nuevo cliente
        guardarConsultarAPI(true);
    }

    return ( 
        <View style={globalStyles.contenedor}>

            <Headline style={globalStyles.titulo}>Login</Headline>
            <TextInput
                label="Correo"
                placeholder="correo@correo.com"
                onChangeText={ texto => guardarCorreo(texto) }
                value={correo}
                style={styles.input}
            />
            <TextInput
                label="Password"
                placeholder="password"
                onChangeText={ texto => guardarPassword(texto) }
                value={password}
                style={styles.input}
            />

            <Button icon="check" mode="contained" onPress={() => guardarCliente() }>
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
 
export default Registro;
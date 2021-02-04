import React, { useEffect, useState } from 'react';
import { Text, FlatList, View, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Headline, Button} from 'react-native-paper';
import globalStyles from '../styles/global'

const Inicio = ({navigation}) => {

    // state de la app
    const [ userId, guardarUserId ] = useState([]);
    const [ usuario, guardarUser ] = useState([]);
    const [ consultarAPI, guardarConsultarAPI ] = useState(true);
    

     useEffect(() => {
        const ObtenerUser = async () => {
            console.log(userId)

                try {
                    guardarUserId(JSON.parse(await AsyncStorage.getItem('user')))
                    if (userId.id > 0) {
                        const resultado = await axios.get(`http://10.0.2.2:8000/api/user/${userId.id}`, 
                        {
                            headers: {
                            'Authorization': 'Bearer '+userId.token
                            }
                        }
                        );
                        guardarUser(resultado.data['user'])
                        
                        guardarConsultarAPI(false);
                    }
                } catch (error) {
                    console.log(error);
                }

        }

        if(consultarAPI) {
            ObtenerUser();
            
        }
    }, [consultarAPI]);

    const mostrarConfirmacion = () => {
        Alert.alert(
            '¿Deseas eliminar este cliente?',
            'Un contacto eliminado no se puede recuperar',
            [
                { text: 'Si, Eliminar', onPress: () => eliminarContacto() },
                { text: 'Cancelar', style: 'cancel' }
            ]
        )
    }

    const eliminarContacto = async () => {
        const url = `http://10.0.2.2:8000/api/logout`;
        // console.log(url);
        try {
            await axios.post(url,'',
                {
                    headers: {
                      'Authorization': 'Bearer '+userId.token
                    }
                }
                );
            await AsyncStorage.setItem('user',null)
        } catch (error) {
            console.log(error);
        }

        // Redireccionar
        navigation.navigate('Inicio');

        // volver a consultar la api
        guardarConsultarAPI(true);
    }

 

    return ( 
        <View style={globalStyles.contenedor}>

            <Headline style={globalStyles.titulo}> { usuario.length > 0 ?   "Bienvenido": "Aun no has iniciado sesion"} </Headline>
                { usuario.length > 0 ?
                    <View style={{alignContent: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                    <Button style={globalStyles.btnContenedor} icon="plus-circle" mode="contained" onPress={() => navigation.navigate("Registro", {usuario,guardarConsultarAPI }) }>
                        Editar perfil
                    </Button>
                    <Button style={globalStyles.btnContenedorDelete} icon="plus-circle" mode="contained"  onPress={ () => mostrarConfirmacion()  }>
                    Salir
                    </Button>
                    </View>
                    :
                    <View>
                    <Button style={globalStyles.btnContenedor} icon="plus-circle" mode="contained" onPress={() => navigation.navigate("Login", { guardarConsultarAPI }) }>
                        Login
                    </Button>
                    <Button style={globalStyles.btnContenedor} icon="plus-circle" mode="contained" onPress={() => navigation.navigate("Registro", { guardarConsultarAPI }) }>
                        Registro
                    </Button>
                </View>  
                }


        </View>
     );
}

 
export default Inicio;
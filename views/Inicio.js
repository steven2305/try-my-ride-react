import React, { useEffect, useState } from 'react';
import { Text, FlatList, View } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { List, Headline, Button, FAB } from 'react-native-paper';
import globalStyles from '../styles/global'

const Inicio = ({navigation}) => {

    // state de la app
    const [ userId, guardarUserId ] = useState([]);
    const [ usuario, guardarUser ] = useState([]);
    const [ consultarAPI, guardarConsultarAPI ] = useState(true);
    

     useEffect(() => {
        const ObtenerUser = async () => {
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
 

    return ( 
        <View style={globalStyles.contenedor}>

                { usuario.length > 0 ?
                    <View>
                        <Button style={globalStyles.btnContenedor} icon="plus-circle" mode="contained" onPress={() => navigation.navigate("Login", { guardarConsultarAPI }) }>
                            Login
                        </Button>
                    </View>
                    :
                    <View>
                    </View>    
                }
                

                <Button style={globalStyles.btnContenedor} icon="plus-circle" mode="contained" onPress={() => navigation.navigate("Registro", { usuario, guardarConsultarAPI }) }>
                { usuario.length > 0 ? "Registro" : "Editar perfil" }
                </Button>

            <Headline style={globalStyles.titulo}> { usuario.length > 0 ? "Aun no has iniciado sesion" : "Bienvenido" } </Headline>

        </View>
     );
}

 
export default Inicio;
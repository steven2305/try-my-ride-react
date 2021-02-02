import React, { useEffect, useState } from 'react';
import { Text, FlatList, View } from 'react-native';
import axios from 'axios';
import { List, Headline, Button, FAB } from 'react-native-paper';
import globalStyles from '../styles/global'

const Inicio = ({navigation}) => {

    // state de la app
    const [ clientes, guardarClientes ] = useState([]);
    const [ consultarAPI, guardarConsultarAPI ] = useState(true);

    useEffect(() => {
        const obtenerClientesApi = async () => {
            try {
                const resultado = await axios.get('http://localhost:3000/clientes');
                guardarClientes(resultado.data)
                guardarConsultarAPI(false);
            } catch (error) {
                console.log(error);
            }
        }

        if(consultarAPI) {
            obtenerClientesApi();
            
        }
    }, [consultarAPI]);


    return ( 
        <View style={globalStyles.contenedor}>

            <Button style={globalStyles.btnContenedor} icon="plus-circle" mode="contained" onPress={() => navigation.navigate("Login", { guardarConsultarAPI }) }>
                Login
            </Button>

            <Button style={globalStyles.btnContenedor} icon="plus-circle" mode="contained" onPress={() => navigation.navigate("Registro", { guardarConsultarAPI }) }>
                Registro
            </Button>

            <Headline style={globalStyles.titulo}> { clientes.length > 0 ? "Clientes" : "Aún no has iniciado sesion" } </Headline>

            <FlatList
                data={clientes}
                keyExtractor={ cliente => (cliente.id).toString()  }
                renderItem={ ({item}) => (
                    <List.Item
                        title={item.nombre}
                        description={item.empresa}
                        onPress={ () => navigation.navigate("DetallesCliente", { item, guardarConsultarAPI }) }
                    />
                )}
            />

        </View>
     );
}

 
export default Inicio;
import { StatusBar } from 'expo-status-bar';
import React, {Component} from 'react';
import {View, Text} from 'react-native';
import firebase from 'firebase/compat/app' ; 
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { Provider } from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import rootReducer from './redux/reducers';
import thunk from 'redux-thunk';
import 'react-native-gesture-handler';
const store = createStore(rootReducer, applyMiddleware(thunk))

const firebaseConfig = {
  apiKey: "AIzaSyD7-K4ApOs8e0Knfpm7f1gkCZKdeIpBUbA",
  authDomain: "photomoto-e9f2f.firebaseapp.com",
  projectId: "photomoto-e9f2f",
  storageBucket: "photomoto-e9f2f.appspot.com",
  messagingSenderId: "751122138309",
  appId: "1:751122138309:web:0862cf8164f01b273d1cac"
};
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack'

import LandingScreen from './components/auth/Landing'
import RegisterScreen from './components/auth/Register'
import MainScreen from './components/Main'
import LoginScreen from './components/auth/Login'
import AddScreen from './components/main/Add'
import SaveScreen from './components/main/Save'
import CommentScreen from './components/main/Comment'


const Stack = createStackNavigator();

let app;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig)
} else {
  app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();

export { db, auth };

export class App extends Component {
  constructor(props){
    super(props);
    this.state={
      loaded:false,
    }
  }
  componentDidMount(){
    firebase.auth().onAuthStateChanged((user) =>{
      if(!user){
        this.setState({
          loggedIn:false,
          loaded:true,
        })
      }else {
        this.setState({
          loggedIn:true,
          loaded:true,
        })
      }
    })
  }
  render() {
    const {loggedIn, loaded} = this.state;
    if(!loaded){
      return(
        <View style={{felx:1,justifyContent:'center'}}>
          <Text>Loading</Text>
        </View>
      )
    }
    if (!loggedIn){
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen name="Landing" component={LandingScreen} options={{headerShown:false}}/>
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Login" component={LoginScreen}/>
          </Stack.Navigator>
        </NavigationContainer>
      );  
    }
    return(//provider reduxa erişmenin tek yolu
      <Provider store={store}> 
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Main">
            <Stack.Screen name="PHOTOMOTO" component={MainScreen}/>  
            <Stack.Screen name="Add" component={AddScreen} navigation={this.props.navigation} />    
            <Stack.Screen name="Save" component={SaveScreen} navigation={this.props.navigation} /> 
            <Stack.Screen name="Comment" component={CommentScreen} navigation={this.props.navigation} />   
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
      
    )
  }
}

export default App





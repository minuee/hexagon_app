import React from 'react';
import {createStackNavigator,SafeAreaView} from '@react-navigation/stack';
const Stack = createStackNavigator();

import SignUpScreen from './SignUpScreen'; //로그인페이지
import {FindIDStack,AuthCheckStack,PassWordResetStack} from './AuthRouteStack'; //로그인페이지


const AuthStack = ({navigation,route}) => {
  return (
    <Stack.Navigator initialRouteName="SignUpScreen" screenOptions={{headerShown: false}}>
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        <Stack.Screen name="AuthCheckStack" >
          {props => <AuthCheckStack {...props} extraData={route} />}
        </Stack.Screen> 
        <Stack.Screen name="FindIDStack" >
          {props => <FindIDStack {...props} extraData={route} />}
        </Stack.Screen> 
        <Stack.Screen name="PassWordResetStack" >
          {props => <PassWordResetStack {...props} extraData={route} />}
        </Stack.Screen> 
    </Stack.Navigator>
  );
};

export default AuthStack;
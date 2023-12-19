import React, { Component } from 'react';
import {TouchableOpacity,Image,PixelRatio,View,StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
const Stack = createStackNavigator();
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import {CustomTextB} from '../../Components/CustomText';
const BACK_BUTTON_IMAGE = require('../../../assets/icons/back_icon2.png');

import FindIDScreen from './FindIDScreen';
import AuthCheckScreen from './AuthCheckScreen';
import PWResetScreen from './PWResetScreen';

const AuthCheckStack = ({navigation,route}) => {
    return (
        <Stack.Navigator
            initialRouteName={'AuthCheckScreen'}
            screenOptions={{
                headerLeft: (props) => (
                    <TouchableOpacity onPress= {()=> navigation.goBack()} style={{flex:1,flexGrow:1,paddingLeft:25,justifyContent:'center',alignItems:'center'}}>
                        <Image source={BACK_BUTTON_IMAGE} style={{width: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23), height: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23)}} />
                    </TouchableOpacity>
                ),
                
                headerTitle : (props) => (
                    <View style={{flex:1,flexGrow:1,justifyContent:'center',alignItems:'center',}}>
                        <CustomTextB style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#000'}}>계정확인하기</CustomTextB>
                    </View>
                ),
                headerRight : (props) => (<View style={{flex:1,flexGrow:1}} />)
            }}
            
        >
        
        <Stack.Screen name="AuthCheckScreen" >
            {props => <AuthCheckScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const FindIDStack = ({navigation,route}) => {
    return (
        <Stack.Navigator
            initialRouteName={'FindIDScreen'}
            screenOptions={{
                headerLeft: (props) => (
                    <TouchableOpacity onPress= {()=> navigation.goBack()} style={{flex:1,flexGrow:1,paddingLeft:25,justifyContent:'center',alignItems:'center'}}>
                        <Image source={BACK_BUTTON_IMAGE} style={{width: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23), height: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23)}} />
                    </TouchableOpacity>
                ),
                
                headerTitle : (props) => (
                    <View style={{flex:1,flexGrow:1,justifyContent:'center',alignItems:'center',}}>
                        <CustomTextB style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#000'}}>계정 찾기</CustomTextB>
                    </View>
                ),
                headerRight : (props) => (<View style={{flex:1,flexGrow:1}} />)
            }}
            
        >
        
        <Stack.Screen name="FindIDScreen" >
            {props => <FindIDScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const PassWordResetStack = ({navigation,route}) => {
    return (
        <Stack.Navigator
            initialRouteName={'PWResetScreen'}
            screenOptions={{
                headerLeft: (props) => (
                    <TouchableOpacity onPress= {()=> navigation.goBack()} style={{flex:1,flexGrow:1,paddingLeft:25,justifyContent:'center',alignItems:'center'}}>
                        <Image source={BACK_BUTTON_IMAGE} style={{width: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23), height: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23)}} />
                    </TouchableOpacity>
                ),
                
                headerTitle : (props) => (
                    <View style={{flex:1,flexGrow:1,justifyContent:'center',alignItems:'center',}}>
                        <CustomTextB style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#000'}}>비밀번호 재설정</CustomTextB>
                    </View>
                ),
                headerRight : (props) => (<View style={{flex:1,flexGrow:1}} />)
            }}
            
        >
        
        <Stack.Screen name="PWResetScreen" >
            {props => <PWResetScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

export { FindIDStack,AuthCheckStack,PassWordResetStack } ;
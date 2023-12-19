import React from 'react';
import {SafeAreaView,Image,View,StyleSheet,PixelRatio,Dimensions, Platform,TouchableOpacity} from 'react-native';
import {createStackNavigator, HeaderTitle} from '@react-navigation/stack';

const Stack = createStackNavigator();
const BACK_BUTTON_IMAGE = require('../../../assets/icons/back_icon2.png');
const LOGO_IMAGE = require('../../../assets/icons/logo.png');
//공통상수 필요에 의해서 사용
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import CommonStyle from '../../Style/CommonStyle';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {CustomTextR,CustomTextL, CustomTextB, CustomTextM, TextRobotoM,TextRobotoR} from '../../Components/CustomText';

import Tabs01Screen from './Tabs01Screen'; 
import Tabs02Screen from './Tabs02Screen'; 
import Tabs03Screen from './Tabs03Screen'; 
import Tabs04Screen from './Tabs04Screen'; 

import MyModifyScreen from './MyModifyScreen';
import MyPWModifyScreen from '../Tabs04/MyPWModifyScreen';

const Tabs01Stack = ({navigation,route}) => {
    return (
        <Stack.Navigator 
        initialRouteName="Tabs01Screen" 
        screenOptions={{          
                headerLeft : (props) => (<View style={{flex:1,flexGrow:1}} />),                     
                headerTitle : () => (
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Image
                        source={LOGO_IMAGE}
                        resizeMode={"contain"}
                        style={Platform.OS === 'android' ? {height:45} : {height:'80%'}}
                    />
                </View>
                ),
                headerRight : (props) => (<View style={{flex:1,flexGrow:1}} />)
            }}
        >
            <Stack.Screen name="Tabs01Screen">
                {props => <Tabs01Screen {...props} extraData={route} />}
            </Stack.Screen>     
        </Stack.Navigator>
    );
};

const Tabs02Stack = ({navigation,route}) => {
    return (
        <Stack.Navigator 
        initialRouteName="Tabs02Screen" 
        screenOptions={{          
                headerLeft : (props) => (<View style={{flex:1,flexGrow:1}} />),                     
                headerTitle : () => (
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Image
                        source={LOGO_IMAGE}
                        resizeMode={"contain"}
                        style={Platform.OS === 'android' ? {height:45} : {height:'80%'}}
                    />
                </View>
                ),
                headerRight : (props) => (<View style={{flex:1,flexGrow:1}} />)
            }}
        >
            <Stack.Screen name="Tabs02Screen">
                {props => <Tabs02Screen {...props} extraData={route} />}
            </Stack.Screen>     
        </Stack.Navigator>
    );
};
const Tabs03Stack = ({navigation,route}) => {
    return (
        <Stack.Navigator 
        initialRouteName="Tabs03Screen" 
        screenOptions={{          
                headerLeft : (props) => (<View style={{flex:1,flexGrow:1}} />),                     
                headerTitle : () => (
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Image
                        source={LOGO_IMAGE}
                        resizeMode={"contain"}
                        style={Platform.OS === 'android' ? {height:45} : {height:'80%'}}
                    />
                </View>
                ),
                headerRight : (props) => (<View style={{flex:1,flexGrow:1}} />)
            }}
        >
            <Stack.Screen name="Tabs03Screen">
                {props => <Tabs03Screen {...props} extraData={route} />}
            </Stack.Screen>     
        </Stack.Navigator>
    );
};
const Tabs04Stack = ({navigation,route}) => {
    return (
        <Stack.Navigator 
        initialRouteName="Tabs04Screen" 
        screenOptions={{          
                headerLeft : (props) => (<View style={{flex:1,flexGrow:1}} />),                     
                headerTitle : () => (
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Image
                        source={LOGO_IMAGE}
                        resizeMode={"contain"}
                        style={Platform.OS === 'android' ? {height:45} : {height:'80%'}}
                    />
                </View>
                ),
                headerRight : (props) => (<View style={{flex:1,flexGrow:1}} />)
            }}
        >
            <Stack.Screen name="Tabs04Screen">
                {props => <Tabs04Screen {...props} extraData={route} />}
            </Stack.Screen>     
        </Stack.Navigator>
    );
};


const MyIDModifyStack = ({navigation,route}) => {
    let navTitle = '계정 정보 편집' ;
    
    return (
        <Stack.Navigator
            initialRouteName={'MyModifyScreen'}
            screenOptions={{
                headerLeft: (props) => (
                    <TouchableOpacity onPress= {()=> navigation.goBack()} style={CommonStyle.stackHeaderLeftWrap}>
                        <Image source={BACK_BUTTON_IMAGE} style={CommonStyle.backButtonWrap} />
                    </TouchableOpacity>
                ),
                headerTitle : (props) => (
                    <View style={CommonStyle.stackHeaderCenterWrap}>
                        <CustomTextB style={CommonStyle.stackHeaderCenterText}>{navTitle}</CustomTextB>
                    </View>
                ),
                headerRight : (props) => (<View style={{flex:1,flexGrow:1}} />),    
            }}
            
        >
        
        <Stack.Screen name="MyModifyScreen" >
            {props => <MyModifyScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const MyPWModifyStack = ({navigation,route}) => {
    let navTitle = '비밀번호 변경' ;
    
    return (
        <Stack.Navigator
            initialRouteName={'MyPWModifyScreen'}
            screenOptions={{
                headerLeft: (props) => (
                    <TouchableOpacity onPress= {()=> navigation.goBack()} style={CommonStyle.stackHeaderLeftWrap}>
                        <Image source={BACK_BUTTON_IMAGE} style={CommonStyle.backButtonWrap} />
                    </TouchableOpacity>
                ),
                headerTitle : (props) => (
                    <View style={CommonStyle.stackHeaderCenterWrap}>
                        <CustomTextB style={CommonStyle.stackHeaderCenterText}>{navTitle}</CustomTextB>
                    </View>
                ),
                headerRight : (props) => (<View style={{flex:1,flexGrow:1}} />),    
            }}
            
        >
        
        <Stack.Screen name="MyPWModifyScreen" >
            {props => <MyPWModifyScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

export {Tabs01Stack,Tabs02Stack,Tabs03Stack,Tabs04Stack,MyIDModifyStack,MyPWModifyStack};

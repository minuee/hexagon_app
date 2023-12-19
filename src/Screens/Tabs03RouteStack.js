import React, { Component } from 'react';
import {TouchableOpacity,Image,PixelRatio,View,StyleSheet} from 'react-native';
import {useSelector,useDispatch} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import ActionCreator from '../Ducks/Actions/MainActions';
const Stack = createStackNavigator();
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../Constants';
import CommonStyle from '../Style/CommonStyle';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import {CustomTextB} from '../Components/CustomText';
import CommonUtil from '../Utils/CommonUtil';
const BACK_BUTTON_IMAGE = require('../../assets/icons/back_icon2.png');
import {createStackNavigator} from '@react-navigation/stack';

import RewardDetailScreen from './Tabs03/RewardDetailScreen';
import MemberDetailScreen from './Tabs03/MemberDetailScreen';
import MemberOrderList from './Order/MemberOrderList';


import ChatListScreen from './Custom/ChatListScreen';
import ChatScreen from './Custom/ChatScreen';

const ChatListStack = ({navigation,route}) => {
    let navTitle = '1:1 문의현황';
    return (
        <Stack.Navigator
            initialRouteName={'ChatListScreen'}
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
                headerRight : (props) => (<View style={CommonStyle.stackHeaderRightWrap} />),
            }}
            
        >
        
        <Stack.Screen name="ChatListScreen" >
            {props => <ChatListScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const ChatStack = ({navigation,route}) => {
    let navTitle = CommonUtil.isEmpty(route.params.userName) ? '1:1 문의현황' : route.params.userName + '님의 1:1문의';
    return (
        <Stack.Navigator
            initialRouteName={'ChatScreen'}
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
                headerRight : (props) => (<View style={CommonStyle.stackHeaderRightWrap} />),
            }}
            
        >
        
        <Stack.Screen name="ChatScreen" >
            {props => <ChatScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const MemberOrderStack = ({navigation,route}) => {
    let navTitle = CommonUtil.isEmpty(route.params.screenData.name) ? '회원정보' : route.params.screenData.name + '님의 주문현황';
    return (
        <Stack.Navigator
            initialRouteName={'MemberOrderList'}
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
                headerRight : (props) => (<View style={CommonStyle.stackHeaderRightWrap} />),
            }}
            
        >
        
        <Stack.Screen name="MemberOrderList" >
            {props => <MemberOrderList {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const RewardDetailStack = ({navigation,route}) => {
    let navTitle = CommonUtil.isEmpty(route.params.screenData.name) ? '회원정보' : route.params.screenData.name + '님의 리워드';
    return (
        <Stack.Navigator
            initialRouteName={'RewardDetailScreen'}
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
                headerRight : (props) => (<View style={CommonStyle.stackHeaderRightWrap} />),
            }}
            
        >
        
        <Stack.Screen name="RewardDetailScreen" >
            {props => <RewardDetailScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};
const MemberDetailStack = ({navigation,route}) => {
    let navTitle = '회원기본정보' ;
    return (
        <Stack.Navigator
            initialRouteName={'MemberDetailScreen'}
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
                headerRight : (props) => (<View style={CommonStyle.stackHeaderRightWrap} />),
            }}
            
        >
        
        <Stack.Screen name="MemberDetailScreen" >
            {props => <MemberDetailScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

export { RewardDetailStack ,MemberDetailStack,MemberOrderStack,ChatListStack,ChatStack} ;
import React, { Component } from 'react';
import {TouchableOpacity,Image,PixelRatio,View} from 'react-native';
import {createMaterialTopTabNavigator,RouteConfigs, TabNavigatorConfig} from '@react-navigation/material-top-tabs';
import {useSelector,useDispatch} from 'react-redux';
import ActionCreator from '../Ducks/Actions/MainActions';
const Stack = createStackNavigator();
const MaterailTopTab =  createMaterialTopTabNavigator(RouteConfigs, TabNavigatorConfig);
import {createStackNavigator} from '@react-navigation/stack';
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../Constants';
import CommonStyle from '../Style/CommonStyle';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import {CustomTextB} from '../Components/CustomText';
import CommonUtil from '../Utils/CommonUtil';
const BACK_BUTTON_IMAGE = require('../../assets/icons/back_icon2.png');
const HEADER_HAMBURG_IMAGE = require('../../assets/icons/icon_hamburg.png');

import NoticeListScreen from './Popup/NoticeListScreen';
import EventListScreen from './Popup/EventListScreen';
import NoticeDetailScreen from './Popup/NoticeDetailScreen';
import EventDetailScreen from './Popup/EventDetailScreen';
import PopNoticeRegistScreen from './Popup/PopNoticeRegistScreen';
import PopNoticeModifyScreen from './Popup/PopNoticeModifyScreen';
import PopEventRegistScreen from './Popup/PopEventRegistScreen';
import PopEventModifyScreen from './Popup/PopEventModifyScreen';

const MaterialTopTabNavi = ({navigation,extraData}) => {
    
    let firstScreen = "공지";
    if (!CommonUtil.isEmpty(extraData.params.gubun) ) {        
        if ( extraData.params.gubun === 2 ) {
            firstScreen = "상품이벤트";
        }else{
            firstScreen = "공지";
        }
    }    

    return (
        <MaterailTopTab.Navigator
            initialRouteName={firstScreen}
            tabBarComponent={firstScreen}
            tabBarOptions={{
                activeTintColor: DEFAULT_COLOR.base_color,
                activeBackgroundColor: '#091e4b',
                inactiveBackgroundColor: '#ffffff',
                inactiveTintColor:  '#ccc',
                indicatorContainerStyle : {
                    borderTopWidth: 1,
                    borderColor: '#fff',
                },                
                indicatorStyle : {
                    borderTopWidth: 2,
                    borderColor: DEFAULT_COLOR.base_color,
                },
                labelStyle: {
                    fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),letterSpacing:-1,fontFamily:'NotoSansKR-Medium',lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize17)
                },
                style:{
                    paddingBottom : -10
                },                
            }}      
            lazy={true}      
            swipeEnabled={true}                
        >
            
            <MaterailTopTab.Screen name="공지">
                {props => <NoticeListScreen {...props} extraData={extraData} />}
            </MaterailTopTab.Screen>
            <MaterailTopTab.Screen name="상품이벤트">
                {props => <EventListScreen {...props} extraData={extraData} />}
            </MaterailTopTab.Screen>
        </MaterailTopTab.Navigator>
    );

    
};

const PopupAdminStack = ({navigation,route}) => {    
    let navTitle = "팝업관리";
    return (
        <Stack.Navigator
            initialRouteName={'MaterialTopTabNavi'}
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
            <Stack.Screen name="MaterialTopTabNavi">
                {props => <MaterialTopTabNavi {...props} extraData={route} />}
            </Stack.Screen>
        </Stack.Navigator>
    );
}

const PopupNoticeDetailStack = ({navigation,route}) => {
    console.log(';ProductListStack',route)
    let navTitle = '팝업공지 상세' ;
    const dispatch = useDispatch();
    const reduxData = useSelector(state => state);
    const {toggleNoticeDetail} = reduxData.GlabalStatus;
    
    checkConfigData = async() => {        
        await dispatch(ActionCreator.fn_ToggleNoticeDetail(!toggleNoticeDetail));
    }
    return (
        <Stack.Navigator
            initialRouteName={'NoticeDetailScreen'}
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
        
        <Stack.Screen name="NoticeDetailScreen" >
            {props => <NoticeDetailScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};


const PopupEventDetailStack = ({navigation,route}) => {
    console.log(';ProductListStack',route)
    let navTitle = '이벤트 상세' ;

    const dispatch = useDispatch();
    const reduxData = useSelector(state => state);
    const {toggleNoticeDetail} = reduxData.GlabalStatus;
    
    checkConfigData = async() => {        
        await dispatch(ActionCreator.fn_ToggleNoticeDetail(!toggleNoticeDetail));
    }
    return (
        <Stack.Navigator
            initialRouteName={'EventDetailScreen'}
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
        
        <Stack.Screen name="EventDetailScreen" >
            {props => <EventDetailScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const PopNoticeRegistStack = ({navigation,route}) => {
    //console.log(';ProductListStack',route)
    let navTitle = '팝업 공지 등록' ;
    
    return (
        <Stack.Navigator
            initialRouteName={'PopNoticeRegistScreen'}
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
        
        <Stack.Screen name="PopNoticeRegistScreen" >
            {props => <PopNoticeRegistScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const PopNoticeModifyStack = ({navigation,route}) => {
    //console.log(';ProductListStack',route)
    let navTitle = '팝업 공지 수정' ;
    
    return (
        <Stack.Navigator
            initialRouteName={'PopNoticeModifyScreen'}
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
        
        <Stack.Screen name="PopNoticeModifyScreen" >
            {props => <PopNoticeModifyScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};
const PopEventRegistStack = ({navigation,route}) => {
    //console.log(';ProductListStack',route)
    let navTitle = '팝업 이벤트 등록' ;
    
    return (
        <Stack.Navigator
            initialRouteName={'PopEventRegistScreen'}
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
        
        <Stack.Screen name="PopEventRegistScreen" >
            {props => <PopEventRegistScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const PopEventModifyStack = ({navigation,route}) => {
    //console.log(';ProductListStack',route)
    let navTitle = '팝업 이벤트 수정' ;
    
    return (
        <Stack.Navigator
            initialRouteName={'PopEventModifyScreen'}
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
        
        <Stack.Screen name="PopEventModifyScreen" >
            {props => <PopEventModifyScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

export { PopupAdminStack ,PopupNoticeDetailStack,PopupEventDetailStack,PopNoticeRegistStack,PopNoticeModifyStack,PopEventRegistStack,PopEventModifyStack};

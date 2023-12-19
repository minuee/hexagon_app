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
import {CustomTextB,CustomTextR} from '../Components/CustomText';
import CommonUtil from '../Utils/CommonUtil';
const BACK_BUTTON_IMAGE = require('../../assets/icons/back_icon2.png');
const HEADER_HAMBURG_IMAGE = require('../../assets/icons/icon_hamburg.png');
import {createStackNavigator} from '@react-navigation/stack';

import NoticeListScreen from './Board/NoticeListScreen';
import NoticeDetailScreen from './Board/NoticeDetailScreen';
import NoticeRegistScreen from './Board/NoticeRegistScreen';
import NoticeModifyScreen from './Board/NoticeModifyScreen';
import BannerListScreen from './Banner/BannerListScreen';
import BannerRegistScreen from './Banner/BannerRegistScreen';
import BannerModifyScreen from './Banner/BannerModifyScreen';
import BannerListModifyScreen from './Banner/BannerListModifyScreen';

import SalesManListScreen from './SalesMan/ListScreen';
import SalesManDetailScreen from './SalesMan/SalesManDetailScreen';
import MonthDetailScreen from './SalesMan/MonthDetailScreen';
import OrderDetailScreen from './Order/OrderDetailScreen';
import ChargeListScreen from './SalesMan/ChargeListScreen';
import MemberInfoScreen from './SalesMan/MemberInfoScreen';
import SalesManRegistScreen from './SalesMan/SalesManRegistScreen';
import SalesManModifyScreen from './SalesMan/SalesManModifyScreen';

import CouponListScreen from './Coupon/CouponListScreen';
import CouponRegistScreen from './Coupon/CouponRegistScreen';
import CouponDetailScreen from './Coupon/CouponDetailScreen';
import CouponModifyScreen from './Coupon/CouponModifyScreen';


const CouponListStack = ({navigation,route}) => {
    //console.log(';ProductListStack',route)
    let navTitle = '쿠폰발급/사용현황' ;
    
    return (
        <Stack.Navigator
            initialRouteName={'CouponListScreen'}
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
        
        <Stack.Screen name="CouponListScreen" >
            {props => <CouponListScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const CouponRegistStack = ({navigation,route}) => {
    //console.log(';ProductListStack',route)
    let navTitle = '쿠폰등록 및 발급' ;
    
    return (
        <Stack.Navigator
            initialRouteName={'CouponRegistScreen'}
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
        
        <Stack.Screen name="CouponRegistScreen" >
            {props => <CouponRegistScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const CouponModifyStack = ({navigation,route}) => {
    //console.log(';ProductListStack',route)
    let navTitle = '쿠폰수정' ;
    
    return (
        <Stack.Navigator
            initialRouteName={'CouponModifyScreen'}
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
        
        <Stack.Screen name="CouponModifyScreen" >
            {props => <CouponModifyScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const CouponDetailStack = ({navigation,route}) => {
    //console.log(';ProductListStack',route)
    let navTitle = '쿠폰상세정보' ;
    
    return (
        <Stack.Navigator
            initialRouteName={'CouponDetailScreen'}
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
        
        <Stack.Screen name="CouponDetailScreen" >
            {props => <CouponDetailScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const MemberInfoStack = ({navigation,route}) => {
    //console.log(';ProductListStack',route)
    let navTitle = '회원 등록정보' ;
    
    return (
        <Stack.Navigator
            initialRouteName={'MemberInfoScreen'}
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
        
        <Stack.Screen name="MemberInfoScreen" >
            {props => <MemberInfoScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const SalesManRegistStack = ({navigation,route}) => {
    //console.log(';ProductListStack',route)
    let navTitle = '영업사원 등록' ;
    
    return (
        <Stack.Navigator
            initialRouteName={'SalesManRegistScreen'}
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
        
        <Stack.Screen name="SalesManRegistScreen" >
            {props => <SalesManRegistScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};


const SalesManModifyStack = ({navigation,route}) => {
    //console.log(';ProductListStack',route)
    let navTitle = CommonUtil.isEmpty(route.params.screenData.name) ? '영업사원 수정' : route.params.screenData.name + ' 영업사원 수정';
   
    return (
        <Stack.Navigator
            initialRouteName={'SalesManModifyScreen'}
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
        
        <Stack.Screen name="SalesManModifyScreen" >
            {props => <SalesManModifyScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const SalesManListStack = ({navigation,route}) => {
    //console.log(';ProductListStack',route)
    let navTitle = '영업사원 관리' ;
    
    return (
        <Stack.Navigator
            initialRouteName={'SalesManListScreen'}
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
        
        <Stack.Screen name="SalesManListScreen" >
            {props => <SalesManListScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const SalesManDetailStack = ({navigation,route}) => {
    //console.log(';ProductListStack',route)
    let navTitle = '영업사원 상세' ;
    
    return (
        <Stack.Navigator
            initialRouteName={'SalesManDetailScreen'}
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
        
        <Stack.Screen name="SalesManDetailScreen" >
            {props => <SalesManDetailScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const MonthDetailStack = ({navigation,route}) => {
    //console.log(';ProductListStack',route)
    let navTitle = '영업사원 월별상세' ;
    
    return (
        <Stack.Navigator
            initialRouteName={'MonthDetailScreen'}
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
        
        <Stack.Screen name="MonthDetailScreen" >
            {props => <MonthDetailScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const ChargeListStack = ({navigation,route}) => {
    //console.log(';ProductListStack',route)
    let navTitle = '관리회원 리스트' ;
    
    return (
        <Stack.Navigator
            initialRouteName={'ChargeListScreen'}
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
        
        <Stack.Screen name="ChargeListScreen" >
            {props => <ChargeListScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const OrderDetailStack = ({navigation,route}) => {
    //console.log(';ProductListStack',route)
    let navTitle = '주문 상세' ;
    
    return (
        <Stack.Navigator
            initialRouteName={'OrderDetailScreen'}
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
        <Stack.Screen name="OrderDetailScreen" >
            {props => <OrderDetailScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};


const BannerListStack = ({navigation,route}) => {
    //console.log(';ProductListStack',route)
    let navTitle = '배너 관리' ;
    
    return (
        <Stack.Navigator
            initialRouteName={'BannerListScreen'}
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
        
        <Stack.Screen name="BannerListScreen" >
            {props => <BannerListScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const BannerListModifyStack = ({navigation,route}) => {
    //console.log(';ProductListStack',route)
    let navTitle = '배너 노출순서 관리' ;
    
    return (
        <Stack.Navigator
            initialRouteName={'BannerListModifyScreen'}
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
        
        <Stack.Screen name="BannerListModifyScreen" >
            {props => <BannerListModifyScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const BannerRegistStack = ({navigation,route}) => {
    //console.log(';ProductListStack',route)
    let navTitle = '배너 등록' ;
    
    return (
        <Stack.Navigator
            initialRouteName={'BannerRegistScreen'}
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
        
        <Stack.Screen name="BannerRegistScreen" >
            {props => <BannerRegistScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const BannerModifyStack = ({navigation,route}) => {
    //console.log(';ProductListStack',route)
    let navTitle = '배너 수정' ;
    const dispatch = useDispatch();
    const reduxData = useSelector(state => state);
    const {toggleBannerDetail} = reduxData.GlabalStatus;
    
    checkConfigData = async() => { 
        console.log('BannerModifyStack',toggleBannerDetail)       
        await dispatch(ActionCreator.fn_ToggleBannerDetail(!toggleBannerDetail));
    }
    return (
        <Stack.Navigator
            initialRouteName={'BannerModifyScreen'}
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
                headerRight : (props) => (<TouchableOpacity onPress= {()=> checkConfigData()} style={{flex:1,justifyContent:'center',paddingRight:10}}><Image source={HEADER_HAMBURG_IMAGE} style={{width: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23), height: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23)}} /></TouchableOpacity>),    
            }}
            
        >
        
        <Stack.Screen name="BannerModifyScreen" >
            {props => <BannerModifyScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const NoticeListStack = ({navigation,route}) => {
    //console.log(';ProductListStack',route)
    let navTitle = '공지 관리' ;
    
    return (
        <Stack.Navigator
            initialRouteName={'NoticeListScreen'}
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
        
        <Stack.Screen name="NoticeListScreen" >
            {props => <NoticeListScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const NoticeDetailStack = ({navigation,route}) => {
    //console.log(';ProductListStack',route)
    let navTitle = '공지사항 상세' ;
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
                headerRight : (props) => (<TouchableOpacity onPress= {()=> checkConfigData()} style={{flex:1,justifyContent:'center',paddingRight:10}}><Image source={HEADER_HAMBURG_IMAGE} style={{width: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23), height: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23)}} /></TouchableOpacity>),    
            }}
            
        >
        
        <Stack.Screen name="NoticeDetailScreen" >
            {props => <NoticeDetailScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const NoticeRegistStack = ({navigation,route}) => {
    //console.log(';ProductListStack',route)
    let navTitle = '공지사항 등록' ;
    
    return (
        <Stack.Navigator
            initialRouteName={'NoticeRegistScreen'}
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
        
        <Stack.Screen name="NoticeRegistScreen" >
            {props => <NoticeRegistScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const NoticeModifyStack = ({navigation,route}) => {
    //console.log(';ProductListStack',route)
    let navTitle = '공지사항 수정' ;
    
    return (
        <Stack.Navigator
            initialRouteName={'NoticeModifyScreen'}
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
        
        <Stack.Screen name="NoticeModifyScreen" >
            {props => <NoticeModifyScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

export { NoticeListStack,NoticeDetailStack,NoticeRegistStack,NoticeModifyStack,BannerListStack,BannerRegistStack,BannerModifyStack,BannerListModifyStack, SalesManListStack,SalesManDetailStack,MonthDetailStack,OrderDetailStack,ChargeListStack,MemberInfoStack,SalesManRegistStack,SalesManModifyStack ,CouponListStack,CouponRegistStack,CouponDetailStack,CouponModifyStack} ;
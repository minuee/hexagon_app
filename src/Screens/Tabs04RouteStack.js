import React, { Component } from 'react';
import {TouchableOpacity,Image,PixelRatio,View,StyleSheet} from 'react-native';
import {useSelector,useDispatch} from 'react-redux';
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
import ActionCreator from '../Ducks/Actions/MainActions';
const Stack = createStackNavigator();
import TextTicker from '../Utils/TextTicker';
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


import CategoryList from './Product/CategoryList';
import ProductListScreen from './Product/ProductListScreen';
import ProductDetailScreen from './Product/ProductDetailScreen';
import ProductModifyScreen from './Product/ProductModifyScreen';
import ProductRegistScreen from './Product/ProductRegistScreen';
import MDProductListScreen from './Product/MDProductListScreen';
import CategoryListModifyScreen from './Product/CategoryListModifyScreen';
import CategoryRegistScreen from './Product/CategoryRegistScreen';
import CategoryModifyScreen from './Product/CategoryModifyScreen';
import ProductListModifyScreen from './Product/ProductListModifyScreen';

import EventScreen from './Event/EventScreen';
import EventRegistScreen from './Event/RegistScreen';
import EventModifyScreen from './Event/ModifyScreen';
import EventDetailScreen from './Event/EventDetailScreen';

const MDProductListStack = ({navigation,route}) => {
    //console.log(';ProductListStack',route)
    let navTitle = 'MD추천 상품관리' ;
    return (
        <Stack.Navigator
            initialRouteName={'MDProductListScreen'}
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
        <Stack.Screen name="MDProductListScreen" >
            {props => <MDProductListScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const EventListStack = ({navigation,route}) => {
    //console.log(';ProductListStack',route)
    let navTitle = '이벤트 관리' ;
    return (
        <Stack.Navigator
            initialRouteName={'EventScreen'}
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
        <Stack.Screen name="EventScreen" >
            {props => <EventScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const EventRegistStack = ({navigation,route}) => {
    //console.log(';ProductListStack',route)
    let navTitle = '이벤트 등록' ;
    return (
        <Stack.Navigator
            initialRouteName={'EventRegistScreen'}
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
        <Stack.Screen name="EventRegistScreen" >
            {props => <EventRegistScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const EventModifyStack = ({navigation,route}) => {
    //console.log(';ProductListStack',route)
    let navTitle = '이벤트 수정' ;
    return (
        <Stack.Navigator
            initialRouteName={'EventModifyScreen'}
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
        <Stack.Screen name="EventModifyScreen" >
            {props => <EventModifyScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const EventDetailStack = ({navigation,route}) => {
    //console.log(';ProductListStack',route)
    let navTitle = '이벤트 상세' ;
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

const CategoryListStack = ({navigation,route}) => {
    const dispatch = useDispatch();
    const reduxData = useSelector(state => state);
    const {togglecategory} = reduxData.GlabalStatus;
    const navTitle = "카테고리 관리"
    checkConfigData = async() => {        
        await dispatch(ActionCreator.fn_ToggleCategory(!togglecategory));
    }
    return (
        <Stack.Navigator
            initialRouteName={'CategoryList'}
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
                headerRight : (props) => (<TouchableOpacity onPress= {()=> checkConfigData()} style={CommonStyle.stackHeaderRightWrap}><Image source={HEADER_HAMBURG_IMAGE} style={{width: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23), height: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23)}} /></TouchableOpacity>),    
                
            }}
            
        >
        
        <Stack.Screen name="CategoryList" >
            {props => <CategoryList {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const ProductListButton = (props) => {
    let _menu = null;
    return (
        <View style={props.menustyle}>
            <Menu
                ref={(tref) => (_menu = tref)}
                button={
                props.isIcon ? (
                    <TouchableOpacity 
                        underlayColor="transparent"                        
                        onPress={() => _menu.show()} hitSlop={{left:20,right:20,bottom:10,top:10}}
                        hitSlop={{left:10,right:10,bottom:10,top:10}}
                        style={{zIndex:50,alignItems:'flex-end',justifyContent:'center'}}
                    >
                        <Image source={HEADER_HAMBURG_IMAGE} style={{width: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23), height: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23)}} />
                    </TouchableOpacity>
                ) : (
                    null
                )}
            >
                <MenuItem onPress={() => {props.modifyCategory();_menu.hide()}}>카테고리수정</MenuItem> 
                <MenuItem onPress={() => {props.modifyProductList();_menu.hide()}}>상품목록수정</MenuItem>
                
            </Menu>
        </View>
    );
}

const ProductListStack = ({navigation,route}) => {
    console.log(';ProductListStack',route.params.screenData)
    const dispatch = useDispatch();
    const reduxData = useSelector(state => state);
    const {selectCategoryName} = reduxData.GlabalStatus;
    

    modifyCategory = () => {
        navigation.navigate('CategoryModifyStack',{
            screenData:route.params.screenData
        })
    }
    modifyProductList = () => {
        navigation.navigate('ProductListModifyStack',{
            categoryType : route.params.screenData.category_pk,
            screenData:route.params.screenData
        })
    }
    //let navTitle = CommonUtil.isEmpty(route.params.screenData.category_name) ? '상품 카테고리' : route.params.screenData.category_name;
    let navTitle = !CommonUtil.isEmpty(selectCategoryName) ? selectCategoryName : CommonUtil.isEmpty(route.params.screenData.category_name) ? '상품 카테고리' : route.params.screenData.category_name;
    return (
        <Stack.Navigator
            initialRouteName={'ProductListScreen'}
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
                headerRight : (props) => (
                    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                        <ProductListButton
                            menutext=""
                            //menustyle={{width:40,height:50,marginRight:0}}
                            menustyle={CommonStyle.subHeaderRightWrap}
                            textStyle={{color: '#fff'}}                                                
                            isIcon={true}
                            modifyCategory={modifyCategory}
                            modifyProductList={modifyProductList}
                        />
                    </View>
                ),  
                
            }}
        >
        
        <Stack.Screen name="ProductListScreen" >
            {props => <ProductListScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const ProductDetailStack = ({navigation,route}) => {
    //console.log(';ProductListStack',route)    
    let navTitle = CommonUtil.isEmpty(route.params.screenData.product_name) ? '상품 상세' : route.params.screenData.product_name;
    let navData = CommonUtil.isEmpty(route.params.screenData) ? {}: route.params.screenData;
    return (
        <Stack.Navigator
            initialRouteName={'ProductDetailScreen'}
            screenOptions={{
                headerLeft: (props) => (
                    <TouchableOpacity onPress= {()=> navigation.goBack()} style={CommonStyle.stackHeaderLeftWrap}>
                        <Image source={BACK_BUTTON_IMAGE} style={CommonStyle.backButtonWrap} />
                    </TouchableOpacity>
                ),
                
                headerTitle : (props) => (
                    <View style={{flex:1,paddingTop:Platform.OS === 'ios'?10:0}}>
                        <TextTicker
                            //marqueeOnMount={false} 
                            style={{fontFamily: DEFAULT_CONSTANTS.defaultFontFamilyRegular,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.base_color_000,lineHeight: DEFAULT_TEXT.fontSize15 * 1.42,}}
                            shouldAnimateTreshold={10}
                            duration={8000}
                            loop
                            bounce
                            repeatSpacer={100}
                            marqueeDelay={1000}
                        >
                            {navTitle}
                        </TextTicker>
                    </View>
                ),
                headerRight : (props) => (<TouchableOpacity onPress= {()=> navigation.navigate('ProductModifyStack',{screenData:navData})} style={CommonStyle.stackHeaderRightWrap}><CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.base_color}}>수정</CustomTextR></TouchableOpacity>)
            }}
        >
        <Stack.Screen name="ProductDetailScreen" >
            {props => <ProductDetailScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const ProductRegistStack = ({navigation,route}) => {
    //console.log(';ProductListStack',route)
    let navTitle = '상품 등록' ;
    return (
        <Stack.Navigator
            initialRouteName={'ProductRegistScreen'}
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
        <Stack.Screen name="ProductRegistScreen" >
            {props => <ProductRegistScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const ProductModifyStack = ({navigation,route}) => {
    //console.log('ProductListStack',route)
    let navTitle = CommonUtil.isEmpty(route.params.screenData.product_name) ? '상품 수정' : route.params.screenData.product_name + ' 수정';
    
    return (
        <Stack.Navigator
            initialRouteName={'ProductModifyScreen'}
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
        
        <Stack.Screen name="ProductModifyScreen" >
            {props => <ProductModifyScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const CategoryListModifyStack = ({navigation,route}) => {
    //console.log(';ProductListStack',route)
    let navTitle = '카테고리 목록 수정';
    
    return (
        <Stack.Navigator
            initialRouteName={'CategoryListModifyScreen'}
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
        
        <Stack.Screen name="CategoryListModifyScreen" >
            {props => <CategoryListModifyScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const CategoryRegistStack = ({navigation,route}) => {
    //console.log(';ProductListStack',route)
    let navTitle = '카테고리 생성';
    
    return (
        <Stack.Navigator
            initialRouteName={'CategoryRegistScreen'}
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
        
        <Stack.Screen name="CategoryRegistScreen" >
            {props => <CategoryRegistScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const CategoryModifyStack = ({navigation,route}) => {
    //console.log(';ProductListStack',route)
    let navTitle = '카테고리 수정';
    
    return (
        <Stack.Navigator
            initialRouteName={'CategoryModifyScreen'}
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
        
        <Stack.Screen name="CategoryModifyScreen" >
            {props => <CategoryModifyScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const ProductListModifyStack = ({navigation,route}) => {
    //console.log(';ProductListStack',route)
    let navTitle = '상품목록 수정';
    
    return (
        <Stack.Navigator
            initialRouteName={'ProductListModifyScreen'}
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
        
        <Stack.Screen name="ProductListModifyScreen" >
            {props => <ProductListModifyScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

export { MDProductListStack,CategoryListStack ,ProductListStack, ProductDetailStack,ProductRegistStack,ProductModifyStack ,CategoryListModifyStack,CategoryRegistStack,CategoryModifyStack,ProductListModifyStack,EventListStack,EventRegistStack,EventModifyStack,EventDetailStack} ;
import React, { Component } from 'react';
import {ScrollView,View,StyleSheet,Platform,Image,PixelRatio} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
Icon.loadFont();
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {connect} from 'react-redux';
import ActionCreator from '../Ducks/Actions/MainActions';
const Tab = createBottomTabNavigator();
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonFunction from '../Utils/CommonFunction';

import {Tabs01Stack,Tabs02Stack,Tabs03Stack,Tabs04Stack} from './SalesmanApp/BaseStack'; 
import { CustomTextR } from '../Components/CustomText';

const AddButton = () => {
    return null
}

class SalesmanMainScreen extends React.PureComponent {


    CustomTabsLabel = (str,tcolor = '#fff' ) => {                    
        return (
            <CustomTextR style={[styles.labelText,{color:tcolor}]}>{str}</CustomTextR>
        )
    }

    render() {
        return(
            <Tab.Navigator
                initialRouteName="Tabs01Stack"
                tabBarOptions={{
                    activeTintColor: DEFAULT_COLOR.base_color,
                    activeBackgroundColor: '#ffffff',
                    inactiveBackgroundColor: '#ffffff',
                    inactiveTintColor:  '#979797',
                    style:{}
                }}
                //tabPress={this.actionToggleDrawer()}
            >
                <Tab.Screen
                    name="Tabs01Stack"
                    //component={Tabs01Stack}
                    options={(navigation) => ({
                        tabBarLabel: ({color})=>this.CustomTabsLabel('홈',color),
                        tabBarIcon: ({color}) => 
                        <Image 
                        source={color === DEFAULT_COLOR.base_color ? require('../../assets/icons/tab1_on.png') : require('../../assets/icons/tab1_off.png')}
                            style={Platform.OS === 'ios' ? styles.tabsWrapiOS : styles.tabsWrapAndroid}
                        />,
                    })}
                >
                    {props => <Tabs01Stack {...props} screenState={this.state} screenProps={this.props} />}
                </Tab.Screen>
                <Tab.Screen
                    name="Tabs02Stack"
                    component={Tabs02Stack}
                    options={{    
                        tabBarLabel: ({color})=>this.CustomTabsLabel('구매현황',color),
                        tabBarIcon: ({color}) => (
                            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                                <Image 
                                source={color === DEFAULT_COLOR.base_color ? require('../../assets/icons/sales_tab2_on.png') : require('../../assets/icons/sales_tab2_off.png')}
                                    resizeMode={'contain'}
                                    style={Platform.OS === 'ios' ? styles.tabsWrapiOS : styles.tabsWrapAndroid}
                                />
                            </View>
                        ),
                        //barStyle: {backgroundColor: '#ffffff'},
                    }}
                    
                />
               
                <Tab.Screen
                    name="Tabs03Stack"
                    component={Tabs03Stack}
                    options={{
                        tabBarLabel: ({color})=>this.CustomTabsLabel('회원관리',color),
                        tabBarIcon: ({color}) => (
                            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                                <Image 
                                    source={color === DEFAULT_COLOR.base_color ? require('../../assets/icons/sales_tab3_on.png') : require('../../assets/icons/sales_tab3_off.png')}
                                    resizeMode={'contain'}
                                    style={Platform.OS === 'ios' ? styles.tabsWrapiOS : styles.tabsWrapAndroid}
                                />
                            </View>
                        ),                    
                        //barStyle: {backgroundColor: '#ffffff'},
                    }}
                />
                <Tab.Screen
                    name="Tabs04Stack"
                    component={Tabs04Stack}
                    options={{
                        tabBarLabel: ({color})=>this.CustomTabsLabel('설정',color),
                        tabBarIcon: ({color}) => (
                            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                                <Image 
                                source={color === DEFAULT_COLOR.base_color ? require('../../assets/icons/sales_tab4_on.png') : require('../../assets/icons/sales_tab4_off.png')}
                                    resizeMode={'contain'}
                                    style={Platform.OS === 'ios' ? styles.tabsWrapiOS : styles.tabsWrapAndroid}
                                />
                            </View>
                        ),
                        //barStyle: {backgroundColor: '#ffffff'},
                    }}
                />
            </Tab.Navigator>
        );
    }
    
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    labelText : { 
        fontSize : DEFAULT_TEXT.fontSize10,        
        margin : 0,padding:0,
        paddingTop:2,
        ...Platform.select({
            ios : {
                marginTop:-5,
                marginBottom:5
            },
            android : {
                marginTop:2,
                marginBottom:-2
            }
        })
    },
    tabsWrapAndroid : {
        width:PixelRatio.roundToNearestPixel(22),height:PixelRatio.roundToNearestPixel(22),marginTop:15
    },
    tabsWrapiOS : {
        width:PixelRatio.roundToNearestPixel(22),height:PixelRatio.roundToNearestPixel(22),marginTop:0
    },
    tabsWrapAndroid2 : {
        width:PixelRatio.roundToNearestPixel(44),height:PixelRatio.roundToNearestPixel(44),marginTop:15
    },
    tabsWrapiOS2 : {
        width:PixelRatio.roundToNearestPixel(60),height:PixelRatio.roundToNearestPixel(60),marginTop:0
    }
});


function mapStateToProps(state) {
    return {
        userToken : state.GlabalStatus.userToken
    };
}



export default connect(mapStateToProps,null)(SalesmanMainScreen);
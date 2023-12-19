import React,{useState,useEffect} from 'react';
import {Text,View,StyleSheet,BackHandler,ToastAndroid,Platform,Alert,StatusBar,Image,SafeAreaView,Dimensions,ScrollView,PixelRatio,PermissionsAndroid,NativeModules} from 'react-native';
import 'react-native-gesture-handler';
import RNExitApp from 'react-native-exit-app';
import DeviceInfo from 'react-native-device-info';
import Orientation from 'react-native-orientation';
import AsyncStorage from '@react-native-community/async-storage';
import 'moment/locale/ko'
import  moment  from  "moment";
import CryptoJS from "react-native-crypto-js";
//import firebase from 'react-native-firebase';
import messaging from '@react-native-firebase/messaging';
import { Provider } from 'react-redux';
import initStore from './src/Ducks/mainStore';
const store = initStore();
const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT} = Dimensions.get("window");
import AppHomeStack from './src/Route/Navigation';

//공통상수 필요에 의해서 사용
import  * as getDEFAULT_CONSTANTS   from './src/Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonUtil from './src/Utils/CommonUtil';
import CommonFunction from './src/Utils/CommonFunction';
import Loader from './src/Utils/Loader';
import {CustomTextR,CustomTextL, CustomTextB, CustomTextM, TextRobotoM,TextRobotoR} from './src/Components/CustomText';

import { apiObject } from "./src/Screens/Apis";

import codePush from 'react-native-code-push';
import CodePushComponent from './CodePushComponent';
const codePushOptions = {
    checkFrequency: codePush.CheckFrequency.ON_APP_START,
    installMode: codePush.InstallMode.IMMEDIATE,
}

class App extends React.PureComponent {

    constructor(props) {
        super(props);
            this.state = {   
            loading : true,
            isInstalledMTAP : false,
            popLayerView : false,
            isConnected : true, 
            exitApp : false,
            orientation : '',
            thisUUID : null,
            deviceName : null,
            deviceModel : null,
            latitude: 0,
            longitude: 0
        };
    }        
  
    getCodeData = async() => {
        let returnCode = {code:9998};     
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/commoncode';
            //console.log('url',url) 
            const token = null;
            returnCode = await apiObject.API_getCommonCode(url,token);          
            //console.log('returnCode',returnCode)   
            if ( returnCode.code === '0000'  ) {
                await  AsyncStorage.setItem('BankCode',JSON.stringify(returnCode.data.codebank) );   
                await  AsyncStorage.setItem('CommonCode',JSON.stringify(returnCode.data.common) );  
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.',2000);
            }
            this.setState({moreLoading:false,loading:false})
        }catch(e){
            this.setState({loading:false,moreLoading : false})
        }
    }
    getCagegoryCodeData = async() => {
        let returnCode = {code:9998};     
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/category/depth/list';
            //console.log('url',url) 
            const token = null;
            returnCode = await apiObject.API_getCommonCode(url,token);          
            //console.log('returnCode',returnCode)   
            if ( returnCode.code === '0000'  ) {
                await  AsyncStorage.setItem('CategoryCode',JSON.stringify(returnCode.data.categoryDepthList) );   
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다3.',2000);
            }
            this.setState({moreLoading:false,loading:false})
        }catch(e){
            //console.log('e',e) 
            this.setState({loading:false,moreLoading : false})
        }
    }
    
    async UNSAFE_componentWillMount() {
        
        let makeUUID =  DeviceInfo.getMacAddressSync() + DeviceInfo.getUniqueId();        
        let deviceModel = DeviceInfo.getModel();
        let uuid =  DEFAULT_CONSTANTS.appID + CryptoJS.MD5(makeUUID).toString()
        await this.setState({
            popLayerView : false,
            thisUUID:uuid,        
            deviceModel:deviceModel
        })
        this.getCodeData();
        const CategoryCode = await AsyncStorage.getItem('CategoryCode');     
        //console.log('CategoryCode',CategoryCode)        
        if(CommonUtil.isEmpty(CategoryCode) ) {
            this.getCagegoryCodeData();
        }
        BackHandler.addEventListener('hardwareBackPress', this.rootHandleBackButton);   
        const initial = Orientation.getInitialOrientation();
        Orientation.lockToPortrait();
        //await this.fcmCheckPermission();
        //await this.messageListener();       
        await this.requestUserPermissionForFCM();
    }

 
    

    componentDidMount() {
        //codePush.sync(codePushOptions);
        //codePush.notifyAppReady();
        Dimensions.addEventListener( 'change', () =>    {        
            this.getOrientation();
        });
    }  
    UNSAFE_componentWillUnmount() {
        Orientation.getOrientation((err, orientation) => {        
        });
        Orientation.removeOrientationListener(this._orientationDidChange);
    }

    getOrientation = () => {        
        if( this.rootView ){            
            if( Dimensions.get('window').width < Dimensions.get('window').height ){                
                this.setState({ orientation: 'portrait' });
            }else{                
                this.setState({ orientation: 'landscape' });
            }
        }
    }

    requestUserPermissionForFCM = async () => {
        const authStatus = await messaging().requestPermission();
        const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (enabled) {
            const token = await messaging().getToken();
            console.log('fcm token:', token);
            console.log('Authorization status:', authStatus);   
            this.handleFcmMessage();
        } else {
            //console.log('fcm auth fail');
        }
    }

    handleFcmMessage = () => {
        //푸시를 받으면 호출됨 
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
        });
        //알림창을 클릭한 경우 호출됨 
        messaging().onNotificationOpenedApp(remoteMessage => {
            //console.log('Notification caused app to open from background state:',remoteMessage.notification);
        });
    }

    rootHandleBackButton = () => {      
        if ( this.state.exitApp ) {
            clearTimeout(this.timeout);
                this.setState({ exitApp: false });
                RNExitApp.exitApp();  // 앱 종료
        } else {
            ToastAndroid.show('한번 더 누르시면 종료됩니다.', ToastAndroid.SHORT);
            this.setState({ 
                exitApp: true                
            });
            this.timeout = setTimeout(
                () => {
                    this.setState({ exitApp: false});
            },2000);
        }
        return true;
    }; 

    /* 여기부터 fcm 설정 */
    fcmCheckPermission = async () => {
        const enabled = await firebase.messaging().hasPermission();
        //console.log('fcmCheckPermission enabled : ', enabled);
        if (enabled) {
            this.getFcmToken();
        } else {
            this.requestPermission();
        }
    }

    getFcmToken = async () => {
        const fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {          
            console.log('fcm Token', Platform.OS, fcmToken);
            console.log('this.state.thisUUID', this.state.thisUUID);
            const wasUUID = await AsyncStorage.getItem('UUID');
            //console.log('wasUUID: ',wasUUID);
            if(CommonUtil.isEmpty(wasUUID) ) {                
                await  AsyncStorage.setItem('UUID',this.state.thisUUID);    
            }
            if ( !CommonUtil.isEmpty(fcmToken) ) {
                this.setFcmTokenToDataBase(fcmToken,Platform.OS,this.state.thisUUID)
            }
            this.setState({
                fcmToken : fcmToken
            })
        } else {
            //this.showAlert('Failed', 'No token received');
        }
    }

    setFcmTokenToDataBase = async(fcmToken,ostype,uuid) => {
        
    }

    requestPermission = async () => {
        try {
            await firebase.messaging().requestPermission();
            // User has authorised
        } catch (error) {
            // User has rejected permissions
            ////console.log('requestPermission error : ', error);
        }
    }

    messageListener = async () => {    
        
        //백그라운드에서 푸시를 받으면 호출됨 
        messaging().setBackgroundMessageHandler(async remoteMessage => {
            //console.log('Message handled in the background!', remoteMessage);
            const { title, body } = remoteMessage.notification;

            this.setState({
                fcmTitle :  title,
                fcmbody : body
            })
            if ( !CommonUtil.isEmpty(title)) {
                this.setState({popLayerView:true})
            }
        });
        /*
        this.notificationListener = firebase.notifications().onNotification((notification) => {
            const { title, body } = notification;
            //this.showAlert(title, body,1);
            this.setState({
                fcmTitle :  title,
                fcmbody : body
            })
            if ( !CommonUtil.isEmpty(title)) {
                this.setState({popLayerView:true})
            }
        });

        //여기가 로컬도 겸용 ios경우
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
            const { title, body } = notificationOpen.notification;
            this.setState({
                fcmTitle :  title,
                fcmbody : body
            })
            if ( !CommonUtil.isEmpty(title)) {
                this.setState({popLayerView:true})
            }
        });
    
        const notificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) {        
            const { title, body } = notificationOpen.notification;
            this.setState({
                fcmTitle :  title,
                fcmbody : body
            })
            if ( !CommonUtil.isEmpty(title)) {
                this.setState({popLayerView:true})
            }
        }

        this.messageListener = firebase.messaging().onMessage((message) => {
        //console.log(JSON.stringify(message));
        });
        */
    }

    showAlert = async(title, message,idx) => {       
        Alert.alert(
            title,
            message,
            [
                {text: '확인', onPress: () => console.log('OK Pressed')},
            ],
            {cancelable: false},
        );
    }

    render() {
        if ( this.state.loading ) {
            return (
                <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} />
            )
        }else {
            return (
                <Provider store={store} >                
                    { Platform.OS == 'android' && <StatusBar backgroundColor={'#fff'} translucent={false}  barStyle="dark-content" />}
                    <CodePushComponent />
                    <AppHomeStack screenState={this.state} screenProps={this.props} />
                </Provider>
            );
        }
    }
}


const styles = StyleSheet.create({
    Rootcontainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor : "#fff",
    },
    introImageWrapper : {
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
});


export default codePush(codePushOptions)(App)

/*
https://mrparkcodingschool.tistory.com/1
*/
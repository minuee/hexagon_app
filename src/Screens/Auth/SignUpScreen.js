import React, { Component } from 'react';
import {SafeAreaView,Image,View,StyleSheet,PixelRatio,Dimensions,TouchableOpacity,StatusBar,Linking,KeyboardAvoidingView,ScrollView} from 'react-native';
import * as NetInfo from "@react-native-community/netinfo"
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import {Input,CheckBox} from 'react-native-elements';
import jwt_decode from "jwt-decode";
import AsyncStorage from '@react-native-community/async-storage';
//공통상수 필요에 의해서 사용
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import CommonStyle from '../../Style/CommonStyle';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {CustomTextR,CustomTextL, CustomTextB, CustomTextM, TextRobotoM,TextRobotoR} from '../../Components/CustomText';
import NetworkDisabled from '../../Components/NetworkDisabled';
import CommonFunction from '../../Utils/CommonFunction';
import CommonUtil from '../../Utils/CommonUtil';
import Loader from '../../Utils/Loader';
import { apiObject } from "../Apis";
const RADIOON_OFF = require('../../../assets/icons/checkbox_off.png');
const RADIOON_ON = require('../../../assets/icons/checkbox_on.png');
class SignupScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            thisUUID : null,
            loading : true,
            moreLoading : false,
            isConnected :  true,
            isSalesman : false,
            formUserID : '',
            formPassword : '',
            //formUserID : 'superbinder',
            //formPassword : 'hexagon12!@',
            isMemoryID : false
        }
    }


    async UNSAFE_componentWillMount() {
        const isMemoryID = await AsyncStorage.getItem('isMemoryID');         
        if(!CommonUtil.isEmpty(isMemoryID) ) {             
            this.setState({formUserID:isMemoryID,isMemoryID:true});
        }
        if ( !CommonUtil.isEmpty(this.props.rootState)) {
            if ( !CommonUtil.isEmpty(this.props.rootState.thisUUID)) {
                this.setState({
                    thisUUID : this.props.rootState.thisUUID
                })
            }
        }
    }

    componentDidMount() {    
        if (Platform.OS === 'android') { //안드로이드는 아래와 같이 initialURL을 확인하고 navigate 합니다.
            Linking.getInitialURL().then(url => {
              if(url) this.getNavigateInfo(url); //
            });
        }else{ //ios는 이벤트리스너를 mount/unmount 하여 url을 navigate 합니다.
            Linking.addEventListener('url', this.handleOpenURL);
        }
        NetInfo.addEventListener(this.handleConnectChange);
    }
    UNSAFE_componentWillUnmount() { 
        Linking.removeEventListener('url', this.handleOpenURL);
        NetInfo.removeEventListener(this.handleConnectChange)
    }
    handleOpenURL = (event) => { //이벤트 리스너.
        this.getNavigateInfo(event.url);
    }
    handleConnectChange = state => {
        this.setState({isConnected:state.isConnected})
        this.timeout = setTimeout(
            () => {
                this.setState({ loading: false});
            },
            500    // 2초
        );  
    }
    getNavigateInfo = (url) =>{
        const basepaths = url.split('?'); // 쿼리스트링 관련한 패키지들을 활용하면 유용합니다.
        const paths = basepaths[1].split('|'); // 쿼리스트링 관련한 패키지들을 활용하면 유용합니다.
        if ( paths[0] === 'shareJoin') {
             if ( !CommonUtil.isEmpty(paths[1])) {
                const shareMember = paths[1].split('=');
                if ( !CommonUtil.isEmpty( shareMember[1])) {
                    this.setState({
                        shareMember : shareMember[1]
                    })
                }
            }
        }else{
            let arrayParams = [];
            if(paths.length>1){ //파라미터가 있다
              const params= paths[1].split('&');
              let id;
              for(let i=0; i<params.length; i++){
                //let param = params[i].split('=');// [0]: key, [1]:value
                let nextData = params[i].replace('=',':');
                arrayParams.push(nextData)
                
              }
               this.props.navigationProps.navigate(paths[0],arrayParams)
            }
        }
    }

    joinForm = () => {
        this.props.navigation.navigate('SignInStack',{
            screenData : {thisUUID : this.state.thisUUID }
        })
    }

    loginForm = async() => {
        if ( CommonUtil.isEmpty(this.state.formUserID)) {
            CommonFunction.fn_call_toast('아이디(이메일)을 입력해주세요',2000);
            return true;
        }else if ( CommonUtil.isEmpty(this.state.formPassword)) {
            CommonFunction.fn_call_toast('비밀번호를 입력해주세요',2000);
            return true;
        }else{
            this.apioginCheck()
        }
    }

    apioginCheck = async() => {
        this.setState({moreLoading:true})
        await AsyncStorage.setItem('isMemoryID',this.state.isMemoryID ? this.state.formUserID : '');   
        let returnCode = {code:9998};     
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/auth/signin';
            const token = null;
            let data = {
                user_id : this.state.formUserID,
                password : this.state.formPassword
            }
            returnCode = await apiObject.API_authLogin(url,token,data);
            if ( returnCode.code === '0000'  ) {
                this.setLoginToken(returnCode.token);
            }else if ( returnCode.code === '1003' ) {
                CommonFunction.fn_call_toast('사용중지된 아이디입니다\n관리팀에게 문의하세요',2000);
            }else if ( returnCode.code === '1014' ) {
                CommonFunction.fn_call_toast('가입한 아이디정보가 없습니다',2000);
            }else if ( returnCode.code === '1015' ) {
                CommonFunction.fn_call_toast('비밀번호가 맞지 않습니다.',2000);
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.',2000);
            }
            
            this.setState({moreLoading:false,loading:false})
        }catch(e){
            //console.log('errr',e)  
            this.setState({loading:false,moreLoading : false})
        }
    }

    setLoginToken = async(token) => {
        let jwtObject = await jwt_decode(token);
        this.props._saveUserToken({
            user_id : jwtObject.user_id,
            special_code : jwtObject.special_code,
            member_pk : jwtObject.member_pk,
            name : jwtObject.name,
            email : jwtObject.email,
            phone : jwtObject.phone,
            is_salesman : jwtObject.is_salesman,
            apiToken : token,
        });

        setTimeout(() => {
            this.props.navigation.popToTop();
        }, 500);
    }

    clearInputText = field => {
        this.setState({[field]: ''});
    };

    checkItem = async(bool) => {
        this.setState({isMemoryID:!bool})        
        await AsyncStorage.setItem('isMemoryID',!bool ? this.state.formUserID : '');   
    }

    render() {
        if ( this.state.loading ) {
            return (
                <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} /> 
            )
        }else { 
        return(
            <SafeAreaView style={ styles.container }>
                {!this.state.isConnected && <NetworkDisabled />}
                <KeyboardAvoidingView style={{paddingVertical:10}} behavior={Platform.OS === 'ios' ? "padding" : 'height'}  enabled> 
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    indicatorStyle={'white'}
                    scrollEventThrottle={16}
                    keyboardDismissMode={'on-drag'}      
                    style={{width:'100%'}}
                >
                <View style={styles.mainTopWrap}>
                    <CustomTextM style={styles.mainTopText}>관리자/영업사원이신가요?</CustomTextM>
                </View>
                <View style={styles.middleWarp}>
                    <View style={[styles.middleDataWarp,{}]}>
                        <View style={styles.titleWrap}>
                            <CustomTextR style={styles.titleText}>아이디</CustomTextR>
                        </View>
                        <View style={styles.dataInputWrap}>
                            <Input   
                                value={this.state.formUserID}
                                placeholder="관리자 아이디를 입력하세요"
                                placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                inputContainerStyle={styles.inputContainerStyle}
                                inputStyle={styles.inputStyle}
                                clearButtonMode={'always'}
                                onChangeText={value => this.setState({formUserID:value})}
                            />
                            {
                                ( Platform.OS === 'android' && this.state.formUserID !== '' ) && 
                                    (
                                    <TouchableOpacity 
                                        hitSlop={{left:10,right:10,bottom:10,top:10}}
                                        style={{position: 'absolute', right: 20}} 
                                        onPress={() => this.clearInputText('formUserID')}
                                    >
                                        <Image source={require('../../../assets/icons/btn_remove.png')} style={CommonStyle.defaultIconImage20} />
                                    </TouchableOpacity>
                                    )
                                }
                        </View>
                        <View style={styles.memoryWrap}>
                            <CustomTextR style={CommonStyle.dataText}>아이디저장</CustomTextR>
                            <View style={styles.memoryRightWrap}>
                                <CheckBox 
                                    containerStyle={{padding:0,margin:0}}   
                                    iconType={'FontAwesome'}
                                    checkedIcon={<Image source={RADIOON_ON} style={CommonStyle.checkboxIcon} />}
                                    uncheckedIcon={<Image source={RADIOON_OFF} style={CommonStyle.checkboxIcon} />}
                                    checkedColor={DEFAULT_COLOR.base_color}                          
                                    checked={this.state.isMemoryID}
                                    size={PixelRatio.roundToNearestPixel(15)}                                    
                                    onPress={() => this.checkItem(this.state.isMemoryID)}
                                />
                            </View> 
                        </View>
                    </View>
                    <View style={styles.middleDataWarp}>
                        <View style={styles.titleWrap}>
                            <CustomTextR style={styles.titleText}>비밀번호</CustomTextR>
                        </View>
                        <View style={{flex:1}}>
                            <Input   
                                secureTextEntry={true}
                                value={this.state.formPassword}
                                placeholder="비밀번호를 입력하세요"
                                placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                inputContainerStyle={styles.inputContainerStyle}
                                inputStyle={styles.inputStyle}
                                clearButtonMode={'always'}
                                onChangeText={value => this.setState({formPassword:value})}
                            />
                            {   
                                ( Platform.OS === 'android' && this.state.formPassword !== '' ) && 
                                (
                                    <TouchableOpacity 
                                        hitSlop={{left:10,right:10,bottom:10,top:10}}
                                        style={{position: 'absolute', right: 20}} 
                                        onPress={() => this.clearInputText('formPassword')}
                                    >
                                        <Image source={require('../../../assets/icons/btn_remove.png')} style={CommonStyle.defaultIconImage20} />
                                    </TouchableOpacity>
                                )
                            }
                        </View>
                    </View>
                   
                    <View style={styles.middleDataWarp2}>
                        <TouchableOpacity 
                            onPress={()=>this.loginForm()}
                            style={(CommonUtil.isEmpty(this.state.formUserID) && CommonUtil.isEmpty(this.state.formPassword) ) ? styles.buttonWrapOff : styles.buttonWrapOn }
                        >
                            <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize17),color:'#fff'}}> 로그인</CustomTextM>
                        </TouchableOpacity>
                    </View>
                </View>
                { 
                    this.state.moreLoading &&
                    <View style={CommonStyle.moreWrap}>
                        <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} />
                    </View>
                }
                </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
        }
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor : "#f5f7fc",
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mainTopWrap : {
        height:80,justifyContent:'center',marginHorizontal:40,marginTop:30
    },
    mainTopText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize20),color:DEFAULT_COLOR.base_color_666
    },
    middleWarp : {
        flex:1,        
        justifyContent:'center',
        marginHorizontal:30,marginBottom:10,
        backgroundColor:'#fff',
        borderColor:DEFAULT_COLOR.input_border_color,borderWidth:1,borderRadius:17
    },
    middleDataWarp : {
        flex:1,
        justifyContent:'center',
        borderBottomColor:DEFAULT_COLOR.input_border_color,borderBottomWidth:1
    },
    dataInputWrap : {
        flex:1,height:55
    },
    middleDataWarp2 : {
        flex:1,
        justifyContent:'center',
        paddingVertical:20,paddingHorizontal:10
    },
    middleDataWarp3 : {
        flex:0.5,
        flexDirection:'row',
        alignItems:'center',
        paddingVertical:5,paddingHorizontal:10
    },
    titleWrap : {
        flex:1,justifyContent:'flex-end',height:45,paddingLeft:20
    },
    memoryWrap : {
        flex:1,flexDirection:'row',flexGrow:1,justifyContent:'center',paddingLeft:20,paddingVertical:10
    },
    memoryRightWrap : {
        flex:1
    },
    titleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),color:DEFAULT_COLOR.base_color_666
    },
    inputContainerStyle : {
        backgroundColor:'#fff',margin:0,padding:0,height:45,borderWidth:1,borderColor:'#fff'
    },
    inputStyle :{ 
        margin:0,paddingLeft: 10,color: DEFAULT_COLOR.base_color_666,fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16)
    },
    buttonWrapOn : {
        backgroundColor:'#0059a9',padding:10,marginHorizontal:15,justifyContent:'center',alignItems:'center',borderRadius:25
    },
    buttonWrapOn2 : {
        backgroundColor:'#fff',paddingVertical:5,marginHorizontal:15,justifyContent:'center',alignItems:'center',borderRadius:25,borderWidth:1,borderColor:DEFAULT_COLOR.base_color
    },
    buttonWrapOff : {
        backgroundColor:'#ccc2e6',padding:10,marginHorizontal:15,justifyContent:'center',alignItems:'center',borderRadius:25
    },
    forgetenWrap : {
        flex:0.2,justifyContent:'flex-start',alignItems:'center',marginHorizontal:30
    },
    forgetenText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),color:'#0059a9'
    },
    footerWrap : {
        flex:1,justifyContent:'flex-end',alignItems:'center',marginHorizontal:30,paddingVertical:50
    },
    footerDataWrap : {
        width:'100%',
        height:80,
        justifyContent:'center',
        marginHorizontal:30,
        marginVertical:15,
        backgroundColor:'#fff',
        borderColor:DEFAULT_COLOR.input_border_color,borderWidth:1,borderRadius:17
    },
});


function mapStateToProps(state) {
    return {
        userToken : state.GlabalStatus.userToken
    };
}

function mapDispatchToProps(dispatch) {
    return {        
        _saveUserToken:(str)=> {
            dispatch(ActionCreator.saveUserToken(str))
        }
    };
}


export default connect(mapStateToProps,mapDispatchToProps)(SignupScreen);

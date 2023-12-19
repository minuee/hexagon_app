import React, { Component } from 'react';
import {SafeAreaView,Image,View,StyleSheet,PixelRatio,Dimensions,TouchableOpacity,BackHandler} from 'react-native';
import {connect} from 'react-redux';
import {Input,Overlay} from 'react-native-elements';
//공통상수 필요에 의해서 사용
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {CustomTextR,CustomTextL, CustomTextB, CustomTextM, TextRobotoM,TextRobotoR} from '../../Components/CustomText';
import CommonFunction from '../../Utils/CommonFunction';
import CommonUtil from '../../Utils/CommonUtil';
import CustomConfirm from '../../Components/CustomConfirm';


class AuthCheckScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading : true,            
            formUserID : null,
            formUserPhone : "010-1234-5678",
            formAuthCode : '123456',
            isResult : false,
            isResultMsg : ""
            
        }
    }
   

    UNSAFE_componentWillMount() {       
        this.setState({
            formUserID : null
        })
       
    }

    componentDidMount() {      
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton); 
        setTimeout(
            () => {            
                this.setState({loading:false})
            },500
        )
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);          
    }

    handleBackButton = () => {      
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);                 
        this.props.navigation.goBack(null);                
        return true;
    };

    sendAuthCode = async() => {
        CommonFunction.fn_call_toast('인증코드를 다시 발송하였습니다.',2000);
    }

    nextMove = async() => {
        this.props.navigation.navigate('PassWordResetStack',{
            screenData: {
                formUserID : this.state.formUserID
            }
        });
    }

    checkAuthCode = async() => {
        if ( !CommonUtil.isEmpty(this.state.formAuthCode)) {
            if ( this.state.formAuthCode ===  '123456' ) {
                this.nextMove()
            }else{
                this.setState({
                    isResult :  true,
                    isResultMsg : "잘못된 인증번호입니다"
                })
            }
        }
    }

    render() {
        return(
            <SafeAreaView style={ styles.container }>
                <View style={styles.middleWarp}>
                    <View style={styles.middleDataWarp}>
                        <View style={{justifyContent:'center',alignItems:'center'}}>
                            <Image
                                source={require('../../../assets/icons/icon_lock.png')}
                                resizeMode={"contain"}
                                style={{width:PixelRatio.roundToNearestPixel(48),height:PixelRatio.roundToNearestPixel(48)}}
                            />
                        </View>
                        <View style={{marginVertical:15}}>
                            <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),color:DEFAULT_COLOR.base_color_666}}>휴대폰으로 전송된 인증 코드를 입력하세요</CustomTextR>
                        </View>
                        <View style={{marginVertical:15}}>
                            <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.base_color_666}}>회원님의 꼐정에 등록된 휴대폰으로 인증 코드를 전송했습니다. <CustomTextB>{this.state.formUserPhone}</CustomTextB>으로 전송된 6자리 코드를 입력하세요</CustomTextR>
                        </View>
                        <TouchableOpacity 
                            style={{marginVertical:15,justifyContent:'center',alignItems:'center'}}
                            onPress={()=>this.sendAuthCode()}
                        >
                            <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),color:'#8b37fe'}}>새 코드 요청하기</CustomTextR>
                        </TouchableOpacity>
                        <Input   
                            value={this.state.formUserID}
                            placeholder="6자리 인증코드"
                            placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                            inputContainerStyle={styles.inputContainerStyle}
                            inputStyle={styles.inputStyle}
                            clearButtonMode={'always'}
                            onChangeText={value => this.setState({formAuthCode:value,isResult:false})}
                        />
                        {
                            ( this.state.isResult && !CommonUtil.isEmpty(this.state.formAuthCode)) &&
                            <View style={{paddingHorizontal:10}}>
                                <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),color:'#c53915'}}>{this.state.isResultMsg}</CustomTextR>
                            </View>
                            
                        }
                    </View>
                    <View style={styles.middleDataWarp2}>
                        <TouchableOpacity 
                            onPress={()=>this.checkAuthCode()}
                            style={CommonUtil.isEmpty(this.state.formAuthCode) ? styles.buttonWrapOff : styles.buttonWrapOn }
                        >
                            <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize17),color:'#fff'}}>다음</CustomTextM>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor : "#fff",
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    middleWarp : {
        flex:1,        
        justifyContent:'center',        
        marginHorizontal:30,marginBottom:10,
    },
    middleDataWarp : {
        flex:1.5,
        justifyContent:'flex-start',
        marginTop:30
    },
    middleDataWarp2 : {
        flex:1,
        justifyContent:'flex-start',
    },
    titleWrap : {
        flex:1,justifyContent:'flex-end',paddingLeft:20
    },
    titleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),color:DEFAULT_COLOR.base_color_666
    },
    inputContainerStyle : {
        backgroundColor:'#fff',margin:0,padding:0,height:45
    },
    inputStyle :{ 
        margin:0,paddingLeft: 10,color: DEFAULT_COLOR.base_color_666,fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16)
    },
    buttonWrapOn : {
        backgroundColor:'#0059a9',padding:10,marginHorizontal:15,justifyContent:'center',alignItems:'center',borderRadius:25
    },
    buttonWrapOff : {
        backgroundColor:'#ccc2e6',padding:10,marginHorizontal:15,justifyContent:'center',alignItems:'center',borderRadius:25
    },
    forgetenWrap : {
        flex:1,justifyContent:'flex-start',alignItems:'center',marginHorizontal:30
    },
    forgetenText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),color:'#0059a9'
    }
});


function mapStateToProps(state) {
    return {
        userToken : state.GlabalStatus.userToken
    };
}

export default connect(mapStateToProps,null)(AuthCheckScreen);
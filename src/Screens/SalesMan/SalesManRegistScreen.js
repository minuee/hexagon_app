import React, { Component } from 'react';
import {SafeAreaView,Image,View,StyleSheet,PixelRatio,Dimensions,TouchableOpacity,ScrollView,Alert,Animated} from 'react-native';
import Modal from 'react-native-modal';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import {Input} from 'react-native-elements';
//공통상수 필요에 의해서 사용
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import CommonStyle from '../../Style/CommonStyle';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {CustomTextR,CustomTextL, CustomTextB, CustomTextM, TextRobotoM,TextRobotoR,DropBoxSearchIcon} from '../../Components/CustomText';
import CommonFunction from '../../Utils/CommonFunction';
import CommonUtil from '../../Utils/CommonUtil';
import Loader from '../../Utils/Loader';
import { apiObject } from "../Apis";


class SalesManRegistScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : false,
            showModal : false,
            formUserID : '',
            formPassword : '',
            formUserName : null,
            formUserTel : null,
            formUserEmail : null,
            formIncentiveRate2000 : '1',
            formIncentiveRate3000 : '1.5'
        }
    }

    resetForm = () => {
        this.setState({
            formUserID : '',
            formPassword : '',
            formUserName : null,
            formUserTel : null,
            formUserEmail : null,
        })
    }

    UNSAFE_componentWillMount() {
        this.props.navigation.addListener('focus', () => {  
            this.resetForm();              
        })
    }

    componentDidMount() {    
     
    }
    UNSAFE_componentWillUnmount() { 
       
    }
    
    registData = async() => {
        this.setState({moreLoading:true})
        let returnCode = {code:9998};     
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/salesman/regist';
            const token = this.props.userToken.apiToken;
            let sendData = {
                user_id: this.state.formUserID.toLowerCase(),
                name : this.state.formUserName,
                password : this.state.formPassword,
                email : CommonFunction.fn_dataEncode(this.state.formUserEmail),
                phone : CommonFunction.fn_dataEncode(this.state.formUserTel),
                incentive_2 : CommonUtil.isEmpty(this.state.formIncentiveRate2000) ? 1 : this.state.formIncentiveRate2000,
                incentive_3 : CommonUtil.isEmpty(this.state.formIncentiveRate3000) ? 1.5 : this.state.formIncentiveRate3000,
            }            
            returnCode = await apiObject.API_registCommon(this.props,url,token,sendData);
            if ( returnCode.code === '0000'  ) {
                CommonFunction.fn_call_toast('정상적으로 등록되었습니다.' ,2000);
                this.timeout = setTimeout(
                    () => {
                    this.props.navigation.goBack(null);
                    },
                    2000
                ); 
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.\n[ERR]' + returnCode.msg ,2000);
            }
            this.setState({moreLoading:false,loading:false})
        }catch(e){
            this.setState({loading:false,moreLoading : false})
        }
    }

    actionOrder = async() => {
        Alert.alert(
            DEFAULT_CONSTANTS.appName,
            "영업사원 정보를 수정하시겠습니까?",
            [
                {text: '네', onPress: () =>  this.registData()},
                {text: '아니오', onPress: () => console.log('Cancle')}
            ],
            { cancelable: true }
        )  
    }
    updateData = () => {
        if ( CommonUtil.isEmpty(this.state.formUserID)) {
            CommonFunction.fn_call_toast('아이디을 입력해주세요',2000);return true;  
        }else if ( this.state.formUserID.length < 4) {
            CommonFunction.fn_call_toast('아이디는 최소 4자리이상 입력해주세요',2000);return true; 
        }else if ( this.state.formPassword.length < 6) {
            CommonFunction.fn_call_toast('비밀번호는 최소 6자리이상 입력해주세요',2000);return true; 
        }else if ( CommonUtil.isEmpty(this.state.formUserName)) {
            CommonFunction.fn_call_toast('이름을 입력해주세요',2000);return true;  
        }else if ( CommonUtil.isEmpty(this.state.formUserTel)) {
            CommonFunction.fn_call_toast('전화번호를 입력해주세요',2000);return true;    
        }else if ( CommonUtil.isEmpty(this.state.formUserEmail)) {
            CommonFunction.fn_call_toast('이메일주소를 입력해주세요',2000);return true;           
        }else{
           this.actionOrder()
        }
    }

    render() {       
        return(
            <SafeAreaView style={ styles.container }>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    indicatorStyle={'white'}
                    scrollEventThrottle={16}
                    keyboardDismissMode={'on-drag'}      
                    style={{width:'100%'}}
                >
                    <View style={styles.mainTopWrap}>
                        <CustomTextM style={styles.mainTopText}>기본정보</CustomTextM>
                    </View>                    
                    <View style={styles.middleWarp}>
                        <View style={[styles.middleDataWarp,{}]}>                            
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>이름</CustomTextR>
                            </View>
                            <View style={styles.dataInputWrap}>
                                <Input   
                                    value={this.state.formUserName}
                                    placeholder="이름을 입력하세요"
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                    inputContainerStyle={[styles.inputContainerStyle]}
                                    inputStyle={styles.inputStyle}
                                    clearButtonMode={'always'}
                                    onChangeText={value => this.setState({formUserName:value})}
                                />
                            </View>                            
                        </View>
                        <View style={[styles.middleDataWarp,{}]}>                            
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>전화번호</CustomTextR>
                            </View>
                            <View style={styles.dataInputWrap}>
                                <Input   
                                    value={this.state.formUserTel}
                                    placeholder="전화번호를 입력하세요"
                                    keyboardType={'number-pad'}
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                    inputContainerStyle={styles.inputContainerStyle}
                                    inputStyle={styles.inputStyle}
                                    clearButtonMode={'always'}
                                    onChangeText={value => this.setState({formUserTel:value})}
                                />
                            </View>                            
                        </View>
                        <View style={styles.middleDataWarp}>
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>E-mail</CustomTextR>
                            </View>
                            <View style={styles.dataInputWrap}>
                                <Input   
                                    keyboardType={'email-address'}
                                    value={this.state.formUserEmail}
                                    placeholder="이메일을 입력하세요"
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                    inputContainerStyle={styles.inputContainerStyle}
                                    inputStyle={styles.inputStyle}   
                                    clearButtonMode={'always'}
                                    onChangeText={value => this.setState({formUserEmail:value})}                                 
                                />
                            </View>
                        </View>  
                        <View style={styles.middleDataWarp}>
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>ID</CustomTextR>
                            </View>
                            <View style={styles.dataInputWrap}>
                                <Input   
                                    value={this.state.formUserID}
                                    placeholder="영업사원 아이디를 입력하세요(최소4자이상)"
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                    inputContainerStyle={styles.inputContainerStyle}
                                    inputStyle={styles.inputStyle}
                                    clearButtonMode={'always'}
                                    onChangeText={value => this.setState({formUserID:value})}
                                />
                            </View>
                        </View>
                        <View style={styles.middleDataWarp}>
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>암호</CustomTextR>
                            </View>
                            <View style={styles.dataInputWrap}>
                                <Input   
                                    value={this.state.formPassword}
                                    placeholder="암호를 입력하세요(최소6자이상)"
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                    inputContainerStyle={styles.inputContainerStyle}
                                    inputStyle={styles.inputStyle}
                                    clearButtonMode={'always'}
                                    onChangeText={value => this.setState({formPassword:value})}
                                />
                            </View>
                        </View>                                        
                    </View>
                    <View style={styles.mainTopWrap}>
                        <CustomTextM style={styles.mainTopText}>인센티브 비율</CustomTextM>
                    </View>
                    
                    <View style={styles.middleWarp}>
                        <View style={[styles.middleDataWarp,{}]}>                            
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>2천만원이상 (단위:%)</CustomTextR>
                            </View>
                            <View style={styles.dataInputWrap}>
                                <Input   
                                    value={this.state.formIncentiveRate2000}
                                    placeholder="비율을 입력하세요 (%)"
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                    inputContainerStyle={[styles.inputContainerStyle]}
                                    inputStyle={styles.inputStyle}
                                    clearButtonMode={'always'}
                                    onChangeText={value => this.setState({formIncentiveRate2000:value})}
                                />
                            </View>                            
                        </View>
                        <View style={[styles.middleDataWarp,{}]}>                            
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>3천만원이상 (단위:%)</CustomTextR>
                            </View>
                            <View style={styles.dataInputWrap}>
                                <Input   
                                    value={this.state.formIncentiveRate3000}
                                    placeholder="비율을 입력하세요 (%)"
                                    keyboardType={'number-pad'}
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                    inputContainerStyle={styles.inputContainerStyle}
                                    inputStyle={styles.inputStyle}
                                    clearButtonMode={'always'}
                                    onChangeText={value => this.setState({formIncentiveRate3000:value})}
                                />
                            </View>                            
                        </View>
                    </View>
                   
                    <View style={[CommonStyle.blankArea,{backgroundColor:'#f5f6f8'}]}></View>
                    { 
                        this.state.moreLoading &&
                        <View style={CommonStyle.moreWrap}>
                            <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} />
                        </View>
                    }
                    
                </ScrollView>
                <View style={CommonStyle.scrollFooterWrap}>
                    <TouchableOpacity style={CommonStyle.scrollFooterLeftWrap} onPress={()=>this.updateData()}>
                        <CustomTextB style={CommonStyle.scrollFooterText}>등록</CustomTextB>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
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
    /**** Modal  *******/
    modalContainer: {   
        zIndex : 10,     
        position :'absolute',
        left:0,
        //top : BASE_HEIGHY,
        width:SCREEN_WIDTH,
        height: SCREEN_HEIGHT-200,
        paddingTop: 16,
        backgroundColor: '#fff'
    },
    mainTopInfoWrap : {
        height:30,justifyContent:'center',alignItems:'center',marginTop:20
    },
    mainTopInfoText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.base_color_666
    },
    mainTopWrap : {
        height:60,justifyContent:'center',marginHorizontal:30
    },
    mainTopText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize20),color:DEFAULT_COLOR.base_color_000
    },
    middleWarp : {
        flex:1,        
        justifyContent:'center',
        marginHorizontal:20,marginBottom:10,
        backgroundColor:'#fff',
        borderColor:DEFAULT_COLOR.input_border_color,borderWidth:1,borderRadius:17
    },
    middleDataWarp : {
        flex:1,
        justifyContent:'center',
        borderBottomColor:DEFAULT_COLOR.input_border_color,borderBottomWidth:1
    },
    middleDataWarp2 : {
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        paddingVertical:10,paddingHorizontal:30
    },
    titleWrap : {
        flex:1,justifyContent:'flex-end',height:45,paddingLeft:20
    },
    titleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.base_color_000
    },
    titleText2 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),color:DEFAULT_COLOR.base_color_666
    },
    dataInputWrap : {
        flex:1,height:55
    },
    inputContainerStyle : {
        backgroundColor:'#fff',margin:0,padding:0,height:45,borderWidth:1,borderColor:'#fff'
    },
    inputStyle :{ 
        margin:0,paddingLeft: 10,color: DEFAULT_COLOR.base_color_666,fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16)
    },
    buttonWrapOn : {
        backgroundColor:'#0059a9',paddingVertical:10,paddingHorizontal:25,justifyContent:'center',alignItems:'center',borderRadius:25
    },
    buttonWrapOn2 : {
        backgroundColor:'#fff',paddingVertical:5,marginHorizontal:15,justifyContent:'center',alignItems:'center',borderRadius:25,borderWidth:1,borderColor:DEFAULT_COLOR.base_color
    },
    buttonWrapOff : {
        backgroundColor:'#ccc2e6',padding:10,marginHorizontal:15,justifyContent:'center',alignItems:'center',borderRadius:25
    },
    footerWrap : {
        flex:1,marginHorizontal:30,marginBottom:10,
    },
    footerDataWrap : {
        flex:1,justifyContent:'flex-end',flexDirection:'row',paddingLeft:10,marginTop:20
    },
    imageStyle : {
        width:PixelRatio.roundToNearestPixel(100),height:PixelRatio.roundToNearestPixel(200)
    }
    
});


function mapStateToProps(state) {
    return {
        userToken : state.GlabalStatus.userToken,
        userNonToken : state.GlabalStatus.userNonToken,
    };
}

function mapDispatchToProps(dispatch) {
    return {        
        _saveUserToken:(str)=> {
            dispatch(ActionCreator.saveUserToken(str))
        }
    };
}


export default connect(mapStateToProps,mapDispatchToProps)(SalesManRegistScreen);
import React, { Component } from 'react';
import {SafeAreaView,Image,View,StyleSheet,PixelRatio,Dimensions,TouchableOpacity,ScrollView,Alert,Animated} from 'react-native';
import Modal from 'react-native-modal';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import {Input,Overlay} from 'react-native-elements';
import ImagePicker from 'react-native-image-picker'
import 'moment/locale/ko'
import  moment  from  "moment";
//공통상수 필요에 의해서 사용
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import CommonStyle from '../../Style/CommonStyle';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {CustomTextR,CustomTextL, CustomTextB, CustomTextM, TextRobotoM,TextRobotoR} from '../../Components/CustomText';
import CommonFunction from '../../Utils/CommonFunction';
import CommonUtil from '../../Utils/CommonUtil';
import Loader from '../../Utils/Loader';
import SignInComplete from './SignInComplete';
import { apiObject } from "../Apis";

//const gradeStartDate =  moment().format('YYYY-MM-01');
const gradeStartDate = moment().clone().startOf('month').format('YYYY-MM-DD');
const gradeEndDate   = moment().add(60, 'd').clone().endOf('month').format('YYYY-MM-DD');


class SignInScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : true,
            showModal : false,
            formUserCode : null,
            formUserID : '123456789',
            formPassword : 'lenapark47##',
            formPassword2 : 'lenapark47##',
            formCeoName : '노성남',
            formCompanyEmail : 'minuee@nate.com',
            formCompanyName : '민누이 주식회사',
            formCompanyTel : '0438330803',
            formBusinessCondition : '서비스업',
            formBusinessSector : '인터넷',
            formBusinessZipCode : '88888',
            formBusinessAddress : '충청북도 괴산군 괴산읍 능촌리 61',
            formRecommUserCode : "AAAAAA",
            formSalesmanCode : "C001",
            formGradeStart : gradeStartDate,
            formGradeEnd : gradeEndDate,
            profileimage : null,
            attachFileSize : 0,
            photoarray: [],
            uploadImagaArray : [],
            screenData : null,
            closeModal : this.closeModal.bind(this),
            nonUserLogin : this.nonUserLogin.bind(this)
        }
    }
    getCodeCheck = async() => {
        let returnCode = {code:9998};     
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/auth/codelist';
            const token = null;
            returnCode = await apiObject.API_getCommonCode(url,token);
            if ( returnCode.code === '0000'  ) {
                let newUserCode = CommonFunction.getRandomString(6,returnCode.data);                
                this.setState({formUserCode : newUserCode,loading:false})
            }else{
                CommonFunction.fn_call_toast('네트워크 오류가 발생하였습니다.',1000);
                setTimeout(() => {
                    this.props.navigation.goBack(null);
                }, 500);
            }           
        }catch(e){
            this.setState({loading:false,})
        }
    }

    async UNSAFE_componentWillMount() {
       
        if ( !CommonUtil.isEmpty(this.props.extraData.params.screenData)) {
            this.setState({
                screenData : this.props.extraData.params.screenData,
                loading:false
            })
        }
        await this.getCodeCheck();
    }

    componentDidMount() {       
    }
    UNSAFE_componentWillUnmount() { 
    }
    animatedHeight = new Animated.Value(SCREEN_HEIGHT);
    showModal = () => {
        this.setState({showModal : true})
    }
    closeModal = () => {
        this.setState({showModal : false})
    }

    nonUserLogin = () => {
        this.props._saveNonUserToken({
            uuid : this.state.screenData.thisUUID
        });
        setTimeout(() => {
            this.props.navigation.popToTop();
        }, 500);
    }


    registData = async() => {
        this.setState({moreLoading:true})
        let returnCode = {code:9998};     
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/auth/signup';
            const token = null;
            let md5Tel = CommonFunction.fn_dataEncode(this.state.formCompanyTel.replace("-",""));
            let md5Email = CommonFunction.fn_dataEncode(this.state.formCompanyEmail);
            let sendData = {
                email : md5Email,
                password : this.state.formPassword,
                phone : md5Tel,
                img_url : null,
                member_type : "Normal", 
                grade_start : this.state.formGradeStart,
                grade_end : this.state.formGradeEnd,
                special_code : this.state.formUserCode,
                user_id : this.state.formUserID,
                name : this.state.formCompanyName,
                company_name : this.state.formCompanyName,
                company_type : this.state.formBusinessSector,
                business_code : this.state.formUserID,
                company_class : this.state.formBusinessCondition,
                company_address : this.state.formBusinessAddress,
                company_zipcode : this.state.formBusinessZipCode,
                company_ceo : this.state.formCeoName,
                company_phone : md5Tel,
                agent_code : this.state.formSalesmanCode,
                recomm_code : this.state.formRecommUserCode
            }
            const sendData2 = new FormData();       
            sendData2.append('email', md5Email); 
            returnCode = await apiObject.API_registMember(url,token,sendData);
            if ( returnCode.code === '0000'  ) {
                this.props.navigation.goBack();
            }else if ( returnCode.code === '1016'  ) {
                CommonFunction.fn_call_toast('이미 등록된 사업자정보입니다.' ,2000);
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.\n[ERR]' + returnCode.msg ,2000);
            }            
            this.setState({moreLoading:false,loading:false})
        }catch(e){
            this.setState({loading:false,moreLoading : false})
        }
        
    }

    actionOrder = async() => { //OrderEndingStack
        Alert.alert(
            DEFAULT_CONSTANTS.appName,
            "회원가입을 신청시겠습니까?",
            [
                {text: '네', onPress: () =>  this.registData()},
                {text: '아니오', onPress: () => console.log('Cancle')},
                
            ],
            { cancelable: true }
        )  
    }
    

    showModalCheck = async() => {
        let pattern1 = /[0-9]/;
        let pattern2 = /[a-zA-Z]/;
        let pattern3 = /[~!@\#$%<>^&*]/;     // 원하는 특수문자 추가 제거
        let formPassword = this.state.formPassword;
        if ( CommonUtil.isEmpty(this.state.formCompanyName)) {
            CommonFunction.fn_call_toast('상호명을 입력해주세요',2000);
            return true;
        }else if ( CommonUtil.isEmpty(this.state.formUserID)) {
            CommonFunction.fn_call_toast('사업자등록번호를 입력해주세요',2000);
            return true;
        }else if ( CommonUtil.isEmpty(this.state.formBusinessSector)) {
            CommonFunction.fn_call_toast('업종을 입력해주세요',2000);
            return true;
        }else if ( CommonUtil.isEmpty(this.state.formBusinessCondition)) {
            CommonFunction.fn_call_toast('업태을 입력해주세요',2000);
            return true;
        }else if ( CommonUtil.isEmpty(this.state.formBusinessAddress)) {
            CommonFunction.fn_call_toast('사업자 주소를 입력해주세요',2000);
            return true;
        }else if ( CommonUtil.isEmpty(this.state.formCeoName)) {
            CommonFunction.fn_call_toast('대표자명을 입력해주세요',2000);
            return true;
        }else if ( CommonUtil.isEmpty(this.state.formCompanyTel)) {
            CommonFunction.fn_call_toast('대표전화번호를 입력해주세요',2000);
            return true;
        }else if ( CommonUtil.isEmpty(this.state.formCompanyEmail)) {
            CommonFunction.fn_call_toast('대표자Email을 입력해주세요',2000);
            return true;
        }else if ( CommonUtil.isEmpty(this.state.formPassword)) {
            CommonFunction.fn_call_toast('비밀번호를 입력해주세요',2000);
            return true;
        }else if ( this.state.formPassword !== this.state.formPassword2) {
            CommonFunction.fn_call_toast('비밀번호가 일치하지 않습니다.',2000);
            return true;
        }else if(!pattern1.test(formPassword)||!pattern2.test(formPassword)||!pattern3.test(formPassword)||formPassword.length<8||formPassword.length>50){
            CommonFunction.fn_call_toast('영문+숫자+특수기호 8자리 이상으로 구성하여야 합니다.',2000);
            return true;
        }else{
            //this.showModal();
            this.actionOrder();
        }
    }

    localcheckfile = () => {
        const options = {
            noData: true,
            privateDirectory: true,
            title : '이미지 선택',
            takePhotoButtonTitle : '카메라 찍기',
            chooseFromLibraryButtonTitle:'이미지 선택',
            cancelButtonTitle : '취소'
        }
        ImagePicker.showImagePicker(options, response => {
            try {
                if( response.type.indexOf('image') != -1) {
                    if (response.uri) {                        
                        if ( parseInt((response.fileSize)/1024/1024) >= 5 ) {
                            Alert.alert('image upload error', '5MB를 초과하였습니다.');
                            return;
                        }else{                            
                            this.setState({
                                attachFileSize :  response.fileSize,
                                profileimage : response.uri,
                                photoarray : {
                                    type : response.type === undefined ? 'jpg' :  response.type,
                                    uri : response.uri, 
                                    height:response.height,
                                    width:response.width,
                                    fileSize:response.fileSize,
                                    fileName:response.fileName
                                }
                            })
                        }
                    }
                }else{
                    Alert.alert('image upload error', '정상적인 이미지 파일이 아닙니다.');
                    return;
                }
            }catch(e){
                //console.log("eerorr ", e)        
            }
        })
    }

   
    handleChoosePhoto = async() => {              
        await this.localcheckfile();     
    }

    render() {
        if ( this.state.loading ) {
            return (
                <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} /> 
            )
        }else { 
        return(
            <SafeAreaView style={ styles.container }>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    indicatorStyle={'white'}
                    scrollEventThrottle={16}
                    keyboardDismissMode={'on-drag'}      
                    style={{width:'100%'}}
                >
                    <View style={styles.mainTopInfoWrap}>
                        <CustomTextM style={styles.mainTopInfoText}>로그인정보 및 가입 정보를 입력해 주세요</CustomTextM>
                    </View>
                    <View style={styles.mainTopWrap}>
                        <CustomTextM style={styles.mainTopText}>사업자 정보</CustomTextM>
                    </View>
                    <View style={styles.middleWarp}>
                        <View style={[styles.middleDataWarp,{}]}>                            
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>상호명</CustomTextR>
                            </View>
                            <View style={styles.dataInputWrap}>
                                <Input   
                                    value={this.state.formCompanyName}
                                    placeholder="상호명을 입력하세요"
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                    inputContainerStyle={[styles.inputContainerStyle]}
                                    inputStyle={styles.inputStyle}
                                    clearButtonMode={'always'}
                                    onChangeText={value => this.setState({formCompanyName:value})}
                                />
                            </View>                            
                        </View>
                        <View style={[styles.middleDataWarp,{}]}>                            
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>사업자등록번호</CustomTextR>
                            </View>
                            <View style={styles.dataInputWrap}>
                                <Input   
                                    value={this.state.formUserID}
                                    placeholder="숫자만입력)"
                                    keyboardType={'number-pad'}
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
                                <CustomTextR style={styles.titleText}>업종</CustomTextR>
                            </View>
                            <View style={styles.dataInputWrap}>
                                <Input   
                                    value={this.state.formBusinessSector}
                                    placeholder="사업자등록증을 참고하세요"
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                    inputContainerStyle={styles.inputContainerStyle}
                                    inputStyle={styles.inputStyle}
                                    clearButtonMode={'always'}
                                    onChangeText={value => this.setState({formBusinessSector:value})}
                                />
                            </View>
                        </View>
                        <View style={styles.middleDataWarp}>
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>업태</CustomTextR>
                            </View>
                            <View style={styles.dataInputWrap}>
                                <Input   
                                    value={this.state.formBusinessCondition}
                                    placeholder="사업자등록증을 참고하세요"
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                    inputContainerStyle={styles.inputContainerStyle}
                                    inputStyle={styles.inputStyle}
                                    clearButtonMode={'always'}
                                    onChangeText={value => this.setState({formBusinessCondition:value})}
                                />
                            </View>
                        </View>
                        <View style={styles.middleDataWarp}>
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>주소</CustomTextR>
                            </View>
                            <View style={styles.dataInputWrap}>
                                <Input   
                                    value={this.state.formBusinessAddress}
                                    placeholder="현재영업중인 매장주소를 입력하세요"
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                    inputContainerStyle={styles.inputContainerStyle}
                                    inputStyle={styles.inputStyle}
                                    clearButtonMode={'always'}
                                    onChangeText={value => this.setState({formBusinessAddress:value})}
                                />
                            </View>
                        </View>                       
                    </View>

                    <View style={styles.mainTopWrap}>
                        <CustomTextM style={styles.mainTopText}>대표자 정보</CustomTextM>
                    </View>
                    <View style={styles.middleWarp}>
                        <View style={[styles.middleDataWarp,{}]}>                            
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>대표자명</CustomTextR>
                            </View>
                            <View style={styles.dataInputWrap}>
                                <Input   
                                    value={this.state.formCeoName}
                                    placeholder="실제 대표자명을 입력하세요"
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                    inputContainerStyle={[styles.inputContainerStyle]}
                                    inputStyle={styles.inputStyle}
                                    clearButtonMode={'always'}
                                    onChangeText={value => this.setState({formCeoName:value})}
                                />
                            </View>                            
                        </View>
                        <View style={[styles.middleDataWarp,{}]}>                            
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>전화번호</CustomTextR>
                            </View>
                            <View style={styles.dataInputWrap}>
                                <Input   
                                    value={this.state.formCompanyTel}
                                    placeholder="회원가입 인증전화 받을 전화번호 입력"
                                    keyboardType={'number-pad'}
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                    inputContainerStyle={styles.inputContainerStyle}
                                    inputStyle={styles.inputStyle}
                                    clearButtonMode={'always'}
                                    onChangeText={value => this.setState({formCompanyTel:value})}
                                />
                            </View>                            
                        </View>
                        <View style={styles.middleDataWarp}>
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>대표자 E-mail</CustomTextR>
                            </View>
                            <View style={styles.dataInputWrap}>
                                <Input   
                                    keyboardType={'email-address'}
                                    value={this.state.formCompanyEmail}
                                    placeholder="계산서발행 확인용 이메일을 입력하세요"
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                    inputContainerStyle={styles.inputContainerStyle}
                                    inputStyle={styles.inputStyle}
                                    clearButtonMode={'always'}
                                    onChangeText={value => this.setState({formCompanyEmail:value})}
                                />
                            </View>
                        </View>
                        <View style={styles.middleDataWarp}>
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>암호</CustomTextR>
                            </View>
                            <View style={styles.dataInputWrap}>
                                <Input   
                                    secureTextEntry={true}
                                    value={this.state.formPassword}
                                    placeholder="8자리 이상 영문,숫자,특수문자포함"
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                    inputContainerStyle={styles.inputContainerStyle}
                                    inputStyle={styles.inputStyle}
                                    clearButtonMode={'always'}
                                    onChangeText={value => this.setState({formPassword:value})}
                                />
                            </View>
                        </View>  
                        <View style={styles.middleDataWarp}>
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>암호확인</CustomTextR>
                            </View>
                            <View style={styles.dataInputWrap}>
                                <Input   
                                    secureTextEntry={true}
                                    value={this.state.formPassword2}
                                    placeholder="8자리 이상 영문,숫자,특수문자포함"
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                    inputContainerStyle={styles.inputContainerStyle}
                                    inputStyle={styles.inputStyle}
                                    clearButtonMode={'always'}
                                    onChangeText={value => this.setState({formPassword2:value})}
                                />
                            </View>
                        </View>                                            
                    </View>
                    <View style={styles.middleWarp}>
                        <View style={[styles.middleDataWarp,{borderBottomWidth:0}]}>
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>사업자 등록증 업로드</CustomTextR>
                            </View>
                            <View style={{flex:1,paddingHorizontal:20,paddingVertical:10}}>
                                <CustomTextR style={styles.titleText2}>사업자 등록증 업로드 시 사업자 본인 인증을 더욱 안전하게 완료할 수 있습니다.</CustomTextR>
                                <CustomTextR style={styles.titleText2}>5MB이하로만 등록가능합니다.</CustomTextR>
                            </View>
                        </View>                    
                        <View style={styles.middleDataWarp2}>
                            <TouchableOpacity 
                                onPress={() => this.handleChoosePhoto()}
                                style={styles.buttonWrapOn}
                            >
                                <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize17),color:'#fff'}}>추가하기</CustomTextM>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.middleDataWarp2}>
                            {
                                !CommonUtil.isEmpty(this.state.profileimage) &&                            
                                <Image 
                                    source={{uri:this.state.profileimage}}
                                    resizeMode={'contain'}
                                    style={styles.imageStyle}
                                />
                            }
                        </View>
                    </View>

                    <View style={styles.mainTopWrap}>
                        <CustomTextM style={styles.mainTopText}>추천코드 입력</CustomTextM>
                    </View>
                    <View style={styles.middleWarp}>
                        <View style={[styles.middleDataWarp,{}]}>                            
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>추천코드 입력</CustomTextR>
                            </View>
                            <View style={styles.dataInputWrap}>
                                <Input   
                                    value={this.state.formRecommUserCode}
                                    placeholder="추천코드 6자리(해당사항 없을시 생략)"
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                    inputContainerStyle={[styles.inputContainerStyle]}
                                    inputStyle={styles.inputStyle}
                                    clearButtonMode={'always'}
                                    onChangeText={value => this.setState({formRecommUserCode:value})}
                                />
                            </View>                            
                        </View>                                    
                    </View>
                    <View style={styles.mainTopWrap}>
                        <CustomTextM style={styles.mainTopText}>관리코드 입력</CustomTextM>
                    </View>
                    <View style={styles.middleWarp}>
                        <View style={[styles.middleDataWarp,{}]}>                            
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>관리코드 입력</CustomTextR>
                            </View>
                            <View style={styles.dataInputWrap}>
                                <Input   
                                    value={this.state.formSalesmanCode}
                                    placeholder="관리코드 4자리(본사직원 입력란입니다)"
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                    inputContainerStyle={[styles.inputContainerStyle]}
                                    inputStyle={styles.inputStyle}
                                    clearButtonMode={'always'}
                                    onChangeText={value => this.setState({formSalesmanCode:value})}
                                />
                            </View>                            
                        </View>                                    
                    </View>
                    <View style={styles.footerWrap}>
                        <View style={styles.footerDataWrap}>
                            <CustomTextR style={styles.titleText}> - </CustomTextR>
                            <CustomTextR style={styles.titleText}>사업자 등록증 정보는 가입절차와 계산서 발행 용도 외에는 일체 노출되거나 사용하지 않으며 회원 탈퇴 시 자동 폐기됨을 알려드립니다.</CustomTextR>
                        </View>
                        <View style={styles.footerDataWrap}>
                        <CustomTextR style={styles.titleText}> - </CustomTextR>
                            <CustomTextR style={styles.titleText}>입력된 전화번호로 인증 전화가 갑니다. 전화 상담 이후 인증 완료 시 회원가입이 완료됩니다.</CustomTextR>
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
                    <TouchableOpacity 
                        style={CommonStyle.scrollFooterLeftWrap}
                        onPress={()=>this.showModalCheck()}
                    >
                        <CustomTextB style={CommonStyle.scrollFooterText}>다음</CustomTextB>
                    </TouchableOpacity>
                </View>
                <Modal
                    //onBackdropPress={this.closeModal}
                    animationType="slide"
                    //transparent={true}
                    onRequestClose={() => {
                        //this.closeModal()
                    }}                        
                    style={{justifyContent: 'flex-end',margin: 0}}
                    useNativeDriver={true}
                    animationInTiming={300}
                    animationOutTiming={300}
                    hideModalContentWhileAnimating                    
                    isVisible={this.state.showModal}
                >
                    <Animated.View style={[styles.modalContainer,{ height: this.animatedHeight }]}>
                        <SignInComplete screenState={this.state} screenProps={this.props} />
                    </Animated.View>
                </Modal>                
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
        marginHorizontal:30,marginBottom:10,
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
        paddingVertical:10,paddingHorizontal:20
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
        },
        _saveNonUserToken:(str)=> {
            dispatch(ActionCreator.saveNonUserToken(str))
        }
    };
}


export default connect(mapStateToProps,mapDispatchToProps)(SignInScreen);
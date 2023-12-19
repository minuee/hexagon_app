import React, { Component } from 'react';
import {SafeAreaView,Image as NativeImage,View,StyleSheet,PixelRatio,Dimensions,TouchableOpacity,ScrollView,Alert,Animated} from 'react-native';
import 'moment/locale/ko'
import  moment  from  "moment";
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import ImagePicker from 'react-native-image-picker'
import {Input,CheckBox} from 'react-native-elements';
import Image from 'react-native-image-progress';
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
import SelectSearch from "../../Utils/SelectSearch";
import { apiObject } from "../Apis";

const RADIOON_OFF = require('../../../assets/icons/check_off.png');
const RADIOON_ON = require('../../../assets/icons/check_on.png');
const currentDate =  moment().unix();

class MemberInfoScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : true,
            showModal : false,
            formMemberPk : 0,
            formUserID : '',
            formCeoName : null,
            formCompanyEmail : null,
            formCompanyName : null,
            formCompanyTel : null,
            formBusinessCondition : null,
            formBusinessSector : null,
            formBusinessAddress : null,
            formRecommUserCode : null,
            formSalesManCode : 0,
            formSalesManName : null,
            oldSalesManCode : null,
            TextUserCode : "",
            textUserGrade : "Bronze",
            textRegDate : currentDate,
            formUseYN : false,
            formApproval : false,
            formIsApproval : false,
            thumbnail_img : null,
            newImage : null,
            salesmanList : []
        }
    }

    setSortData = async(arr) => {
        let formSalesManCode = this.state.formSalesManCode
        let newData = [
            {id : 0,member_pk : 1,name : '관리자', code : 'A001',checked : formSalesManCode === 'A001' ? true : false}
        ]
        await arr.forEach(function(element,index,array){     
            newData.push({id : index+1,member_pk : element.member_pk,name : element.name, code : element.special_code,checked : formSalesManCode === element.special_code ? true : false})
        }); 
        this.setState({
            salesmanList :  newData
        })
    }
    getSalemanList = async() => {
        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/salesman/list';            
            const token = this.props.userToken.apiToken;            
            returnCode = await apiObject.API_getDetailDefault(this.props,url,token);
            if ( returnCode.code === '0000'  ) {
                this.setSortData(returnCode.data.salesmanList)
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다1.',1000);
                setTimeout(
                    () => {            
                       this.props.navigation.goBack(null);
                    },1000
                )
            }
            this.setState({moreLoading:false,loading:false})
        }catch(e){            
            this.setState({loading:false,moreLoading : false})
            CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다2.',1000);
            setTimeout(
                () => {            
                    this.props.navigation.goBack(null);
                },1000
            )
        }
    }

    getBaseData = async(member_pk) => {
        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/member/view/' + member_pk ;
            const token = this.props.userToken.apiToken;            
            returnCode = await apiObject.API_getDetailDefault(this.props,url,token);
            if ( returnCode.code === '0000'  ) {
                this.setState({
                    formMemberPk : member_pk,
                    formUserID : returnCode.data.userDetail.user_id,
                    formCeoName : returnCode.data.userDetail.company_ceo,
                    formCompanyEmail : CommonFunction.fn_dataDecode(returnCode.data.userDetail.email),
                    formCompanyName : returnCode.data.userDetail.name,
                    formCompanyTel : CommonFunction.fn_dataDecode(returnCode.data.userDetail.phone),
                    formBusinessCondition : returnCode.data.userDetail.company_type,
                    formBusinessSector : returnCode.data.userDetail.company_class,
                    formBusinessAddress : returnCode.data.userDetail.company_address,
                    formSalesManCode : returnCode.data.userDetail.salesman_code,
                    oldSalesManCode: returnCode.data.userDetail.salesman_code,
                    formSalesManName : returnCode.data.userDetail.salesman_name,
                    TextUserCode : returnCode.data.userDetail.special_code,
                    formUseYN : returnCode.data.userDetail.use_yn,
                    formApproval : returnCode.data.userDetail.approval_dt,
                    textUserGrade : returnCode.data.userDetail.grade_name,
                    textRegDate : returnCode.data.userDetail.reg_dt,
                    thumbnail_img : !CommonUtil.isEmpty(returnCode.data.userDetail.img_url) ? DEFAULT_CONSTANTS.defaultImageDomain + returnCode.data.userDetail.img_url : null,
                    gradeStart : returnCode.data.userDetail.grade_start,
                    gradeEnd : returnCode.data.userDetail.grade_end
                })
               
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다1.',1000);
                setTimeout(
                    () => {            
                       this.props.navigation.goBack(null);
                    },1000
                )
            }
            this.setState({moreLoading:false,loading:false})
        }catch(e){            
            this.setState({loading:false,moreLoading : false})
            CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다2.',1000);
            setTimeout(
                () => {            
                    this.props.navigation.goBack(null);
                },1000
            )
        }
    }
    
    async UNSAFE_componentWillMount() {        
        if ( !CommonUtil.isEmpty(this.props.extraData.params.screenData)) {
            await this.getBaseData(this.props.extraData.params.screenData.member_pk);
            await this.getSalemanList();
        }else{
            CommonFunction.fn_call_toast('잘못된 접근입니다.',1000);
            setTimeout(
                () => {            
                   this.props.navigation.goBack(null);
                },1000
            )
        }
    }

    componentDidMount() {
    }
    UNSAFE_componentWillUnmount() { 
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
                                    disabled={true}
                                    value={this.state.formCompanyName}
                                    placeholder="상호명을 입력하세요"
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                    inputContainerStyle={[styles.inputContainerStyle]}
                                    inputStyle={styles.inputStyle}
                                />
                            </View>                            
                        </View>
                        <View style={[styles.middleDataWarp,{}]}>                            
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>사업자등록번호</CustomTextR>
                            </View>
                            <View style={styles.dataInputWrap}>
                                <Input   
                                    disabled={true}
                                    value={this.state.formUserID}
                                    placeholder="숫자만입력)"
                                    keyboardType={'number-pad'}
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                    inputContainerStyle={styles.inputContainerStyle}
                                    inputStyle={styles.inputStyle}
                                />
                            </View>                            
                        </View>
                        <View style={styles.middleDataWarp}>
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>업종</CustomTextR>
                            </View>
                            <View style={styles.dataInputWrap}>
                                <Input  
                                    disabled={true}
                                    value={this.state.formBusinessSector}
                                    placeholder="사업자등록증을 참고하세요"
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                    inputContainerStyle={styles.inputContainerStyle}
                                    inputStyle={styles.inputStyle}
                                    
                                />
                            </View>
                        </View>
                        <View style={styles.middleDataWarp}>
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>업태</CustomTextR>
                            </View>
                            <View style={styles.dataInputWrap}>
                                <Input  
                                    disabled={true}
                                    value={this.state.formBusinessCondition}
                                    placeholder="사업자등록증을 참고하세요"
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                    inputContainerStyle={styles.inputContainerStyle}
                                    inputStyle={styles.inputStyle}
                                    
                                />
                            </View>
                        </View>
                        <View style={styles.middleDataWarp}>
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>주소</CustomTextR>
                            </View>
                            <View style={styles.dataInputWrap}>
                                <Input   
                                    disabled={true}
                                    value={this.state.formBusinessAddress}
                                    placeholder="사업장 주소입력"
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                    inputContainerStyle={styles.inputContainerStyle}
                                    inputStyle={styles.inputStyle}
                                   
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
                                    disabled={true}
                                    value={this.state.formCeoName}
                                    placeholder="대표자명을 입력하세요"
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                    inputContainerStyle={[styles.inputContainerStyle]}
                                    inputStyle={styles.inputStyle}
                                />
                            </View>                            
                        </View>
                        <View style={[styles.middleDataWarp,{}]}>                            
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>전화번호</CustomTextR>
                            </View>
                            <View style={styles.dataInputWrap}>
                                <Input   
                                    disabled={true}
                                    value={this.state.formCompanyTel}
                                    placeholder="회원가입 인증전화 받을 전화번호 입력"
                                    keyboardType={'number-pad'}
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                    inputContainerStyle={styles.inputContainerStyle}
                                    inputStyle={styles.inputStyle}
                                />
                            </View>                            
                        </View>
                        <View style={styles.middleDataWarp}>
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>대표자 E-mail</CustomTextR>
                            </View>
                            <View style={styles.dataInputWrap}>
                                <Input   
                                    disabled={true}
                                    keyboardType={'email-address'}
                                    value={this.state.formCompanyEmail}
                                    placeholder="계산서발행 확인용 이메일을 입력하세요"
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                    inputContainerStyle={styles.inputContainerStyle}
                                    inputStyle={styles.inputStyle} 
                                />
                            </View>
                        </View>                                        
                    </View>
                    <View style={styles.mainTopWrap}>
                        <CustomTextM style={styles.mainTopText}>유저 정보</CustomTextM>
                    </View>
                    <View style={styles.middleWarp}>
                        <View style={[styles.middleDataWarp,{}]}>                            
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>관리코드</CustomTextR>
                            </View>
                            <View style={styles.dataInputWrap2}>
                            <CustomTextR style={styles.dataText}>{this.state.TextUserCode}</CustomTextR>
                            </View> 
                        </View>  
                        <View style={[styles.middleDataWarp,{}]}>                            
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>가입일자</CustomTextR>
                            </View>
                            <View style={styles.dataInputWrap2}>
                            <CustomTextR style={styles.dataText}>
                                {CommonFunction.convertUnixToDate(this.state.textRegDate,"YYYY.MM.DD")}
                                {/*moment.unix(this.state.textRegDate).format("YYYY.MM.DD")}*/}
                            </CustomTextR>
                            </View>  
                        </View> 
                        <View style={[styles.middleDataWarp,{}]}>                            
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>승인</CustomTextR>
                            </View>
                            { 
                                !CommonUtil.isEmpty(this.state.formApproval) ?
                                <View style={styles.dataInputWrap3}>                       
                                    <CustomTextR style={styles.dataText}>승인 {moment.unix(this.state.formApproval).format("YYYY.MM.DD")}</CustomTextR>
                                </View>
                                :
                                <View style={styles.dataInputWrap3}>   
                                    <CustomTextR style={styles.dataText}>승인대기</CustomTextR>
                                </View>  
                            }
                        </View> 
                        { 
                            !CommonUtil.isEmpty(this.state.formApproval) &&
                            <View style={[styles.middleDataWarp,{}]}>                            
                                <View style={styles.titleWrap}>
                                    <CustomTextR style={styles.titleText}>상태</CustomTextR>
                                </View>
                                <View style={styles.dataInputWrap3}>                            
                                    <CustomTextR style={styles.dataText}>{this.state.formUseYN ? '사용중' : '사용중지'}</CustomTextR>
                                </View>  
                            </View>
                        }

                        { 
                            !CommonUtil.isEmpty(this.state.formApproval) && 
                            <View style={[styles.middleDataWarp,{}]}>                            
                                <View style={styles.titleWrap}>
                                    <CustomTextR style={styles.titleText}>등급</CustomTextR>
                                </View>
                                <View style={styles.dataInputWrap2}>
                                    <CustomTextR style={styles.dataText}>{this.state.textUserGrade}</CustomTextR>
                                    <CustomTextR style={CommonStyle.dataText}>기간 ({this.state.gradeStart}~{this.state.gradeEnd})</CustomTextR>
                                </View>  
                            </View>     
                        }                                                     
                    </View>

                    <View style={styles.middleWarp}>
                        <View style={[styles.middleDataWarp,{borderBottomWidth:0}]}>
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>사업자 등록증 업로드</CustomTextR>
                            </View>
                        </View>                    
                        <View style={styles.middleDataWarp2}>
                            { 
                                !CommonUtil.isEmpty(this.state.thumbnail_img) ?
                                <Image
                                    source={{uri:this.state.thumbnail_img}}
                                    resizeMode={"contain"}
                                    style={{width:PixelRatio.roundToNearestPixel(100),height:PixelRatio.roundToNearestPixel(145)}}
                                />
                                :
                                <NativeImage
                                    source={require('../../../assets/icons/default_category.png')}
                                    resizeMode={"contain"}
                                    style={{width:PixelRatio.roundToNearestPixel(97),height:PixelRatio.roundToNearestPixel(150)}}
                                />
                            }
                        </View>
                        
                    </View>
                    {
                        !CommonUtil.isEmpty(this.state.formSalesManName) && 
                        <View>
                            <View style={styles.mainTopWrap}>
                                <CustomTextM style={styles.mainTopText}>담당 영업사원</CustomTextM>
                            </View>
                            <View style={styles.middleWarp}>
                                <View style={[styles.middleDataWarp,{}]}>                            
                                    <View style={styles.titleWrap}>
                                        <CustomTextR style={styles.titleText}>영업사원명</CustomTextR>
                                    </View>
                                    <View style={styles.dataInputWrap}>
                                        <Input   
                                            disabled={true}
                                            value={this.state.formSalesManName + '(' + this.state.formSalesManCode + ')'}
                                            placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                            inputContainerStyle={[styles.inputContainerStyle]}
                                            inputStyle={styles.inputStyle}
                                        />
                                    </View>                            
                                </View>
                            </View>
                        </View>
                    }

                    <View style={[CommonStyle.blankArea,{backgroundColor:'#f5f6f8'}]}></View>
                    { 
                        this.state.moreLoading &&
                        <View style={CommonStyle.moreWrap}>
                            <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} />
                        </View>
                    }
                </ScrollView>
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
    textWrap : {
        flex:1,justifyContent:'center',padding:15,backgroundColor:'#fff',marginHorizontal:20
    },
    middleWarp : {
        flex:1,        
        justifyContent:'center',
        marginHorizontal:20,marginBottom:10,
        backgroundColor:'#fff',
        borderColor:DEFAULT_COLOR.input_border_color,borderWidth:1,borderRadius:17
    },
    middleWarp2 : {
        flex:1,        
        justifyContent:'center',
        marginHorizontal:20,marginBottom:10,
        backgroundColor:'#fff'
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
    
    middleDataWarp3 : {
        flex:1,
        justifyContent:'center'
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
    dataInputWrap2 : {
        flex:1,height:55,justifyContent:'center',paddingHorizontal:20
    },
    dataInputWrap3 : {
        flex:1,height:55,justifyContent:'center',paddingHorizontal:20,flexDirection:'row',justifyContent:'flex-start',paddingTop:15
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
    };
}

function mapDispatchToProps(dispatch) {
    return {        
        _saveUserToken:(str)=> {
            dispatch(ActionCreator.saveUserToken(str))
        }
    };
}


export default connect(mapStateToProps,mapDispatchToProps)(MemberInfoScreen);
import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Image,Dimensions,PixelRatio,TouchableOpacity,Animated,Alert,BackHandler} from 'react-native';
import 'moment/locale/ko'
import  moment  from  "moment";
import Modal from 'react-native-modal';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
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
import { apiObject } from "../Apis";

class CouponDetailScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading : false,
            coupon_pk : 0,
            couponData : {},
            couponDetail : {}
        }
    }

    getBaseData = async(notice_pk) => {
        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/coupon/view/'+notice_pk;
            const token = this.props.userToken.apiToken;
            returnCode = await apiObject.API_getDetailDefault(this.props,url,token);
            if ( returnCode.code === '0000'  ) {
                this.setState({
                    couponDetail : CommonUtil.isEmpty(returnCode.data.couponDetail) ? [] : returnCode.data.couponDetail
                })
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.',1500);
                setTimeout(
                    () => {            
                       this.props.navigation.goBack(null);
                    },1500
                )
            }
            this.setState({moreLoading:false,loading:false})
        }catch(e){
            this.setState({loading:false,moreLoading : false})
        }
    }

    async UNSAFE_componentWillMount() {
        if ( !CommonUtil.isEmpty(this.props.extraData.params.screenData)) {
            this.setState({
                coupon_pk : this.props.extraData.params.screenData.coupon_pk,
                couponData : this.props.extraData.params.screenData,
            })
            await this.getBaseData(this.props.extraData.params.screenData.coupon_pk);
        }else{
            CommonFunction.fn_call_toast('잘못된 접근입니다.',1500);
            setTimeout(
                () => {            
                   this.props.navigation.goBack(null);
                },1500
            )
        }

        this.props.navigation.addListener('focus', () => {  
        })

        this.props.navigation.addListener('blur', () => {            
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        })
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);          
    }

    handleBackButton = () => {        
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);  
        this.props.navigation.goBack(null);                
        return true;
    };

    moveDetail = async(item) => {
        this.props.navigation.navigate('OrderDetailStack',{
            screenData: item
        });
    }
    render() {
        if ( this.state.loading ) {
            return (
                <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} /> 
            )
        }else {  
            return(
                <SafeAreaView style={styles.container}>
                    <ScrollView
                        ref={(ref) => {
                            this.ScrollView = ref;
                        }}
                        showsVerticalScrollIndicator={false}
                        indicatorStyle={'white'}
                        scrollEventThrottle={16}
                        keyboardDismissMode={'on-drag'}
                        style={{width:'100%',flex:1}}
                    >
                    <View style={styles.defaultWrap}>
                        <View style={[styles.boxWrap,{flexDirection:'row'}]}>
                            <CustomTextR style={styles.menuTitleText2}>쿠폰분류 : {this.state.couponDetail.price}원권</CustomTextR>
                        </View>
                    </View>
                    <View style={styles.defaultWrap}>
                        <View style={styles.boxWrap}>
                            <CustomTextR style={styles.menuTitleText2}>발급일자 : {CommonFunction.convertUnixToDate(this.state.couponDetail.reg_dt,'YYYY.MM.DD')}</CustomTextR>
                        </View>
                    </View>
                    <View style={styles.defaultWrap}>
                        <View style={styles.boxWrap}>
                            <CustomTextR style={styles.menuTitleText2}>발급사유 : {this.state.couponDetail.issue_reason}</CustomTextR>
                        </View>
                    </View>
                    <View style={styles.defaultWrap}>
                        <View style={styles.boxWrap}>
                            <CustomTextR style={styles.menuTitleText2}>사용자 : {this.state.couponDetail.member_name}</CustomTextR>
                        </View>
                    </View>
                    {
                        this.state.couponDetail.use_dt > 0 ?
                        <View style={styles.defaultWrap}>
                            <View style={[styles.boxWrap,{flexDirection:'row'}]}>
                                <CustomTextR style={styles.menuTitleText2}>사용일자 : </CustomTextR>
                                <CustomTextR style={styles.menuTitleText2}>{CommonFunction.convertUnixToDate(this.state.couponDetail.use_dt,'YYYY.MM.DD')}</CustomTextR>
                                { 
                                    !CommonUtil.isEmpty(this.state.couponDetail.order_pk) &&
                                    <TouchableOpacity onPress={()=>this.moveDetail({order_pk:this.state.couponDetail.order_pk})}>
                                        <CustomTextR style={styles.menuTitleText3}>[주문확인]</CustomTextR>
                                    </TouchableOpacity>
                                }
                            </View>
                        </View>
                        :
                        <View style={styles.defaultWrap}>
                            <View style={[styles.boxWrap,{flexDirection:'row'}]}>
                                <CustomTextR style={styles.menuTitleText2}>사용일자 : 사용기한 만료</CustomTextR>
                            </View>
                        </View>
                    }
                    <View style={CommonStyle.blankArea}></View>
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
    defaultWrap:{
        flex:1,borderTopWidth:1,borderTopColor:DEFAULT_COLOR.input_border_color,backgroundColor : "#fff",justifyContent:'center',
        paddingVertical:5
    },
    inputText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#444040',paddingLeft:20
    },
    thumbnailWrap : {
        paddingHorizontal:0,marginVertical:20,justifyContent:'center',alignItems:'center',overflow:'hidden'
    },
    menuTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),paddingRight:10
    },
    menuTitleText2 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),paddingRight:10,color:'#343434'
    },
    menuTitleText3 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),paddingRight:10,color:DEFAULT_COLOR.base_color
    },
    termText4 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),paddingRight:10,color:'#343434'
    },
    ballStyle : {
        width: 28,height: 28,borderRadius: 14,backgroundColor:'#fff'
    },
    boxWrap : {
        paddingHorizontal:20,paddingVertical:10
    },
    boxSubWrap : {
        flex:1,
        flexDirection:'row',    
        flexGrow:1,    
        paddingVertical: Platform.OS === 'android' ? 5 : 15,
        alignItems: 'center',
        backgroundColor:'#fff',        
        borderBottomWidth:1,
        borderBottomColor : DEFAULT_COLOR.input_border_color
    },
    productArrayWrap : {
        padding:10
    },
    boxLeftWrap : {
        flex:1,        
        justifyContent:'center',
        alignItems:'center'
    },
    boxRightWrap : {
        flex:5,        
        justifyContent:'center',
        alignItems:'flex-start'
    },
    boxStockWrap : {
        flex:1.5,        
        justifyContent:'center',
        alignItems:'center'
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
});

function mapStateToProps(state) {
    return {
        userToken : state.GlabalStatus.userToken,
        toggleNoticeDetail : state.GlabalStatus.toggleNoticeDetail
    };
}

function mapDispatchToProps(dispatch) {
    return {        
        _saveUserToken:(str)=> {
            dispatch(ActionCreator.saveUserToken(str))
        },        
        _fn_ToggleNoticeDetail:(bool)=> {
            dispatch(ActionCreator.fn_ToggleNoticeDetail(bool))
        }
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(CouponDetailScreen);
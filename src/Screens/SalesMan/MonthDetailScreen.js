import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Text,Dimensions,PixelRatio,TouchableOpacity} from 'react-native';
import 'moment/locale/ko'
import  moment  from  "moment";
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
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
const currentDate =  moment().format('YYYY.MM.DD HH:MM');

class MonthDetailScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading : true,
            monthData : {},
            salemanData : {},
            monthOrders : []
        }
    }

    getBaseData = async(member_pk,sales_month) => {
        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/salesman/incentive/month/' + member_pk + '?sales_month=' + sales_month ;
            const token = this.props.userToken.apiToken;
            returnCode = await apiObject.API_getDetailDefault(this.props,url,token);
            if ( returnCode.code === '0000'  ) {
                this.setState({
                    monthData : returnCode.data.monthData,
                    moreLoading:false,loading:false,
                    monthOrders : CommonUtil.isEmpty(returnCode.data.monthData.order_data) ? [] : returnCode.data.monthData.order_data,
                })
            }else{
                this.setState({moreLoading:false,loading:false})
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다1.',1000);
                setTimeout(
                    () => {            
                       this.props.navigation.goBack(null);
                    },1000
                )
            }
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
            await this.setState({
                member_pk : this.props.extraData.params.member_pk,
                salemanData : this.props.extraData.params.salemanData,
                sales_month : this.props.extraData.params.screenData.sales_month
            })
            await this.getBaseData(this.props.extraData.params.member_pk,this.props.extraData.params.screenData.sales_month)
            
        }else{
            CommonFunction.fn_call_toast('잘못된 접근입니다.',1000);
            setTimeout(
                () => {            
                   this.props.navigation.goBack(null);
                },1000
            )
        }
    }

    componentWillUnmount(){        
    }

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
                <SafeAreaView style={ styles.container }>
                    <ScrollView
                        ref={(ref) => {
                            this.ScrollView = ref;
                        }}
                        showsVerticalScrollIndicator={false}
                        indicatorStyle={'white'}
                        scrollEventThrottle={16}
                        keyboardDismissMode={'on-drag'}
                        style={{width:'100%'}}
                    >
                    <View style={styles.mainWrap}>
                        <View style={styles.boxWrap}>
                            <View style={{paddingVertical:5,alignItems:'center',justifyContent:'center'}}>
                                <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#000'}}>{CommonFunction.convertDateToComma(this.state.sales_month)} 인센티브 현황</CustomTextR>
                            </View>
                            <View style={{paddingVertical:5,alignItems:'center',justifyContent:'center'}}>
                                <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize20),color:'#000'}}>{CommonFunction.currencyFormat(this.state.monthData.total_incentive)}원</CustomTextR>
                            </View>
                        </View>
                    </View>
                    <View style={styles.mainWrap3}>
                        <View style={{flex:1}}>
                            <CustomTextR  style={CommonStyle.titleText}>주문금액</CustomTextR>
                        </View>
                        <View style={{flex:1,alignItems:'flex-end'}}>
                            <CustomTextR  style={CommonStyle.titleText}>인센티브대상금액</CustomTextR>
                        </View>
                    </View>
                    <View style={styles.mainWrap4}>
                        <View style={[styles.boxWrap4,{padding:0}]}>
                            {
                            this.state.monthOrders.map((item, index) => {  
                                return (
                                <TouchableOpacity 
                                    onPress={()=>this.moveDetail(item)}
                                    style={styles.historyBoxWrap} 
                                    key={index}
                                >
                                    <View style={{flex:1,paddingVertical:5}}>
                                        <CustomTextB style={CommonStyle.dataText}>{item.order_no}</CustomTextB>
                                        <CustomTextR  style={CommonStyle.dataText}>{item.member_name} {CommonFunction.convertUnixToDate(item.order_reg_dt,'YYYY.MM.DD HH:mm')}</CustomTextR>
                                    </View>
                                    <View style={{flexDirection:'row',paddingVertical:5}}>
                                        <View style={{flex:1,justifyContent:'center'}}>
                                            { 
                                                item.discount_price > 0 ?
                                                <TextRobotoR style={CommonStyle.dataText}>
                                                    {CommonFunction.currencyFormat(item.discount_price)} 원
                                                </TextRobotoR>
                                                :
                                                <TextRobotoR style={CommonStyle.dataText}>
                                                    {CommonFunction.currencyFormat(item.total_price)} 원
                                                </TextRobotoR>
                                            }
                                        </View>
                                        <View style={{flex:1,justifyContent:'center',alignItems:'flex-end'}}>
                                            { 
                                                item.event_limit_price === 0 ?
                                                item.discount_price > 0 ?
                                                <TextRobotoR style={CommonStyle.dataText}>
                                                    {CommonFunction.currencyFormat(item.discount_price)} 원
                                                </TextRobotoR>
                                                :
                                                <TextRobotoR style={CommonStyle.dataText}>
                                                    {CommonFunction.currencyFormat(item.total_price)} 원
                                                </TextRobotoR>
                                                :
                                                <TextRobotoR style={CommonStyle.dataText}>0원</TextRobotoR>
                                            }
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                )
                            })
                            }
                        </View>
                        <View style={styles.mainWrap3}>
                            <View style={{flex:1}}>
                                <CustomTextR  style={CommonStyle.titleText}>합계금액</CustomTextR>
                            </View>
                            <View style={{flex:1,alignItems:'flex-end'}}>
                                <TextRobotoM style={CommonStyle.dataText}>
                                    {CommonFunction.currencyFormat(this.state.monthData.total_amount)} 원
                                </TextRobotoM>
                            </View>
                        </View>
                        <View style={styles.mainWrap3}>
                            <View style={{flex:1}}>
                                <CustomTextR  style={CommonStyle.titleText}>포인트구매금액(-)</CustomTextR>
                            </View>
                            <View style={{flex:1,alignItems:'flex-end'}}>
                                <TextRobotoM style={CommonStyle.dataText}>
                                    {CommonFunction.currencyFormat(this.state.monthData.total_point)} 원
                                </TextRobotoM>
                            </View>
                        </View>
                        <View style={styles.mainWrap5}>
                            <View style={{flex:1,alignItems:'center'}}>
                                <Icon name="questioncircleo" size={PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16)} color="#bbb" />
                            </View>
                            <View style={{flex:7}}>
                                <CustomTextR  style={CommonStyle.dataText}>
                                    월간 누적금액이 2천이상이면 그 금액의 {this.state.monthData.incentive_2}%, 3천이상 {this.state.monthData.incentive_3}%로 인센티브 정산{"\n"}(인센티브 대상제외 :  포인트구매금액(주문에서 사용된 쿠폰/포인트금액),한정특가상품)
                                </CustomTextR>
                            </View>
                        </View>
                    </View>
                    </ScrollView>
                </SafeAreaView>
            );
        }
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
    mainWrap : {        
        marginHorizontal : 15,marginTop:15
    },
    mainWrap2 : {        
        marginVertical:5
    },
    mainWrap3 : {        
        marginHorizontal:20,marginVertical:5,flexDirection:'row',alignItems:'center'
    },
    mainWrap4 : {        
        marginVertical:5
    },
    mainWrap5 : {
        marginHorizontal:20,marginVertical:15,flexDirection:'row',alignItems:'center',paddingTop:20
    },
    boxWrap : {
        padding:15,backgroundColor:'#fff',minHeight:60,marginBottom:10,borderRadius:5,
        ...Platform.select({
            ios: {
                shadowColor: "#ccc",
                shadowOpacity: 0.5,
                shadowRadius: 2,
                shadowOffset: {
                    height: 0,
                    width: 0.1
                }
            },
            android: {
                elevation: 5
            }
        })
    },
    boxWrap4 : {
        padding:0,backgroundColor:'#fff',minHeight:60,marginBottom:10,borderRadius:5,
    },
    boxText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),color:'#000'
    },
    boxDataWarp : {
        paddingVertical:5,justifyContent:'center',alignItems:'center'
    },
    codeBoxWrap : {
        flex:1,maxWidth:SCREEN_WIDTH/2,padding:10,justifyContent:'center',alignItems:'center',borderWidth:1,borderColor:'#3272ff'
    },
    codeCopyBoxWrap: {
        flex:1,maxWidth:SCREEN_WIDTH/2,paddingVertical:10,paddingHorizontal:20,justifyContent:'center',alignItems:'center',borderWidth:1,borderColor:'#0059a9',backgroundColor:'#0059a9'
    },
    historyBoxWrap : {
        paddingVertical:10,paddingHorizontal:20,borderBottomWidth:1,borderBottomColor:DEFAULT_COLOR.input_border_color
    },
    dataText3 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),color:'#7f7f7f'
    },
});


function mapStateToProps(state) {
    return {
        userToken : state.GlabalStatus.userToken,
        togglecategory : state.GlabalStatus.togglecategory
    };
}

function mapDispatchToProps(dispatch) {
    return {   
        _saveUserToken:(str)=> {
            dispatch(ActionCreator.saveUserToken(str))
        },             
        _fn_ToggleCategory:(bool)=> {
            dispatch(ActionCreator.fn_ToggleCategory(bool))
        }
    };
}


export default connect(mapStateToProps,mapDispatchToProps)(MonthDetailScreen);
import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Text,Dimensions,PixelRatio,TouchableOpacity,Image} from 'react-native';
import 'moment/locale/ko'
import  moment  from  "moment";
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
class SalesManDetailScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : true,
            member_pk : 0,
            salemanData : {},
            incentiveMonthData : [],
        }
    }

    getBaseData = async(member_pk) => {
        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/salesman/view/' + member_pk ;
            const token = this.props.userToken.apiToken;
            returnCode = await apiObject.API_getDetailDefault(this.props,url,token);
            if ( returnCode.code === '0000'  ) {
                this.setState({
                    member_pk,
                    moreLoading:false,loading:false,
                    salemanData : returnCode.data.userDetail,
                    incentiveMonthData : CommonUtil.isEmpty(returnCode.data.userDetail.incentive) ? [] :returnCode.data.userDetail.incentive
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
            await this.getBaseData(this.props.extraData.params.screenData.member_pk);
            this.props.navigation.addListener('focus', () => {  
                this.getBaseData(this.state.member_pk);                
            })
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

    componentWillUnmount(){        
    }

    moveMonthDetail = async(item) => {
        if ( !CommonUtil.isEmpty(item.sales_month) && item.total_amount > 0) {
            this.props.navigation.navigate('MonthDetailStack',{
                screenData: item,
                salemanData : this.state.salemanData,
                member_pk : this.state.member_pk
            });
        }
    }
    moveDetail2 = async() => {
        this.props.navigation.navigate('ChargeListStack',{
            screenData: this.state.salemanData
        });
    }
    moveModify = async() => {
        if ( this.props.userToken.is_salesman) {
            this.props.navigation.navigate('MyIDModifyStack',{
                screenData: this.state.salemanData
            });
        }else{
            this.props.navigation.navigate('SalesManModifyStack',{
                screenData: this.state.salemanData
            });
        }
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
                        <View style={[styles.boxWrap,{marginTop:15}]}>
                            <TouchableOpacity onPress={()=>this.moveModify()} style={styles.fixDataWarp}>
                                <CustomTextR style={styles.boxText2}>정보수정</CustomTextR>
                            </TouchableOpacity>
                            <View style={styles.boxDataWarp}>
                                <CustomTextB style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize17),color:DEFAULT_COLOR.base_color_666}}>{this.state.salemanData.name}</CustomTextB>
                            </View>
                            <View style={styles.boxDataWarp}>
                                <View style={styles.codeBoxWrap}>
                                    <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize28),color:'#3272ff'}}>{this.state.salemanData.special_code}</CustomTextM>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.mainWrap2}>
                        <View style={[styles.boxWrap3,{flex:1}]}>
                            <TouchableOpacity onPress={()=>this.moveDetail2()} style={styles.agentWrap}>
                                <CustomTextR style={styles.boxText}>관리회원</CustomTextR>
                                <Image
                                    source={require('../../../assets/icons/btn_next.png')}
                                    resizeMode={"contain"}
                                    style={{width:PixelRatio.roundToNearestPixel(20),height:PixelRatio.roundToNearestPixel(20)}}
                                />
                            </TouchableOpacity>
                            <View style={{paddingVertical:5,alignItems:'center',justifyContent:'center'}}>
                                <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize20),color:'#000'}}>{CommonFunction.currencyFormat(this.state.salemanData.charge_count)}</CustomTextR>
                            </View>
                        </View>
                        <View style={{flex:0.1}} />
                        <View style={[styles.boxWrap3,{flex:2}]}>
                            <View style={{paddingVertical:5,alignItems:'center',justifyContent:'center'}}>
                                <CustomTextR style={styles.boxText}>인센티브 누적현황</CustomTextR>
                            </View>
                            <View style={{paddingVertical:5,alignItems:'center',justifyContent:'center'}}>
                                <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize20),color:'#000'}}>{CommonFunction.currencyFormat(this.state.salemanData.total_incentive)}원</CustomTextR>
                            </View>
                        </View>
                    </View>
                    <View style={styles.mainWrap4}>
                        <View style={styles.boxWrap4}>
                            {
                            this.state.incentiveMonthData.map((item, index) => {  
                                return (
                                    <View style={styles.historyBoxWrap} key={index}>
                                        <TouchableOpacity 
                                            onPress={()=>this.moveMonthDetail(item)}
                                            style={{flex:1,paddingVertical:5,flexDirection:'row'}}
                                        >
                                            <View style={{flex:1}}>
                                                <CustomTextR style={styles.boxText}>{CommonFunction.convertDateToComma(item.sales_month)}</CustomTextR>
                                            </View>
                                            <View style={{flex:1,alignItems:'flex-end'}}>
                                                <Image
                                                    source={require('../../../assets/icons/btn_next.png')}
                                                    resizeMode={"contain"}
                                                    style={CommonStyle.defaultIconImage20}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                        <View style={{flexDirection:'row',paddingVertical:5}}>
                                            <View style={{flex:2,justifyContent:'center'}}>
                                                <CustomTextR style={CommonStyle.dataText}>구매액 : {CommonFunction.currencyFormat(item.total_amount)} 원</CustomTextR>
                                            </View>
                                            <View style={{flex:1,justifyContent:'center',alignItems:'flex-end'}}>
                                                <CustomTextR style={CommonStyle.dataText}>{CommonFunction.currencyFormat(item.total_incentive)} 원</CustomTextR>
                                            </View>
                                        </View>
                                    </View>
                                )
                            })
                            }
                            
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
    fixDataWarp : {
        position:'absolute',right:10,top:10,width:100,borderWidth:1,borderColor:DEFAULT_COLOR.input_border_color,
        justifyContent:'center',alignItems:'center',paddingVertical:5,zIndex:5
    },
    mainWrap : {        
        marginHorizontal : 15,marginVertical:5
    },
    mainWrap2 : {        
        marginVertical:5,flexDirection:'row',marginHorizontal:15
    },
    mainWrap4 : {        
        marginVertical:5
    },
    agentWrap : {
        paddingVertical:5,alignItems:'center',justifyContent:'center',flexDirection:'row',flexGrow:1
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
    boxWrap3 : {
        padding:5,backgroundColor:'#fff',minHeight:40,marginBottom:5,borderRadius:5,
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
        padding:0,backgroundColor:'#fff',minHeight:0,marginBottom:10,borderRadius:5,
    },
    boxText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#000'
    },
    boxText2 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),color:'#666'
    },
    boxDataWarp : {
        paddingVertical:5,justifyContent:'center',alignItems:'center'
    },
    codeBoxWrap : {
        flex:1,maxWidth:SCREEN_WIDTH/2,paddingHorizontal:10,justifyContent:'center',alignItems:'center',borderWidth:1,borderColor:'#3272ff'
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
export default connect(mapStateToProps,mapDispatchToProps)(SalesManDetailScreen);
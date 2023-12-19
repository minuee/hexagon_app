import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Text,Dimensions,PixelRatio,TouchableOpacity} from 'react-native';
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


class IntroScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading : true,
            userList : [],
            todaySales : 0,
        }
    }

    getBaseData = async() => {
        let returnCode = {code:9998};     
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/home/analyst/' + this.props.userToken.member_pk;
            const token = this.props.userToken.apiToken;
            let sendData = null;
            returnCode = await apiObject.API_getPageList(this.props,url,token,sendData);
            if ( returnCode.code === '0000'  ) {
                this.setState({
                    userList : CommonUtil.isEmpty(returnCode.data.rank_data) ? [] : returnCode.data.rank_data,
                    todaySales : CommonUtil.isEmpty(returnCode.data.today_sales.daily_sales) ? 0 : returnCode.data.today_sales.daily_sales,
                })
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.IntroScreen',2000);
            }
            this.setState({moreLoading:false,loading:false})
        }catch(e){
            this.setState({loading:false,moreLoading : false})
        }
    }
    
    async UNSAFE_componentWillMount() {
        await this.getBaseData();
        this.props.navigation.addListener('focus', () => {  
            this.getBaseData();
        })
    }

    componentDidMount() { 
    }
    componentWillUnmount(){        
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
                    <View style={styles.topWrap}>
                        <CustomTextB style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize20),color:'#000'}}>관리자님,{"\n"}환영합니다</CustomTextB>     
                    </View>
                    <View style={styles.mainWrap}>
                        <View style={styles.boxWrap}>
                            <View style={{paddingVertical:5}}>
                                <CustomTextB style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#000'}}>일일 판매액</CustomTextB>
                            </View>
                            <View style={{paddingVertical:5}}>
                                <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),color:'#949494'}}>{currentDate} 기준</CustomTextR>
                            </View>                            
                            <View style={{paddingVertical:5}}>
                                <CustomTextB style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18)}}><CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize28),color:'#000'}}>{CommonFunction.currencyFormat(this.state.todaySales)}</CustomTextR> 원</CustomTextB>
                            </View>
                        </View>
                    </View>
                    <View style={styles.mainWrap}>
                        <View style={styles.boxWrap}>
                            <View style={{paddingVertical:5}}>
                                <CustomTextB style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#000'}}>유저 구매누적액 총액</CustomTextB>
                            </View>
                            <View style={{paddingVertical:5}}>
                                <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),color:'#949494'}}>{currentDate} 기준</CustomTextR>
                            </View>
                            <View style={{paddingVertical:5}}>
                            {
                                this.state.userList.length === 0 ?
                                <View style={CommonStyle.emptyWrap} >
                                    <CustomTextR style={CommonStyle.dataText}>주문이력 데이터가 없습니다.</CustomTextR>
                                </View>
                                :
                                this.state.userList.map((item, index) => {  
                                    return (
                                        <View style={{flexDirection:'row',paddingVertical:5}} key={index}>
                                            <View style={{flex:1,justifyContent:'center'}}>
                                                <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#000'}}>{index+1}  {item.member_name}</CustomTextR>
                                            </View>
                                            <View style={{flex:1,justifyContent:'center',alignItems:'flex-end'}}>
                                                <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#000'}}>{CommonFunction.currencyFormat(item.total_amount)} 원</CustomTextR>
                                            </View>
                                        </View>
                                    )
                                })
                            }
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
    topWrap : {
        height:60,marginVertical:20,marginLeft:30
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
        marginHorizontal : 15,marginVertical:5
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
    boxText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),color:'#000'
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

export default connect(mapStateToProps,mapDispatchToProps)(IntroScreen);
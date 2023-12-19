import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Text,Dimensions,PixelRatio,TouchableOpacity,Image} from 'react-native';
import 'moment/locale/ko'
import  moment  from  "moment";
import Clipboard from '@react-native-community/clipboard';
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

const DefaultPaginate = 10;
class RewardDetailScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading : true,
            member_pk : 0,
            rewardData : {},
            moreLoading : false,
            ismore :  false,
            myRewardList : [],
            currentPage : 1,
        }
    }

    moreDataUpdate = async( baseData , addData) => {     
        let newArray = await baseData.concat(addData.data.userRewardHistory);  
        this.setState({            
            moreLoading : false,
            loading : false,
            myRewardList : newArray,
            ismore : parseInt(this.state.currentPage) < parseInt(addData.lastPage) ? true : false
        })
    }

    getBaseData = async(rmember_pk = null,currentPage,morePage = false) => {

        this.setState({moreLoading : true})
        let returnCode = {code:9998};
        let member_pk = !CommonUtil.isEmpty(rmember_pk)   ? rmember_pk : this.state.member_pk;
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/member/reward/list/'+ member_pk + '?page=' + currentPage + '&paginate='+DefaultPaginate;
            const token = this.props.userToken.apiToken;
            let sendData = null;
            returnCode = await apiObject.API_getPageList(this.props,url,token,sendData);
            if ( returnCode.code === '0000'  ) {
                this.setState({currentPage : returnCode.currentPage})
                if ( morePage ) {
                    this.moreDataUpdate(this.state.myRewardList,returnCode )
                }else{
                    this.setState({
                        totalCount : returnCode.total,
                        totalReward :  returnCode.data.totalReward,
                        myRewardList : CommonUtil.isEmpty(returnCode.data.userRewardHistory) ? [] : returnCode.data.userRewardHistory,
                        ismore : parseInt(this.state.currentPage)  < parseInt(returnCode.lastPage) ? true : false
                    })
                }
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.',2000);
            }
            this.setState({moreLoading:false,loading:false})
        }catch(e){            
            this.setState({loading:false,moreLoading : false})
        }
       
    }
    
    async UNSAFE_componentWillMount() {
        if ( !CommonUtil.isEmpty(this.props.extraData.params.screenData)) {
            this.setState({
                rewardData : this.props.extraData.params.screenData,
                member_pk : this.props.extraData.params.screenData.member_pk
            })
            if ( !CommonUtil.isEmpty(this.props.extraData.params.screenData.member_pk)) {
                await this.getBaseData(this.props.extraData.params.screenData.member_pk,1,false);
            }    
        }else{
            CommonFunction.fn_call_toast('잘못된 접근입니다.',2000);
            setTimeout(
                () => {            
                   this.props.navigation.goBack(null);
                },500
            )
        }
    }

    componentDidMount() {
    }
    componentWillUnmount(){        
    }


    clipboardCode = ( code ) => {
        Clipboard.setString(code);        
        CommonFunction.fn_call_toast('복사되었습니다.', 2000);
    }

    moveDetail = (item) => {
        this.props.navigation.navigate('OrderDetailStack',{
            screenTitle:item.order_no,
            screenData:item
        })
    }

    handleOnScroll (event) {             
        let paddingToBottom = 1;
        paddingToBottom += event.nativeEvent.layoutMeasurement.height;                            
        if (event.nativeEvent.contentOffset.y + paddingToBottom >= event.nativeEvent.contentSize.height) {            
            this.scrollEndReach();
        }
    }

    scrollEndReach = () => {      
        if ( this.state.ismore && !this.state.moreLoading ) {
            this.getBaseData(this.state.member_pk,this.state.currentPage+1,true)
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
                        onScroll={e => this.handleOnScroll(e)}
                        indicatorStyle={'white'}
                        scrollEventThrottle={16}
                        keyboardDismissMode={'on-drag'}
                        style={{width:'100%'}}
                    >
                    <View style={styles.mainWrap}>
                        <View style={[styles.boxWrap,{marginTop:15}]}>
                            <View style={styles.boxDataWarp}>
                                <CustomTextB style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize17),color:DEFAULT_COLOR.base_color_666}}>
                                    {this.state.rewardData.name}
                                </CustomTextB>
                            </View>
                            <View style={styles.boxDataWarp}>
                                <View style={styles.codeBoxWrap}>
                                    <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize28),color:'#3272ff'}}>
                                        {this.state.rewardData.special_code}
                                    </CustomTextM>
                                </View>
                            </View>                            
                            <View style={styles.boxDataWarp}>
                                <TouchableOpacity
                                    onPress={()=>this.clipboardCode(this.state.rewardData.special_code)} 
                                    style={styles.codeCopyBoxWrap}
                                >
                                    <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize17),color:'#fff'}}>코드복사</CustomTextM>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={styles.mainWrap2}>
                        <View style={styles.boxWrap}>
                            <View style={{paddingVertical:5,alignItems:'center',justifyContent:'center'}}>
                                <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#000'}}>적립금 현황</CustomTextR>
                            </View>
                            <View style={{paddingVertical:5,alignItems:'center',justifyContent:'center'}}>
                                <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize20),color:'#000'}}>
                                    {this.state.totalReward > 0 ? CommonFunction.currencyFormat(this.state.totalReward) : 0} 원
                                </CustomTextR>
                            </View>
                        </View>
                    </View>
                    <View style={styles.mainWrap2}>
                        <View style={[styles.boxWrap,{padding:0}]}>
                            {
                                this.state.myRewardList.map((item, index) => {  
                                return (
                                    <View style={styles.historyBoxWrap} key={index}>
                                        <View style={styles.commonDataWrap}>
                                            <View style={{flex:2}}>
                                                <CustomTextR style={CommonStyle.titleText}>{CommonFunction.convertUnixToDate(item.reg_dt,"YYYY.MM.DD HH:mm")}</CustomTextR>
                                            </View>
                                            { 
                                                item.order_pk > 0 ?
                                                <TouchableOpacity 
                                                    onPress={()=>this.moveDetail(item)}
                                                    style={{flex:1,alignItems:'flex-end'}}>
                                                    <Image
                                                        source={require('../../../assets/icons/btn_next.png')}
                                                        resizeMode={"contain"}
                                                        style={CommonStyle.defaultIconImage20}
                                                    />
                                                </TouchableOpacity>
                                                :
                                                <View style={{flex:1,alignItems:'flex-end'}} />
                                            }
                                        </View>
                                        <View style={styles.commonDataWrap}>
                                            <View style={{flex:2,justifyContent:'center'}}>
                                                { 
                                                    item.reward_gubun === 'm'  && item.order_pk > 0 ?
                                                    <CustomTextR style={CommonStyle.dataText}>주문포인트 사용</CustomTextR>
                                                    :
                                                    <CustomTextR style={CommonStyle.dataText}>{item.content}</CustomTextR>       
                                                } 
                                            </View>
                                            <View style={{flex:1,justifyContent:'center',alignItems:'flex-end'}}>
                                                <TextRobotoR style={CommonStyle.dataText}>{item.reward_gubun === 'p' ? '+' : '-'}{CommonFunction.currencyFormat(item.reward_point)}원</TextRobotoR>
                                            </View>
                                        </View>
                                    </View>

                                    
                                )
                            })
                            }
                            
                        </View>
                    </View>
                    {/* {
                        this.state.ismore &&
                        <View style={CommonStyle.moreButtonWrap}>
                            <TouchableOpacity 
                                onPress={() => this.getBaseData(this.state.member_pk,this.state.currentPage+1,true)}
                                style={CommonStyle.moreButton}
                            >
                            <CustomTextL style={CommonStyle.moreText}>더보기</CustomTextL>
                            </TouchableOpacity>
                        </View>
                    } */}
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
    mainWrap2 : {        
        marginVertical:5
    },
    boxWrap : {
        padding:15,backgroundColor:'#fff',minHeight:0,marginBottom:10,borderRadius:5
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
    commonDataWrap : {
        flex:1,flexDirection:'row',paddingVertical:5
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

    boxSubWrap : {
        flex:1,
        flexDirection:'row',    
        flexGrow:1,    
        paddingHorizontal:20,paddingVertical:15,
        alignItems: 'center',        
        borderBottomWidth:1,
        borderBottomColor : DEFAULT_COLOR.input_border_color
    },
    boxCenterWrap : {
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    boxLeftWrap : {
        flex:5,
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center'
    },
    boxRightWrap : {
        flex:1,        
        justifyContent:'center',
        alignItems:'flex-end'
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


export default connect(mapStateToProps,mapDispatchToProps)(RewardDetailScreen);
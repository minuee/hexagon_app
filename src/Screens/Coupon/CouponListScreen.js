import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Text,Dimensions,RefreshControl, PixelRatio,Image,TouchableOpacity, Platform,Animated,BackHandler} from 'react-native';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
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
class CouponListScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : false,
            moreLoading : false,
            totalCount : 0,
            totalCountOld : 0,
            couponList : [],
            ismore :  false,
            currentPage : 1,
            couponListOld : [],
            ismoreOld :  false,
            currentPageOld : 1,
        }
    }

    moreDataUpdate = async( baseData , addData , gubun = null) => {
        if ( gubun === null ) {            
            let newArray = await baseData.concat(addData.data.validCouponList);  
            this.setState({            
                moreLoading : false,
                loading : false,
                currentPageOld : addData.currentPage,
                couponList : newArray,
                ismore : parseInt(addData.currentPage) < parseInt(addData.lastPage) ? true : false
            })
        }else{
            let newArray = await baseData.concat(addData.data.passCouponList);  
            this.setState({            
                moreLoading : false,
                loading : false,
                couponListOld : newArray,
                currentPageOld : addData.currentPage,
                ismoreOld : parseInt(addData.currentPage) < parseInt(addData.lastPage) ? true : false
            })
        }
        
    }

    getBaseData = async(currentpage,morePage = false) => {
        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/coupon/list/ing?page=' + currentpage + '&paginate='+DefaultPaginate;
            const token = this.props.userToken.apiToken;
            let sendData = null;
            returnCode = await apiObject.API_getPageList(this.props,url,token,sendData);
            if ( returnCode.code === '0000'  ) {
                if ( morePage ) {
                    this.moreDataUpdate(this.state.couponList,returnCode )
                }else{
                    this.setState({
                        moreLoading:false,loading:false,
                        totalCount : returnCode.total,
                        currentPage : returnCode.currentPage,
                        couponList : CommonUtil.isEmpty(returnCode.data.validCouponList) ? [] : returnCode.data.validCouponList,
                        ismore : parseInt(returnCode.currentPage)  < parseInt(returnCode.lastPage) ? true : false
                    })
                }
            }else{
                this.setState({moreLoading:false,loading:false})
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.',2000);
            }
        }catch(e){            
            this.setState({loading:false,moreLoading : false})
        }
    }

    getBaseDataOld = async(currentpage,morePage = false) => {

        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/coupon/list/old?page=' + currentpage + '&paginate='+DefaultPaginate;
            const token = this.props.userToken.apiToken;
            let sendData = null;
            returnCode = await apiObject.API_getPageList(this.props,url,token,sendData);
            if ( returnCode.code === '0000'  ) {
                if ( morePage ) {
                    this.moreDataUpdate(this.state.couponListOld,returnCode,'old' )
                }else{
                    this.setState({
                        moreLoading:false,loading:false,
                        currentPageOld : returnCode.currentPage,
                        totalCountOld : returnCode.total,
                        couponListOld : CommonUtil.isEmpty(returnCode.data.passCouponList) ? [] : returnCode.data.passCouponList,
                        ismoreOld : parseInt(returnCode.currentPage)  < parseInt(returnCode.lastPage) ? true : false
                    })
                }
            }else{
                this.setState({moreLoading:false,loading:false})
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.',2000);
            }            
        }catch(e){
            this.setState({loading:false,moreLoading : false})
        }
    }
    
    async UNSAFE_componentWillMount() {
        await this.getBaseData(1,false);
        await this.getBaseDataOld(1,false);
        this.props.navigation.addListener('focus', () => {  
            this.getBaseData(1);
            BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
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


    handleOnScroll (event) {             
        if ( event.nativeEvent.contentOffset.y >= 200 ) {
            //this.setState({showTopButton : true}) 
        }else{
            //this.setState({showTopButton : false}) 
        }

        let paddingToBottom = 1;
        paddingToBottom += event.nativeEvent.layoutMeasurement.height;                            
        if (event.nativeEvent.contentOffset.y + paddingToBottom >= event.nativeEvent.contentSize.height) {            
            //this.scrollEndReach();
        }
    }

    scrollEndReach = () => {       
       
    }
    refreshingData = async() => {
    }

    moveDetail = async(item,mode) => {
       
        if ( mode === 'A' ) {
            this.props.navigation.navigate('CouponModifyStack',{
                screenData:item
            })
        }else{
            this.props.navigation.navigate('CouponDetailStack',{
                screenData:item
            })
        }
    }

 
    addSchedule = () => {
        this.props.navigation.navigate('CouponRegistStack' );
    }

    removeNotuse = async (mode,bool) => {
        if ( mode === 'B') {
            this.setState({
                remove_unUse : !bool
            })
        }else{
            this.setState({
                remove_unUse2 : !bool
            })
        }
    }

    animatedHeight = new Animated.Value(SCREEN_HEIGHT * 0.2);
    
    closeModalInforation = () => {
        this.props._fn_ToggleCategory(false)
    };

    render() {
        if ( this.state.loading ) {
            return (
                <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} /> 
            )
        }else { 
            
        return(
            <SafeAreaView style={ styles.container }>                
                <TouchableOpacity style={styles.fixedUpButton} onPress={e => this.addSchedule()}>
                    <CustomTextL style={{color:'#fff',fontSize:PixelRatio.roundToNearestPixel(35)}}>+</CustomTextL>
                </TouchableOpacity>                
                <ScrollView
                    ref={(ref) => {
                        this.ScrollView = ref;
                    }}
                    showsVerticalScrollIndicator={false}
                    indicatorStyle={'white'}
                    scrollEventThrottle={16}
                    keyboardDismissMode={'on-drag'}
                    onScroll={e => this.handleOnScroll(e)}
                    onMomentumScrollEnd = {({nativeEvent}) => {                         
                    }}
                    onScrollEndDrag ={({nativeEvent}) => {                        
                    }}                        
                    style={{width:'100%'}}
                >
                    <View style={styles.boxWrap}>
                        <View style={styles.boxLeftWrap}>
                            <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)}}>미사용</CustomTextM>
                        </View>
                    </View> 
                    <View style={styles.boxWrap}>
                        <View style={styles.boxTitleWrap1}>
                            <CustomTextR style={CommonStyle.titleText}>유저명</CustomTextR>
                        </View>
                        <View style={styles.boxDataWrap2}>
                            <CustomTextR style={CommonStyle.titleText}>금액</CustomTextR>
                        </View>
                        <View style={styles.boxDataWrap3}>
                            <CustomTextR style={CommonStyle.titleText}>발급일자</CustomTextR>
                        </View>
                    </View>
                    {
                        this.state.couponList.length === 0 ? 
                        <View style={CommonStyle.emptyWrap} >
                            <CustomTextR style={CommonStyle.dataText}>발급된 쿠폰이 없습니다.</CustomTextR>
                        </View>
                        :
                        this.state.couponList.map((item, index) => {  
                            return (
                                <View key={index} style={{backgroundColor:'#fff'}}>
                                    <TouchableOpacity style={styles.boxSubWrap} onPress={()=>this.moveDetail(item,'A')}>
                                        <View style={styles.boxLeftWrap2}>
                                            <CustomTextR style={styles.titleText}>{item.member_name}</CustomTextR>
                                        </View>
                                        <View style={styles.boxRightWrap}>
                                            <CustomTextR style={styles.titleText}>{CommonFunction.currencyFormat(item.price)}</CustomTextR>
                                        </View>
                                        <View style={styles.boxRightWrap}>
                                            <CustomTextR style={styles.titleText}>{CommonFunction.convertUnixToDate(item.reg_dt,"YYYY.MM.DD")}</CustomTextR>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )
                        })
                    } 
                    {
                        this.state.ismore &&
                        <View style={CommonStyle.moreButtonWrap}>
                            <TouchableOpacity 
                                onPress={() => this.getBaseData(this.state.currentPage+1,true)}
                                style={CommonStyle.moreButton}
                            >
                            <CustomTextL style={CommonStyle.moreText}>더보기</CustomTextL>
                            </TouchableOpacity>
                        </View>
                    }

                    <View style={styles.boxWrap}>
                        <View style={styles.boxLeftWrap}>
                            <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)}}>사용 또는 과거 쿠폰</CustomTextM>
                        </View>
                    </View> 
             
                    <View style={styles.boxWrap}>
                        <View style={styles.boxTitleWrap1}>
                            <CustomTextR style={CommonStyle.titleText}>유저명</CustomTextR>
                        </View>
                        <View style={styles.boxDataWrap2}>
                            <CustomTextR style={CommonStyle.titleText}>금액</CustomTextR>
                        </View>
                        <View style={styles.boxDataWrap3}>
                            <CustomTextR style={CommonStyle.titleText}>사용일자</CustomTextR>
                        </View>
                    </View>
          
                    {
                        this.state.couponListOld.length === 0 ? 
                        <View style={styles.emptyWrap} >
                            <CustomTextR style={CommonStyle.dataText}>사용된 쿠폰이 없습니다.</CustomTextR>
                        </View>
                        :
                        this.state.couponListOld.map((item, index) => {  
                            return (
                                <View key={index} style={{backgroundColor:'#fff'}}>
                                    <TouchableOpacity style={styles.boxSubWrap} onPress={()=>this.moveDetail(item,'B')}>
                                        <View style={styles.boxLeftWrap2}>
                                            <CustomTextR style={styles.titleText}>{item.member_name}</CustomTextR>
                                        </View>
                                        <View style={styles.boxRightWrap}>
                                            <CustomTextR style={styles.titleText}>{CommonFunction.currencyFormat(item.price)}</CustomTextR>
                                        </View>
                                        <View style={styles.boxRightWrap}>
                                            <CustomTextR style={styles.titleText}>{CommonFunction.convertUnixToDate(item.reg_dt,"YYYY.MM.DD")}</CustomTextR>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )
                        })
                    } 
                    {
                        this.state.ismoreOld &&
                        <View style={CommonStyle.moreButtonWrap}>
                            <TouchableOpacity 
                                onPress={() => this.getBaseDataOld(this.state.currentPageOld+1,true)}
                                style={CommonStyle.moreButton}
                            >
                            <CustomTextL style={CommonStyle.moreText}>더보기</CustomTextL>
                            </TouchableOpacity>
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
        backgroundColor : "#fff"
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    fixedUpButton : {
        position:'absolute',bottom:80,right:20,width:50,height:50,backgroundColor:DEFAULT_COLOR.base_color,borderColor:'#ccc',borderWidth:1,borderRadius:25,alignItems:'center',justifyContent:'center',zIndex:10
    },
    emptyWrap : {
        flex:1,justifyContent:'center',alignItems:'center',paddingVertical:20,backgroundColor:'#fff',
    },
    boxWrap : {
        flex:1,
        flexDirection:'row',    
        flexGrow:1,    
        paddingHorizontal:20,
        paddingVertical:10,
        backgroundColor:'#f5f6f8',
        borderBottomWidth:1,
        borderBottomColor : DEFAULT_COLOR.input_border_color
    },
    boxSubWrap : {
        flex:1,
        flexDirection:'row',    
        flexGrow:1,    
        paddingHorizontal:20,paddingVertical: Platform.OS === 'android' ? 5 : 15,
        alignItems: 'center',        
        borderBottomWidth:1,
        borderBottomColor : DEFAULT_COLOR.input_border_color
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
        alignItems:'center'
    },
    boxLeftWrap2 : {
        flex:1,
        justifyContent:'center',
        alignItems:'flex-start'
    },
    boxRightWrap2 : {
        flex:2,        
        flexDirection:'row',
        justifyContent:'flex-end',
        alignItems:'center'
    },
    menuTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),paddingRight:10
    },
    menuRemoveText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#777'
    },
    boxTitleWrap1 : {
        flex:1,flexDirection:'row',paddingLeft:20
    },
    boxDataWrap1 : {
        flex:1,justifyContent:'center',alignItems:'flex-start',paddingLeft:20
    },
    boxDataWrap2 : {
        flex:1,flexDirection:'row',flexGrow:1,justifyContent:'center',paddingRight:20,alignItems:'center'
    },
    boxDataWrap3 : {
        flex:1,justifyContent:'flex-end',paddingRight:30,alignItems:'flex-end'
    },
    dataText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#545454'
    },
    dataText3 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),color:'#7f7f7f'
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
export default connect(mapStateToProps,mapDispatchToProps)(CouponListScreen);
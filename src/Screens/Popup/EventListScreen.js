import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Text,Dimensions,RefreshControl, PixelRatio,TouchableOpacity, Platform,Animated,BackHandler} from 'react-native';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import Image from 'react-native-image-progress';
import Progress from 'react-native-progress/Bar';
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


const DefaultPaginate = 5;
class EventListScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : true,
            moreLoading : false,
            totalCount : 0,
            totalCountOld : 0,
            noticeList : [],
            ismore :  false,
            currentPage : 1,
            noticeListOld : [],
            ismoreOld :  false,
            currentPageOld : 1,
           
        }
    }

    moreDataUpdate = async( baseData , addData , gubun = null) => {     
        if ( gubun === null ) {
            let newArray = await baseData.concat(addData.data.nowPopupEventList);  
            this.setState({            
                moreLoading : false,
                loading : false,
                noticeList : newArray,
                ismore : parseInt(this.state.currentPage) < parseInt(addData.lastPage) ? true : false
            })
        }else{
            let newArray = await baseData.concat(addData.data.stopPopupEventList);  
            this.setState({            
                moreLoading : false,
                loading : false,
                noticeListOld : newArray,
                ismoreOld : parseInt(this.state.currentPage) < parseInt(addData.lastPage) ? true : false
            })
        }
        
    }

    getBaseData = async(currentpage,morePage = false) => {
        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/popevent/list/now?page=' + currentpage + '&paginate='+DefaultPaginate;
            const token = this.props.userToken.apiToken;
            let sendData = null;
            returnCode = await apiObject.API_getPageList(this.props,url,token,sendData);
            if ( returnCode.code === '0000'  ) {
                this.setState({currentPage : returnCode.currentPage})
                if ( morePage ) {
                    this.moreDataUpdate(this.state.noticeList,returnCode )
                }else{
                    this.setState({
                        totalCount : returnCode.total,
                        noticeList : CommonUtil.isEmpty(returnCode.data.nowPopupEventList) ? [] : returnCode.data.nowPopupEventList,
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

    getBaseDataOld = async(currentpage,morePage = false) => {
        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/popevent/list/stop?page=' + currentpage + '&paginate='+DefaultPaginate;
            const token = this.props.userToken.apiToken;
            let sendData = null;
            returnCode = await apiObject.API_getPageList(this.props,url,token,sendData);
            if ( returnCode.code === '0000'  ) {
                this.setState({currentPage : returnCode.currentPage})
                if ( morePage ) {
                    this.moreDataUpdate(this.state.noticeListOld,returnCode ,'old')
                }else{
                    this.setState({
                        totalCountOld : returnCode.total,
                        noticeListOld : CommonUtil.isEmpty(returnCode.data.stopPopupEventList) ? [] : returnCode.data.stopPopupEventList,
                        ismoreOld : parseInt(this.state.currentPage)  < parseInt(returnCode.lastPage) ? true : false
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
        await this.getBaseData(1,false);
        await this.getBaseDataOld(1,false);

        this.props.navigation.addListener('focus', () => {  
            this.getBaseData(1,false);
            this.getBaseDataOld(1,false);
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
            this.props.navigation.navigate('PopEventModifyStack',{
                screenData:item
            })
        }else{
            this.props.navigation.navigate('PopupEventDetailStack',{
                screenData:item
            })
        }
    }

    addSchedule = () => {        
        this.props.navigation.navigate('PopEventRegistStack');
    }

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
                        <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)}}>
                            현재/대기({CommonFunction.currencyFormat(this.state.totalCount)})
                        </CustomTextM>
                    </View> 
                    {
                        this.state.noticeList.length === 0 ? 
                        <View style={CommonStyle.emptyWrap} >
                            <CustomTextR style={CommonStyle.dataText}>진행중인 팝업이벤트가 없습니다.</CustomTextR>
                        </View>
                        :
                        this.state.noticeList.map((item, index) => {  
                            return (
                                <View key={index} style={styles.itemWrap}>
                                    <TouchableOpacity style={styles.boxSubWrap} onPress={()=>this.moveDetail(item,'A')}>
                                        <View style={styles.boxLeftWrap}>
                                            { 
                                                !CommonUtil.isEmpty(item.img_url) ?
                                                <Image
                                                    source={{uri:DEFAULT_CONSTANTS.defaultImageDomain + item.img_url}}
                                                    resizeMode={"contain"}
                                                    style={CommonStyle.defaultImage97}
                                                />
                                                :
                                                <Image
                                                    source={require('../../../assets/icons/no_image.png')}
                                                    resizeMode={"contain"}
                                                    style={CommonStyle.defaultImage97}
                                                />
                                            }
                                        </View>
                                        <View style={styles.boxRightWrap}>
                                            <CustomTextR numberOfLines={2} ellipsizeMode={'tail'}style={CommonStyle.titleText}>
                                                {item.title}
                                            </CustomTextR>
                                            <CustomTextR></CustomTextR>
                                            <CustomTextR numberOfLines={2} ellipsizeMode={'tail'} style={CommonStyle.dataText}>
                                                공개일 : {CommonFunction.convertUnixToDate(item.start_dt,"YYYY.MM.DD HH:mm")}
                                            </CustomTextR>
                                            <CustomTextR numberOfLines={2} ellipsizeMode={'tail'} style={CommonStyle.dataText}>
                                               팝업형태 : {item.popup_type === 'Layer' ? '레이어' : '전면'}
                                            </CustomTextR>
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
                        <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)}}>
                            지난({CommonFunction.currencyFormat(this.state.totalCountOld)})
                        </CustomTextM>
                    </View> 
                    {
                        this.state.noticeListOld.length === 0 ? 
                        <View style={CommonStyle.emptyWrap} >
                            <CustomTextR style={CommonStyle.dataText}>만료된 팝업이벤트가 없습니다.</CustomTextR>
                        </View>
                        :
                        this.state.noticeListOld.map((item, index) => {  
                            return (
                                <View key={index} style={styles.itemWrap}>
                                    <TouchableOpacity style={styles.boxSubWrap} onPress={()=>this.moveDetail(item,'B')}>
                                        <View style={styles.boxLeftWrap}>
                                            { 
                                                !CommonUtil.isEmpty(item.img_url) ?
                                                <Image
                                                    source={{uri:DEFAULT_CONSTANTS.defaultImageDomain + item.img_url}}
                                                    resizeMode={"contain"}
                                                    style={CommonStyle.defaultImage97}
                                                    indicator={Progress.Pie}
                                                    indicatorProps={{size: 80,borderWidth: 0,color: DEFAULT_COLOR.base_color,unfilledColor:'#fff'}}
                                                />
                                                :
                                                <Image
                                                    source={require('../../../assets/icons/no_image.png')}
                                                    resizeMode={"contain"}
                                                    style={CommonStyle.defaultImage97}
                                                />
                                            }
                                        </View>
                                        <View style={styles.boxRightWrap}>
                                            <CustomTextR numberOfLines={2} ellipsizeMode={'tail'}style={CommonStyle.titleText}>
                                                {item.title}
                                            </CustomTextR>
                                            <CustomTextR></CustomTextR>
                                            <CustomTextR numberOfLines={2} ellipsizeMode={'tail'} style={CommonStyle.dataText}>
                                                공개일 : {CommonFunction.convertUnixToDate(item.start_dt,"YYYY.MM.DD HH:mm")}
                                            </CustomTextR>
                                            <CustomTextR numberOfLines={2} ellipsizeMode={'tail'} style={CommonStyle.dataText}>
                                               팝업형태 : {item.popup_type === 'Layer' ? '레이어' : '전면'}
                                            </CustomTextR>
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
        paddingRight:10,paddingVertical: Platform.OS === 'android' ? 10 : 15,
        borderBottomWidth:1,
        borderBottomColor : DEFAULT_COLOR.input_border_color
    },
    repeatWrap : {
        backgroundColor:'#fff',paddingRight:10
    },
    boxLeftWrap : {
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    boxRightWrap : {
        flex:2,        
        alignItems:'flex-start',
        minHeight:100
    },
    itemWrap : {
        backgroundColor:'#fff',paddingHorizontal:10
    },
    menuTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),paddingRight:10
    },
    menuTitleText2 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),paddingRight:10
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
    };
}
function mapDispatchToProps(dispatch) {
    return {                
        _saveUserToken:(str)=> {
            dispatch(ActionCreator.saveUserToken(str))
        }
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(EventListScreen);
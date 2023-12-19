import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Text,Dimensions,RefreshControl, PixelRatio,Image,TouchableOpacity, Platform,Animated,BackHandler} from 'react-native';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import 'moment/locale/ko'
import  moment  from  "moment";
import {CheckBox} from 'react-native-elements';
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
const RADIOON_OFF = require('../../../assets/icons/checkbox_off.png');
const RADIOON_ON = require('../../../assets/icons/checkbox_on.png');
const DefaultPaginate = 5;
class CouponListScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : false,
            togglecategory : this.props.togglecategory,
            showOlder :false,
            eventList : [],
            ismore :  false,
            totalCount : 0,
            eventOldList : [],
            currentpage : 1,
            
        }
    }

    moreDataUpdateOld = async( baseData , addData) => {     
        let newArray = await baseData.concat(addData.data.eventList);  
        this.setState({            
            moreLoading : false,
            loading : false,
            showOlder : true,
            eventOldList : newArray,
            ismore : parseInt(this.state.currentPage) < parseInt(addData.lastPage) ? true : false
        })
    }

    getBaseDataOld = async(currentpage,morePage = false) => {

        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/event/list/stop?paginate=' + DefaultPaginate + '&page=' + currentpage;
            const token = this.props.userToken.apiToken;
            let sendData = null;
            returnCode = await apiObject.API_getPageList(this.props,url,token,sendData);          
            console.log('returnCode',returnCode.data)   
            this.setState({currentPage : returnCode.currentPage})
            if ( returnCode.code === '0000'  ) {
                if ( morePage ) {
                    this.moreDataUpdateOld(this.state.eventOldList,returnCode )
                }else{
                    this.setState({
                        showOlder : true,
                        totalCount : returnCode.total,
                        eventOldList : returnCode.data.eventList,
                        ismore : parseInt(this.state.currentPage)  < parseInt(returnCode.lastPage) ? true : false
                    })
                }
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니2다.',2000);
                this.setState({moreLoading:false,loading:false})
            }
            
        }catch(e){
            //console.log('e',e) 
            this.setState({loading:false,moreLoading : false})
        }
    }

    getBaseData = async() => {

        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/event/list/now?page=1&paginame=100';
            const token = this.props.userToken.apiToken;
            let sendData = null;
            returnCode = await apiObject.API_getPageList(this.props,url,token,sendData);          
            //console.log('returnCode',returnCode.data.categoryBrandList)   
            if ( returnCode.code === '0000'  ) {
                this.setState({
                    eventList : returnCode.data.eventList
                })
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.',2000);
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

    moveDetail = async(mode,item) => {
        //console.log('item',item.use_yn)
        if ( mode === 'A') {
            this.props.navigation.navigate('EventModifyStack',{
                screenData:item
            })
        }else{
            this.props.navigation.navigate('EventDetailStack',{
                screenData:item
            })
        }
    }

    showOldEvent = async(bool) => {
        if ( bool && this.state.eventOldList.length === 0 ) {
            await this.getBaseDataOld(1,false);
        }else if ( bool && this.state.eventOldList.length > 0 ) {
            this.setState({showOlder:bool})
        }else {
            this.setState({showOlder:bool})
        }
    }
 
    addSchedule = () => {
        this.props.navigation.navigate('EventRegistStack' );
    }


    animatedHeight = new Animated.Value(SCREEN_HEIGHT * 0.2);
    
    renderTitle = (item) => {
        let marker = ""; 
        switch(item.event_gubun) {
            case 'LIMIT' : marker = <CustomTextL style={{color:DEFAULT_COLOR.base_color}}>■</CustomTextL>;break;
            case 'TERM' : marker = <CustomTextL style={{color:'#CC0000'}}>■</CustomTextL>;break;
            case 'EVENT' : marker = <CustomTextL style={{color:'#006633'}}>■</CustomTextL>;break;
            default : marker = <CustomTextL style={{color:'#006633'}}>■</CustomTextL>;break;
        }
        return (
            <CustomTextR style={styles.titleText} numberOfLines={1} ellipsizeMode={'tail'}>
                {marker} {item.title}
            </CustomTextR>
        ); 
    }
    render() {
        if ( this.state.loading ) {
            return (
                <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} /> 
            )
        }else { 
            
        const aliveDate =  moment().unix();
        //console.log('aliveDate',aliveDate)
        let eventPresentList = this.state.eventList.filter((info) => (CommonUtil.isEmpty(info.end_dt) || info.end_dt >= aliveDate) );
        let eventPassList = this.state.eventList.filter((info) => (!CommonUtil.isEmpty(info.end_dt && info.end_dt < aliveDate))) ;
        return(
            <SafeAreaView style={ styles.container }>
                
                <TouchableOpacity 
                    style={styles.fixedUpButton}
                    onPress={e => this.addSchedule()}
                >
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
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.loading}
                            onRefresh={this.refreshingData}
                        />
                    }
                    onScrollEndDrag ={({nativeEvent}) => { 
                        
                    }}                        
                    style={{width:'100%'}}
                    
                >
                    <View style={[styles.boxWrap,{backgroundColor:'#fff'}]}>
                        <View style={styles.boxLeftWrap2}>
                            <View style={styles.titleRightWrap}>
                            <CustomTextL style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13)}}>
                                범례   <CustomTextL style={{color:DEFAULT_COLOR.base_color}}>■한정특가 </CustomTextL><CustomTextL style={{color:'#CC0000'}}>■기간할인 </CustomTextL><CustomTextL style={{color:'#006633'}}>■할인이벤트</CustomTextL>
                            </CustomTextL>
                            </View>
                        </View>
                        
                    </View> 
                    <View style={styles.boxWrap}>
                        <View style={[styles.boxLeftWrap2,{flexDirection:'row'}]}>
                            <View style={styles.CheckBoxWrap2}>
                                <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)}}>진행중 이벤트</CustomTextM>
                            </View>

                            <View style={styles.CheckBoxWrap}>
                                <CheckBox 
                                    containerStyle={{padding:0,margin:0}}   
                                    iconType={'FontAwesome'}
                                    checkedIcon={<Image source={RADIOON_ON} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                    uncheckedIcon={<Image source={RADIOON_OFF} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                    checkedColor={DEFAULT_COLOR.base_color}                          
                                    checked={this.state.showOlder}
                                    size={PixelRatio.roundToNearestPixel(15)}                                    
                                    onPress={() => this.showOldEvent(!this.state.showOlder)}
                                />
                                <TouchableOpacity 
                                    onPress={() => this.showOldEvent(!this.state.showOlder)}
                                    style={[styles.detailRightWrap,{flex:3}]}
                                >
                                    <CustomTextR style={styles.menuTitleText}>지난이벤트보기</CustomTextR>    
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View> 
                    <View style={styles.boxWrap}>
                        <View style={styles.boxTitleWrap1}>
                            <CustomTextR style={CommonStyle.titleText}>제목</CustomTextR>
                        </View>
                        <View style={styles.boxDataWrap2}>
                            <CustomTextR style={CommonStyle.titleText}>시작일시</CustomTextR>
                        </View>
                    </View>
                    {
                        this.state.eventList.length === 0 ? 
                        <View style={CommonStyle.emptyWrap} >
                            <CustomTextR style={CommonStyle.dataText}>진행중인 이벤트가 없습니다.</CustomTextR>
                        </View>
                        :
                        this.state.eventList.map((item, index) => {  
                            return (
                                <View key={index} style={{backgroundColor:'#fff'}}>
                                    <TouchableOpacity style={styles.boxSubWrap} onPress={()=>this.moveDetail('A',item)}>
                                        <View style={styles.boxLeftWrap}>
                                            {this.renderTitle(item)}
                                        </View>
                                        <View style={styles.boxRightWrap}>
                                            <CustomTextR style={styles.titleText}>{CommonFunction.convertUnixToDate(item.start_dt,"YYYY.MM.DD hh:mm")}</CustomTextR>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )
                        })
                    } 
                    {this.state.showOlder && 
                    <View>
                        <View style={styles.boxWrap}>
                            <View style={styles.boxLeftWrap2}>
                                <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)}}>지난</CustomTextM>
                            </View>
                        </View> 
                        {
                        this.state.eventOldList.length === 0 ? 
                        <View style={CommonStyle.emptyWrap} >
                            <CustomTextR style={CommonStyle.dataText}>지난 이벤트가 없습니다.</CustomTextR>
                        </View>
                        :
                            this.state.eventOldList.map((item, index) => {  
                            return (
                                <View key={index} style={{backgroundColor:'#fff'}}>
                                    <TouchableOpacity style={styles.boxSubWrap} onPress={()=>this.moveDetail('B',item)}>
                                        <View style={styles.boxLeftWrap}>
                                            {this.renderTitle(item)}
                                        </View>
                                        <View style={styles.boxRightWrap}>
                                            <CustomTextR style={styles.titleText}>{CommonFunction.convertUnixToDate(item.start_dt,"YYYY.MM.DD hh:mm")}</CustomTextR>
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
                                    onPress={() => this.getBaseDataOld(this.state.currentPage+1,true)}
                                    style={CommonStyle.moreButton}
                                >
                                <CustomTextL style={CommonStyle.moreText}>더보기</CustomTextL>
                                </TouchableOpacity>
                            </View>
                        }
                    </View>
                    }
                    <View style={[CommonStyle.blankArea,{backgroundColor : "#f5f6f8"}]}></View>
                </ScrollView>               
            </SafeAreaView>
        );
        }
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor : "#f5f6f8"
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
    titleLeftWrap : {
        flex:1,
        justifyContent:'center'
    },
    titleRightWrap : {
        flex:4,       
        alignItems:'center', 
        justifyContent:'flex-end',
        flexDirection:'row',
        flexGrow:1,
        
    },
    boxLeftWrap : {
        flex:2,
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center'
    },
    boxRightWrap : {
        flex:1,        
        justifyContent:'center',
        alignItems:'center',
    },
    boxLeftWrap2 : {
        flex:1,
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center'
    },
    boxRightWrap2 : {
        flex:2,        
        flexDirection:'row',
        justifyContent:'flex-end',
        alignItems:'center'
    },
    CheckBoxWrap2 : {
        flex:1.5,flexDirection:'row',alignItems:'center',
    },
    CheckBoxWrap : {
        flex:1,flexDirection:'row',alignItems:'center',justifyContent:'flex-end'
    },
    menuTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#888'
    },
    menuRemoveText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#777'
    },
    boxTitleWrap1 : {
        flex:2,flexDirection:'row'
    },
    boxDataWrap1 : {
        flex:1,justifyContent:'center',alignItems:'flex-start',paddingLeft:20
    },
    boxDataWrap2 : {
        flex:1,justifyContent:'center',paddingRight:20,alignItems:'center'
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

export default connect(mapStateToProps,null)(CouponListScreen);
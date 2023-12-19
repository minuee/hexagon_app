import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Image as NativeImage,Dimensions,RefreshControl, PixelRatio,TouchableOpacity, Platform,BackHandler,Alert} from 'react-native';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import Image from 'react-native-image-progress';
//공통상수 필요에 의해서 사용
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import CommonStyle from '../../Style/CommonStyle';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {CustomTextR,CustomTextL, CustomTextB, CustomTextM, TextRobotoM,TextRobotoR, TextRobotoL} from '../../Components/CustomText';
import CommonFunction from '../../Utils/CommonFunction';
import CommonUtil from '../../Utils/CommonUtil';
import Loader from '../../Utils/Loader';
import { apiObject } from "../Apis";

const DefaultPaginate = 10;

class NoticeListScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : true,
            moreLoading : false,
            totalCount : 0,
            noticeList : [],
            ismore :  false,
            currentPage : 1,
        }
    }

    moreDataUpdate = async( baseData , addData) => {     
        let newArray = await baseData.concat(addData.data.noticeList);
        /*
        await addData.data.forEach(function(element,index,array){                                
            baseData.push(element);
        }); 
        */   
        this.setState({            
            moreLoading : false,
            loading : false,
            noticeList : newArray,
            ismore : parseInt(this.state.currentPage) < parseInt(addData.lastPage) ? true : false
        })
    }

    getBaseData = async(currentpage,morePage = false) => {
        this.setState({moreLoading : true})
        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/notice/list?page=' + currentpage + '&paginate='+DefaultPaginate;
            const token = this.props.userToken.apiToken;
            let sendData = null;
            returnCode = await apiObject.API_getPageList(this.props,url,token,sendData);          
            //console.log('returnCode',returnCode) ;
            //console.log('this.state.currentPage',this.state.currentPage) 
            if ( returnCode.code === '0000'  ) {
                this.setState({currentPage : returnCode.currentPage})
                if ( morePage ) {
                    this.moreDataUpdate(this.state.noticeList,returnCode )
                }else{
                    this.setState({
                        totalCount : returnCode.total,
                        noticeList : CommonUtil.isEmpty(returnCode.data.noticeList) ? [] : returnCode.data.noticeList,
                        ismore : parseInt(this.state.currentPage)  < parseInt(returnCode.lastPage) ? true : false
                    })
                }
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.',2000);
            }

            this.setState({moreLoading:false,loading:false})
        }catch(e){
            //console.log('e',e) 
            this.setState({loading:false,moreLoading : false})
        }
    }

    async UNSAFE_componentWillMount() {
        await this.getBaseData(1,false);
        this.props.navigation.addListener('focus', () => {  
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

    moveDetail = (item) => {
        //console.log('item',item)   
        this.props.navigation.navigate('NoticeDetailStack',{
            screenData:item
        })
    }

    moveCategory = () => {
        this.props.navigation.navigate('CategoryListModifyStack')
    }

    addSchedule = () => {
        //CommonFunction.fn_call_toast('준비중입니다.',2000);
        this.props.navigation.navigate('NoticeRegistStack');
    }

    sendPush = (item) => {
        console.log('item',item)   
        Alert.alert(
            DEFAULT_CONSTANTS.appName,
            "`"+item.title +"` 공지사항을 알림발송하시겠습니까?",
            [
                {text: '네', onPress: () =>  this.sendPushAction(item)},
                {text: '아니오', onPress: () => console.log('Cancle')},
                
            ],
            { cancelable: true }
        )  
    }

    sendPushAction = async(item) => {

        this.setState({moreLoading:true})
        let returnCode = {code:9998};     
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/pushsend';
            const token = this.props.userToken.apiToken;
            let sendData = {
                title : item.title,
                comment : CommonFunction.strip_tags(item.content),
                routeName : 'NoticeDetailStack',
                routeIdx : item.notice_pk,
                img_url : !CommonUtil.isEmpty(item.img_url) ? DEFAULT_CONSTANTS.defaultImageDomain+item.img_url : ''
            }
            //console.log('sendData',sendData)  
            returnCode = await apiObject.API_registCommon(this.props,url,token,sendData);          
            //console.log('returnCode',returnCode)   
            if ( returnCode.code === '0000'  ) {
                CommonFunction.fn_call_toast('정상적으로 발송되었습니다.' ,2000);
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.\n[ERR]' + returnCode.msg ,2000);
            }
            this.setState({moreLoading:false,loading:false})
        }catch(e){
            //console.log('ㄸㄸㄷ',e)  
            this.setState({loading:false,moreLoading : false})
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
                    <View style={styles.boxWrap}>
                        <View style={styles.boxTitleLeftWrap}>
                            <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)}}>공지사항 목록</CustomTextM>
                        </View>
                        <View style={styles.boxTitleRightWrap}>
                            <TextRobotoL style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13)}}>
                                전체 : {CommonFunction.currencyFormat(this.state.totalCount)}건
                            </TextRobotoL>
                        </View>
                    </View> 
                    {
                        this.state.noticeList.map((item, index) => {  
                            return (
                                <View key={index} style={{backgroundColor:'#fff'}}>
                                    <TouchableOpacity style={styles.boxSubWrap} onPress={()=>this.moveDetail(item)}>
                                        <View style={styles.boxLeftWrap}>
                                            { !CommonUtil.isEmpty(item.img_url) ?
                                                <Image
                                                    source={{uri:DEFAULT_CONSTANTS.defaultImageDomain+item.img_url}}
                                                    resizeMode={"contain"}
                                                    style={CommonStyle.defaultIconImage55}
                                                />
                                                :
                                                <NativeImage
                                                    source={require('../../../assets/icons/no_image.png')}
                                                    resizeMode={"contain"}
                                                    style={CommonStyle.defaultIconImage55}
                                                />
                                            }
                                           
                                        </View>
                                        <View style={styles.boxRightWrap}>
                                            <CustomTextR style={CommonStyle.titleText}>{item.title}</CustomTextR>
                                            <CustomTextR style={CommonStyle.dataText}>
                                                {CommonFunction.convertUnixToDate(item.start_dt,"YYYY.MM.DD HH:mm")}
                                            </CustomTextR>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        onPress={()=>this.sendPush(item)}
                                        style={styles.pushBottonWrap}
                                    >
                                        <CustomTextR style={styles.pushText}>알림발송</CustomTextR>
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
                    <View style={CommonStyle.blankArea}></View>
                    { this.state.moreLoading &&
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
        paddingHorizontal:20,
        paddingVertical:10,
        backgroundColor:'#f5f6f8',
        borderBottomWidth:1,
        borderBottomColor : DEFAULT_COLOR.input_border_color
    },
    pushText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11),color:'#fff'
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
        flex:1,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    boxRightWrap : {
        flex:5,        
        justifyContent:'center',
        paddingLeft:10
    },
    pushBottonWrap : {
        position :'absolute',right:10,bottom:10,padding:5,backgroundColor:'#888',alignItems:'center',zIndex:5
    },
    boxTitleLeftWrap : {
        flex:1,
    },
    boxTitleRightWrap : {
        flex:1,
        justifyContent:'flex-end',
        alignItems:'flex-end',
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

export default connect(mapStateToProps,mapDispatchToProps)(NoticeListScreen);
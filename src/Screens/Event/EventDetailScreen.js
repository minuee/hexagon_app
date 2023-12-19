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

class EventDetailScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading : false,
            even_pk : 0,
            eventDetail : {},
            productArray : []
        }
    }

    getBaseData = async(even_pk) => {
        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/event/view/'+even_pk;
            const token = this.props.userToken.apiToken;
            returnCode = await apiObject.API_getDetailDefault(this.props,url,token);          
            //console.log('returnCode',returnCode.data)   
            if ( returnCode.code === '0000'  ) {
                this.setState({
                    eventDetail : CommonUtil.isEmpty(returnCode.data.eventDetail) ? [] : returnCode.data.eventDetail,
                    productArray : CommonUtil.isEmpty(returnCode.data.eventDetail.product_array) ? [] : returnCode.data.eventDetail.product_array,
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
            //console.log('e',e)   
            this.setState({loading:false,moreLoading : false})
        }
    }

    async UNSAFE_componentWillMount() {
        
        //console.log('RewardDetailScreen',this.props.extraData.params.screenData)
        if ( !CommonUtil.isEmpty(this.props.extraData.params.screenData)) {
            await this.getBaseData(this.props.extraData.params.screenData.event_pk);
            this.setState({
                even_pk : this.props.extraData.params.screenData.even_pk
            })
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

    fn_onChangeToggle = (bool) => {
        this.setState({switchOn1 : bool})
    }

    updateNotice = () => {
        this.props._fn_ToggleNoticeDetail(false)
        this.props.navigation.navigate('NoticeModifyStack',{
            screenData:this.state.noticeData
        })
    }

    deleteNotice = (mode) => {
        Alert.alert(
            "공지사항 삭제",      
            "정말로 삭제하시겠습니까?",
            [
                {text: 'OK', onPress: () => this.removeNotice()},
                {text: 'CANCEL', onPress: () => console.log('Cancle')},
                
            ],
            { cancelable: true }
        )  
    }

    removeNotice = async() => {
        this.setState({moreLoading:true})
        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/notice/remove/'+this.state.notice_pk;
            const token = this.props.userToken.apiToken;
            let sendData = null;                
            returnCode = await apiObject.API_removeCommon(this.props,url,token,sendData);          
            //console.log('returnCode',returnCode)   
            if ( returnCode.code === '0000'  ) {
                this.props._fn_ToggleNoticeDetail(false)
                CommonFunction.fn_call_toast('삭제되었습니다.',1500);
                setTimeout(
                    () => {            
                        this.props.navigation.goBack(null);
                    },1500
                )
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.\n[ERR]' + returnCode.msg ,2000);
            }
            this.setState({moreLoading:false,loading:false})
        }catch(e){
            //console.log('errrr',e)   
            this.setState({loading:false,moreLoading : false})
        }
    }

    animatedHeight = new Animated.Value(SCREEN_HEIGHT * 0.2);
    
    closeModalInforation = () => {
        this.props._fn_ToggleNoticeDetail(false)
    };

    renderEventGubun = (data) => {
        switch(data.event_gubun) {
            case 'TERM' : return '기간할인이벤트';break;
            case 'LIMIT' : return '한정특가';break;
            case 'SALE' : return '할인이벤트';break;
            default : return '할인이벤트';break;
        }
    }

    moveDetail = (item) => {
        this.props.navigation.navigate('ProductDetailStack',{
            screenData:item
        })
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
                        <View style={styles.boxWrap}>
                            <CustomTextR style={styles.menuTitleText2}>이벤트 제목 : {this.state.eventDetail.title}</CustomTextR>
                        </View>
                    </View>
                    <View style={styles.defaultWrap}>
                        <View style={styles.boxWrap}>
                            <CustomTextR style={styles.menuTitleText2}>이벤트 분류 : {this.renderEventGubun(this.state.eventDetail)}</CustomTextR>
                        </View>
                    </View>
                    <View style={styles.defaultWrap}>
                        <View style={styles.boxWrap}>
                            <CustomTextR style={styles.menuTitleText2}>이벤트기간 :  {CommonFunction.convertUnixToDate(this.state.eventDetail.start_dt,"YYYY.MM.DD HH:mm")} ~ {CommonFunction.convertUnixToDate(this.state.eventDetail.end_dt,"YYYY.MM.DD HH:mm")}</CustomTextR>
                        </View>
                    </View>
                    <View style={[styles.defaultWrap,{backgroundColor:'#e6e6e6'}]}>
                        <View style={styles.boxWrap}>
                            <CustomTextR style={styles.menuTitleText2}>이벤트 상품</CustomTextR>
                        </View>
                    </View>
                    { this.state.productArray.length === 0  ?
                        <View style={{padding:15}}>
                            <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:DEFAULT_COLOR.base_color_666}}>
                                이벤트 상품이 없습니다.
                            </CustomTextR>
                        </View> 
                    :
                    <View style={styles.defaultWrap}>
                        {
                            this.state.productArray.map((item, index) => {  
                                return (
                                    <TouchableOpacity 
                                        key={index} 
                                        style={styles.boxSubWrap}
                                        onPress={()=>this.moveDetail(item)}>
                                        <View style={styles.boxLeftWrap}>
                                            { !CommonUtil.isEmpty(item.thumb_img) ?
                                                <Image
                                                    source={{uri:DEFAULT_CONSTANTS.defaultImageDomain+item.thumb_img}}
                                                    resizeMode={"cover"}
                                                    style={CommonStyle.defaultIconImage60}
                                                />
                                                :
                                                <Image
                                                    source={require('../../../assets/icons/no_image.png')}
                                                    resizeMode={"contain"}
                                                    style={CommonStyle.defaultIconImage60}
                                                />
                                            }  
                                           
                                        </View>
                                        <View style={styles.boxRightWrap}>
                                            <CustomTextR style={styles.inputText}>{item.product_name}</CustomTextR>
                                            <CustomTextR style={styles.inputText}>{CommonFunction.currencyFormat(item.event_each_price)}원</CustomTextR>
                                        </View>
                                        { this.state.eventDetail.event_gubun === 'LIMIT' &&
                                        <View style={styles.boxStockWrap}>
                                            <TextRobotoR style={styles.inputText}>{CommonFunction.currencyFormat(item.stock)}개</TextRobotoR>
                                        </View>
                                        }
                                    </TouchableOpacity>
                                )
                            })
                        } 
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
    termText4 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),paddingRight:10,color:'#343434'
    },
    ballStyle : {
        width: 28,height: 28,borderRadius: 14,backgroundColor:'#fff',
        
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
        alignItems:'center',
        paddingLeft:20
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
export default connect(mapStateToProps,mapDispatchToProps)(EventDetailScreen);
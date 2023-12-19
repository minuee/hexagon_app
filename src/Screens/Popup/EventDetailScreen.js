import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Text,Dimensions,PixelRatio,TouchableOpacity,Image as NativeImage,Alert} from 'react-native';
import 'moment/locale/ko'
import  moment  from  "moment";
import Modal from 'react-native-modal';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
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

class EventDetailScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading : true,
            switchOn1 : true,
            popData : {},
            formEventGoods : [
                { id: 1, icon : require('../../../assets/images/sample001.png'),product_name : '아릭스 수세미 1',each_price : 1000, pcode  : 2},
                { id: 2, icon : require('../../../assets/images/sample001.png'),product_name : '아릭스 수세미 2',each_price : 1200, pcode  : 2},
            ]
        }
    }

    UNSAFE_componentWillMount() {
        if ( !CommonUtil.isEmpty(this.props.extraData.params.screenData)) {
            this.setState({
                popData : this.props.extraData.params.screenData
            })
        }
        this.props.navigation.addListener('focus', (payload) => {            
            this.props._fn_ToggleNoticeDetail(false)
        })
        this.props.navigation.addListener('blur', (payload) => {            
            ////console.log('blurblurblurblur')
        })
    }

    componentDidMount() {        
        setTimeout(
            () => {            
                this.setState({loading:false})
            },500
        )
    }
    componentWillUnmount(){        
    }

    rePosting = () => {        
        CommonFunction.fn_call_toast('준비중입니다.',1500);
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
                        <View style={styles.titleWrap}>
                            <View style={styles.boxWrap}>
                                <CustomTextR style={CommonStyle.titleText}>{this.state.popData.title}</CustomTextR>
                            </View>
                            <View style={styles.boxWrap}>
                                <CustomTextR style={CommonStyle.dataText}>{this.state.popData.popup_type === 'Layer' ? '레이어' : '전면'} 팝업창</CustomTextR>
                            </View>
                            <View style={styles.boxWrap}>
                                <CustomTextR style={CommonStyle.dataText}>{CommonFunction.convertUnixToDate(this.state.popData.start_dt,"YYYY.MM.DD HH:mm")}~{CommonFunction.convertUnixToDate(this.state.popData.end_dt,"YYYY.MM.DD HH:mm")}</CustomTextR>
                            </View>
                        </View>
                        <View style={styles.titleWrap}>
                            <View style={styles.thumbnailWrap}>
                            { 
                                !CommonUtil.isEmpty(this.state.popData.img_url) ?
                                <Image
                                    source={{uri:DEFAULT_CONSTANTS.defaultImageDomain+this.state.popData.img_url}}
                                    resizeMode={"contain"}
                                    style={CommonStyle.fullWidthImage}
                                    indicator={Progress.Pie}
                                    indicatorProps={{size: 80,borderWidth: 0,color: DEFAULT_COLOR.base_color,unfilledColor:'#fff'}}
                                />
                                :
                                <Image
                                    source={require('../../../assets/icons/no_image.png')}
                                    resizeMode={"contain"}
                                    style={CommonStyle.fullWidthImage}
                                />
                            }
                            </View> 
                        </View>      
                        <View style={styles.boxTitleWrap}>
                            <CustomTextM style={CommonStyle.titleText}>이벤트상품리스트</CustomTextM>
                        </View> 
                        <View style={styles.defaultWrap}>
                        {
                            this.state.formEventGoods.map((item, index) => {  
                            return (
                                <View key={index} style={{backgroundColor:'#fff'}}>
                                    <TouchableOpacity style={styles.boxSubWrap} onPress={()=>this.moveDetail(item)}>
                                        <View style={styles.boxLeftWrap}>
                                            { 
                                                !CommonUtil.isEmpty(item.thumb_img) ?
                                                <Image
                                                    source={{uri:DEFAULT_CONSTANTS.defaultImageDomain+item.thumb_img}}
                                                    resizeMode={"contain"}
                                                    style={{width:PixelRatio.roundToNearestPixel(55),height:PixelRatio.roundToNearestPixel(55)}}
                                                />
                                                :
                                                <NativeImage
                                                    source={item.icon}
                                                    resizeMode={"contain"}
                                                    style={CommonStyle.defaultImage40}
                                                />
                                            }
                                        </View>
                                        <View style={styles.boxRightWrap}>
                                            <CustomTextR style={CommonStyle.titleText} numberOfLines={1} ellipsizeMode={'tail'}>
                                                {item.product_name}
                                            </CustomTextR>
                                            <CustomTextR style={CommonStyle.dataText}>낱개단가:{CommonFunction.currencyFormat(item.each_price)}원
                                            {
                                                item.product_yn === false &&
                                                <CustomTextR style={[styles.menuRemoveText,{paddingLeft:10}]}>(사용중지)</CustomTextR>
                                            }
                                            </CustomTextR>
                                        </View>                                        
                                    </TouchableOpacity>
                                </View>
                            )
                            })
                        } 
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
        backgroundColor : "#fff",
    },
    fixedTop : {
        position:'absolute',right:10,top:1,width:110,height:100,zIndex:10,justifyContent:'center'
    },
    fixedDataWarp : {
        flex:1,
        width:110,
        paddingLeft:20,
        borderWidth :2,
        borderColor : DEFAULT_COLOR.input_border_color,
        backgroundColor:'#fff',
        ...Platform.select({
            ios: {
              shadowColor: "#555",
              shadowOpacity: 0.5,
              shadowRadius: 2,
              shadowOffset: {
                height: 1,
                width: 1
             }
           },
            android: {
              elevation: 5
           }
         })
    },
    boxTitleWrap: { 
        flex:1,
        flexDirection:'row',    
        flexGrow:1,    
        paddingHorizontal:20,
        paddingVertical:10,
        backgroundColor:'#f5f6f8',
        borderBottomWidth:1,
        borderBottomColor : DEFAULT_COLOR.input_border_color
    },
    thumbnailWrap : {
        paddingHorizontal:0,justifyContent:'center',alignItems:'center',overflow:'hidden'
    },
    bottomButtonWrap : {
        position:'absolute',right:0,bottom:0,width:SCREEN_WIDTH,height:DEFAULT_CONSTANTS.BottomHeight,backgroundColor:DEFAULT_COLOR.base_color,justifyContent:'center',alignItems:'center',flexDirection:'row',borderTopWidth:1, borderTopColor:DEFAULT_COLOR.base_color
    },
    defaultWrap:{
        flex:1,borderTopWidth:1,borderTopColor:DEFAULT_COLOR.input_border_color,backgroundColor : "#fff",justifyContent:'center',
        paddingVertical:5,paddingHorizontal:10
    },
    boxSubWrap : {
        flex:1,
        flexDirection:'row',    
        flexGrow:1,    
        paddingVertical: Platform.OS === 'android' ? 10 : 15,
        alignItems: 'center',
        backgroundColor:'#fff',        
        borderBottomWidth:1,
        borderBottomColor : DEFAULT_COLOR.input_border_color
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
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleWrap : {
        flex:1,borderTopWidth:1,borderTopColor:DEFAULT_COLOR.input_border_color,backgroundColor : "#fff",justifyContent:'center',paddingVertical:10
    },
    menuTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),paddingRight:10
    },
    menuTitleText2 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),paddingRight:10,color:'#343434'
    },
    termText4 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),paddingRight:10,color:'#343434'
    },
    ballStyle : {
        width: 28,height: 28,borderRadius: 14,backgroundColor:'#fff',
        
    },
    boxWrap : {
        paddingHorizontal:20,paddingVertical:5
    },
    menuOnBox : {
        flex:1,backgroundColor:DEFAULT_COLOR.base_color,justifyContent:'center',alignItems:'center'
    },
    menuOffBox : {
        flex:1,backgroundColor:'#fff',justifyContent:'center',alignItems:'center',height:'100%'
    },
    menuOnText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#fff'
    },
    menuOffText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.base_color
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
        _fn_ToggleNoticeDetail:(bool)=> {
            dispatch(ActionCreator.fn_ToggleNoticeDetail(bool))
        }
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(EventDetailScreen);
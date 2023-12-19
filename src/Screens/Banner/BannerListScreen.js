import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Text,Dimensions,RefreshControl, PixelRatio,TouchableOpacity, Platform,Image as NativeImage} from 'react-native';
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
import {CustomTextR,CustomTextL, CustomTextB, CustomTextM, TextRobotoM,TextRobotoR} from '../../Components/CustomText';
import CommonFunction from '../../Utils/CommonFunction';
import CommonUtil from '../../Utils/CommonUtil';
import Loader from '../../Utils/Loader';
import { apiObject } from "../Apis";

class BannerListScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : true,
            bannerList : []
        }
    }
    getBaseData = async() => {
        this.setState({moreLoading : true})
        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/banner/list?page=1&paginate=10';
            const token = this.props.userToken.apiToken;
            let sendData = null;
            returnCode = await apiObject.API_getPageList(this.props,url,token,sendData);
            //console.log('returnCode',returnCode.data.bannerList[4].productdetail) 
            if ( returnCode.code === '0000'  ) {
                this.setState({
                    bannerList : CommonUtil.isEmpty(returnCode.data.bannerList) ? [] : returnCode.data.bannerList
                })
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
        await this.getBaseData();
        this.props.navigation.addListener('focus', () => {  
            this.getBaseData();
        })
    }

    componentDidMount() {
        
    }
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
        this.props.navigation.navigate('BannerModifyStack',{
            screenData:item
        })
    }
    moveSeq = () => {
        this.props.navigation.navigate('BannerListModifyStack',{
            screenData:this.state.bannerList
        })
    }

    addSchedule = () => {
        if ( this.state.bannerList.length === 10 ) {
            CommonFunction.fn_call_toast('10개까지만 등록이 가능합니다.',2000);
            return;
        }else{
            this.props.navigation.navigate('BannerRegistStack');
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
                <TouchableOpacity 
                    style={styles.fixedUpButton2}
                    onPress={e => this.moveSeq()}
                >
                    <NativeImage
                        source={require('../../../assets/icons/icon_hamburg.png')}
                        resizeMode={"contain"}
                        style={CommonStyle.defaultImage40}
                    />
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
                        <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)}}>배너 목록({this.state.bannerList.length}/10)</CustomTextM>

                    </View> 
                    {
                        this.state.bannerList.length === 0 ? 
                        <View style={[CommonStyle.emptyWrap,{backgroundColor:'#f5f6f8'}]} >
                            <CustomTextR style={CommonStyle.dataText}>등록된 배너가 없습니다.</CustomTextR>
                        </View>
                        :
                        this.state.bannerList.map((item, index) => {  
                        return (
                            <View key={index} style={styles.repeatWrap}>
                                <TouchableOpacity style={styles.boxSubWrap} onPress={()=>this.moveDetail(item)}>
                                    <View style={styles.boxLeftWrap}>
                                        { !CommonUtil.isEmpty(item.img_url) ?
                                            <Image
                                                source={{uri:DEFAULT_CONSTANTS.defaultImageDomain + item.img_url}}
                                                resizeMode={"contain"}
                                                style={CommonStyle.defaultIconImage55}
                                            />
                                            :
                                            <Image
                                                source={require('../../../assets/icons/no_image.png')}
                                                resizeMode={"contain"}
                                                style={CommonStyle.defaultIconImage55}
                                            />
                                        }
                                    </View>
                                    <View style={styles.boxRightWrap}>
                                        <CustomTextR 
                                            numberOfLines={1} ellipsizeMode={'tail'}
                                            style={CommonStyle.titleText}
                                        >{item.title}</CustomTextR>
                                        <CustomTextR 
                                            numberOfLines={2} ellipsizeMode={'tail'}
                                            style={CommonStyle.dataText}
                                        >{CommonFunction.replaceAll(item.content,"\n","")}</CustomTextR>
                                        <View style={{alignItems:'flex-end'}}>
                                            <CustomTextR style={CommonStyle.dataText}>
                                                {index+1}/{this.state.bannerList.length}
                                            </CustomTextR>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )
                        })
                    } 
                <View style={[CommonStyle.blankArea,{backgroundColor:'#f5f6f8'}]}></View>
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
        position:'absolute',bottom:90,right:20,width:50,height:50,backgroundColor:DEFAULT_COLOR.base_color,borderColor:'#ccc',borderWidth:1,borderRadius:25,alignItems:'center',justifyContent:'center',zIndex:10
    },
    fixedUpButton2 : {
        position:'absolute',bottom:30,right:20,width:50,height:50,backgroundColor:'#fff',borderColor:'#000',borderWidth:1,borderRadius:25,alignItems:'center',justifyContent:'center',zIndex:10
    },
    repeatWrap : {
        backgroundColor:'#fff',paddingRight:10
    },
    boxWrap : {
        flex:1,
        flexDirection:'row',    
        flexGrow:1,    
        paddingHorizontal:20,
        paddingVertical : Platform.OS ==='ios' ? 10 : 15,
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
    boxLeftWrap : {
        flex:1,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    boxRightWrap : {
        flex:2,        
        justifyContent:'flex-start'
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
export default connect(mapStateToProps,mapDispatchToProps)(BannerListScreen);
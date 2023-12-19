import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Text,Dimensions,RefreshControl, PixelRatio,TouchableOpacity, Platform,Animated,BackHandler} from 'react-native';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import Modal from 'react-native-modal';
import Image from 'react-native-image-progress';
//공통상수 필요에 의해서 사용
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import CommonStyle from '../../Style/CommonStyle';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {CustomTextR,CustomTextL, CustomTextB, CustomTextM, TextRobotoM,TextRobotoR,TextRobotoL} from '../../Components/CustomText';
import CommonFunction from '../../Utils/CommonFunction';
import CommonUtil from '../../Utils/CommonUtil';
import Loader from '../../Utils/Loader';
import { apiObject } from "../Apis";

const DefaultPaginate = 50;
class ProductListScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : true,
            moreLoading : false,
            isback :false,
            totalCount : 0,
            category_pk : 0,
            categoryData : {},
            toggleproduct : this.props.toggleproduct,
            productList : [],            
            ismore :  false,
            currentPage : 1,
        }
    }

    moreDataUpdate = async( baseData , addData) => {     
        let newArray = await baseData.concat(addData.data.productList); 
        this.setState({            
            moreLoading : false,
            loading : false,
            productList : newArray,
            ismore : parseInt(this.state.currentPage) < parseInt(addData.lastPage) ? true : false
        })
    }

    getBaseData = async(category_pk,currentPage,morePage = false) => {
        this.setState({moreLoading : true})
        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/product/list?category_pk=' + category_pk + '&page=' + currentPage + '&paginate='+DefaultPaginate;
            const token = this.props.userToken.apiToken;
            let sendData = null;
            returnCode = await apiObject.API_getPageList(this.props,url,token,sendData);
            if ( returnCode.code === '0000'  ) {
                this.setState({currentPage : returnCode.currentPage})
                if ( morePage ) {
                    this.moreDataUpdate(this.state.productList,returnCode )
                }else{
                    this.setState({
                        totalCount : returnCode.total,
                        productList : CommonUtil.isEmpty(returnCode.data.productList) ? [] : returnCode.data.productList,
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
                categoryData : this.props.extraData.params.screenData,
                category_pk : this.props.extraData.params.screenData.category_pk
            })
            if ( !CommonUtil.isEmpty(this.props.extraData.params.screenData.category_pk)) {
                await this.getBaseData(this.props.extraData.params.screenData.category_pk,1,false);
            }
    
        }else{
            CommonFunction.fn_call_toast('잘못된 접근입니다.',2000);
            setTimeout(
                () => {            
                   this.props.navigation.goBack(null);
                },500
            )
        }

        this.props.navigation.addListener('focus', () => {  
            if ( this.state.isback === false) {                
                this.setState({isback:false});
                this.getBaseData(this.props.extraData.params.screenData.category_pk,1,false);
            }
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
        this.setState({isback:true})
        this.props.navigation.navigate('ProductDetailStack',{
            screenData:item
        })
    }
 
    addSchedule = () => {        
        this.setState({isback:false});
        this.props.navigation.navigate('ProductRegistStack',{
            screenData:this.state.categoryData
        });
    }

    animatedHeight = new Animated.Value(SCREEN_HEIGHT * 0.2);
    
    closeModalInforation = () => {
        this.props._fn_ToggleProduct(false)
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
                        <View style={styles.boxTitleRightWrap}>
                            <TextRobotoL style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13)}}>
                                등록수 : {CommonFunction.currencyFormat(this.state.totalCount)}
                            </TextRobotoL>
                        </View>
                    </View> 
                    {
                        this.state.productList.length === 0 ? 
                        <View style={{flex:1,justifyContent:'center',alignItems:'center',paddingVertical:20}} >
                            <CustomTextR style={CommonStyle.dataText}>등록된 상품이 없습니다.</CustomTextR>
                        </View>
                        :
                        this.state.productList.map((item, index) => {  
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
                                                <Image
                                                    source={require('../../../assets/icons/no_image.png')}
                                                    resizeMode={"contain"}
                                                    style={CommonStyle.defaultIconImage}
                                                />
                                            }
                                        </View>
                                        <View style={styles.boxRightWrap}>
                                            <CustomTextR style={CommonStyle.titleText} numberOfLines={1} ellipsizeMode={'tail'}>{item.product_name}</CustomTextR>
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
                    {
                        this.state.ismore &&
                        <View style={CommonStyle.moreButtonWrap}>
                            <TouchableOpacity 
                                onPress={() => this.getBaseData(this.state.category_pk,this.state.currentPage+1,true)}
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
    bottomButtonWrap : {
        paddingHorizontal:20,paddingVertical: Platform.OS === 'ios' ? 15 : 5,
        justifyContent:'flex-start'
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
        flex:1,        
        justifyContent:'center',
        alignItems:'center'
    },
    boxRightWrap : {
        flex:5,        
        justifyContent:'center',
        alignItems:'flex-start',
        paddingLeft:15
    },
    boxTitleRightWrap : {
        flex:1,
        justifyContent:'flex-end',
        alignItems:'flex-end',
    },
    menuTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),paddingRight:10
    },
    menuRemoveText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#777'
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
        toggleproduct: state.GlabalStatus.toggleproduct,
    };
}
function mapDispatchToProps(dispatch) {
    return {   
        _saveUserToken:(str)=> {
            dispatch(ActionCreator.saveUserToken(str))
        },             
        _fn_ToggleProduct:(bool)=> {
            dispatch(ActionCreator.fn_ToggleProduct(bool))
        }
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(ProductListScreen);
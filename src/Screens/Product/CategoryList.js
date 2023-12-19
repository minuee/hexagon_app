import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Text,Dimensions,RefreshControl, PixelRatio,Image,TouchableOpacity, Platform,Animated,BackHandler} from 'react-native';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import Modal from 'react-native-modal';
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
class CategoryList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : true,
            remove_unUse : false,
            remove_unUse2 : false,
            togglecategory : this.props.togglecategory,
            categoryBrandList : [],
            categoryNormalList : []
        }
    }

    getBaseData = async() => {
        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/category/list?is_cms=true';
            const token = this.props.userToken.apiToken;
            let sendData = null;
            returnCode = await apiObject.API_getPageList(this.props,url,token,sendData);
            if ( returnCode.code === '0000'  ) {
                this.setState({
                    categoryBrandList : CommonUtil.isEmpty(returnCode.data.categoryBrandList) ? [] : returnCode.data.categoryBrandList,
                    categoryNormalList : CommonUtil.isEmpty(returnCode.data.categoryNormalList) ? [] : returnCode.data.categoryNormalList
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

    moveDetail = async(item) => {
        await this.props._fn_selectCategoryName(item.category_name);
        if ( item.category_yn ) {
            this.props.navigation.navigate('ProductListStack',{
                screenData:item
            })
        }else{
            this.props.navigation.navigate('CategoryModifyStack',{
                screenData:item
            })
        }
    }

    moveCategory = (mode ) => {
        this.props._fn_ToggleCategory(false);
        this.props.navigation.navigate('CategoryListModifyStack',{
            categoryType : mode,
            screenData: mode ==='B' ? this.state.categoryBrandList : this.state.categoryNormalList
        })
    }

    addSchedule = () => {        
        this.props.navigation.navigate('CategoryRegistStack' );
    }

    removeNotuse = async (mode,bool) => {
        if ( mode === 'B') {
            this.setState({remove_unUse : !bool})
        }else{
            this.setState({remove_unUse2 : !bool})
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
        let categoryBrandList = this.state.remove_unUse ? this.state.categoryBrandList.filter((info) => info.category_yn === true ) : this.state.categoryBrandList;
        let categoryNormalList = this.state.remove_unUse2 ? this.state.categoryNormalList.filter((info) => info.category_yn === true ) : this.state.categoryNormalList;
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
                        <View style={styles.boxLeftWrap2}>
                            <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)}}>브랜드 카테고리</CustomTextM>
                        </View>
                        <View style={styles.boxRightWrap2}>
                            <CheckBox 
                                containerStyle={{padding:0,margin:0}}   
                                iconType={'FontAwesome'}
                                checkedIcon={<Image source={RADIOON_ON} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                uncheckedIcon={<Image source={RADIOON_OFF} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                checkedColor={DEFAULT_COLOR.base_color}                          
                                checked={this.state.remove_unUse}
                                size={PixelRatio.roundToNearestPixel(15)}                                    
                                onPress={() => this.removeNotuse('B',this.state.remove_unUse)}
                            />
                            <TouchableOpacity onPress={() => this.removeNotuse('B',this.state.remove_unUse)}>
                                <CustomTextR style={styles.menuRemoveText}>사용중지 제거</CustomTextR>    
                            </TouchableOpacity>
                        </View>
                    </View> 
                    {
                        categoryBrandList.length === 0 ? 
                        <View style={styles.emptyWrap} >
                            <CustomTextR style={CommonStyle.dataText}>등록된 카테고리가 없습니다.</CustomTextR>
                        </View>
                        :
                        categoryBrandList.map((item, index) => {  
                            return (
                            <View key={index} style={{backgroundColor:'#fff'}}>
                                <TouchableOpacity style={styles.boxSubWrap} onPress={()=>this.moveDetail(item)}>
                                    <View style={styles.boxLeftWrap}>
                                        { 
                                            !CommonUtil.isEmpty(item.category_logo) ?
                                            <Image
                                                source={{uri:DEFAULT_CONSTANTS.defaultImageDomain + item.category_logo}}
                                                resizeMode={"contain"}
                                                style={CommonStyle.defaultIconImage}
                                            />
                                            :
                                            <Image
                                                source={require('../../../assets/icons/no_image.png')}
                                                resizeMode={"contain"}
                                                style={CommonStyle.defaultIconImage}
                                            />
                                        }
                                        <CustomTextR style={[styles.menuTitleText,{paddingLeft:20}]}>
                                            {item.category_name}({CommonFunction.currencyFormat(item.product_count)})
                                        </CustomTextR>
                                        {
                                            item.category_yn === false &&
                                            <CustomTextR style={[styles.menuRemoveText,{paddingLeft:10}]}>(사용중지)</CustomTextR>
                                        }
                                    </View>
                                    <View style={styles.boxRightWrap}>
                                        <Image
                                            source={require('../../../assets/icons/btn_next.png')}
                                            resizeMode={"contain"}
                                            style={CommonStyle.defaultIconImage}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            )
                        })
                    }
                    <View style={styles.boxWrap}>
                        <View style={styles.boxLeftWrap2}>
                            <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)}}>제품군 카테고리</CustomTextM>
                        </View>
                        <View style={styles.boxRightWrap2}>
                            <CheckBox 
                                containerStyle={{padding:0,margin:0}}   
                                iconType={'FontAwesome'}
                                checkedIcon={<Image source={RADIOON_ON} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                uncheckedIcon={<Image source={RADIOON_OFF} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                checkedColor={DEFAULT_COLOR.base_color}                          
                                checked={this.state.remove_unUse2}
                                size={PixelRatio.roundToNearestPixel(15)}                                    
                                onPress={() => this.removeNotuse('N',this.state.remove_unUse2)}
                            />
                            <TouchableOpacity onPress={() => this.removeNotuse('N',this.state.remove_unUse2)}>
                                <CustomTextR style={styles.menuRemoveText}>사용중지 제거</CustomTextR>    
                            </TouchableOpacity>
                        </View>
                    </View> 
                    {
                        categoryNormalList.length === 0 ? 
                        <View style={styles.emptyWrap} >
                            <CustomTextR style={CommonStyle.dataText}>등록된 카테고리가 없습니다.</CustomTextR>
                        </View>
                        :
                        categoryNormalList.map((item, index) => {  
                            return (
                                <View key={index} style={{backgroundColor:'#fff'}}>
                                    <TouchableOpacity style={styles.boxSubWrap} onPress={()=>this.moveDetail(item)}>
                                        <View style={styles.boxLeftWrap}>
                                            { 
                                                !CommonUtil.isEmpty(item.category_logo) ?
                                                <Image
                                                    source={{uri:DEFAULT_CONSTANTS.defaultImageDomain+item.category_logo}}
                                                    resizeMode={"contain"}
                                                    style={CommonStyle.defaultIconImage}
                                                />
                                                :
                                                <Image
                                                    source={require('../../../assets/icons/no_image.png')}
                                                    resizeMode={"contain"}
                                                    style={CommonStyle.defaultIconImage}
                                                />
                                            }
                                            <CustomTextR style={[styles.menuTitleText,{paddingLeft:20}]}>
                                                {item.category_name}({CommonFunction.currencyFormat(item.product_count)})
                                            </CustomTextR>
                                            {
                                                item.category_yn === false &&
                                                <CustomTextR style={[styles.menuRemoveText,{paddingLeft:10}]}>(사용중지)</CustomTextR>
                                            }
                                        </View>
                                        <View style={styles.boxRightWrap}>
                                            <Image
                                                source={require('../../../assets/icons/btn_next.png')}
                                                resizeMode={"contain"}
                                                style={CommonStyle.defaultIconImage}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )
                        })
                    } 
                    <View style={[CommonStyle.blankArea,{backgroundColor : "#f5f6f8"}]}></View>
                </ScrollView>
                <Modal
                    onBackdropPress={this.closeModalInforation}
                    animationType="slide"
                    //transparent={true}
                    onRequestClose={() => {
                        this.props._fn_ToggleCategory(false)
                    }}                        
                    style={{justifyContent: 'flex-end',margin: 0}}
                    useNativeDriver={true}
                    animationInTiming={300}
                    animationOutTiming={300}
                    hideModalContentWhileAnimating                    
                    isVisible={this.props.togglecategory}
                >
                    <Animated.View style={[styles.modalContainer,{ height: this.animatedHeight }]}>
                        <View style={styles.modalContainer}>                            
                            <TouchableOpacity 
                                onPress={()=>this.moveCategory('B')}
                                style={{paddingHorizontal:20,paddingVertical:15}}
                            >
                                <CustomTextR style={styles.termText4}>브랜드카테고리 목록 수정</CustomTextR>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={()=>this.moveCategory('N')}
                                style={{paddingHorizontal:20,paddingVertical:15}}
                            >
                                <CustomTextR style={styles.termText4}>제품군카테고리 목록 수정</CustomTextR>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </Modal>              
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
        togglecategory : state.GlabalStatus.togglecategory,
        selectCategoryName :  state.GlabalStatus.selectCategoryName
    };
}

function mapDispatchToProps(dispatch) {
    return {     
        _saveUserToken:(str)=> {
            dispatch(ActionCreator.saveUserToken(str))
        },           
        _fn_ToggleCategory:(bool)=> {
            dispatch(ActionCreator.fn_ToggleCategory(bool))
        },
        _fn_selectCategoryName:(str)=> {
            dispatch(ActionCreator.fn_selectCategoryName(str))
        }
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(CategoryList);
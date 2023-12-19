import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Text,Dimensions,RefreshControl, PixelRatio,Image,TouchableOpacity, Platform,Animated} from 'react-native';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import Modal from 'react-native-modal';
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
const DefaultPaginate = 20;
class ChargeListScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : false,
            moreLoading : false,
            ismore :  false,
            currentpage : 1,
            salemanData : {},
            salesmanList : [],
            togglecategory : this.props.togglecategory,
        }
    }

    moreDataUpdate = async( baseData , addData) => {    
        
        await addData.data.forEach(function(element,index,array){                                
            baseData.push(element);
        });    
        this.setState({            
            moreLoading : false,
            loading : false,
            salesmanList : baseData,
            ismore : parseInt(this.state.currentpage+1)  < parseInt(addData.lastPage) ? true : false
        })
    }

    getBaseData = async(currentpage,morePage = false,) => {
        let returnCode = {code:9998};
        let salesmanCode = this.state.salemanData.special_code;
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain+'/cms/salesman/charge/list/'+salesmanCode+'?paginate='+DefaultPaginate+'&page='+currentpage;
            const token = this.props.userToken.apiToken;
            let sendData = null;
            returnCode = await apiObject.API_getPageList(this.props,url,token,sendData);
            if ( returnCode.code === '0000'  ) {
                if ( morePage ) {
                    this.moreDataUpdate(this.state.salesmanList,returnCode.data.salesmanList )
                }else{
                    this.setState({
                        salesmanList : CommonUtil.isEmpty(returnCode.data.salesmanList) ? [] : returnCode.data.salesmanList,
                        ismore : parseInt(this.state.currentpage+1)  < parseInt(returnCode.lastPage) ? true : false
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
            await this.setState({
                salemanData : this.props.extraData.params.screenData
            })
            await this.getBaseData(1,false);
        }else{
            CommonFunction.fn_call_toast('잘못된 접근입니다.',1000);
            setTimeout(
                () => {            
                   this.props.navigation.goBack(null);
                },1000
            )
        }
    }
    
    componentDidMount() {
    }

    handleOnScroll (event) {             
        if ( event.nativeEvent.contentOffset.y >= 200 ) {     
        }else{
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
        this.props.navigation.navigate('MemberDetailStack',{
            screenData:item
        })
    }
    render() {
        return(
            <SafeAreaView style={ styles.container }>
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
                    {
                        this.state.salesmanList.length === 0 ? 
                        <View style={CommonStyle.emptyWrap} >
                            <CustomTextR style={CommonStyle.dataText}>담당 회원이 없습니다.</CustomTextR>
                        </View>
                        :
                        this.state.salesmanList.map((item, index) => {  
                        return (
                            <View key={index} style={{backgroundColor:'#fff'}}>
                                <TouchableOpacity style={styles.boxSubWrap} onPress={()=>this.moveDetail(item)}>
                                    <View style={styles.boxLeftWrap}>                                           
                                        <CustomTextR style={[styles.menuTitleText,{paddingLeft:20}]}>{item.name}<CustomTextR style={[styles.menuTitleText,{color:'#555'}]}>({item.grade_code})</CustomTextR></CustomTextR>
                                    </View>
                                    <View style={styles.boxRightWrap}>
                                        <Image
                                            source={require('../../../assets/icons/btn_next.png')}
                                            resizeMode={"contain"}
                                            style={{width:PixelRatio.roundToNearestPixel(20),height:PixelRatio.roundToNearestPixel(20)}}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )
                    })
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
        padding:20,
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
    menuTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),paddingRight:10
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
        togglecategory : state.GlabalStatus.togglecategory
    };
}

function mapDispatchToProps(dispatch) {
    return {   
        _saveUserToken:(str)=> {
            dispatch(ActionCreator.saveUserToken(str))
        },             
        _fn_ToggleCategory:(bool)=> {
            dispatch(ActionCreator.fn_ToggleCategory(bool))
        }
    };
}


export default connect(mapStateToProps,mapDispatchToProps)(ChargeListScreen);
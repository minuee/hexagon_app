import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Image,Dimensions,PixelRatio,TouchableOpacity,Animated,RefreshControl} from 'react-native';
import 'moment/locale/ko'
import  moment  from  "moment";
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import Modal from 'react-native-modal';
//공통상수 필요에 의해서 사용
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import CommonStyle from '../../Style/CommonStyle';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {CustomTextR,CustomTextL, CustomTextB, CustomTextM, TextRobotoM,TextRobotoR,DropBoxIcon,DropBoxIconSmallClose,DropBoxIconSmallOpen} from '../../Components/CustomText';
import CommonFunction from '../../Utils/CommonFunction';
import CommonUtil from '../../Utils/CommonUtil';
import Loader from '../../Utils/Loader';
import { apiObject } from "../Apis";

import SelectCalendar from '../../Utils/SelectCalendar';

const currentDate =  moment().format('YYYY-MM-DD');
const startDate =  moment().subtract(30, 'd').format('YYYY-MM-DD');
const minDate =  moment().subtract(365*1, 'd').format('YYYY-MM-DD');
const maxDate =  moment().format('YYYY-MM-DD');

const DefaultPaginate = 10;
class IntroScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showTopButton:false,
            loading : true,
            showModal : false,
            moreLoading : false,
            sortItem : 3,
            sortType : 'DESC',
            formActionStart : startDate,
            formActionEnd : currentDate,
            totalCount : 0,
            orderList : [],
            ismore :  false,
            currentPage : 1,
        }
    }

    moreDataUpdate = async( baseData , addData) => {     
        let newArray = await baseData.concat(addData.data.orderList);  
        this.setState({            
            moreLoading : false,
            loading : false,
            orderList : newArray,
            ismore : parseInt(this.state.currentPage) < parseInt(addData.lastPage) ? true : false
        })
    }

    getBaseData = async(currentpage,morePage = false,sortItem = null,sortType = null) => {      
        this.setState({moreLoading:true})  
        let returnCode = {code:9998};
        let sort_Item = "&sort_item=";
        let strSortType = sortType ? sortType : this.state.sortType;
        let sort_Type = "&sort_type=" + strSortType ;
        switch( sortItem ) {
            case 1 : sort_Item = "&sort_item=uname"; break; 
            case 2 : sort_Item = "&sort_item=order"; break; 
            case 3 : sort_Item = "&sort_item=reg_dt"; break; 
            default : sort_Item = "&sort_item=reg_dt"; break; 
        }
        let formActionStart = this.state.formActionStart;
        let formActionEnd = this.state.formActionEnd;
        if ( formActionEnd < formActionStart) {
            formActionStart = formActionEnd;
            formActionEnd = formActionStart;
            this.setState({
                formActionStart : formActionStart,
                formActionEnd : formActionEnd
            })
        }
        let term_start = CommonFunction.convertDateToUnix(formActionStart + ' 00:00:00');
        let term_end = CommonFunction.convertDateToUnix(formActionEnd + ' 23:59:59');
        let term_start2 = '&term_start='+term_start;
        let term_end2 = '&term_end='+term_end;
        let special_code = '&special_code='+this.props.userToken.special_code;
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/order/list?paginate=' + DefaultPaginate + '&page=' + currentpage + sort_Item + sort_Type + term_start2 + term_end2 + special_code;
            const token = this.props.userToken.apiToken;
            let sendData = null;
            returnCode = await apiObject.API_getPageList(this.props,url,token,sendData);
            if ( returnCode.code === '0000'  ) {
                this.setState({currentPage : returnCode.currentPage})
                if ( morePage ) {
                    this.moreDataUpdate(this.state.orderList,returnCode )
                }else{
                    this.setState({
                        totalCount : returnCode.total,
                        orderList : CommonUtil.isEmpty(returnCode.data.orderList) ? [] : returnCode.data.orderList,
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
        await this.getBaseData(1,false,this.state.sortItem);
    }

    componentDidMount() {        

    }
    componentWillUnmount(){        
    }

    upButtonHandler = () => {        
        this.ScrollView.scrollTo({ x: 0,  animated: true });
    };

    refreshingData = async() => {        
        this.getBaseData(1,false,this.state.sortItem);
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
            this.scrollEndReach();
        }
    }

    scrollEndReach = () => {
        if ( this.state.ismore && !this.state.moreLoading ) {
            this.getBaseData(this.state.currentPage+1,true,this.state.sortItem,this.state.sortType)
        } 
        
    }

    animatedHeight = new Animated.Value(SCREEN_HEIGHT * 0.5);
    closeModal = () => {
        this.setState({ showModal: false });
      
    };
    showModal = (mode) => {
        this.setState({ 
            showModal: true,
            showModalType : mode
        })
    };
    onDayPress = (days) => {        
        if ( this.state.showModalType === 1 ) {
            this.setState({formActionStart:days.dateString});
        }else{
            this.setState({formActionEnd:days.dateString});
        }
        this.closeModal();
    }

    setOrderBy = async(seq) => {
        if ( this.state.sortItem === seq ) {
            this.setState({
                sortItem:seq,moreLoading:true,sortType : this.state.sortType === 'DESC' ? 'ASC' : 'DESC'
            })
            await this.getBaseData(1,false,seq,this.state.sortType === 'DESC' ? 'ASC' : 'DESC');
        }else{
            this.setState({
                sortItem:seq,moreLoading:true,sortType:this.state.sortType === 'DESC' ? 'ASC' : 'DESC'
            })
            await this.getBaseData(1,false,seq,this.state.sortType === 'DESC' ? 'ASC' : 'DESC');
        }
    }

    moveDetail = async(item) => {
        this.props.navigation.navigate('OrderDetailStack',{
            screenData: item
        });
    }

    render() {
        if ( this.state.loading ) {
            return (
                <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} /> 
            )
        }else {  
            return(
                <SafeAreaView style={ styles.container }>
                    { 
                        this.state.showTopButton &&
                        <TouchableOpacity style={styles.fixedUpButton3} onPress={e => this.upButtonHandler()}>
                            <Icon name="up" size={25} color="#000" />
                        </TouchableOpacity>
                    }
                    <View style={styles.topCalendarWrap}>
                        <View style={styles.topCalendarDataWrap}>
                            <TouchableOpacity onPress={()=> this.showModal(1)} style={styles.calendarWrap}>
                                <View style={styles.calendarDateWrap}>
                                    <CustomTextR style={CommonStyle.dataText}>{this.state.formActionStart}</CustomTextR>
                                </View>
                                <View style={styles.calendarImageWrap}>
                                    <Image
                                        source={require('../../../assets/icons/icon_calendar.png')}
                                        resizeMode={"contain"}
                                        style={styles.calendarImage}
                                    />
                                </View>
                            </TouchableOpacity>
                            <View style={{flex:0.1,justifyContent:'center',alignItems:'center'}}>
                                <CustomTextR style={CommonStyle.dataText}>~</CustomTextR>
                            </View>
                            <TouchableOpacity onPress={()=> this.showModal(2)} style={styles.calendarWrap}>
                                <View style={styles.calendarDateWrap}>
                                    <CustomTextR style={CommonStyle.dataText}>{this.state.formActionEnd}</CustomTextR>
                                </View>
                                <View style={styles.calendarImageWrap}>
                                    <Image
                                        source={require('../../../assets/icons/icon_calendar.png')}
                                        resizeMode={"contain"}
                                        style={styles.calendarImage}
                                    />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={()=>this.getBaseData(1,false,this.state.sortItem)}
                                style={{flex:0.2,justifyContent:'center',alignItems:'center'}}
                            >
                                <Image
                                    source={require('../../../assets/icons/icon_search.png')}
                                    resizeMode={"contain"}
                                    style={styles.calendarImage}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.topCalendarWrap}>
                        <View style={{flexDirection:'row'}}>
                            <View style={styles.boxWrap}>
                                <TouchableOpacity 
                                    onPress={()=>this.setOrderBy(1)}
                                    style={[styles.boxDataWrap1,this.state.sortItem === 1 ? CommonStyle.selectBackground : CommonStyle.defautBackground ]}
                                >
                                    <CustomTextR style={CommonStyle.titleText}>유저명</CustomTextR>
                                    {this.state.sortItem === 1 && this.state.sortType === 'ASC' ? <DropBoxIconSmallOpen /> : <DropBoxIconSmallClose /> }
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress={()=>this.setOrderBy(2)}
                                    style={[styles.boxDataWrap2,this.state.sortItem === 2 ? CommonStyle.selectBackground : CommonStyle.defautBackground,{paddingRight:20}]}
                                >
                                    <CustomTextR style={CommonStyle.titleText}>구매액</CustomTextR>
                                    {this.state.sortItem === 2 && this.state.sortType === 'ASC' ? <DropBoxIconSmallOpen /> : <DropBoxIconSmallClose /> }
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress={()=>this.setOrderBy(3)}
                                    style={[styles.boxDataWrap3,{alignItems:'center',flexDirection:'row'},this.state.sortItem === 3 ? CommonStyle.selectBackground : CommonStyle.defautBackground]}
                                >
                                    <CustomTextR style={CommonStyle.titleText}>주문일자</CustomTextR>
                                    {this.state.sortItem === 3 && this.state.sortType === 'ASC' ? <DropBoxIconSmallOpen /> : <DropBoxIconSmallClose /> }
                                </TouchableOpacity>
                                
                            </View>
                        </View>
                    </View>
                    <ScrollView
                        ref={(ref) => {
                            this.ScrollView = ref;
                        }}
                        showsVerticalScrollIndicator={false}
                        indicatorStyle={'white'}
                        scrollEventThrottle={16}
                        keyboardDismissMode={'on-drag'}
                        style={{width:'100%'}}
                        refreshControl={
                            <RefreshControl
                              refreshing={this.state.moreLoading}
                              onRefresh={this.refreshingData}
                            />
                        }
                        onScroll={e => this.handleOnScroll(e)}
                    >
                    
                    <View style={styles.mainWrap}>
                        {
                            this.state.orderList.length === 0 ? 
                            <View style={CommonStyle.emptyWrap} >
                                <CustomTextR style={CommonStyle.dataText}>검색 결과 데이터가 없습니다.</CustomTextR>
                            </View>
                            :
                            this.state.orderList.map((item, index) => {  
                                return (
                                    <TouchableOpacity 
                                        onPress={()=>this.moveDetail(item)}
                                        style={styles.boxWrap2} key={index}
                                    >
                                        <View style={[styles.boxDataWrap1,{flexDirection:'column'}]}>
                                            <CustomTextR style={CommonStyle.dataText}>{item.member_name}</CustomTextR>
                                            <CustomTextR style={CommonStyle.dataText}>({item.order_status_name})</CustomTextR>
                                        </View>
                                        <View style={[styles.boxDataWrap2,{justifyContent:'flex-end'}]}>
                                            <CustomTextR style={CommonStyle.dataText}>{CommonFunction.currencyFormat(item.total_amount)}원</CustomTextR>
                                            
                                        </View>
                                        <View style={[styles.boxDataWrap3,{justifyContent:'center'}]}>
                                            <CustomTextR style={CommonStyle.dataText}>{CommonFunction.convertUnixToDate(item.reg_dt,"YYYY.MM.DD")}</CustomTextR>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })
                        }  
                    </View>
                    {/* {
                        this.state.ismore &&
                        <View style={CommonStyle.moreButtonWrap}>
                            <TouchableOpacity 
                                onPress={() => this.getBaseData(this.state.currentPage+1,true,this.state.sortItem,this.state.sortType)}
                                style={CommonStyle.moreButton}
                            >
                            <CustomTextL style={CommonStyle.moreText}>더보기</CustomTextL>
                            </TouchableOpacity>
                        </View>
                    } */}
                    <View style={CommonStyle.blankArea}></View>
                    { 
                        this.state.moreLoading &&
                        <View style={CommonStyle.moreWrap}>
                            <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} />
                        </View>
                    }   
                    </ScrollView>
                    <Modal
                        onBackdropPress={this.closeModal}
                        style={{justifyContent: 'flex-end',margin: 0}}
                        useNativeDriver={true}
                        animationInTiming={300}
                        animationOutTiming={300}
                        hideModalContentWhileAnimating
                        isVisible={this.state.showModal}>
                        <Animated.View style={[styles.modalContainer,{ height: this.animatedHeight }]}>
                            <SelectCalendar 
                                current={currentDate}
                                minDate={minDate}
                                maxDate={maxDate}
                                onDayLongPress={(day)=>this.onDayPress(day)}
                            />
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
        backgroundColor : "#fff",
    },
    fixedUpButton3 : {
        position:'absolute',bottom:20,right:20,width:50,height:50,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',zIndex:3,borderColor:'#ccc',borderWidth:1,borderRadius:25,opacity:0.5
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    topCalendarWrap : {
        height:50
    },
    topCalendarDataWrap : {
        paddingVertical:10,paddingHorizontal:20,flexDirection:'row',flexGrow:1
    },
    /**** Modal  *******/
    modalContainer: {   
        zIndex : 10,     
        position :'absolute',
        left:0,
        //top : BASE_HEIGHY,
        width:SCREEN_WIDTH,
        height: SCREEN_HEIGHT*0.5,
        paddingTop: 16,
        backgroundColor: '#fff'
    },
    mainWrap : {        
        
    },
    boxWrap : {
       flex:1,flexDirection:'row',
       borderTopWidth:1.5,borderTopColor:DEFAULT_COLOR.input_border_color,
       borderBottomWidth:1.5,borderBottomColor:DEFAULT_COLOR.input_border_color,
    },
    boxWrap2 : {
        flex:1,flexDirection:'row',        
        borderBottomWidth:1,borderBottomColor:DEFAULT_COLOR.input_border_color,
     },
    boxText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),color:'#000'
    },
    calendarWrap : {
        flex:1,flexDirection:'row',flexGrow:1,borderWidth:1,borderColor:DEFAULT_COLOR.input_border_color
    },
    calendarImageWrap : {
        flex:1,justifyContent:'center',alignItems:'center'
    },   
    calendarDateWrap : {
        flex:3,padding:5,justifyContent:'center',alignItems:'center',backgroundColor:'#fff'
    },
    calendarImage : {
        width:PixelRatio.roundToNearestPixel(20),height:PixelRatio.roundToNearestPixel(20)
    },
    boxDataWrap1 : {
        flex:1,flexDirection:'row',flexGrow:1,justifyContent:'center',alignItems:'center',paddingVertical:10
    },
    boxDataWrap2 : {
        flex:2,flexDirection:'row',flexGrow:1,justifyContent:'flex-end',paddingRight:10,alignItems:'center',paddingVertical:10
    },
    boxDataWrap3 : {
        flex:1,justifyContent:'flex-end',paddingRight:30,alignItems:'flex-end',paddingVertical:10
    },
    dataText3 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),color:'#7f7f7f'
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

export default connect(mapStateToProps,mapDispatchToProps)(IntroScreen);
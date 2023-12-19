import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Image,Dimensions,PixelRatio,TouchableOpacity,Animated} from 'react-native';
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
class MemberOrderList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading : true,
            showModal : false,
            moreLoading : false,
            sortItem : 1,
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
    getBaseData = async(currentPage,morePage = false,tmpmember_pk = 0,sortItem = null,sortType = '') => {
        this.setState({moreLoading:true})
        let returnCode = {code:9998};
        let sort_Item = "&sort_item=";
        let strSortType = sortType ? "ASC" : 'DESC';
        let sort_Type = "&sort_type=" + strSortType ;
        switch( sortItem ) {
            case 1 : sort_Item = "&sort_item=reg_dt"; break; 
            case 2 : sort_Item = "&sort_item=order"; break; 
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
        const memberpk = tmpmember_pk === 0 ? this.state.member_pk : tmpmember_pk;
        const member_pk = '&member_pk='+ memberpk
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/order/list?paginate=' + DefaultPaginate + '&page=' + currentPage + sort_Item + sort_Type + term_start2 + term_end2 + member_pk;
            //console.log('url',url) 
            const token = this.props.userToken.apiToken;
            let sendData = null;
            returnCode = await apiObject.API_getPageList(this.props,url,token,sendData);          
            console.log('returnCode',returnCode) ;
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
            //console.log('e',e) 
            this.setState({loading:false,moreLoading : false})
        }
    }

    async UNSAFE_componentWillMount() {

        if ( !CommonUtil.isEmpty(this.props.extraData.params.screenData)) {
            this.setState({
                member_pk :  this.props.extraData.params.screenData.member_pk
            })
            await this.getBaseData(1,false,this.props.extraData.params.screenData.member_pk,this.state.sortItem);
        }else{
            CommonFunction.fn_call_toast('잘못된 접근입니다..',2000);
            this.props.navigation.goBack(null)
        }
        
    }


    componentDidMount() {        

    }
    componentWillUnmount(){        
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
        //console.log('selected day', days);
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
                sortItem:seq,moreLoading:true,sortType : !this.state.sortType
            })
            
            await this.getBaseData(1,false,this.state.member_pk,seq,!this.state.sortType);
        }else{
            this.setState({
                sortItem:seq,moreLoading:true,sortType:true
            })
            
            await this.getBaseData(1,false,this.state.member_pk,seq,!this.state.sortType);
        }
    }

    moveDetail = async(item) => {
        this.props.navigation.navigate('OrderDetailStack',{
            screenData: item
        });
    }

    handleOnScroll (event) {             
        let paddingToBottom = 1;
        paddingToBottom += event.nativeEvent.layoutMeasurement.height;                            
        if (event.nativeEvent.contentOffset.y + paddingToBottom >= event.nativeEvent.contentSize.height) {            
            this.scrollEndReach();
        }
    }

    scrollEndReach = () => {      
        if ( this.state.ismore && !this.state.moreLoading ) {
            console.log('this.state.moreLoading',this.state.moreLoading) 
            this.getBaseData(this.state.currentPage+1,true,this.state.member_pk,this.state.sortItem)
            
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
                    <View style={styles.topCalendarWrap}>
                        <View style={styles.topCalendarDataWrap}>
                            <TouchableOpacity 
                                onPress={()=> this.showModal(1)}
                                style={styles.calendarWrap}
                            >
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
                            <TouchableOpacity 
                                onPress={()=> this.showModal(2)}
                                style={styles.calendarWrap}
                            >
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
                                onPress={()=>this.getBaseData(1,false,this.state.member_pk,this.state.sortItem)}
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
                                    <CustomTextR style={CommonStyle.titleText}>주문일자</CustomTextR>
                                    {this.state.sortItem === 1 && this.state.sortType ? <DropBoxIconSmallOpen /> : <DropBoxIconSmallClose /> }
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress={()=>this.setOrderBy(2)}
                                    style={[styles.boxDataWrap2,this.state.sortItem === 2 ? CommonStyle.selectBackground : CommonStyle.defautBackground,{paddingRight:20}]}
                                >
                                    <CustomTextR style={CommonStyle.titleText}>구매액</CustomTextR>
                                    {this.state.sortItem === 2 && this.state.sortType ? <DropBoxIconSmallOpen /> : <DropBoxIconSmallClose /> }
                                </TouchableOpacity>
                                <View 
                                    style={[styles.boxDataWrap3,{alignItems:'center',flexDirection:'row'},CommonStyle.defautBackground]}
                                >
                                    <CustomTextR style={CommonStyle.titleText}>주문상태</CustomTextR>
                                </View>                                
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
                        onScroll={e => this.handleOnScroll(e)}
                        keyboardDismissMode={'on-drag'}
                        style={{width:'100%'}}
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
                                            <View style={styles.boxDataWrap1}>
                                                <CustomTextR style={CommonStyle.dataText}>{CommonFunction.convertUnixToDate(item.reg_dt,"YYYY.MM.DD")}</CustomTextR>
                                                
                                            </View>
                                            <View style={[styles.boxDataWrap2,{justifyContent:'flex-end'}]}>
                                                <CustomTextR style={CommonStyle.dataText}>{CommonFunction.currencyFormat(item.total_amount)}원</CustomTextR>
                                                
                                            </View>
                                            <View style={styles.boxDataWrap3}>
                                                <CustomTextR style={CommonStyle.dataText}>{item.order_status_name}</CustomTextR>
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
                                    onPress={() => this.getBaseData(this.state.currentPage+1,true,this.state.member_pk,this.state.sortItem)}
                                    style={CommonStyle.moreButton}
                                >
                                <CustomTextL style={CommonStyle.moreText}>더보기</CustomTextL>
                                </TouchableOpacity>
                            </View>
                        } */}
                        <View style={[CommonStyle.blankArea,{backgroundColor:DEFAULT_COLOR.base_background_color}]}></View>
                        { this.state.moreLoading &&
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

export default connect(mapStateToProps,mapDispatchToProps)(MemberOrderList);
import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Image,Dimensions,PixelRatio,TouchableOpacity,Animated,BackHandler} from 'react-native';
import 'moment/locale/ko'
import  moment  from  "moment";
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
//공통상수 필요에 의해서 사용
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import CommonStyle from '../../Style/CommonStyle';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {CustomTextR,CustomTextL, CustomTextB, CustomTextM, TextRobotoM,TextRobotoR,DropBoxIcon,DropBoxIconSmallOpen,DropBoxIconSmallClose} from '../../Components/CustomText';
import CommonFunction from '../../Utils/CommonFunction';
import CommonUtil from '../../Utils/CommonUtil';
import Loader from '../../Utils/Loader';
import { apiObject } from "../Apis";

const currentDate =  moment().format('YYYY-MM-DD');
const startDate =  moment().subtract(30, 'd').format('YYYY-MM-DD');
const minDate =  moment().subtract(365*1, 'd').format('YYYY-MM-DD');
const maxDate =  moment().add(0, 'd').format('YYYY-MM-DD');

const DefaultPaginate = 10;

class ListScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading : true,
            showModal : false,
            moreLoading : false,
            salesmanList : [],
            totalCount : 0,
            ismore :  false,
            currentPage : 1,
            sortItem : 0,
            sortType : false,
            formActionStart : startDate,
            formActionEnd : currentDate,
        }
    }

    moreDataUpdate = async( baseData , addData) => {     
        let newArray = await baseData.concat(addData.data.salesmanList); 
        this.setState({            
            moreLoading : false,
            loading : false,
            salesmanList : newArray,
            ismore : parseInt(this.state.currentPage) < parseInt(addData.lastPage) ? true : false
        })
    }
    getBaseData = async(currentpage,morePage = false,sortItem = null,sortType = '') => {        
        let returnCode = {code:9998};
        let sort_Item = "&sort_item=reg";
        let strSortType = sortType ? "ASC" : 'DESC';
        let sort_Type = "&sort_type=" + strSortType ;
        switch( sortItem ) {
            case 1 : sort_Item = "&sort_item=uname"; break; 
            case 2 : sort_Item = "&sort_item=order"; break; 
            case 3 : sort_Item = "&sort_item=incentive"; break; 
            default : sort_Item = "&sort_item=reg"; break; 
        }

        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/salesman/list?paginate=' + DefaultPaginate + '&page=' + currentpage + sort_Item + sort_Type;
            const token = this.props.userToken.apiToken;
            let sendData = null;
            returnCode = await apiObject.API_getPageList(this.props,url,token,sendData);
            if ( returnCode.code === '0000'  ) {
                if ( morePage ) {
                    this.moreDataUpdate(this.state.salesmanList,returnCode )
                }else{
                    this.setState({
                        totalCount : returnCode.total,
                        salesmanList : CommonUtil.isEmpty(returnCode.data.salesmanList) ? [] : returnCode.data.salesmanList,
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

        this.props.navigation.addListener('focus', () => {  
            this.getBaseData(1,false,this.state.sortItem);
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
                sortItem:seq,moreLoading:true,sortType : !this.state.sortType
            })
            await this.getBaseData(1,false,seq,!this.state.sortType);
        }else{
            this.setState({
                sortItem:seq,moreLoading:true,sortType:true
            })
            await this.getBaseData(1,false,seq,!this.state.sortType);
        }
    }

    moveDetail = async(item) => {
        this.props.navigation.navigate('SalesManDetailStack',{
            screenData: item
        });
    }

    addSchedule = () => {        
        this.props.navigation.navigate('SalesManRegistStack');
    }

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
                    <View style={styles.topCalendarWrap}>
                        <View style={styles.topCalendarDataWrap}>
                            <View style={styles.boxWrap}>
                                <TouchableOpacity 
                                    onPress={()=>this.setOrderBy(1)}
                                    style={[styles.boxDataWrap1,this.state.sortItem === 1 ? CommonStyle.selectBackground : CommonStyle.defautBackground ]}
                                >
                                    <CustomTextR style={CommonStyle.titleText}>이름</CustomTextR>
                                    {this.state.sortItem === 1 && this.state.sortType ? <DropBoxIconSmallOpen /> : <DropBoxIconSmallClose /> }
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress={()=>this.setOrderBy(2)}
                                    style={[styles.boxDataWrap2,this.state.sortItem === 2 ? CommonStyle.selectBackground : CommonStyle.defautBackground]}
                                >
                                    <CustomTextR style={CommonStyle.titleText}>구매대행액</CustomTextR>
                                    {this.state.sortItem === 2 && this.state.sortType ? <DropBoxIconSmallOpen /> : <DropBoxIconSmallClose /> }
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress={()=>this.setOrderBy(3)}
                                    style={[styles.boxDataWrap3,{alignItems:'center',flexDirection:'row'},this.state.sortItem === 3 ? CommonStyle.selectBackground : CommonStyle.defautBackground]}
                                >
                                    <CustomTextR style={CommonStyle.titleText}>인센티브액</CustomTextR>
                                    {this.state.sortItem === 3 && this.state.sortType ? <DropBoxIconSmallOpen /> : <DropBoxIconSmallClose /> }
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
                    >
                    <View style={styles.mainWrap}>
                        {
                            this.state.salesmanList.length === 0 ? 
                            <View style={CommonStyle.emptyWrap} >
                                <CustomTextR style={CommonStyle.dataText}>검색 결과 데이터가 없습니다.</CustomTextR>
                            </View>
                            :
                            this.state.salesmanList.map((item, index) => {  
                                return (
                                    <TouchableOpacity 
                                        style={styles.boxWrap2} key={index}
                                        onPress={()=>this.moveDetail(item)}
                                    >
                                        <View style={[styles.boxDataWrap1,{flexDirection:'column'}]}>
                                            <CustomTextR style={CommonStyle.dataText} numberOfLines={1} ellipsizeMode={'tail'}>
                                                {item.name}
                                            </CustomTextR>
                                            <CustomTextR style={styles.dataText3}>
                                                ({item.special_code})
                                            </CustomTextR>
                                        </View>
                                        <View style={[styles.boxDataWrap2,{justifyContent:'flex-end'}]}>
                                            <CustomTextR style={CommonStyle.dataText}>{CommonFunction.currencyFormat(item.total_amount)}원</CustomTextR>
                                        </View>
                                        <View style={styles.boxDataWrap3}>
                                            <CustomTextR style={CommonStyle.dataText}>{CommonFunction.currencyFormat(item.total_incentive)}원</CustomTextR>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })
                        }  
                    </View>
                    {
                        this.state.ismore &&
                        <View style={CommonStyle.moreButtonWrap}>
                            <TouchableOpacity 
                                onPress={() => this.getBaseData(this.state.currentPage+1,true,this.state.sortItem)}
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
    fixedUpButton : {
        position:'absolute',bottom:50,right:20,width:50,height:50,backgroundColor:DEFAULT_COLOR.base_color,borderColor:'#ccc',borderWidth:1,borderRadius:25,alignItems:'center',justifyContent:'center',zIndex:10
    },
    topCalendarWrap : {
        height:50
    },
    topCalendarDataWrap : {
       flexDirection:'row'
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
        flex:1,
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
        flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',padding:10
    },
    boxDataWrap2 : {
        flex:1,flexDirection:'row',flexGrow:1,justifyContent:'flex-end',paddingRight:20,alignItems:'center',paddingVertical:10
    },
    boxDataWrap3 : {
        flex:1,justifyContent:'center',paddingRight:30,alignItems:'flex-end',paddingVertical:10
    },
    dataText3 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),color:'#7f7f7f'
    },
});


function mapStateToProps(state) {
    return {
        userToken : state.GlabalStatus.userToken
    };
}
function mapDispatchToProps(dispatch) {
    return {                
        _saveUserToken:(str)=> {
            dispatch(ActionCreator.saveUserToken(str))
        }
    };
}
export default connect(mapStateToProps,null)(ListScreen);
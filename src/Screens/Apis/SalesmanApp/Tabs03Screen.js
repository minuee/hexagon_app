import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Image,Dimensions,PixelRatio,TouchableOpacity,Animated} from 'react-native';
import 'moment/locale/ko'
import  moment  from  "moment";
import Modal from 'react-native-modal';
import {connect} from 'react-redux';
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

import SelectCalendar from '../../Utils/SelectCalendar';
import { apiObject } from "../Apis";
const currentDate =  moment().format('YYYY-MM-DD');
const startDate =  moment().subtract(30, 'd').format('YYYY-MM-DD');
const minDate =  moment().subtract(365*1, 'd').format('YYYY-MM-DD');
const maxDate =  moment().add(0, 'd').format('YYYY-MM-DD');

const DefaultPaginate = 10;

class Tabs03Screen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading : true,
            showModal : false,
            moreLoading : false,
            ismore :  false,
            userList : [],
            currentpage : 1,
            sortItem : 0,
            sortType : false,
            formActionStart : startDate,
            formActionEnd : currentDate,
        }
    }

    moreDataUpdate = async( baseData , addData) => {     
        
        await addData.data.forEach(function(element,index,array){                                
            baseData.push(element);
        });    
        this.setState({            
            moreLoading : false,
            loading : false,
            userList : baseData,
            ismore : parseInt(this.state.currentpage+1)  < parseInt(addData.lastPage) ? true : false
        })
    }

    getBaseData = async(currentpage,morePage = false,sortItem = null,sortType = '') => {
        console.log('sortType',sortType) 
        let returnCode = {code:9998};
        let sort_Item = "&sort_item=";
        let strSortType = sortType ? "ASC" : 'DESC';
        let sort_Type = "&sort_type=" + strSortType ;
        switch( sortItem ) {
            case 1 : sort_Item = "&sort_item=uname"; break; 
            case 2 : sort_Item = "&sort_item=order"; break; 
            case 3 : sort_Item = "&sort_item=reward"; break; 
            default : sort_Item = "&sort_item="; break; 
        }

        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/member/list?paginate=' + DefaultPaginate + '&page=' + currentpage + sort_Item + sort_Type;
            console.log('url',url) 
            const token = this.props.userToken.apiToken;
            let sendData = null;
            returnCode = await apiObject.API_getPageList(this.props,url,token,sendData);          
            //console.log('returnCode',this.state.userList,returnCode.data.userList[0])   
            if ( returnCode.code === '0000'  ) {
                if ( morePage ) {
                    this.moreDataUpdate(this.state.userList,returnCode.data.userList )
                }else{
                    this.setState({
                        userList : CommonUtil.isEmpty(returnCode.data.userList) ? [] : returnCode.data.userList,
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
        await this.getBaseData(1,false,this.state.sortItem);

        this.props.navigation.addListener('focus', () => {  
            this.getBaseData(1,false,this.state.sortItem);
        })

     
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
            
            await this.getBaseData(1,false,seq,!this.state.sortType);
        }else{
            this.setState({
                sortItem:seq,moreLoading:true,sortType:true
            })
            
            await this.getBaseData(1,false,seq,!this.state.sortType);
        }
    }


    moveDetail = async(mode,item) => {
        if ( mode === 'B') {
            this.props.navigation.navigate('RewardDetailStack',{
                screenData: item
            });
        }else{
            this.props.navigation.navigate('MemberInfoStack',{
                screenData: item
            });
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
                    <View style={{marginVertical:20,marginHorizontal:20,flexDirection:'row',flexGrow:1}}>
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
                    </View>
                    <View style={styles.mainWrap}>
                        <View style={styles.boxWrap}>
                            <TouchableOpacity 
                                onPress={()=>this.setOrderBy(1)}
                                style={[styles.boxTitleWrap1,this.state.sortItem === 1 ? CommonStyle.selectBackground : CommonStyle.defautBackground ]}
                            >
                                <CustomTextR style={CommonStyle.titleText}>유저명</CustomTextR>
                                {this.state.sortItem === 1 && this.state.sortType ? <DropBoxIconSmallOpen /> : <DropBoxIconSmallClose /> }
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={()=>this.setOrderBy(2)}
                                style={[styles.boxDataWrap2,this.state.sortItem === 2 ? CommonStyle.selectBackground : CommonStyle.defautBackground]}
                            >
                                <CustomTextR style={CommonStyle.titleText}>구매액</CustomTextR>
                                {this.state.sortItem === 2 && this.state.sortType ? <DropBoxIconSmallOpen /> : <DropBoxIconSmallClose /> }
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={()=>this.setOrderBy(3)}
                                style={[styles.boxDataWrap3,{alignItems:'center',flexDirection:'row'},this.state.sortItem === 3 ? CommonStyle.selectBackground : CommonStyle.defautBackground]}
                            >
                                <CustomTextR style={CommonStyle.titleText}>리워드액</CustomTextR>
                                {this.state.sortItem === 3 && this.state.sortType ? <DropBoxIconSmallOpen /> : <DropBoxIconSmallClose /> }
                            </TouchableOpacity>
                            
                        </View>
                    </View>
                    <View style={styles.mainWrap}>
                        {
                            this.state.userList.length === 0 ? 
                                <View style={{flex:1,justifyContent:'center',alignItems:'center',paddingVertical:20}} >
                                    <CustomTextR style={CommonStyle.dataText}>등록된 회원이 없습니다.</CustomTextR>
                                </View>
                            :
                            this.state.userList.map((item, index) => {  
                            return (
                                <View style={styles.boxWrap2} key={index}>
                                    <TouchableOpacity 
                                        style={styles.boxDataWrap1}
                                        onPress={()=>this.moveDetail('A',item)}
                                    >
                                        <CustomTextR style={styles.dataText}>{item.name}</CustomTextR>
                                        <CustomTextR style={styles.dataText3} numberOfLines={1} ellipsizeMode='tail'>
                                            {item.special_code}
                                            <CustomTextR style={styles.dataText3}> {item.approval === false ? '(승인대기)':''}</CustomTextR>
                                        </CustomTextR>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        onPress={()=>this.moveDetail('B',item)}
                                        style={[styles.boxDataWrap2,{justifyContent:'flex-end'}]}
                                    >
                                        <CustomTextR style={styles.dataText}>{CommonUtil.isEmpty(item.total_amount) ? 0 : CommonFunction.currencyFormat(item.total_amount)}원</CustomTextR>
                                        
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        onPress={()=>this.moveDetail('B',item)}
                                        style={styles.boxDataWrap3}
                                    >
                                        <CustomTextR style={styles.dataText}>{CommonUtil.isEmpty(item.reward_point) ? 0 : CommonFunction.currencyFormat(item.reward_point)}원</CustomTextR>
                                        <CustomTextR style={styles.dataText3} numberOfLines={1} ellipsizeMode='tail'>
                                            {item.rate*100}%
                                        </CustomTextR>
                                    </TouchableOpacity>
                                    
                                </View>
                            )
                            })
                        }  
                    </View>
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
    boxTitleWrap1 : {
        flex:1,flexDirection:'row',paddingVertical:10,paddingLeft:20,alignItems:'center'
    },
    boxDataWrap1 : {
        flex:1,justifyContent:'center',alignItems:'flex-start',paddingVertical:10,paddingLeft:20
    },
    boxDataWrap2 : {
        flex:1,flexDirection:'row',flexGrow:1,justifyContent:'flex-end',paddingRight:20,alignItems:'center',paddingVertical:10
    },
    boxDataWrap3 : {
        flex:1,justifyContent:'flex-end',paddingRight:30,alignItems:'flex-end',paddingVertical:10
    },
    dataText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#545454'
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
export default connect(mapStateToProps,null)(Tabs03Screen);
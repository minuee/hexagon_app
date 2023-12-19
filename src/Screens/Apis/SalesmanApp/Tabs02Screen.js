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
import {CustomTextR,CustomTextL, CustomTextB, CustomTextM, TextRobotoM,TextRobotoR,DropBoxIcon,DropBoxIconSmallClose,DropBoxIconSmallOpen} from '../../Components/CustomText';
import CommonFunction from '../../Utils/CommonFunction';
import CommonUtil from '../../Utils/CommonUtil';
import Loader from '../../Utils/Loader';

import SelectCalendar from '../../Utils/SelectCalendar';

const currentDate =  moment().format('YYYY-MM-DD');
const startDate =  moment().subtract(7, 'd').format('YYYY-MM-DD');
const minDate =  moment().subtract(365*1, 'd').format('YYYY-MM-DD');
const maxDate =  moment().format('YYYY-MM-DD');


const mockData1 = [
    { id: 1, username : '홍길동', sales : 18291100 ,count : 200 ,unit : '카톤',itemname : 'trtttttttttt'},
    { id: 2, username : '여미한', sales: 624104 ,count : 200 ,unit : '카톤',itemname : 'trtttttttttt'},
    { id: 3, username : '박정현', sales: 460910 ,count : 200 ,unit : '박스',itemname : 'trtttttttttt'},
    { id: 4, username : '강호동', sales: 260910  ,count : 200 ,unit : '카톤',itemname : 'trtttttttttt'},
    { id: 5, username : '다니엘헤니', sales: 80000 ,count : 200 ,unit : '개',itemname : 'trtttttttttt'}
];

class Tabs02Screen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading : true,
            showModal : false,
            moreLoading : false,
            sortItem : 1,
            formActionStart : startDate,
            formActionEnd : currentDate,
        }
    }

    UNSAFE_componentWillMount() {
        
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

    setOrderBy = (seq) => {
        if ( this.state.sortItem !== seq ) {
            this.setState({
                sortItem:seq
            })
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
                                style={[styles.boxDataWrap1,this.state.sortItem === 1 ? CommonStyle.selectBackground : CommonStyle.defautBackground ]}
                            >
                                <CustomTextR style={CommonStyle.titleText}>유저명</CustomTextR>
                                <DropBoxIconSmallOpen />
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={()=>this.setOrderBy(2)}
                                style={[styles.boxDataWrap2,this.state.sortItem === 2 ? CommonStyle.selectBackground : CommonStyle.defautBackground]}
                            >
                                <CustomTextR style={CommonStyle.titleText}>구매액</CustomTextR>
                                <DropBoxIconSmallOpen />
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={()=>this.setOrderBy(3)}
                                style={[styles.boxDataWrap3,{alignItems:'center',flexDirection:'row'},this.state.sortItem === 3 ? CommonStyle.selectBackground : CommonStyle.defautBackground]}
                            >
                                <CustomTextR style={CommonStyle.titleText}>수량</CustomTextR>
                                <DropBoxIconSmallOpen />
                            </TouchableOpacity>
                            
                        </View>
                    </View>
                    <View style={styles.mainWrap}>
                        {
                            mockData1.map((item, index) => {  
                                return (
                                    <TouchableOpacity 
                                        onPress={()=>this.moveDetail(item)}
                                        style={styles.boxWrap2} key={index}
                                    >
                                        <View style={styles.boxDataWrap1}>
                                            <CustomTextR style={CommonStyle.dataText}>{item.username}</CustomTextR>
                                        </View>
                                        <View style={[styles.boxDataWrap2,{justifyContent:'flex-end'}]}>
                                            <CustomTextR style={CommonStyle.dataText}>{CommonFunction.currencyFormat(item.sales)}원</CustomTextR>
                                            
                                        </View>
                                        <View style={styles.boxDataWrap3}>
                                            <CustomTextR style={CommonStyle.dataText}>{CommonFunction.currencyFormat(item.count)}{item.unit}</CustomTextR>
                                            <CustomTextR style={styles.dataText3} numberOfLines={1} ellipsizeMode='tail'>
                                                {item.itemname}
                                            </CustomTextR>
                                        </View>
                                        
                                    </TouchableOpacity>
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
        userToken : state.GlabalStatus.userToken
    };
}
export default connect(mapStateToProps,null)(Tabs02Screen);
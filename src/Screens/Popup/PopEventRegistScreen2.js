import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Text,Dimensions,RefreshControl,PixelRatio,Image,TouchableOpacity,BackHandler,TextInput,KeyboardAvoidingView,Animated} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
import Modal from 'react-native-modal';
import 'moment/locale/ko'
import  moment  from  "moment";
import ImagePicker from 'react-native-image-crop-picker';
import DatePicker from 'react-native-date-picker';
import {Overlay} from 'react-native-elements';
//공통상수 필요에 의해서 사용
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import CommonStyle from '../../Style/CommonStyle';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {CustomTextR,CustomTextL, CustomTextB, CustomTextM, TextRobotoM,TextRobotoR,DropBoxIcon,DropBoxSearchIcon} from '../../Components/CustomText';
import CommonUtil from '../../Utils/CommonUtil';
import CommonFunction from '../../Utils/CommonFunction';
import Loader from '../../Utils/Loader';
import SelectCalendar from '../../Utils/SelectCalendar';
import SelectSearch from "../../Utils/SelectSearch";
import PopLayerSeleteType from './PopLayerSeleteType';
import PopLayerSeleteGoods from './PopLayerSeleteGoods';

const currentDate =  moment().format('YYYY-MM-DD');
const currentDate2 =  moment().add(7, 'd').format('YYYY-MM-DD');
const minDate =  moment().format('YYYY-MM-DD');
const maxDate =  moment().add(60, 'd').format('YYYY-MM-DD');

const mockData1 = [
    { id: 1, name : '이벤트이벤트이벤트1', checked: false },
    { id: 2, name : '이벤트이벤트이벤트2', checked: false },
    { id: 3, name : '이벤트이벤트이벤트3', checked: false },
    { id: 4, name : '이벤트이벤트이벤트4', checked: false },
    { id: 5, name : '이벤트이벤트이벤트5', checked: false },
]

class PopNoticeRegistScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading : true,
            showModal : false,
            showModalType : false,
            showModalType : 1,
            moreloading : false,
            popLayerView : false,
            closepopLayer : this.closepopLayer.bind(this),
            popLayerView2 : false,
            closepopLayer2 : this.closepopLayer2.bind(this),
            imageUrl : null,
            formActionStart : currentDate,
            formActionEnd : currentDate,
            showBirthModal : false,
            selectTime : new Date(),
            showModalType2 : 1,
            formStartHour : 0,
            formStartMinute : 0,
            formEndHour : 0,
            formEndMinute : 0,
            formPopupType : null,
            formPopupTypeName : null,
            formEventGoods : []
        }
    }

    UNSAFE_componentWillMount() {
      
        this.setState({
            showModal : false,
            showModalType : false,
            showModalType : 1,
            moreloading : false,
            popLayerView : false,
            popLayerView2 : false,
            imageUrl : null,
            formActionStart : currentDate,
            formActionEnd : currentDate2,
            showBirthModal : false,
            selectTime : new Date(),
            showModalType2 : 1,
            formStartHour : 0,
            formStartMinute : 0,
            formEndHour : 0,
            formEndMinute : 0,
            formPopupType : null,
            formPopupTypeName : null
           
        })
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        setTimeout(
            () => {            
                this.setState({loading:false})
            },500
        )
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);          
    }

    handleBackButton = () => {        
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);  
        this.props.navigation.goBack(null);                
        return true;
    };

    closepopLayer = (mode=null) => {
        if ( mode === null ) {
            this.setState({ popLayerView: false})
        }else{
            this.setState({
                popLayerView :false,
                formPopupType : mode,
                formPopupTypeName : mode === 'A' ? '레이어 팝업' : '전면 팝업'
            })
        }
    }; 
    showpopLayer = () => this.setState({ popLayerView: true });

    closepopLayer2 = (arr=[]) => {
        console.log('eventProduct',arr)
        this.setState({
            formEventGoods : arr,
            popLayerView2: false
        })
    }; 
    showpopLayer2 = () => this.setState({ popLayerView2: true });
  
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

    onDayPress = (days) => {
        //console.log('selected day', days);
        if ( this.state.showModalType === 1 ) {
            this.setState({formActionStart:days.dateString});
        }else{
            this.setState({formActionEnd:days.dateString});
        }
        
        this.closeModal();
    }

    animatedHeight2 = new Animated.Value(SCREEN_HEIGHT * 0.35);
    closeBirthModal = async() => {        
        this.setState({ showBirthModal: false })
    };
    showBirthModal = (num) => this.setState({ showBirthModal: true,showModalType2 : num });


    setBirthday = async( datew ) => {
        console.log('setBirthday', datew);
        if ( this.state.showModalType2 === 1 ) {
            this.setState({
                selectTime : datew,
                formStartHour : datew.getHours(),
                formStartMinute : datew.getMinutes(),
            });
        }else {
            this.setState({
                selectTime : datew,
                formEndHour : datew.getHours(),
                formEndMinute : datew.getMinutes(),
            });
        }
        
        
    }

    registPosting = async() => {
        CommonFunction.fn_call_toast('준비중입니다.',2000);
    }

    removeData = async() => {
        CommonFunction.fn_call_toast('준비중입니다.',2000);
    }

    changeProfile = async(cropit, circular = false, mediaType = 'photo') => {
        
        ImagePicker.openPicker({
            width: 900,
            height: 900,
            multiple:false,
            cropping: true,
            cropperCircleOverlay: circular,
            sortOrder: 'none',
            compressImageMaxWidth: 1000,
            compressImageMaxHeight: 1000,
            compressImageQuality: 1,
            compressVideoPreset: 'MediumQuality',
            includeExif: true,
            cropperStatusBarColor: 'white',
            cropperToolbarColor: 'white',
            cropperActiveWidgetColor: 'white',
            cropperToolbarWidgetColor: '#3498DB',
            loadingLabelText:'처리중...',
            forceJpg:true
        })
          .then((response) => {
            //console.log('received image2', response);
            this.setState({
                profileimage : response.path,
                image: {
                    uri: response.path,
                    width: response.width,
                    height: response.height,
                    mime: response.mime,
                },
                images: null,
            });
            this.awsimageupload(
                {
                    type : response.mime === undefined ? 'jpg' :  response.mime,
                    uri : response.path, 
                    height:response.height,
                    width:response.width,
                    fileSize:response.size,
                    fileName:response.modificationDate
                });
          })
          .catch((e) => {
            //console.log(e);
            CommonFunction.fn_call_toast('이미지 선택을 취소하였습니다.',2000)
            //Alert.alert(e.message ? e.message : e);
          });
    }
    selectFilter = async(filt) => {     
        console.log('filt',filt) 
        
        this.setState({
            targetMember:filt.member_pk             
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
                    <KeyboardAvoidingView style={{paddingVertical:0}} behavior="height" enabled> 
                    {this.state.popLayerView && (
                        <View >
                            <Overlay
                                isVisible={this.state.popLayerView}
                                onBackdropPress={this.closepopLayer}
                                windowBackgroundColor="rgba(0, 0, 0, 0.8)"
                                overlayBackgroundColor="tranparent"                                
                                containerStyle={{margin:0,padding:0}}
                            >
                                <View style={styles.popLayerWrap}>
                                    <PopLayerSeleteType screenState={this.state} />
                                </View>
                                
                            </Overlay>
                        </View>
                    )}
                    {this.state.popLayerView2 && (
                        <View >
                            <Overlay
                                isVisible={this.state.popLayerView2}
                                onBackdropPress={this.closepopLayer2}
                                windowBackgroundColor="rgba(0, 0, 0, 0.8)"
                                overlayBackgroundColor="tranparent"                                
                                containerStyle={{margin:0,padding:0}}
                            >
                                <View style={styles.popLayerWrap}>
                                    <PopLayerSeleteGoods screenState={this.state} />
                                </View>
                                
                            </Overlay>
                        </View>
                    )}
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
                         <View style={styles.dataTopWrap}>
                            <View style={{paddingHorizontal:5,flexDirection:'row'}}>
                                <TouchableOpacity 
                                    onPress={()=>this.changeProfile(true,true)}
                                    style={{flex:1,justifyContent:'center'}} 
                                >
                                { !CommonUtil.isEmpty(this.state.imageUrl) ?
                                    <Image
                                        source={{uri:this.state.imageUrl}}
                                        resizeMode={"contain"}
                                        style={{width:PixelRatio.roundToNearestPixel(97),height:PixelRatio.roundToNearestPixel(97)}}
                                    />
                                    :
                                    <Image
                                        source={require('../../../assets/icons/no_image.png')}
                                        resizeMode={"contain"}
                                        style={{width:PixelRatio.roundToNearestPixel(97),height:PixelRatio.roundToNearestPixel(97)}}
                                    />
                                }
                                </TouchableOpacity>
                            </View>
                            <View style={styles.titleWrap}>
                                <CustomTextR style={CommonStyle.titleText}>팝업창 유형선택</CustomTextR>
                                <CustomTextR style={CommonStyle.requiredText}>{'*'}</CustomTextR>
                            </View>
                            <View style={{paddingHorizontal:5,flexDirection:'row'}}>
                                <TouchableOpacity 
                                    onPress={()=> this.showpopLayer()}
                                    style={styles.formTextType}>
                                        <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:DEFAULT_COLOR.base_color_666}}>
                                            {CommonUtil.isEmpty(this.state.formPopupTypeName) ?" 팝업창 유형을 선택해주세요": this.state.formPopupTypeName }
                                        </CustomTextR>
                                </TouchableOpacity>
                                <DropBoxIcon />
                            </View> 
                            <View style={styles.titleWrap}>
                                <CustomTextR style={CommonStyle.titleText}>기간설정</CustomTextR>
                                <CustomTextR style={CommonStyle.requiredText}>{'*'}</CustomTextR>
                            </View>
                           
                            <View style={styles.carlendarWrap}>
                                <TouchableOpacity 
                                    onPress={()=> this.showModal(1)}
                                    style={styles.calendarTextWrap}
                                >
                                    <View style={styles.calendarTextLeftWrap}>
                                        <CustomTextR style={styles.inputText}>{this.state.formActionStart}</CustomTextR>
                                    </View>
                                    <View style={styles.calendarTextRightWrap}>
                                        <Image
                                            source={require('../../../assets/icons/small_calendar.png')}
                                            resizeMode={"contain"}
                                            style={{width:PixelRatio.roundToNearestPixel(20),height:PixelRatio.roundToNearestPixel(20)}}
                                        />
                                    </View>
                                </TouchableOpacity>
                                
                                <View style={styles.betweenWrap}/>
                                <View style={{flex:1}} />
                            </View> 
                            

                            <View style={styles.titleWrap}>
                                <CustomTextR style={CommonStyle.titleText}>시간설정</CustomTextR>
                                <CustomTextR style={CommonStyle.requiredText}>{'*'}</CustomTextR>
                            </View>
                            
                            <View style={styles.carlendarWrap}>
                                <TouchableOpacity 
                                    onPress={()=> this.showBirthModal(1)}
                                    style={styles.calendarTextWrap}
                                >
                                    <View style={styles.calendarTextLeftWrap}>
                                        <CustomTextR style={styles.inputText}>{this.state.formStartHour > 9 ? this.state.formStartHour : '0'+ this.state.formStartHour} : {this.state.formStartMinute > 9 ?this.state.formStartMinute : '0'+ this.state.formStartMinute}</CustomTextR>
                                    </View>
                                    <View style={styles.calendarTextRightWrap}>
                                        <Image
                                            source={require('../../../assets/icons/timer.png')}
                                            resizeMode={"contain"}
                                            style={{width:PixelRatio.roundToNearestPixel(20),height:PixelRatio.roundToNearestPixel(20)}}
                                        />
                                    </View>
                                </TouchableOpacity>
                                <View style={{flex:0.1,justifyContent:'center',alignItems:'center'}}>
                                    
                                </View>
                                <View style={{flex:1}} />
                            </View>
                            <View style={styles.titleWrap}>
                                <CustomTextR style={CommonStyle.titleText}>이벤트선택</CustomTextR>
                                <CustomTextR style={CommonStyle.requiredText}>{'*'}</CustomTextR>
                            </View>
                            <View style={{paddingHorizontal:5,flexDirection:'row'}}>
                                <DropBoxIcon />                           
                                <SelectSearch
                                    isSelectSingle
                                    showSearchBox={true}
                                    searchPlaceHolderText={'이벤트명으로 검색하세요'}
                                    style={styles.unSelectedBox}
                                    selectedTitleStyle={styles.selectBoxText}
                                    colorTheme={DEFAULT_COLOR.base_color_666}
                                    popupTitle="이벤트선택"
                                    title={'이벤트선택'}
                                    cancelButtonText="취소"
                                    selectButtonText="선택"
                                    data={mockData1}
                                    onSelect={data => {
                                        this.selectFilter(data)
                                    }}
                                    onRemoveItem={data => {
                                        mockData1[0].checked = true;
                                    }}
                                    initHeight={SCREEN_HEIGHT * 0.7}
                                />   
                            </View>
                            {/*
                            <View style={styles.titleWrap}>
                                <CustomTextR style={CommonStyle.titleText}>이벤트 상품</CustomTextR>
                                <View style={styles.formTextTypeWrap}>
                                    <TouchableOpacity 
                                        onPress={()=> this.showpopLayer2()}
                                        style={styles.formTextType2}
                                    >
                                        <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#fff'}}>상품선택</CustomTextR>
                                    </TouchableOpacity>
                                </View>                                
                            </View>
                            { this.state.formEventGoods.length === 0  ?
                                <View style={{paddingHorizontal:5}}>
                                    <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:DEFAULT_COLOR.base_color_666}}>
                                        이벤트 상품을 선택해주세요
                                    </CustomTextR>
                                </View> 
                            :
                                <View style={styles.productArrayWrap}>
                                {
                                    this.state.formEventGoods.map((item, index) => {  
                                    return (
                                        <View key={index} style={styles.boxSubWrap}>
                                            <View style={styles.boxLeftWrap}>
                                                <Image
                                                    source={item.icon}
                                                    resizeMode={"contain"}
                                                    style={CommonStyle.defaultIconImage55}
                                                />
                                                
                                            </View>
                                            <View style={styles.boxRightWrap}>
                                                <CustomTextR style={styles.menuTitleText}>{item.name}</CustomTextR>
                                                <CustomTextR style={styles.menuPriceText}>{CommonFunction.currencyFormat(item.price)}원</CustomTextR>
                                            </View>
                                            <View style={styles.boxStockWrap}>
                                                { this.state.eventType === 'LIMIT' &&
                                                <TextInput     
                                                    keyboardType={'number-pad'}                               
                                                    style={[styles.inputBlank,CommonStyle.defaultOneWayFormAlignRight]}
                                                    value={item.stock}
                                                    onChangeText={(text)=>this.setProductStock(text,index)}
                                                    multiline={false}
                                                /> 
                                                }
                                            </View>
                                        </View>
                                        )
                                    })
                                } 
                                </View>

                                }
                            */}
                        </View>
                        <View style={CommonStyle.blankArea}></View>
                        { this.state.moreLoading &&
                            <View style={CommonStyle.moreWrap}>
                                <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} />
                            </View>
                        }
                    </ScrollView>     
                    </KeyboardAvoidingView>    
                    <View 
                        style={{position:'absolute',right:0,bottom:0,width:SCREEN_WIDTH,height:DEFAULT_CONSTANTS.BottomHeight,backgroundColor:DEFAULT_COLOR.base_color,justifyContent:'center',alignItems:'center',flexDirection:'row',borderTopWidth:1, borderTopColor:DEFAULT_COLOR.base_color}}
                    >
                        <TouchableOpacity 
                            style={styles.menuOnBox}
                            onPress={()=> this.registPosting()}
                        >
                            <CustomTextB style={styles.menuOnText}>등록</CustomTextB>
                        </TouchableOpacity> 
                    </View>
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
                    <Modal
                        onBackdropPress={this.closeBirthModal}
                        animationType="slide"
                        onRequestClose={() => {
                        this.setState({showBirthModal: false});
                        }}
                        // useNativeDriver={true}
                        animationInTiming={300}
                        animationOutTiming={300}
                        hideModalContentWhileAnimating
                        isVisible={this.state.showBirthModal}
                        style={{justifyContent: 'flex-end', margin: 0}}
                        // hideModalContentWhileAnimating={true}
                        onSwipeComplete={() => this.closeBirthModal()}
                        propagateSwipe={false}
                        backdropOpacity={0.1}
                    
                    >
                        <Animated.View style={[styles.modalContainer2,{ height: this.animatedHeight2 }]}>
                            <View style={{flex:1,paddingHorizontal:20,justifyContent:'center',alignItems:'center'}}>
                                {
                                    Platform.OS === 'android' ?                                
                                    <DatePicker                                    
                                        locale='ko'
                                        //timeZoneOffsetInMinutes={'ko'}
                                        textColor={DEFAULT_CONSTANTS.base_color}
                                        //date={moment(TodayTimeStamp).add(-20, 'years')}
                                        date={this.state.selectTime}
                                        onDateChange={(date) => {this.setBirthday(date)}}
                                        mode={'time'}
                                        minuteInterval={15}
                                        androidVariant="iosClone"
                                        //androidVariant="nativeAndroid"
                                    />
                                    :
                                    <DatePicker                                    
                                        locale='ko'
                                        textColor={DEFAULT_CONSTANTS.base_color}
                                        //date={this.state.formBirthDay}
                                        date={this.state.selectTime}
                                        onDateChange={(date) => {this.setBirthday(date)}}
                                        mode={'time'}
                                        minuteInterval={15}
                                        
                                    />
                                }
                                
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
        flex:1,            
        backgroundColor : "#fff",
        padding:15
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dataTopWrap : {
        flex:1,backgroundColor:'#fff'
    },
    popLayerWrap : {
        width:SCREEN_WIDTH*0.9,height:SCREEN_HEIGHT*0.8,backgroundColor:'transparent',margin:0,padding:0
    },
    inputText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#444040'
    },
    titleWrap : {
        paddingHorizontal:5,paddingVertical:10,marginTop:15,flexDirection:'row'
    },
    boxSubWrap : {
        flex:1,
        flexDirection:'row',    
        flexGrow:1,    
        paddingVertical: Platform.OS === 'android' ? 5 : 15,
        alignItems: 'center',        
        borderBottomWidth:1,
        borderBottomColor : DEFAULT_COLOR.input_border_color
    },
    carlendarWrap : {
        paddingHorizontal:5,paddingVertical:10,flexDirection:'row'
    },
    calendarTextWrap : {
        flex:1,flexDirection:'row',flexGrow:1,borderWidth:1,borderColor:'#ccc'
    },
    calendarTextWrapNull : {
        flex:1,flexDirection:'row',flexGrow:1
    },
    calendarTextLeftWrap : {
        flex:3,padding:5,justifyContent:'center',alignItems:'center'
    },
    calendarTextRightWrap : {
        flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#e1e1e1'
    },
    betweenWrap : {
        flex:0.1,justifyContent:'center',alignItems:'center'
    },
    productArrayWrap : {
        paddingHorizontal:10
    },
    menuTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),paddingLeft:10
    },
    menuPriceText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),paddingLeft:10,color:'#585858'
    },
    formTextTypeWrap : {
        flex:1,alignItems:'flex-end',justifyContent: 'center',
    },
    formTextType2 : {
        borderWidth:1,borderColor:DEFAULT_COLOR.input_border_color,borderRadius:5,paddingVertical:5,paddingHorizontal:10,backgroundColor:DEFAULT_COLOR.base_color
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
    modalContainer2: {   
        zIndex : 9999,
        position :'absolute',
        width:SCREEN_WIDTH,
        paddingTop: 16,
        backgroundColor: '#fff',
        borderBottomColor : '#ccc',
        borderBottomWidth:0.5
    },
    formTextType : {
        justifyContent: 'center',width:'100%',borderWidth:1,borderColor:DEFAULT_COLOR.input_border_color,borderRadius:5,paddingLeft:10,paddingVertical:5
    },
    selectBoxText  : {
        color:DEFAULT_COLOR.base_color_666,
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),
        lineHeight: DEFAULT_TEXT.fontSize20 * 1,
    },
    selectedTabText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),color:DEFAULT_COLOR.base_color
    },
    unSelectedTabText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),color:'#808080'
    },
    inputBlank : {
        flex:1,paddingVertical:10,borderWidth:1,borderColor:DEFAULT_COLOR.input_border_color,borderRadius:5,backgroundColor:'#fff',justifyContent:'center',alignItems:'center'
    },
    unSelectedBox : {
        borderRadius:5,borderWidth:1,borderColor:DEFAULT_COLOR.input_border_color,paddingVertical:5,paddingHorizontal:10,backgroundColor:'#fff'
    },
    canBoxWrap : {
        flex:1,flexDirection:'row',backgroundColor:'#fff',paddingVertical:10,paddingHorizontal:20,borderTopWidth:1,borderTopColor:'#ccc'
    },
    uncanBoxWrap : {
        flex:1,flexDirection:'row',backgroundColor:'#e1e1e1',paddingVertical:10,paddingHorizontal:20,borderTopWidth:1,borderTopColor:'#ccc'
    },
    tdWrap1 : {
        flex:0.5,justifyContent:'center',alignItems:'center'
    },
    tdWrap2  :{
        flex:2,justifyContent:'center',alignItems:'center'
    },
    tdWrap3 : {
        flex:3,justifyContent:'center',alignItems:'center'
    },
    tdWrap4 : {
        flex:1,justifyContent:'center',alignItems:'center'
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
});


function mapStateToProps(state) {
    return {
        userToken : state.GlabalStatus.userToken
    };
}

export default connect(mapStateToProps,null)(PopNoticeRegistScreen);
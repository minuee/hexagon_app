import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Text,Dimensions,Alert,PixelRatio,Image,TouchableOpacity,BackHandler,TextInput,KeyboardAvoidingView,Animated} from 'react-native';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
import 'moment/locale/ko'
import  moment  from  "moment";
import Modal from 'react-native-modal';
import ImagePicker from 'react-native-image-crop-picker';
import DatePicker from 'react-native-date-picker';
import {CheckBox} from 'react-native-elements';
//공통상수 필요에 의해서 사용
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import CommonStyle from '../../Style/CommonStyle';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {CustomTextR,CustomTextL, CustomTextB, CustomTextM, TextRobotoM,TextRobotoR,DropBoxIcon} from '../../Components/CustomText';
import CommonUtil from '../../Utils/CommonUtil';
import CommonFunction from '../../Utils/CommonFunction';
import SelectCalendar from '../../Utils/SelectCalendar';
import Loader from '../../Utils/Loader';
import { apiObject } from "../Apis";
const RADIOON_OFF = require('../../../assets/icons/checkbox_off.png');
const RADIOON_ON = require('../../../assets/icons/checkbox_on.png');

const currentDate =  moment().format('YYYY.MM.DD HH:MM');
const minDate =  moment().add(1, 'd').format('YYYY-MM-DD');
const maxDate =  moment().add(60, 'd').format('YYYY-MM-DD');

class NoticeModifyScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading : true,
            showModal : false,
            showModalType : 1,
            moreloading : false,
            isSendPush : false,
            formTitle : null,
            formContents : null,
            isNewImage : false,
            thumbnail_img : null,
            image : {},
            formActionStart : currentDate,
            formActionEnd : currentDate,
            showBirthModal : false,
            selectTime : new Date(),
            showModalType2 : 1,
            formStartHour : 9,
            formStartMinute : 30,
            formEndHour : 0,
            formEndMinute : 0,
        }
    }

    async UNSAFE_componentWillMount() {
        
        //console.log('NoticeModifyScreen',this.props.extraData.params.screenData)
        if ( !CommonUtil.isEmpty(this.props.extraData.params.screenData)) {
            this.setState({
                notice_pk : this.props.extraData.params.screenData.notice_pk,
                isSendPush : this.props.extraData.params.screenData.send_push,
                formTitle : this.props.extraData.params.screenData.title,
                formContents : this.props.extraData.params.screenData.content,
                thumbnail_img : this.props.extraData.params.screenData.img_url,
                image : {},
                formActionStart : CommonFunction.convertUnixToDate(this.props.extraData.params.screenData.start_dt,'YYYY-MM-DD'),
                formActionEnd : currentDate,
                selectTime : CommonFunction.convertUnixToNewDate(this.props.extraData.params.screenData.start_dt),
                formStartHour : CommonFunction.convertUnixToDate(this.props.extraData.params.screenData.start_dt,'HH'),
                formStartMinute : CommonFunction.convertUnixToDate(this.props.extraData.params.screenData.start_dt,'mm'),
                formEndHour : 0,
                formEndMinute : 0,
            })
        }else{
            CommonFunction.fn_call_toast('잘못된 접근입니다.',1500);
            setTimeout(
                () => {            
                   this.props.navigation.goBack(null);
                },1500
            )
        }

        this.props.navigation.addListener('focus', () => {  
        })

        this.props.navigation.addListener('blur', () => {            
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
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

    registData = async() => {

        this.setState({moreLoading:true})
        let  thumbnail_new = {data:null};
        //console.log('this.state.image',this.state.image) 
        if ( !CommonUtil.isEmpty(this.state.image)) {
            let filename = this.state.image.filename;
            if ( CommonUtil.isEmpty(this.state.image.filename)) {
                let spotCount = this.state.image.path.split('.').length-1;
                let pathExplode = this.state.image.path.split('.') 
                filename = Platform.OS + moment().unix() + '.'+pathExplode[spotCount];
            }
            try {
                let newImageadata = {
                    name: filename, 
                    size : this.state.image.size,
                    uri:  this.state.image.path , 
                    type: this.state.image.mime
                }
                thumbnail_new = await CommonUtil.SingleImageUpload(this.props.userToken.apiToken,newImageadata,'etc');
            }catch(e) {
                this.setState({loading:false,moreLoading : false})
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.',2000);
                return;
            }
        }
        //console.log('thumbnail_new',thumbnail_new)   
        const formActionStart = CommonUtil.isEmpty(this.state.formActionStart) ? minDate : this.state.formActionStart;
        const formStartHour = CommonUtil.isEmpty(this.state.formStartHour) ? 10 : this.state.formStartHour;
        const formStartMinute = CommonUtil.isEmpty(this.state.formStartMinute) ? minDate : this.state.formStartMinute;
        const uploadTimex = await moment(`${formActionStart} ${formStartHour < 10 ? '0'+formStartHour : formStartHour}:${formStartMinute}`).unix(); 

        let returnCode = {code:9998};     
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/notice/modify/'+this.state.notice_pk;
            const token = this.props.userToken.apiToken;
            
            let sendData = {
                title : this.state.formTitle,
                img_url : !CommonUtil.isEmpty(thumbnail_new.data) ? thumbnail_new.data : this.state.thumbnail_img,
                content : this.state.formContents,
                start_dt : uploadTimex,
                send_push : this.state.isSendPush
            }
            //console.log('sendData',sendData)  
            returnCode = await apiObject.API_updateCommon(this.props,url,token,sendData);          
            //console.log('returnCode',returnCode)   
            if ( returnCode.code === '0000'  ) {
                CommonFunction.fn_call_toast('정상적으로 수정되었습니다.' ,2000);
                this.timeout = setTimeout(
                    () => {
                    this.props.navigation.goBack(null);
                    },
                    2000
                ); 
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.\n[ERR]' + returnCode.msg ,2000);
            }
            
            this.setState({moreLoading:false,loading:false})
        }catch(e){
            //console.log('eeeee',e)  
            this.setState({loading:false,moreLoading : false})
        }
       
    }

   
    actionOrder = async() => {
        Alert.alert(
            DEFAULT_CONSTANTS.appName,
            "공지사항을 수정하시겠습니까?",
            [
                {text: '네', onPress: () =>  this.registData()},
                {text: '아니오', onPress: () => console.log('Cancle')},
                
            ],
            { cancelable: true }
        )  
    }

    updateData = async() => {
        //console.log('formCategoryCode', this.state.formCategoryCode);
        if ( CommonUtil.isEmpty(this.state.formTitle)) {
            CommonFunction.fn_call_toast('제목을 입력해주세요',2000);
            return true;   
        }else if ( this.state.formContents.length < 10) {
            CommonFunction.fn_call_toast('내용을 최소 10자이상 입력해주세요',2000);
            return true;           
        }else{
            this.actionOrder();
        }
    }

    cancleRegist = () => {
        Alert.alert(
            "공지사항 수정 취소",      
            "공지사항 수정을 취소하시겠습니까?",
            [
                {text: '네', onPress: () => this.props.navigation.goBack(null)},
                {text: '아니오', onPress: () => console.log('Cancle')},
                
            ],
            { cancelable: true }
        )  
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
                thumbnail_img : response.path,
                isNewImage : true,
                image: response
            });
            //this.ImageUpload(response)
            
        })
        .catch((e) => {
        //console.log(e);
        CommonFunction.fn_call_toast('이미지 선택을 취소하였습니다.',2000)
        //Alert.alert(e.message ? e.message : e);
        });
    }

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

    render() {
        if ( this.state.loading ) {
            return (
                <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} /> 
            )
        }else {        
            return(
                <SafeAreaView style={ styles.container }>
                    <KeyboardAvoidingView style={{paddingVertical:10}} behavior={Platform.OS === 'ios' ? "padding" : 'height'}  enabled> 
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
                            <View style={styles.ThumbnailWrap}>
                                <TouchableOpacity 
                                    onPress={()=>this.changeProfile(true,true)}
                                    style={{flex:1,justifyContent:'center',alignItems:'center'}} 
                                >
                                { !CommonUtil.isEmpty(this.state.thumbnail_img) ?
                                    <Image
                                        source={{uri: this.state.newImage ? this.state.thumbnail_img : DEFAULT_CONSTANTS.defaultImageDomain + this.state.thumbnail_img}}
                                        resizeMode={"contain"}
                                        style={CommonStyle.defaultBannerImage}
                                    />
                                    :
                                    <Image
                                        source={require('../../../assets/icons/no_image.png')}
                                        resizeMode={"contain"}
                                        style={CommonStyle.defaultImage97}
                                    />
                                }
                                </TouchableOpacity>
                            </View>
                            <View style={styles.titleWrap}>
                                <CustomTextR style={CommonStyle.titleText}>제목</CustomTextR>
                                <CustomTextR style={CommonStyle.requiredText}>{'*'}</CustomTextR>
                            </View>
                            <View style={{paddingHorizontal:5}}>
                                <TextInput          
                                    placeholder={'공지 제목을 입력해주세요'}
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                           
                                    style={[styles.inputBlank,CommonStyle.defaultOneWayForm]}
                                    value={this.state.formTitle}
                                    onChangeText={text=>this.setState({formTitle:text})}
                                    multiline={false}
                                    clearButtonMode='always'
                                />
                            </View> 
                            <View style={styles.titleWrap}>
                                <View style={styles.dataLefttWrap}>
                                    <CustomTextR style={CommonStyle.titleText}>업로드일시</CustomTextR>
                                    <CustomTextR style={CommonStyle.requiredText}>{'*'}</CustomTextR>
                                </View>
                            </View>
                           
                            <View style={styles.carlendarWrap}>
                                <TouchableOpacity 
                                    onPress={()=> this.showModal(1)}
                                    style={styles.calendarTextWrap}
                                >
                                    <View style={styles.calendarTextLeftWrap}>
                                        <CustomTextR style={CommonStyle.dataText}>{this.state.formActionStart}</CustomTextR>
                                    </View>
                                    <View style={styles.calendarTextRightWrap}>
                                        <Image
                                            source={require('../../../assets/icons/small_calendar.png')}
                                            resizeMode={"contain"}
                                            style={CommonStyle.defaultIconImage20}
                                        />
                                    </View>
                                </TouchableOpacity>
                                <View style={{flex:0.1,justifyContent:'center',alignItems:'center'}}>
                                    <CustomTextR style={CommonStyle.dataText}></CustomTextR>
                                </View>
                                <TouchableOpacity 
                                    onPress={()=> this.showBirthModal(1)}
                                    style={styles.calendarTextWrap}
                                >
                                    <View style={styles.calendarTextLeftWrap}>
                                        <CustomTextR style={CommonStyle.dataText}>
                                            {this.state.formStartHour > 9 ? this.state.formStartHour : '0'+ this.state.formStartHour} : {this.state.formStartMinute > 9 ?this.state.formStartMinute : '0'+ this.state.formStartMinute}
                                        </CustomTextR>
                                    </View>
                                    <View style={styles.calendarTextRightWrap}>
                                        <Image
                                            source={require('../../../assets/icons/timer.png')}
                                            resizeMode={"contain"}
                                            style={CommonStyle.defaultIconImage20}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View> 
                            
                            <View style={styles.titleWrap}>
                                <CustomTextR style={CommonStyle.titleText}>내용</CustomTextR>
                                <CustomTextR style={CommonStyle.requiredText}>{'*'}</CustomTextR>
                            </View>
                            <View style={{paddingHorizontal:5}}>
                                <TextInput         
                                    placeholder={'공지 내용을 입력해주세요'}
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                           
                                    style={[
                                        styles.inputBlank,
                                        {
                                            height:200,width:'100%',paddingTop: 5,paddingBottom: 5,paddingLeft: 5,paddingRight: 5,textAlignVertical: 'top',textAlign:'left',fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13)
                                        }]}
                                    value={this.state.formContents}
                                    onChangeText={text=>this.setState({formContents:text})}
                                    multiline={true}
                                    clearButtonMode='always'
                                />
                            </View>

                        </View>
                      
                        <View style={CommonStyle.blankArea}></View>
                        { this.state.moreLoading &&
                            <View style={CommonStyle.moreWrap}>
                                <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} />
                            </View>
                        }
                    </ScrollView>                    
                    
                    <View style={CommonStyle.bottomButtonWrap}>
                        <TouchableOpacity 
                            style={CommonStyle.bottomRightBox}
                            onPress={()=>this.cancleRegist()}
                        >
                            <CustomTextB style={CommonStyle.bottomMenuOnText}>취소</CustomTextB>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={CommonStyle.bottomLeftBox}
                            onPress={()=>this.updateData()}
                        >
                            <CustomTextB style={CommonStyle.bottomMenuOffText}>수정</CustomTextB>
                        </TouchableOpacity>
                    </View>
                    </KeyboardAvoidingView>
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
        flex:1,backgroundColor:'#fff',padding:15
    },
    dataLefttWrap : {
        flex:1,paddingHorizontal:5,paddingVertical:10,marginTop:10,flexDirection:'row'
    },
    dataRightWrap : {
        flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'
    },
    ThumbnailWrap : {
        paddingHorizontal:5,paddingVertical:10,flexDirection:'row'
    },
    titleWrap : {
        paddingHorizontal:5,paddingVertical:10,marginTop:10,flexDirection:'row'
    },
    carlendarWrap : {
        paddingHorizontal:5,paddingVertical:10,flexDirection:'row'
    },
    calendarTextWrap : {
        flex:1,flexDirection:'row',flexGrow:1,borderWidth:1,borderColor:'#ccc'
    },
    calendarTextLeftWrap : {
        flex:3,padding:5,justifyContent:'center',alignItems:'center'
    },
    calendarTextRightWrap : {
        flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#e1e1e1'
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
        borderWidth:1,borderColor:DEFAULT_COLOR.input_border_color,borderRadius:5,backgroundColor:'#fff'
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
export default connect(mapStateToProps,mapDispatchToProps)(NoticeModifyScreen);
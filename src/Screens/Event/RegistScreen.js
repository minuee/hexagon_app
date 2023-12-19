import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Text,Dimensions,RefreshControl,PixelRatio,Image,TouchableOpacity,BackHandler,TextInput,KeyboardAvoidingView,Animated,Alert} from 'react-native';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
import 'moment/locale/ko'
import  moment  from  "moment";
import {CheckBox,Overlay} from 'react-native-elements';
import Modal from 'react-native-modal';
import DatePicker from 'react-native-date-picker';
import ImagePicker from 'react-native-image-picker'
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
import Loader from '../../Utils/Loader';
import SelectCalendar from '../../Utils/SelectCalendar';
import PopLayerSeleteGoods from '../Popup/PopLayerSeleteGoods';
import { apiObject } from "../Apis";

const currentDate =  moment().format('YYYY-MM-DD');
const currentDateHour =  moment().format('HH');
const minDate =  moment().format('YYYY-MM-DD');
const maxDate =  moment().add(60, 'd').format('YYYY-MM-DD');

const RADIOON_OFF = require('../../../assets/icons/check_off.png');
const RADIOON_ON = require('../../../assets/icons/check_on.png');

const mockData1 = [
    { id: 1, name : '한정특가', code : 'LIMIT',checked:false},
    { id: 2, name : '기간할인', code : 'TERM',checked:false},
    { id: 3, name : '할인이벤트', code : 'SALE',checked:false},
]

class RegistScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading : true,
            eventType : 'LIMIT',
            userList : [],
            formEventGoods : [],
            showModal : false,
            showModalType : false,
            showModalType : 1,
            moreloading : false,
            formTitle : null,
            popLayerView : false,
            closepopLayer : this.closepopLayer.bind(this),
            popLayerView2 : false,
            closepopLayer2 : this.closepopLayer2.bind(this),
            formActionStart : currentDate,
            formActionEnd : currentDate,
            showBirthModal : false,
            selectTime : new Date(),
            showModalType2 : 1,
            formStartHour : currentDateHour,
            formStartMinute : '00',
            formEndHour : 0,
            formEndMinute : 0,
            productArray : [],
            setProductArray : this.setProductArray.bind(this),

            photoarray: [],
            thumbnail_img : null,
            isNewImage : false,
        }
    }

    resetForm = () => {
        this.setState({
            loading : true,
            eventType : 'LIMIT',
            userList : [],
            formEventGoods : [],
            showModal : false,
            showModalType : false,
            showModalType : 1,
            formTitle : null,
            moreloading : false,
            popLayerView : false,
            popLayerView2 : false,
            formActionStart : currentDate,
            formActionEnd : currentDate,
            showBirthModal : false,
            selectTime : new Date(),
            showModalType2 : 1,
            formStartHour : currentDateHour,
            formStartMinute : '00',
            formEndHour : 0,
            formEndMinute : 0,
            productArray : [],
           
        })
    }

    setProductArray = (arr) => {
        this.setState({
            productArray : arr
        })
    }
    async UNSAFE_componentWillMount() {
        this.props.navigation.addListener('focus', () => {  
            this.resetForm();              
            BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        })

        this.props.navigation.addListener('blur', () => {            
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        })
    }

    componentDidMount() {
        this.timeout = setTimeout(
            () => {
               this.setState({loading:false});
            },
            500
        ); 
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
        //console.log('eventProduct',arr)
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
        //console.log('setBirthday', datew);
        if ( this.state.showModalType2 === 1 ) {
            this.setState({
                selectTime : datew,
                formStartHour : datew.getHours(),
                formStartMinute : datew.getMinutes() < 10 ? '0' + datew.getMinutes() : datew.getMinutes(),
            });
        }else {
            this.setState({
                selectTime : datew,
                formEndHour : datew.getHours(),
                formStartMinute : datew.getMinutes() < 10 ? '0' + datew.getMinutes() : datew.getMinutes(),
            });
        } 
    }

    cancleRegist = () => {
        Alert.alert(
            DEFAULT_CONSTANTS.appName,
            "이벤트 등록을 취소하시겠습니까?",
            [
                {text: '네', onPress: () => this.props.navigation.goBack(null)},
                {text: '아니오', onPress: () => console.log('Cancle')},
                
            ],
            { cancelable: true }
        )  
    }

    registData = async() => {


        this.setState({moreLoading:true})
        let returnCode = {code:9998};     
        try {            
            let thumbnail_new = this.state.thumbnail_img;
            if ( this.state.isNewImage && this.state.photoarray.length > 0 ) {                
                thumbnail_new = await CommonUtil.SingleImageUpload(this.props.userToken.apiToken,this.state.photoarray[0],'event');
            }
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/event/regist';
           // console.log('url',url) 
            const token = this.props.userToken.apiToken;
            let sDate = this.state.formActionStart + ' ' +this.state.formStartHour+":"+this.state.formStartMinute;
            let eDate = null;
            if ( CommonUtil.isEmpty(this.state.formActionEnd)) {
                eDate = this.state.formActionEnd + '23:59';
            }
            let sDate2 = CommonFunction.convertDateToUnix(sDate);
            let eDate2 = CommonFunction.convertDateToUnix(eDate);
            let sendData = {
                event_gubun : this.state.eventType,
                event_img : !CommonUtil.isEmpty(thumbnail_new.data) ? thumbnail_new.data : null,
                start_dt : sDate2,
                end_dt : eDate2,
                title : this.state.formTitle,  
                product : this.state.formEventGoods
            }
            console.log('sendData',sendData)   
            returnCode = await apiObject.API_registCommon(this.props,url,token,sendData);          
            //console.log('returnCode',returnCode)   
            if ( returnCode.code === '0000'  ) {
                CommonFunction.fn_call_toast('정상적으로 등록되었습니다.' ,2000);
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
            //console.log('eeee',e)   
            this.setState({loading:false,moreLoading : false})
        }
        
    }

    actionOrder = async() => {
        Alert.alert(
            DEFAULT_CONSTANTS.appName,
            "새로운 이벤트를 등록하시겠습니까?",
            [
                {text: '네', onPress: () =>  this.registData()},
                {text: '아니오', onPress: () => console.log('Cancle')},
                
            ],
            { cancelable: true }
        )  
    }

    updateData = async() => {
        if ( CommonUtil.isEmpty(this.state.eventType)) {
            CommonFunction.fn_call_toast('이벤트구분를 선택해주세요.',2000);
            return true;   
        }else if ( CommonUtil.isEmpty(this.state.formTitle)) {
            CommonFunction.fn_call_toast('제목을 입력해주세요',2000);
            return true; 
        }else if ( CommonUtil.isEmpty(this.state.thumbnail_img)) {
            CommonFunction.fn_call_toast('이벤트 이미지를 등록해주세요',2000);
            return true; 
        }else if ( this.state.formEventGoods.length < 1) {
            CommonFunction.fn_call_toast('이벤트 상품을 최소 1개이상 선택해주세요.',2000);
            return;        
        }else{
            this.actionOrder();
            /*
            if ( this.state.eventType === 'LIMIT') {
                const isStocknull = (element) => parseInt(element.stock) > 0;
                let isStockCheck = await this.state.formEventGoods.every((isStocknull));
                if ( isStockCheck ) {
                    this.actionOrder();
                }else{
                    CommonFunction.fn_call_toast('모든 이벤트 상품을 한정수량을 입력해주세요',2000);
                    return;    
                }
            }else{
                this.actionOrder();
            }
            */
            
        }
    }


    removeProducts = async(idx) => { 
        let newArray = this.state.formEventGoods.filter((item,index) => index !== idx );
        this.setState({
            formEventGoods : newArray
        })
    }

    changeProfile = async() => {        
        const options = {
            noData: true,
            title : '이미지 선택',
            takePhotoButtonTitle : '카메라 찍기',
            chooseFromLibraryButtonTitle:'이미지 선택',
            cancelButtonTitle : '취소'
        }
        ImagePicker.showImagePicker(options, response => {
            try {
                if( response.type.indexOf('image') != -1) {
                    if (response.uri) {
                        console.log('response.uri', response)
                        if ( parseInt((this.state.attachFileSize+response.fileSize)/1024/1024) > 50 ) {
                            Alert.alert('image upload error', '50MB를 초과하였습니다.');
                            return;
                        }else{

                            //console.log('localcheckfile()', 'response = ' + JSON.stringify(response))

                            let fileName = response.fileName;
                            if ( CommonUtil.isEmpty(fileName)) {
                                let spotCount = response.uri.split('.').length-1;
                                let pathExplode = response.uri.split('.') 
                                fileName = Platform.OS + moment().unix() + '.'+pathExplode[spotCount];
                            }
                            const photoarray = [{
                                type : response.type === undefined ? 'image/jpeg' :  response.type,
                                uri : response.uri, 
                                size:response.fileSize,
                                name:fileName
                            }];
                            //console.log('lresponse.uri',response.uri)
                            this.setState({
                                photoarray,
                                isNewImage:true,
                                thumbnail_img : response.uri,
                                attachFileSize :  this.state.attachFileSize+response.fileSize
                            })
                        }
                        
                    }
                }else{
                    Alert.alert('image upload error', '정상적인 이미지 파일이 아닙니다.');
                    return;
                }
            }catch(e){
                console.log("eerorr ", e)        
            }
        })
    }

    render() {
        if ( this.state.loading ) {
            return (
                <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} /> 
            )
        }else {        
            return(
                <SafeAreaView style={ styles.container }>
                    <KeyboardAvoidingView style={{paddingVertical:0}} behavior="height" enabled> 
                    {this.state.popLayerView2 && (
                        <View >
                            <Overlay
                                isVisible={this.state.popLayerView2}
                                //onBackdropPress={this.closepopLayer2}
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
                            
                            <View style={styles.titleWrap}>
                                <CustomTextR style={CommonStyle.titleText}>이벤트구분</CustomTextR>
                                <CustomTextR style={CommonStyle.requiredText}></CustomTextR>
                            </View>
                            <View style={styles.carlendarWrap}>
                                {
                                mockData1.map((item, index) => {  
                                return (
                                    <View style={{flex:1,flexDirection:'row'}} key={index}>
                                        <CheckBox 
                                            containerStyle={{padding:0,margin:0}}   
                                            iconType={'FontAwesome'}
                                            checkedIcon={<Image source={RADIOON_ON} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                            uncheckedIcon={<Image source={RADIOON_OFF} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                            checkedColor={DEFAULT_COLOR.base_color}                          
                                            checked={this.state.eventType === item.code}
                                            size={PixelRatio.roundToNearestPixel(15)}                                    
                                            onPress={() => this.setState({eventType:item.code})}
                                        />
                                        <TouchableOpacity 
                                            onPress={() => this.setState({eventType:item.code})}
                                            style={[styles.detailRightWrap,{flex:3}]}
                                        >
                                            <CustomTextR style={CommonStyle.titleText}>{item.name}</CustomTextR>    
                                        </TouchableOpacity>
                                    </View>
                                )
                                })
                            }
                            </View> 
                            <View style={styles.titleWrap}>
                                <CustomTextR style={CommonStyle.titleText}>제목</CustomTextR>
                                <CustomTextR style={CommonStyle.requiredText}>{'*'}</CustomTextR>
                            </View>
                            <View style={{paddingHorizontal:5}}>
                                <TextInput          
                                    placeholder={'이벤트 제목을 입력해주세요'}
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                           
                                    style={[styles.inputBlank,CommonStyle.defaultOneWayForm]}
                                    value={this.state.formTitle}
                                    onChangeText={text=>this.setState({formTitle:text})}
                                    multiline={false}
                                    clearButtonMode='always'
                                />
                            </View> 

                            <View style={styles.titleWrap}>
                                <CustomTextR style={CommonStyle.titleText}>이벤트이미지</CustomTextR>
                                <CustomTextR style={CommonStyle.requiredText}>{'*'}</CustomTextR>
                            </View>
                            <View style={{paddingHorizontal:5}}>
                                <TouchableOpacity 
                                    onPress={()=>this.changeProfile(true,true)}
                                    style={{flex:1,justifyContent:'center'}} 
                                >
                                { !CommonUtil.isEmpty(this.state.thumbnail_img) ?
                                    this.state.isNewImage ?
                                    <Image
                                        source={{uri:this.state.thumbnail_img}}
                                        resizeMode={"contain"}
                                        style={{width:'100%',height:100}}
                                    />
                                    :
                                    <Image
                                        source={{uri:DEFAULT_CONSTANTS.defaultImageDomain + this.state.thumbnail_img}}
                                        resizeMode={"contain"}
                                        style={{width:'100%',height:100}}
                                    />
                                    :
                                    <Image
                                        source={require('../../../assets/icons/default_category.png')}
                                        resizeMode={"contain"}
                                        style={CommonStyle.defaultImage97}
                                    />
                                }
                                </TouchableOpacity>
                            </View>
                            <View style={styles.titleWrap}>
                                <CustomTextR style={CommonStyle.titleText}>기간설정</CustomTextR>
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
                                            style={CommonStyle.defaultIconImage20}
                                        />
                                    </View>
                                </TouchableOpacity>
                                <View style={styles.betweenWrap}>
                                    {this.state.eventType === 'TERM' && <CustomTextR style={styles.inputText}>~</CustomTextR>}
                                </View>
                                {this.state.eventType === 'TERM' ?
                                <TouchableOpacity 
                                    onPress={()=> this.showModal(2)}
                                    style={styles.calendarTextWrap}
                                >
                                    <View style={styles.calendarTextLeftWrap}>
                                        <CustomTextR style={styles.inputText}>{this.state.formActionEnd}</CustomTextR>
                                    </View>
                                    <View style={styles.calendarTextRightWrap}>
                                        <Image
                                            source={require('../../../assets/icons/small_calendar.png')}
                                            resizeMode={"contain"}
                                            style={CommonStyle.defaultIconImage20}
                                        />
                                    </View>
                                </TouchableOpacity>
                                :
                                <View style={styles.calendarTextWrapNull} />
                                }
                            </View> 
                            <View style={styles.titleWrap}>
                                <CustomTextR style={CommonStyle.titleText}>시간설정</CustomTextR>
                            </View>
                            <View style={styles.carlendarWrap}>
                                <TouchableOpacity 
                                    onPress={()=> this.showBirthModal(1)}
                                    style={styles.calendarTextWrap}
                                >
                                    <View style={styles.calendarTextLeftWrap}>
                                        <CustomTextR style={styles.inputText}>{this.state.formStartHour} :  {this.state.formStartMinute}</CustomTextR>
                                    </View>
                                    <View style={styles.calendarTextRightWrap}>
                                        <Image
                                            source={require('../../../assets/icons/timer.png')}
                                            resizeMode={"contain"}
                                            style={CommonStyle.defaultIconImage20}
                                        />
                                    </View>
                                </TouchableOpacity>
                                <View style={styles.betweenWrap}/>
                                <View style={{flex:1}} />
                            </View>

                            <View style={styles.titleWrap}>
                                <CustomTextR style={CommonStyle.titleText}>이벤트 상품 선택</CustomTextR>
                                <View style={styles.formTextTypeWrap}>
                                    <TouchableOpacity 
                                        onPress={()=> this.showpopLayer2()}
                                        style={styles.formTextType}
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
                                            { !CommonUtil.isEmpty(item.thumb_img) ?
                                                <Image
                                                    source={{uri:DEFAULT_CONSTANTS.defaultImageDomain + item.thumb_img}}
                                                    resizeMode={"contain"}
                                                    style={CommonStyle.defaultImage40}
                                                />
                                                :
                                                <Image
                                                    source={require('../../../assets/icons/no_image.png')}
                                                    resizeMode={"contain"}
                                                    style={CommonStyle.defaultImage40}
                                                />
                                            }                                                
                                            </View>
                                            <View style={styles.boxRightWrap}>
                                                <CustomTextR style={styles.menuTitleText}>{item.product_name}</CustomTextR>
                                                <CustomTextR style={styles.menuPriceText}>{CommonFunction.currencyFormat(item.event_each_price)}원(낱개)</CustomTextR>
                                            </View>
                                           
                                            <TouchableOpacity 
                                                style={styles.boxCloseWrap}
                                                onPress={()=> this.removeProducts(index)}
                                                hitSlop={{left:10,right:5,top:10,bottom:20}}
                                            >
                                                <Image
                                                    source={require('../../../assets/icons/btn_close.png')}
                                                    resizeMode={"contain"}
                                                    style={CommonStyle.defaultIconImage}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        )
                                    })
                                } 
                                </View>
                            }
                        </View>


                        <View style={CommonStyle.blankArea}></View>
                        { this.state.moreLoading &&
                            <View style={CommonStyle.moreWrap}>
                                <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} />
                            </View>
                        }
                    </ScrollView>                    
                    </KeyboardAvoidingView>
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
                            <CustomTextB style={CommonStyle.bottomMenuOffText}>등록</CustomTextB>
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
    titleWrap : {
        paddingHorizontal:5,paddingVertical:10,marginTop:10,flexDirection:'row',alignItems:'center'
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
    popLayerWrap : {
        width:SCREEN_WIDTH*0.9,height:SCREEN_HEIGHT*0.8,backgroundColor:'transparent',margin:0,padding:0
    },
    inputText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#444040'
    },
    formTextTypeWrap : {
        flex:1,alignItems:'flex-end',justifyContent: 'center',
    },
    formTextType : {
        borderWidth:1,borderColor:DEFAULT_COLOR.input_border_color,borderRadius:5,paddingVertical:5,paddingHorizontal:10,backgroundColor:DEFAULT_COLOR.base_color
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
    productArrayWrap : {
        paddingHorizontal:10
    },
    menuTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),paddingLeft:10
    },
    menuPriceText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),paddingLeft:10,color:'#585858'
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
    selecterWrap : {
        flex:1,borderWidth:1,borderColor:DEFAULT_COLOR.input_border_color,borderRadius:5,marginBottom:10
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
    boxStockWrap : {
        flex:1.5,        
        justifyContent:'center',
        alignItems:'center'
    },
    boxCloseWrap : {
        flex:0.8,      
        justifyContent:'center',
        alignItems:'flex-end'
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
export default connect(mapStateToProps,mapDispatchToProps)(RegistScreen);
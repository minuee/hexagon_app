import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Text,Dimensions,RefreshControl,PixelRatio,Image,TouchableOpacity,BackHandler,TextInput,KeyboardAvoidingView,Animated,Alert} from 'react-native';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
import Modal from 'react-native-modal';
import 'moment/locale/ko'
import  moment  from  "moment";
import ImagePicker from 'react-native-image-picker'
import DatePicker from 'react-native-date-picker';
import {CheckBox,Overlay} from 'react-native-elements';
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
import { apiObject } from "../Apis";
import SelectType from '../../Utils/SelectType';
import SelectSearch from '../../Utils/SelectSearch';
import SelectCalendar from '../../Utils/SelectCalendar';
import PopLayerSeleteType from './PopLayerSeleteType';
import PopLayerSeleteGoods from '../Banner/PopLayerSeleteGoods';

const currentDate =  moment().format('YYYY-MM-DD');
const currentDateHour =  moment().format('HH');
const currentDate2 =  moment().add(7, 'd').format('YYYY-MM-DD');
const minDate =  moment().format('YYYY-MM-DD');
const maxDate =  moment().add(60, 'd').format('YYYY-MM-DD');
const RADIOON_OFF = require('../../../assets/icons/check_off.png');
const RADIOON_ON = require('../../../assets/icons/check_on.png');

const mockData1 = [
    { id: 1, name : '상품', code : 'PRODUCT',checked:false},
    { id: 2, name : '이벤트', code : 'EVENT',checked:false},
]

class PopEventModifyScreen extends Component {
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
            imageUrl : null,
            newImage : null,
            formTitle : null,
            formEventPk : 0,
            formActionStart : currentDate,
            formActionEnd : currentDate,
            showBirthModal : false,
            selectTime : new Date(),
            showModalType2 : 1,
            formStartHour : currentDateHour,
            formStartMinute : '00',
            formEndHour : 0,
            formEndMinute : 0,
            formPopupType : 'Layer',
            inlinkType : 'PRODUCT',
            formPopupTypeName : '레이어팝업',
            eventList :[],
            popLayerView2 : false,
            closepopLayer2 : this.closepopLayer2.bind(this),
            setProductArray : this.setProductArray.bind(this),
            topCategory : [],
            productArray : [],
            target_data : null
            
        }
    }

    setProductArray = (arr) => {
        this.setState({
            productArray : arr
        })
    }

    setEventList = async(arr) => {
        let newData = [];
        let formEventPk = this.state.formEventPk;
        await arr.forEach(function(element,index,array){     
            newData.push({id : index,name : element.title,code : element.event_pk ,checked : element.event_pk === formEventPk ?  true : false})               
       });
        this.setState({
            eventList : newData
        })
    }
   
    getBaseData = async() => {

        let returnCode = {code:9998};
        const aliveDate =  moment().unix();
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/event/list';
            const token = this.props.userToken.apiToken;
            let sendData = null;
            returnCode = await apiObject.API_getPageList(this.props,url,token,sendData);
            if ( returnCode.code === '0000'  ) {
                let arrayTmp = await returnCode.data.eventList.filter((info) => (CommonUtil.isEmpty(info.end_dt) || info.end_dt > aliveDate) );
                this.setEventList(arrayTmp);
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
            let productData = {}
            if ( !CommonUtil.isEmpty(this.props.extraData.params.screenData.productdetail) ) {
                productData = {
                    product_pk :  this.props.extraData.params.screenData.productdetail.product_pk,
                    thumb_img : this.props.extraData.params.screenData.productdetail.thumb_img,
                    product_name : this.props.extraData.params.screenData.productdetail.product_name,
                    each_price : this.props.extraData.params.screenData.productdetail.each_price,
                    event_each_price : this.props.extraData.params.screenData.productdetail.event_each_price,
                }
            }
            await this.setState({
                popup_pk : this.props.extraData.params.screenData.popup_pk,
                popup_gubun : this.props.extraData.params.screenData.popup_gubun,
                formPopupType : this.props.extraData.params.screenData.popup_type,
                formPopupTypeName : this.props.extraData.params.screenData.popup_type === 'Layer' ? '레이어' : '전면',
                formTitle : this.props.extraData.params.screenData.title,
                imageUrl : this.props.extraData.params.screenData.img_url,
                formEventPk : this.props.extraData.params.screenData.inlink_type === 'EVENT' ? this.props.extraData.params.screenData.target_pk : 0,
                inlinkType : this.props.extraData.params.screenData.inlink_type,
                target_data : this.props.extraData.params.screenData.inlink_type === 'PRODUCT' ?  this.props.extraData.params.screenData.productdata : {},
                formActionStart : CommonFunction.convertUnixToDate(this.props.extraData.params.screenData.start_dt,'YYYY-MM-DD'),
                formActionEnd : currentDate,
                selectTime : CommonFunction.convertUnixToNewDate(this.props.extraData.params.screenData.start_dt),
                formStartHour : CommonFunction.convertUnixToDate(this.props.extraData.params.screenData.start_dt,'HH'),
                formStartMinute : CommonFunction.convertUnixToDate(this.props.extraData.params.screenData.start_dt,'mm'),
                formEndHour : 0,
                formEndMinute : 0,
            })
            await this.getBaseData();
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
    closepopLayer2 = (item) => {        
        if ( !CommonUtil.isEmpty(item)) {
            this.setState({target_data : item })
        }
        this.setState({ popLayerView2: false})
    }; 
    showpopLayer2 = () => this.setState({ popLayerView2: true });


    setBirthday = async( datew ) => {        
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

    localcheckfile = () => {        
        const options = {
            noData: true,
            privateDirectory: true,
            title : '이미지 선택',
            takePhotoButtonTitle : '카메라 찍기',
            chooseFromLibraryButtonTitle:'이미지 선택',
            cancelButtonTitle : '취소'
        }
        ImagePicker.showImagePicker(options, response => {
            try {
                if( response.type.indexOf('image') != -1) {
                    if (response.uri) {                        
                        if ( parseInt((response.fileSize)/1024/1024) >= 5 ) {
                            Alert.alert(DEFAULT_CONSTANTS.appName, '이미지사이즈가 5MB를 초과하였습니다.');
                            return;
                        }else{                            
                            let fileName = response.fileName;
                            if ( CommonUtil.isEmpty(fileName)) {
                                let spotCount = response.uri.split('.').length-1;
                                let pathExplode = response.uri.split('.') 
                                fileName = Platform.OS + moment().unix() + '.'+pathExplode[spotCount];
                            }
                            this.setState({
                                imageUrl : response.uri,
                                attachFileSize :  this.state.attachFileSize+response.fileSize,
                                newImage : {
                                    type : response.type === undefined ? 'image/jpeg' :  response.type,
                                    uri : response.uri, 
                                    size:response.fileSize,
                                    name:fileName
                                }
                            })
                        }
                        
                    }
                }else{
                    Alert.alert(DEFAULT_CONSTANTS.appName, '정상적인 이미지 파일이 아닙니다.');
                    return;
                }
            }catch(e){
            }
        })
    }

    registData = async() => {
        this.setState({moreLoading:true})
        let  thumbnail_new = {data:null};
        if ( !CommonUtil.isEmpty(this.state.newImage)) {
            try {
                thumbnail_new = await CommonUtil.SingleImageUpload(this.props.userToken.apiToken,this.state.newImage,'etc');
            }catch(e) {
                this.setState({loading:false,moreLoading : false})
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.',2000);
                return;
            }
        }
        let returnCode = {code:9998};     
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/popevent/modify/' + this.state.popup_pk;        
            const token = this.props.userToken.apiToken;
            let expireDate = this.state.formActionStart + ' ' +this.state.formStartHour+":"+this.state.formStartMinute;
            let expireDate2 = CommonFunction.convertDateToUnix(expireDate);
            let sendData = {
                popup_gubun : 'Event',
                popup_type : this.state.formPopupType,
                start_dt : expireDate2,
                img_url : !CommonUtil.isEmpty(thumbnail_new.data) ? thumbnail_new.data : this.state.imageUrl,
                title : this.state.formTitle,
                inlink_type : this.state.inlinkType,
                target_pk : this.state.inlinkType === 'EVENT' ? this.state.formEventPk : this.state.target_data.product_pk   
            }            
            returnCode = await apiObject.API_updateCommon(this.props,url,token,sendData);
            if ( returnCode.code === '0000'  ) {
                CommonFunction.fn_call_toast('정상적으로 수정되었습니다.' ,2000);
                this.timeout = setTimeout(
                    () => {
                       this.props.navigation.goBack(null);
                    },2000
                ); 
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.\n[ERR]' + returnCode.msg ,2000);
            }
            this.setState({moreLoading:false,loading:false})
        }catch(e){
            this.setState({loading:false,moreLoading : false})
        }
        
    }

    actionOrder = async() => {
        Alert.alert(
            DEFAULT_CONSTANTS.appName,
            "팝업 이벤트를 수정하시겠습니까?",
            [
                {text: '네', onPress: () =>  this.registData()},
                {text: '아니오', onPress: () => console.log('Cancle')}
            ],
            { cancelable: true }
        )  
    }
    
    registPosting = async() => {

        if ( CommonUtil.isEmpty(this.state.formTitle)) {
            CommonFunction.fn_call_toast('제목을 입력해주세요',2000);
            return true;    
        }else if ( CommonUtil.isEmpty(this.state.formPopupType)) {
            CommonFunction.fn_call_toast('팝업창 유형을 선택해주세요',2000);
            return true;    
        }else if ( this.state.inlinkType === 'EVENT' && this.state.formEventPk === 0 ) {
            CommonFunction.fn_call_toast('이벤트를 선택해주세요',2000);
            return true;   
        }else if ( this.state.inlinkType === 'PRODUCT' && CommonUtil.isEmpty(this.state.target_data)) {
            CommonFunction.fn_call_toast('상품을 선택해주세요',2000);
            return true;      
        }else{
            this.actionOrder();
        }
    }

    selectFilter = async(filt) => {
        this.setState({formEventPk:filt.code })
    }

    removePopop = async(bool) => {
        this.setState({moreLoading :true})
        let returnCode = {code:9998};     
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/popevent/stop/' + this.state.popup_pk;
            const token = this.props.userToken.apiToken;
            let endtDate =  moment().format('YYYY-MM-DD HH:mm');
            
            let sendData = {
                end_dt : 0//CommonFunction.convertDateToUnix(endtDate)
            }
            returnCode = await apiObject.API_patchCommon(this.props,url,token,sendData);
            if ( returnCode.code === '0000'  ) {
                CommonFunction.fn_call_toast('정상적으로 중치처리되었습니다.' ,1500);
                this.timeout = setTimeout(
                    () => {
                       this.props.navigation.goBack(null);
                    },
                    1500
                ); 
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.\n[ERR]' + returnCode.msg ,2000);
            }
            this.setState({moreLoading:false,loading:false})
        }catch(e){
            this.setState({loading:false,moreLoading : false})
        } 
        this.setState({switchOn1 : bool})
    }

    cancleRegist = () => {
        Alert.alert(
            DEFAULT_CONSTANTS.appName,
            "팝업이벤트를 중지하시겠습니까?",
            [
                {text: '네', onPress: () => this.removePopop()},
                {text: '아니오', onPress: () => console.log('Cancle')}
            ],
            { cancelable: true }
        )  
    }

    setBannerType = async(type) => {
        if ( type === 'EVENT') {
            if ( this.state.eventList.length === 0 ) {
                await this.getEventList();
            }
            await this.setState({inlinkType:type})
        }else{
            this.setState({inlinkType:type})
        }
    }

    getEventList = async() => {
        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/event/list';
            const token = this.props.userToken.apiToken;
            let sendData = null;
            returnCode = await apiObject.API_getPageList(this.props,url,token,sendData);
            if ( returnCode.code === '0000'  ) {
                let cateArray = await returnCode.data.eventList.map(({ event_pk, title }) => ({ id: event_pk, name: title }));
                this.setState({ eventList : cateArray})
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.',2000);
            }
            this.setState({moreLoading:false,loading:false})
        }catch(e){
            this.setState({loading:false,moreLoading : false})
        }
    }

    moveDetail = (item) => {
        this.props.navigation.navigate('ProductDetailStack',{
            screenData:item
        })
    }

    renderTarget = (type) => {        
        if ( type === 'PRODUCT' ) {
            return (
                <View style={{paddingBottom:15}}>
                    <View style={styles.titleWrap}>
                        <CustomTextR style={CommonStyle.titleText}>상품 선택</CustomTextR>
                        <View style={styles.formTextTypeWrap}>
                            <TouchableOpacity 
                                onPress={()=> this.showpopLayer2()}
                                style={styles.formTextType2}
                            >
                                <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#fff'}}>상품선택</CustomTextR>
                            </TouchableOpacity>
                        </View>
                                                    
                    </View>
                    {
                        !CommonUtil.isEmpty(this.state.target_data) &&
                        <View style={styles.boxSubWrap}>
                            <TouchableOpacity 
                                onPress={()=>this.moveDetail({product_pk:this.state.target_data.product_pk})}
                                style={styles.boxLeftWrap}
                            >
                            { 
                                !CommonUtil.isEmpty(this.state.target_data.thumb_img) ?
                                <Image
                                    source={{uri:DEFAULT_CONSTANTS.defaultImageDomain + this.state.target_data.thumb_img}}
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
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={()=>this.moveDetail({product_pk:this.state.target_data.product_pk})}
                                style={styles.boxRightWrap}
                            >
                                <CustomTextR style={styles.menuTitleText}>{this.state.target_data.product_name}</CustomTextR>
                                {
                                    this.state.target_data.event_each_price > 0 ?
                                    <CustomTextR style={styles.menuPriceText}>
                                        {CommonFunction.currencyFormat(this.state.target_data.event_each_price)}원(낱개)
                                    </CustomTextR>
                                    :
                                    <CustomTextR style={styles.menuPriceText}>{CommonFunction.currencyFormat(this.state.target_data.each_price)}원(낱개)</CustomTextR>
                                }
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.boxStockWrap}
                                onPress={()=> this.setState({target_data : null})}
                                hitSlop={{left:10,right:5,top:10,bottom:20}}
                            >
                                <Image
                                    source={require('../../../assets/icons/btn_close.png')}
                                    resizeMode={"contain"}
                                    style={CommonStyle.defaultIconImage}
                                />
                            </TouchableOpacity>
                        </View>
                    } 
                </View>
            )
        }else {
            return (
                <View style={{paddingHorizontal:15,marginTop:10}}>
                    <DropBoxIcon />                           
                    <SelectType
                        isSelectSingle
                        showSearchBox={false}
                        //searchPlaceHolderText={'카테고리명으로 검색하세요'}
                        style={styles.unSelectedBox}
                        selectedTitleStyle={styles.selectBoxText}
                        colorTheme={DEFAULT_COLOR.base_color_666}
                        popupTitle={'이벤트선택'}
                        title={'이벤트선택'}
                        cancelButtonText="취소"
                        selectButtonText="선택"
                        data={this.state.eventList}
                        onSelect={data => {
                            this.selectFilter(data)
                        }}
                        onRemoveItem={data => {
                            this.state.eventList[0].checked = true;
                        }}
                        initHeight={SCREEN_HEIGHT * 0.7}
                    />   
                </View>
            )

        }
    }
    
    render() {
        if ( this.state.loading ) {
            return (
                <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} /> 
            )
        }else {        
            return(
                <View style={styles.container}>
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
                    <KeyboardAvoidingView keyboardVerticalOffset={0} style={{flex:1,paddingVertical:10}} behavior={Platform.OS === 'ios' ? "padding" : 'height'}  enabled> 
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
                                <TouchableOpacity 
                                    onPress={()=>this.localcheckfile()}
                                    style={{flex:1,justifyContent:'center'}} 
                                >
                                { 
                                    !CommonUtil.isEmpty(this.state.imageUrl) ?
                                    <Image
                                        source={{uri: this.state.newImage ? this.state.imageUrl : DEFAULT_CONSTANTS.defaultImageDomain + this.state.imageUrl}}
                                        resizeMode={"contain"}
                                        style={CommonStyle.defaultImage97}
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
                                <CustomTextR style={CommonStyle.requiredText2}>{'*'}</CustomTextR>
                            </View>
                            <View style={{paddingHorizontal:15}}>
                                <TextInput          
                                    placeholder={'배너 제목을 입력해주세요'}
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                           
                                    style={[styles.inputBlank,CommonStyle.defaultOneWayForm]}
                                    value={this.state.formTitle}
                                    onChangeText={text=>this.setState({formTitle:text})}
                                    multiline={false}
                                    clearButtonMode='always'
                                />
                            </View> 
                            <View style={styles.titleWrap}>
                                <CustomTextR style={CommonStyle.titleText}>팝업창 유형선택</CustomTextR>
                                <CustomTextR style={CommonStyle.requiredText}>{'*'}</CustomTextR>
                            </View>
                            <View style={{paddingHorizontal:15,flexDirection:'row'}}>
                                <TouchableOpacity 
                                    onPress={()=> this.showpopLayer()}
                                    style={styles.formTextType}>
                                        <CustomTextR style={CommonStyle.dataText}>
                                            {CommonUtil.isEmpty(this.state.formPopupTypeName) ?" 팝업창 유형을 선택해주세요": this.state.formPopupTypeName }
                                        </CustomTextR>
                                </TouchableOpacity>
                                <DropBoxIcon />
                            </View> 
                            <View style={styles.titleWrap}>
                                <CustomTextR style={CommonStyle.titleText}>오픈시간설정</CustomTextR>
                                <CustomTextR style={CommonStyle.requiredText}>{'*'}</CustomTextR>
                            </View>
                           
                            <View style={styles.carlendarWrap}>
                                <TouchableOpacity onPress={()=> this.showModal(1)} style={styles.calendarTextWrap}>
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
                                <View style={{flex:0.1,justifyContent:'center',alignItems:'center'}}>
                                    <CustomTextR style={styles.inputText}></CustomTextR>
                                </View>
                                <TouchableOpacity onPress={()=> this.showBirthModal(1)} style={styles.calendarTextWrap}>
                                    <View style={styles.calendarTextLeftWrap}>
                                        <CustomTextR style={styles.inputText}>
                                            {this.state.formStartHour > 9 ? this.state.formStartHour : '0'+ this.state.formStartHour} : {this.state.formStartMinute}
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
                            <View>
                                <View style={styles.titleWrap}>
                                    <CustomTextR style={CommonStyle.titleText}>대상분류</CustomTextR>
                                    <CustomTextR style={CommonStyle.requiredText}></CustomTextR>
                                </View>
                                <View style={styles.dataWrap}>
                                    {
                                        mockData1.map((item, index) => {  
                                        return (
                                            <View style={styles.CheckBoxWrap} key={index}>
                                                <CheckBox 
                                                    containerStyle={{padding:0,margin:0}}   
                                                    iconType={'FontAwesome'}
                                                    checkedIcon={<Image source={RADIOON_ON} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                                    uncheckedIcon={<Image source={RADIOON_OFF} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                                    checkedColor={DEFAULT_COLOR.base_color}                          
                                                    checked={this.state.inlinkType === item.code}
                                                    size={PixelRatio.roundToNearestPixel(15)}                                    
                                                    onPress={() => this.setBannerType(item.code)}
                                                />
                                                <TouchableOpacity 
                                                    onPress={() => this.setBannerType(item.code)}
                                                    style={[styles.detailRightWrap,{flex:3}]}
                                                >
                                                    <CustomTextR style={styles.menuTitleText}>{item.name}</CustomTextR>    
                                                </TouchableOpacity>
                                            </View>
                                        )
                                        })
                                    }
                                </View>                                 
                                {this.renderTarget(this.state.inlinkType)}                                
                            </View>
                        </View>                        
                        <View style={CommonStyle.blankArea}></View>
                        { 
                            this.state.moreLoading &&
                            <View style={CommonStyle.moreWrap}>
                                <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} />
                            </View>
                        }
                    </ScrollView>
                    <View style={CommonStyle.bottomButtonWrap}>
                        <TouchableOpacity style={CommonStyle.bottomRightBox} onPress={()=>this.cancleRegist()}>
                            <CustomTextB style={CommonStyle.bottomMenuOnText}>중지</CustomTextB>
                        </TouchableOpacity>
                        <TouchableOpacity style={CommonStyle.bottomLeftBox} onPress={()=>this.registPosting()}>
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
                </View>
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
        flex:1,backgroundColor:'#fff'
    },
    titleWrap : {
        paddingHorizontal:15,paddingVertical:10,marginTop:10,flexDirection:'row'
    },
    
    popLayerWrap : {
        width:SCREEN_WIDTH*0.9,height:SCREEN_HEIGHT*0.8,backgroundColor:'transparent',margin:0,padding:0
    },
    inputText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#444040'
    },
    carlendarWrap : {
        paddingHorizontal:5,paddingVertical:0,flexDirection:'row'
    },
    calendarTextWrap : {
        flex:1,flexDirection:'row',flexGrow:1,borderWidth:1,borderColor:'#ccc',marginHorizontal:10
    },
    calendarTextLeftWrap : {
        flex:3,padding:5,justifyContent:'center',alignItems:'center'
    },
    calendarTextRightWrap : {
        flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#e1e1e1'
    },
    dataWrap : {
        flex:1,paddingHorizontal:15,flexDirection:'row',flexGrow:1,flexWrap:'wrap',alignContent:'space-between'
    },
    CheckBoxWrap:{
        flex:1,flexDirection:'row',justifyContent:'center',minWidth:SCREEN_WIDTH/3-20,paddingVertical:5
    },
    formTextTypeWrap : {
        flex:1,alignItems:'flex-end',justifyContent: 'center',
    },
    formTextType2 : {
        borderWidth:1,borderColor:DEFAULT_COLOR.input_border_color,borderRadius:5,paddingVertical:5,paddingHorizontal:10,backgroundColor:DEFAULT_COLOR.base_color
    },
    boxSubWrap : {
        flex:1,
        flexDirection:'row',    
        flexGrow:1,    
        paddingHorizontal: 15,
        paddingVertical: Platform.OS === 'android' ? 10 : 15,
        alignItems: 'center',        
        borderBottomWidth:1,
        borderBottomColor : DEFAULT_COLOR.input_border_color
    },
    
    menuTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),paddingLeft:10
    },
    menuPriceText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),paddingLeft:10,color:'#585858'
    },
    boxStockWrap : {
        flex:1.5,        
        justifyContent:'center',
        alignItems:'center'
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
        flex:1,backgroundColor:DEFAULT_COLOR.base_color,justifyContent:'center',alignItems:'center',paddingVertical:15
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
function mapDispatchToProps(dispatch) {
    return {                
        _fn_ToggleCategory:(bool)=> {
            dispatch(ActionCreator.fn_ToggleCategory(bool))
        },
        _fn_selectCategoryName:(str)=> {
            dispatch(ActionCreator.fn_selectCategoryName(str))
        },
        _saveUserToken:(str)=> {
            dispatch(ActionCreator.saveUserToken(str))
        }
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(PopEventModifyScreen);
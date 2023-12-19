import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Alert,Dimensions,RefreshControl,PixelRatio,Image,TouchableOpacity,BackHandler,TextInput,KeyboardAvoidingView,Animated} from 'react-native';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
import 'moment/locale/ko'
import  moment  from  "moment";
import ImagePicker from 'react-native-image-crop-picker';
import ImagePicker2 from 'react-native-image-picker'
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
import Loader from '../../Utils/Loader';
import { apiObject } from "../Apis";

const RADIOON_OFF = require('../../../assets/icons/check_off.png');
const RADIOON_ON = require('../../../assets/icons/check_on.png');

class ProductRegistScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading : true,
            showModal : false,
            showModalType : 1,
            moreloading : false,
            isNewImage : false,
            image : {},
            thumbnail_img : null,
            uploadImageThumb : null,
            attachFileSize : 0,
            arrayImageUpload : false,
            photoarray: [],
            uploadImagaArray01 :null ,
            uploadImagaArray02 :null ,
            uploadImagaArray03 :null ,
            uploadImagaArray04 :null ,
            can_point : true,
            is_nonPoint : false,
            use_yn : false,
            formProductName : null,
            formPriceOne : 0,            
            formPriceBox : 0,
            formPriceBoxEach : 0,
            formPriceTon : 0,
            formPriceTonEach : 0,
            formEventPriceOne : 0,
            formEventEachStock : 0,            
            formEventPriceBox : 0,
            formEventPriceBoxEach : 0,
            formEventBoxStock : 0,
            formEventPriceTon : 0,
            formEventPriceTonEach : 0,
            formEventCartonStock : 0,
            formMaterial : null
        }
    }
    
    resetForm = () => {
        this.setState({
            loading : true,
            can_point : true,
            is_nonPoint : false,
            formProductName : "",
            formPriceOne : 0,            
            formPriceBox : 0,
            formPriceBoxEach : 0,
            formPriceTon : 0,
            formPriceTonEach : 0,
            formEventPriceOne : 0,            
            formEventPriceBox : 0,
            formEventPriceBoxEach : 0,
            formEventPriceTon : 0,
            formEventPriceTonEach : 0,
            formMaterial : "",
            formEventEachStock : 0,    
            formEventBoxStock : 0,    
            formEventCartonStock : 0,    
        })
    }

    async UNSAFE_componentWillMount() {        
        if ( !CommonUtil.isEmpty(this.props.extraData.params.screenData)) {
            this.setState({
                categoryData : this.props.extraData.params.screenData,
            })
        }else{
            CommonFunction.fn_call_toast('잘못된 접근입니다.',2000);
            setTimeout(
                () => {            
                   this.props.navigation.goBack(null);
                },500
            )
        }

        this.props.navigation.addListener('focus', () => {  
            this.resetForm();              
            BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
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
    }
    animatedHeight = new Animated.Value(SCREEN_HEIGHT * 0.5);
    closeModal = () => {
        this.setState({ showModal: false });
    }
    showModal = (mode) => {
        this.setState({showModal: true,showModalType : mode})
    }

    singleLocalImageUpload = async(newImageadata,index = 0) => {
        try {
            let thumbnail_new = await CommonUtil.SingleImageUpload(this.props.userToken.apiToken,newImageadata,'product');
            switch(index) {
                case 1 : this.setState({uploadImagaArray01:!CommonUtil.isEmpty(thumbnail_new.data) ? thumbnail_new.data : null});break;
                case 2 : this.setState({uploadImagaArray02:!CommonUtil.isEmpty(thumbnail_new.data) ? thumbnail_new.data : null});break;
                case 3 : this.setState({uploadImagaArray03:!CommonUtil.isEmpty(thumbnail_new.data) ? thumbnail_new.data : null});break;
                case 4 : this.setState({uploadImagaArray04:!CommonUtil.isEmpty(thumbnail_new.data) ? thumbnail_new.data : null});break;
                default : this.setState({uploadImageThumb:!CommonUtil.isEmpty(thumbnail_new.data) ? thumbnail_new.data : null}); break;   
            }
            return true;           
        }catch(e) {
            this.setState({loading:false,moreLoading : false})
            CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.',2000);
            return false;
        }
    }

    registData = async() => {
        this.setState({moreLoading:true})
        let filename = this.state.image.filename;
        if ( CommonUtil.isEmpty(this.state.image.filename)) {
            let spotCount = this.state.image.path.split('.').length-1;
            let pathExplode = this.state.image.path.split('.') 
            filename = Platform.OS + moment().unix() + '.'+pathExplode[spotCount];
        }
        let newImageadata = {
            name: filename, 
            size : this.state.image.size,
            uri:  this.state.image.path, 
            type: this.state.image.mime
        }
        let thumbnailImage = await CommonUtil.SingleImageUpload(this.props.userToken.apiToken,newImageadata,'product');        
        if ( !CommonUtil.isEmpty(thumbnailImage.data)  ) {
            const promises = this.state.photoarray.map((element,index) => this.singleLocalImageUpload(element,parseInt(index+1)));
            await Promise.all(promises);
            let returnCode = {code:9998};     
            try {            
                const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/product/regist';            
                const token = this.props.userToken.apiToken;
                let sendData = {
                    reg_member :  this.props.userToken.member_pk,
                    use_yn :  this.state.use_yn,
                    category_pk : this.state.categoryData.category_pk,
                    can_point : this.state.can_point,
                    is_nonpoint :  this.state.is_nonPoint,
                    product_name : this.state.formProductName ,
                    each_price : this.state.formPriceOne ,            
                    box_price : this.state.formPriceBox,
                    box_unit : this.state.formPriceBoxEach,
                    carton_price : this.state.formPriceTon,
                    carton_unit : this.state.formPriceTonEach,
                    event_each_price : this.state.formEventPriceOne, 
                    event_each_stock : this.state.formEventEachStock, 
                    event_box_price : this.state.formEventPriceBox,
                    event_box_unit : this.state.formEventPriceBoxEach,
                    event_box_stock : this.state.formEventBoxStock, 
                    event_carton_price : this.state.formEventPriceTon,
                    event_carton_unit : this.state.formEventPriceTonEach,
                    event_carton_stock : this.state.formEventCartonStock, 
                    material : this.state.formMaterial,
                    thumb_img : !CommonUtil.isEmpty(thumbnailImage.data) ? thumbnailImage.data : '',
                    detail_img1 : this.state.uploadImagaArray01,
                    detail_img2 : this.state.uploadImagaArray02,
                    detail_img3 : this.state.uploadImagaArray03,
                    detail_img4 : this.state.uploadImagaArray04,
                }
                returnCode = await apiObject.API_registCommon(this.props,url,token,sendData);
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
                this.setState({loading:false,moreLoading : false})
            }
        }else{
            this.setState({moreLoading:false,loading:false})
            CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.' ,2000);
        }
    }

    actionOrder = async() => {
        Alert.alert(
            DEFAULT_CONSTANTS.appName,
            "상품을 등록하시겠습니까?",
            [
                {text: '네', onPress: () =>  this.registData()},
                {text: '아니오', onPress: () => console.log('Cancle')},
                
            ],
            { cancelable: true }
        )  
    }

    updateData = async() => {
        if ( CommonUtil.isEmpty(this.state.formProductName)) {
            CommonFunction.fn_call_toast('상품명을 입력해주세요',2000);return true;  
        }else if ( CommonUtil.isEmpty(this.state.formPriceOne)) {
            CommonFunction.fn_call_toast('낱개단가를 입력해주세요',2000);return true;    
        }else if ( CommonUtil.isEmpty(this.state.formMaterial)) {
            CommonFunction.fn_call_toast('재질정보를 입력해주세요',2000);return true;      
        }else if ( CommonUtil.isEmpty(this.state.image)) {
            CommonFunction.fn_call_toast('대표 썸네일을 필수로 등록해주세요',2000);return true; 
        }else if ( CommonUtil.isEmpty(this.state.photoarray)) {
            CommonFunction.fn_call_toast('상세 이미지는 1개이상 필수로 등록해주세요',2000);return true;        
        }else{
           this.actionOrder()
        }
    }

    removeData = async() => {
        CommonFunction.fn_call_toast('준비중입니다.',2000);
    }

    cancleRegist = () => {
        Alert.alert(
            DEFAULT_CONSTANTS.appName,  
            "상품 등록을 취소하시겠습니까?",
            [
                {text: 'OK', onPress: () => this.props.navigation.goBack(null)},
                {text: 'CANCEL', onPress: () => console.log('Cancle')}
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
            this.setState({thumbnail_img : response.path,image: response,});
          })
          .catch((e) => {            
            CommonFunction.fn_call_toast('이미지 선택을 취소하였습니다.',2000)
          });
    }

    removeAttachImage = async(idx) => {
        let selectedFilterList = await this.state.photoarray.filter((info,index) => index !== idx);
        this.setState({
            photoarray: selectedFilterList,
            attachFileSize: this.state.attachFileSize - this.state.photoarray[idx].fileSize,
        })
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
        ImagePicker2.showImagePicker(options, response => {
            try {
                if( response.type.indexOf('image') != -1) {
                    if (response.uri) {
                        if ( parseInt((this.state.attachFileSize+response.fileSize)/1024/1024) >= 5 ) {
                            Alert.alert('image upload error', '5MB를 초과하였습니다.');
                            return;
                        }else{
                            let fileName = response.fileName;
                            if ( CommonUtil.isEmpty(fileName)) {
                                let spotCount = response.path.split('.').length-1;
                                let pathExplode = response.path.split('.') 
                                fileName = Platform.OS + moment().unix() + '.'+pathExplode[spotCount];
                            }
                            this.state.photoarray.push({
                                type : response.type === undefined ? 'image/jpeg' :  response.type,
                                uri : response.uri, 
                                size:response.fileSize,
                                name:fileName
                            });
                            this.setState({
                                attachFileSize :  this.state.attachFileSize+response.fileSize
                            })
                            this.ScrollView2.scrollToEnd({ animated: true});
                        }
                    }
                }else{
                    Alert.alert('image upload error', '정상적인 이미지 파일이 아닙니다.');
                    return;
                }
            }catch(e){
            }
        })
    }

    handleChoosePhoto = async() => {              
        await this.localcheckfile();     
    }

    renderImageUpload (){
        return (
            <View style={{flex:1,flexGrow:1,flexDirection:'row'}}>
                {
                    this.state.photoarray.map((data, index) => {
                    return (                
                        <View style={styles.imageOuterWrap} key={index}>
                            <TouchableOpacity onPress={() => this.removeAttachImage(index)} style={styles.imageDataWarp}>
                                <Image
                                    source={require('../../../assets/icons/btn_del_img.png')}
                                    resizeMode='contain'
                                    style={{ width: 24, height: 24 }}
                                />
                            </TouchableOpacity>
                            <Image
                                source={{ uri: data.uri }}
                                resizeMode='cover'
                                style={{ width: "100%", height: '100%' }}
                            />
                        </View>
                    )}
                    )
                }
                {this.state.photoarray.length < 4 &&
                    <TouchableOpacity 
                        onPress={() => this.handleChoosePhoto()}
                        style={styles.imageOuterWrap2}>
                        <Image
                            source={require('../../../assets/icons/btn_add_img.png')}
                            resizeMode='contain'
                            style={{width:'100%',height:'100%'}}
                        />
                    </TouchableOpacity>
                }
            </View>
        )
    }


    render() {
        if ( this.state.loading ) {
            return (
                <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} /> 
            )
        }else {        
            return(
                <View style={ styles.container }>
                    <KeyboardAvoidingView style={{paddingVertical:0}} behavior="height" enabled> 
                    <ScrollView
                        ref={(ref) => {
                            this.ScrollView = ref;
                        }}
                        showsVerticalScrollIndicator={false}
                        indicatorStyle={'white'}
                        scrollEventThrottle={16}
                        keyboardDismissMode={'on-drag'}
                        style={{width:'100%'}}
                        nestedScrollEnabled={true}
                    >
                        <View style={{flex:1,backgroundColor:'#fff',padding:15}}>
                            <View style={styles.cellDefaultWrap}>
                                <TouchableOpacity onPress={()=>this.changeProfile(true,true)} style={{flex:1,justifyContent:'center'}}>
                                    { 
                                        !CommonUtil.isEmpty(this.state.thumbnail_img) ?
                                        <Image
                                            source={{uri:this.state.thumbnail_img}}
                                            resizeMode={"contain"}
                                            style={{width:PixelRatio.roundToNearestPixel(97),height:PixelRatio.roundToNearestPixel(97)}}
                                        />
                                        :
                                        <Image
                                            source={require('../../../assets/icons/default_category.png')}
                                            resizeMode={"contain"}
                                            style={{width:PixelRatio.roundToNearestPixel(97),height:PixelRatio.roundToNearestPixel(97)}}
                                        />
                                    }
                                </TouchableOpacity>
                            </View>
                            <View style={styles.cellDefaultRowWrap}>
                                <CustomTextR style={CommonStyle.titleText}>상품명</CustomTextR>
                                <CustomTextR style={CommonStyle.requiredText}>{'*'}</CustomTextR>
                            </View>
                            <View style={styles.cellDefaultWrap}>
                                <TextInput                         
                                    style={[styles.inputBlank,CommonStyle.defaultOneWayForm]}
                                    value={this.state.formProductName}
                                    onChangeText={text=>this.setState({formProductName:text})}
                                    multiline={false}
                                    clearButtonMode='always'
                                />
                            </View> 
                            <View style={{paddingHorizontal:5,marginTop:15,flexDirection:'row'}}>
                                <CustomTextR style={CommonStyle.titleText}>가격</CustomTextR>
                                <CustomTextR style={CommonStyle.requiredText}>{'*'}</CustomTextR>
                            </View>
                            <View style={{paddingHorizontal:5}}>
                                <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11),color:'#555'}}>단위당 가격</CustomTextR>                                
                            </View>
                            <View style={{paddingHorizontal:5,paddingVertical:10,flexDirection:'row'}}>
                                <View style={styles.boxLeftWrap}>
                                    <CustomTextR style={CommonStyle.titleText}>낱개</CustomTextR>
                                </View>
                                <View style={styles.boxRightWrap}>
                                    <TextInput       
                                        keyboardType={'number-pad'}
                                        style={[styles.inputBlank,CommonStyle.defaultOneWayFormAlignRight]}
                                        value={this.state.formPriceOne.toString()}
                                        onChangeText={text=>this.setState({formPriceOne:text})}
                                        multiline={false}
                                        clearButtonMode='always'
                                    />      
                                </View> 
                            </View> 
                            <View style={styles.cellDefaultWrap15}>
                                <View style={styles.boxLeftWrap}>
                                    <CustomTextR style={CommonStyle.titleText}>박스당</CustomTextR>
                                </View>
                                <View style={styles.boxRightWrap}>
                                    <TextInput     
                                        keyboardType={'number-pad'}                               
                                        style={[styles.inputBlank,CommonStyle.defaultOneWayFormAlignRight]}
                                        value={this.state.formPriceBox.toString()}
                                        onChangeText={text=>this.setState({formPriceBox:text})}
                                        multiline={false}
                                        clearButtonMode='always'
                                    />   
                                </View> 
                            </View> 
                            <View style={styles.cellDefaultWrap5}>
                                <View style={styles.boxLeftWrap}></View>
                                <View style={styles.boxRightWrap2}>
                                    <TextInput
                                        keyboardType={'number-pad'}
                                        style={[styles.inputBlank,CommonStyle.defaultOneWayFormAlignRight]}
                                        value={this.state.formPriceBoxEach.toString()}
                                        onChangeText={text=>this.setState({formPriceBoxEach:text})}
                                        multiline={false}
                                        clearButtonMode='always'
                                    />      
                                </View> 
                                <View style={styles.boxLeftWrap}>
                                    <CustomTextR style={CommonStyle.titleText}>개입</CustomTextR>
                                </View>
                            </View>

                            <View style={styles.cellDefaultWrap15}>
                                <View style={styles.boxLeftWrap}>
                                    <CustomTextR style={CommonStyle.titleText}>카톤당</CustomTextR>
                                </View>
                                <View style={styles.boxRightWrap}>
                                    <TextInput
                                        keyboardType={'number-pad'}
                                        style={[styles.inputBlank,CommonStyle.defaultOneWayFormAlignRight]}
                                        value={this.state.formPriceTon.toString()}
                                        onChangeText={text=>this.setState({formPriceTon:text})}
                                        multiline={false}
                                        clearButtonMode='always'
                                    />
                                </View>
                            </View> 
                            <View style={styles.cellDefaultWrap5}>
                                <View style={styles.boxLeftWrap}></View>
                                <View style={styles.boxRightWrap2}>
                                    <TextInput
                                        keyboardType={'number-pad'}
                                        style={[styles.inputBlank,CommonStyle.defaultOneWayFormAlignRight]}
                                        value={this.state.formPriceTonEach.toString()}
                                        onChangeText={text=>this.setState({formPriceTonEach:text})}
                                        multiline={false}
                                        clearButtonMode='always'
                                    />      
                                </View> 
                                <View style={styles.boxLeftWrap}>
                                    <CustomTextR style={CommonStyle.titleText}>개입</CustomTextR>
                                </View>
                            </View> 
                            <View style={{paddingHorizontal:5,marginTop:10}}>
                                <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11),color:'#666'}}>1개이상 낱개 필수입력</CustomTextR>                                
                            </View>  
                            <View style={{paddingHorizontal:5,marginTop:20,flexDirection:'row',alignItems:'center'}}>
                                <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11),color:'#555'}}>이벤트 정보</CustomTextR>    
                                <CustomTextR style={[CommonStyle.requiredText2,{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11)}]}>{' * 필요시에만 등록'}</CustomTextR>                            
                            </View>                            
                            <View style={{paddingHorizontal:5,paddingVertical:10,flexDirection:'row'}}>
                                <View style={styles.boxLeftWrap}>
                                    <CustomTextR style={CommonStyle.titleText}>낱개</CustomTextR>
                                </View>
                                <View style={styles.boxRightWrap}>
                                    <TextInput
                                        keyboardType={'number-pad'}
                                        style={[styles.inputBlank,CommonStyle.defaultOneWayFormAlignRight]}
                                        value={this.state.formEventPriceOne.toString()}
                                        onChangeText={text=>this.setState({formEventPriceOne:text})}
                                        multiline={false}
                                        clearButtonMode='always'
                                    />      
                                </View> 
                            </View> 
                            <View style={styles.cellDefaultWrap5}>
                                <View style={styles.boxLeftWrap}></View>
                                <View style={styles.boxRightWrap3}>
                                    <TextInput
                                        keyboardType={'number-pad'}
                                        style={[styles.inputBlank,CommonStyle.defaultOneWayFormAlignRight]}
                                        placeholder={'한정이벤트시 적용'}
                                        value={this.state.formEventEachStock.toString()}
                                        onChangeText={text=>this.setState({formEventEachStock:text})}
                                        multiline={false}
                                        clearButtonMode='always'
                                    />      
                                </View> 
                                <View style={styles.boxLeftWrap3}>
                                    <CustomTextR style={CommonStyle.dataText}>한정이벤트시 판매수량</CustomTextR>
                                </View>
                            </View>
                            <View style={styles.cellDefaultWrap15}>
                                <View style={styles.boxLeftWrap}>
                                    <CustomTextR style={CommonStyle.titleText}>박스당</CustomTextR>
                                </View>
                                <View style={styles.boxRightWrap}>
                                    <TextInput
                                        keyboardType={'number-pad'}
                                        style={[styles.inputBlank,CommonStyle.defaultOneWayFormAlignRight]}
                                        value={this.state.formEventPriceBox.toString()}
                                        onChangeText={text=>this.setState({formEventPriceBox:text})}
                                        multiline={false}
                                        clearButtonMode='always'
                                    />      
                                </View> 
                            </View> 
                            <View style={styles.cellDefaultWrap5}>
                                <View style={styles.boxLeftWrap}></View>
                                <View style={styles.boxRightWrap2}>
                                    <TextInput
                                        keyboardType={'number-pad'}
                                        style={[styles.inputBlank,CommonStyle.defaultOneWayFormAlignRight]}
                                        value={this.state.formEventPriceBoxEach.toString()}
                                        onChangeText={text=>this.setState({formEventPriceBoxEach:text})}
                                        multiline={false}
                                        clearButtonMode='always'
                                    />      
                                </View> 
                                <View style={styles.boxLeftWrap}>
                                    <CustomTextR style={CommonStyle.titleText}>개입</CustomTextR>
                                </View>
                            </View>
                            <View style={styles.cellDefaultWrap5}>
                                <View style={styles.boxLeftWrap}></View>
                                <View style={styles.boxRightWrap3}>
                                    <TextInput
                                        keyboardType={'number-pad'}
                                        style={[styles.inputBlank,CommonStyle.defaultOneWayFormAlignRight]}
                                        placeholder={'한정이벤트시 적용'}
                                        value={this.state.formEventBoxStock.toString()}
                                        onChangeText={text=>this.setState({formEventBoxStock:text})}
                                        multiline={false}
                                        clearButtonMode='always'
                                    />      
                                </View> 
                                <View style={styles.boxLeftWrap3}>
                                    <CustomTextR style={CommonStyle.dataText}>박스,한정이벤트시 판매수량</CustomTextR>
                                </View>
                            </View>
                            <View style={styles.cellDefaultWrap15}>
                                <View style={styles.boxLeftWrap}>
                                    <CustomTextR style={CommonStyle.titleText}>카톤당</CustomTextR>
                                </View>
                                <View style={styles.boxRightWrap}>
                                    <TextInput
                                        keyboardType={'number-pad'}
                                        style={[styles.inputBlank,CommonStyle.defaultOneWayFormAlignRight]}
                                        value={this.state.formEventPriceTon.toString()}
                                        onChangeText={text=>this.setState({formEventPriceTon:text})}
                                        multiline={false}
                                        clearButtonMode='always'
                                    />      
                                </View> 
                            </View> 
                            <View style={styles.cellDefaultWrap5}>
                                <View style={styles.boxLeftWrap}></View>
                                <View style={styles.boxRightWrap2}>
                                    <TextInput
                                        keyboardType={'number-pad'}
                                        style={[styles.inputBlank,CommonStyle.defaultOneWayFormAlignRight]}
                                        value={this.state.formEventPriceTonEach.toString()}
                                        onChangeText={text=>this.setState({formEventPriceTonEach:text})}
                                        multiline={false}
                                        clearButtonMode='always'
                                    />      
                                </View>
                                <View style={styles.boxLeftWrap}>
                                    <CustomTextR style={CommonStyle.titleText}>개입</CustomTextR>
                                </View> 
                            </View> 
                            <View style={styles.cellDefaultWrap5}>
                                <View style={styles.boxLeftWrap}></View>
                                <View style={styles.boxRightWrap3}>
                                    <TextInput
                                        keyboardType={'number-pad'}
                                        style={[styles.inputBlank,CommonStyle.defaultOneWayFormAlignRight]}
                                        placeholder={'한정이벤트시 적용'}
                                        value={this.state.formEventCartonStock.toString()}
                                        onChangeText={text=>this.setState({formEventCartonStock:text})}
                                        multiline={false}
                                        clearButtonMode='always'
                                    />      
                                </View> 
                                <View style={styles.boxLeftWrap3}>
                                    <CustomTextR style={CommonStyle.dataText}>카톤,한정이벤트시 판매수량</CustomTextR>
                                </View>
                            </View>
                            <View style={styles.cellDefaultRowWrap}>
                                <CustomTextR style={CommonStyle.titleText}>재질</CustomTextR>
                                <CustomTextR style={CommonStyle.requiredText}>{'*'}</CustomTextR>
                            </View>
                            <View style={styles.cellDefaultWrap}>
                                <TextInput                                    
                                    style={[styles.inputBlank,CommonStyle.defaultOneWayForm]}
                                    value={this.state.formMaterial}
                                    onChangeText={text=>this.setState({formMaterial:text})}
                                    multiline={false}
                                    clearButtonMode='always'
                                />
                            </View>
                            <View style={styles.cellDefaultRowWrap}>
                                <CustomTextR style={CommonStyle.titleText}>적립금 사용가능여부</CustomTextR>
                                <CustomTextR style={CommonStyle.requiredText}></CustomTextR>
                            </View>
                            <View style={styles.cellDefaultWrap}>
                                <View style={styles.CheckBoxWrap}>
                                    <CheckBox 
                                        containerStyle={{padding:0,margin:0}}   
                                        iconType={'FontAwesome'}
                                        checkedIcon={<Image source={RADIOON_ON} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                        uncheckedIcon={<Image source={RADIOON_OFF} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                        checkedColor={DEFAULT_COLOR.base_color}                          
                                        checked={this.state.can_point}
                                        size={PixelRatio.roundToNearestPixel(15)}                                    
                                        onPress={() => this.setState({can_point : true})}
                                    />
                                    <TouchableOpacity 
                                        onPress={() => this.setState({can_point : true})}    
                                        style={[styles.detailRightWrap,{flex:3}]}
                                    >
                                        <CustomTextR style={styles.menuTitleText}>사용가능</CustomTextR>    
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.CheckBoxWrap}>
                                    <CheckBox 
                                        containerStyle={{padding:0,margin:0}}   
                                        iconType={'FontAwesome'}
                                        checkedIcon={<Image source={RADIOON_ON} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                        uncheckedIcon={<Image source={RADIOON_OFF} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                        checkedColor={DEFAULT_COLOR.base_color}                          
                                        checked={!this.state.can_point}
                                        size={PixelRatio.roundToNearestPixel(15)}                                    
                                        onPress={() => this.setState({can_point : false})}
                                    />
                                    <TouchableOpacity 
                                        onPress={() => this.setState({can_point : false})}    
                                        style={[styles.detailRightWrap,{flex:3}]}
                                    >
                                        <CustomTextR style={styles.menuTitleText}>사용불가</CustomTextR>    
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.cellDefaultRowWrap}>
                                <CustomTextR style={CommonStyle.titleText}>적립제외 상품여부</CustomTextR>
                                <CustomTextR style={CommonStyle.requiredText}></CustomTextR>
                            </View>
                            <View style={styles.cellDefaultWrap}>
                                <View style={styles.CheckBoxWrap}>
                                    <CheckBox 
                                        containerStyle={{padding:0,margin:0}}   
                                        iconType={'FontAwesome'}
                                        checkedIcon={<Image source={RADIOON_ON} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                        uncheckedIcon={<Image source={RADIOON_OFF} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                        checkedColor={DEFAULT_COLOR.base_color}                          
                                        checked={this.state.is_nonPoint}
                                        size={PixelRatio.roundToNearestPixel(15)}                                    
                                        onPress={() => this.setState({is_nonPoint : true})}
                                    />
                                    <TouchableOpacity 
                                        onPress={() => this.setState({is_nonPoint : true})}    
                                        style={[styles.detailRightWrap,{flex:3}]}
                                    >
                                        <CustomTextR style={styles.menuTitleText}>대상</CustomTextR>    
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.CheckBoxWrap}>
                                    <CheckBox 
                                        containerStyle={{padding:0,margin:0}}   
                                        iconType={'FontAwesome'}
                                        checkedIcon={<Image source={RADIOON_ON} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                        uncheckedIcon={<Image source={RADIOON_OFF} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                        checkedColor={DEFAULT_COLOR.base_color}                          
                                        checked={!this.state.is_nonPoint}
                                        size={PixelRatio.roundToNearestPixel(15)}                                    
                                        onPress={() => this.setState({is_nonPoint : false})}
                                    />
                                    <TouchableOpacity 
                                        onPress={() => this.setState({is_nonPoint : false})}    
                                        style={[styles.detailRightWrap,{flex:3}]}
                                    >
                                        <CustomTextR style={styles.menuTitleText}>비대상</CustomTextR>    
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.cellDefaultRowWrap}>
                                <CustomTextR style={CommonStyle.titleText}>사용여부</CustomTextR>
                                <CustomTextR style={CommonStyle.requiredText}></CustomTextR>
                            </View>
                            <View style={styles.cellDefaultWrap}>
                                <View style={styles.CheckBoxWrap}>
                                    <CheckBox 
                                        containerStyle={{padding:0,margin:0}}   
                                        iconType={'FontAwesome'}
                                        checkedIcon={<Image source={RADIOON_ON} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                        uncheckedIcon={<Image source={RADIOON_OFF} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                        checkedColor={DEFAULT_COLOR.base_color}                          
                                        checked={this.state.use_yn}
                                        size={PixelRatio.roundToNearestPixel(15)}                                    
                                        onPress={() => this.setState({use_yn : true})}
                                    />
                                    <TouchableOpacity 
                                        onPress={() => this.setState({use_yn : true})}    
                                        style={[styles.detailRightWrap,{flex:3}]}
                                    >
                                        <CustomTextR style={styles.menuTitleText}>사용</CustomTextR>    
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.CheckBoxWrap}>
                                    <CheckBox 
                                        containerStyle={{padding:0,margin:0}}   
                                        iconType={'FontAwesome'}
                                        checkedIcon={<Image source={RADIOON_ON} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                        uncheckedIcon={<Image source={RADIOON_OFF} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                        checkedColor={DEFAULT_COLOR.base_color}                          
                                        checked={!this.state.use_yn}
                                        size={PixelRatio.roundToNearestPixel(15)}                                    
                                        onPress={() => this.setState({use_yn : false})}
                                    />
                                    <TouchableOpacity 
                                        onPress={() => this.setState({use_yn : false})}    
                                        style={[styles.detailRightWrap,{flex:3}]}
                                    >
                                        <CustomTextR style={styles.menuTitleText}>미사용</CustomTextR>    
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.cellDefaultRowWrap}>
                                <CustomTextR style={CommonStyle.titleText}>상세설명 이미지</CustomTextR>
                                <CustomTextR style={CommonStyle.requiredText}>{'*'}</CustomTextR>
                            </View>
                            <View style={styles.cellDefaultRowWrap}>
                                <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11),color:'#666'}}>상품에 대한 상세한 설명 또는 브랜드에 관한 소개를 이미지로 업로드해주세요(최대4개)</CustomTextR>                                
                            </View> 
                            <View style={{marginHorizontal:15,paddingVertical:10,marginTop:5}}>
                                <ScrollView 
                                    horizontal={true}
                                    ref={(ref) => {
                                        this.ScrollView2 = ref;
                                    }}
                                    nestedScrollEnabled={true}
                                >
                                    {this.renderImageUpload()}
                                </ScrollView>
                                <View style={{flexGrow:1,flexDirection:'row',marginTop:20, marginBottom:15}}>
                                    <View style={{justifyContent:'center',width: (SCREEN_WIDTH - 16 - 8) / 4 * 3}}>
                                        <View style={{height:3,width:'100%',backgroundColor:DEFAULT_COLOR.input_bg_color}}>
                                            <View style={{
                                                height:3,
                                                width:(
                                                    this.state.attachFileSize > 0
                                                        ? parseInt(this.state.attachFileSize/1024/1024)
                                                        : 0
                                                ) / 50 * 100 + '%',
                                                backgroundColor: DEFAULT_COLOR.input_border_color
                                            }}
                                            >
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{flexDirection: 'row',justifyContent:'center',paddingRight: 8, width: (SCREEN_WIDTH - 30) / 4 * 1,
                                    }}>
                                        <CustomTextM style={styles.imageText}>
                                            {this.state.attachFileSize > 0 ? (this.state.attachFileSize/1024/1024).toFixed(1) : 0}/
                                        </CustomTextM>
                                        <CustomTextM style={styles.imageText}>
                                            50MB
                                        </CustomTextM>
                                    </View>                                
                                </View>
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
                            <CustomTextB style={CommonStyle.bottomMenuOnText}>취소</CustomTextB>
                        </TouchableOpacity>
                        <TouchableOpacity style={CommonStyle.bottomLeftBox} onPress={()=>this.updateData()}>
                            <CustomTextB style={CommonStyle.bottomMenuOffText}>등록</CustomTextB>
                        </TouchableOpacity>
                    </View>
                    </KeyboardAvoidingView>
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
    cellDefaultWrap : {
        paddingHorizontal:5,flexDirection:'row'
    },
    cellDefaultWrap5 : {
        paddingHorizontal:5,flexDirection:'row',marginTop:5
    },
    cellDefaultWrap15 : {
        paddingHorizontal:5,flexDirection:'row',marginTop:15
    },
    cellDefaultRowWrap :{
        paddingHorizontal:5,paddingVertical:10,marginTop:15,flexDirection:'row'
    },
    imageOuterWrap : {
        flex: 1,width: (SCREEN_WIDTH) / 4 - 8,height: (SCREEN_WIDTH - 16 - 8) / 4 - 8,justifyContent: 'flex-end',alignItems: 'flex-end', marginRight: 8,borderWidth: 1,borderColor: '#ccc',overflow: 'hidden',
    },
    imageOuterWrap2 : {
        flex: 1,width: (SCREEN_WIDTH) / 4 - 8,height: (SCREEN_WIDTH - 16 - 8) / 4 - 8,justifyContent: 'flex-end',alignItems: 'flex-end'
    },
    imageDataWarp : {position: 'absolute',width: 24,height: 24,zIndex: 2,borderColor: '#ccc',backgroundColor: 'transparent'
    },
    imageText : {
        color:DEFAULT_COLOR.base_color_666,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_12),lineHeight: DEFAULT_TEXT.body_12 * 1.42
    },
    CheckBoxWrap : {
        flex:1,flexDirection:'row',alignItems:'center'
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
        borderWidth:1,borderColor:DEFAULT_COLOR.input_border_color,borderRadius:5,backgroundColor:'#fff',paddingTop:5,justifyContent:'center'
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
        flexDirection:'row',    
        justifyContent:'center',
        alignItems:'flex-start'
    },
    boxRightWrap2 : {
        flex:4,
        flexDirection:'row',    
        justifyContent:'center',
        alignItems:'flex-start'
    },
    boxLeftWrap3 : {
        flex:2,        
        justifyContent:'center',
        alignItems:'flex-start'
    },
    boxRightWrap3 : {
        flex:1,
        flexDirection:'row',    
        justifyContent:'center',
        alignItems:'flex-start'
    }
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
export default connect(mapStateToProps,mapDispatchToProps)(ProductRegistScreen);

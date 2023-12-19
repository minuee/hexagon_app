import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Text,Dimensions,RefreshControl,PixelRatio,Image,TouchableOpacity,BackHandler,TextInput,KeyboardAvoidingView,Animated,Alert} from 'react-native';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
import 'moment/locale/ko'
import  moment  from  "moment";
import {CheckBox,Overlay} from 'react-native-elements';
import ImagePicker from 'react-native-image-crop-picker';
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
import SelectSearch from "../../Utils/SelectSearch";
import SelectType from '../../Utils/SelectType';
import PopLayerSeleteGoods from './PopLayerSeleteGoods';
import Loader from '../../Utils/Loader';
import { apiObject } from "../Apis";

const RADIOON_OFF = require('../../../assets/icons/check_off.png');
const RADIOON_ON = require('../../../assets/icons/check_on.png');

const mockData1 = [
    { id: 1, name : '상품', code : 'PRODUCT',checked:false},
    //{ id: 2, name : '공지사항', code : 'NOTICE',checked:false},
    { id: 2, name : '카테고리', code : 'CATEGORY',checked:false},
    { id: 3, name : '이벤트', code : 'EVENT',checked:false},
]

const DefaultPaginate = 100;
class BannerModifyScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : true,
            totalCount : 0,
            ismore :  false,
            currentPage : 1,
            showModal : false,
            showModalType : 1,
            banner_pk : 0,
            linkType : 'INLINK',
            moreloading : false,
            newImage : false,
            image : {},
            images : {},
            thumbnail_img : null,
            formTitle : null,
            formContents : '',
            formBannerSeq : 1,
            inlinkType : 'PRODUCT',
            inlinkTarket : null,
            formOutLink : '',

            target_data : null,
            topCategory : [],
            productArray : [],
            eventList : [],
            popLayerView2 : false,
            closepopLayer2 : this.closepopLayer2.bind(this),
            setProductArray : this.setProductArray.bind(this),
        }
    }

    setProductArray = (arr) => {
        this.setState({
            productArray : arr
        })
    }
   
    setCategory = async(arr) => {
        if ( !CommonUtil.isEmpty(arr) ) {
            let newCategory1 = await [...new Set(arr.map(item => item.category_pk))];
            let newCategory2 = await [...new Set(arr.map(item => item.category_name))];
            //console.log('newCategory1',newCategory1) 
            //console.log('newCategory2',newCategory2) 
            let newArray = newCategory1.map((e, i) => ({category_pk : e, category_name :newCategory2[i],checked : ( this.state.inlinkType === 'CATEGORY' &&  e === this.state.inlinkTarket ) ? true :false }));
           
            let cateArray = await newArray.map(({ checked,category_pk, category_name }) => ({ id: category_pk, name: category_name ,checked : checked}));
            console.log('cateArray',cateArray) 
            this.setState({
                topCategory : cateArray,
                productArray : arr,
                loading:false,moreLoading : false
            })
           
        }
    }
    getBaseData = async(currentpage,morePage = false) => {
        this.setState({moreLoading : true})
        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/product/all?page=' + currentpage + '&paginate='+DefaultPaginate;
            const token = this.props.userToken.apiToken;
            let sendData = null;
            returnCode = await apiObject.API_getPageList(this.props,url,token,sendData);
            console.log('returnCode',returnCode) 
            if ( returnCode.code === '0000'  ) {
                await this.setCategory(returnCode.data.productList);
                this.setState({currentPage : returnCode.currentPage})
                this.setState({
                    totalCount : returnCode.total,
                    ismore : parseInt(this.state.currentPage)  < parseInt(returnCode.lastPage) ? true : false
                })
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.',2000);
                this.setState({moreLoading:false,loading:false})
            }
           
        }catch(e){
            //console.log('e',e) 
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
                banner_pk : this.props.extraData.params.screenData.banner_pk,
                linkType : this.props.extraData.params.screenData.link_type,
                newImage : false,
                thumbnail_img : this.props.extraData.params.screenData.img_url,
                formTitle : this.props.extraData.params.screenData.title,
                formContents : this.props.extraData.params.screenData.content,
                formBannerSeq : this.props.extraData.params.screenData.display_seq,
                inlinkType : this.props.extraData.params.screenData.inlink_type,
                inlinkTarket :  this.props.extraData.params.screenData.target_pk ,
                formOutLink : this.props.extraData.params.screenData.target_url,
                target_data : this.props.extraData.params.screenData.inlink_type === 'PRODUCT' ?  productData : null
            })
            await this.getBaseData(1,false);
            
            if ( this.state.eventList.length === 0 ) {
                await this.getEventList();
            }
            //await this.getBaseData(this.props.extraData.params.screenData.inlink_type,this.props.extraData.params.screenData.target_pk)
        }else{
            CommonFunction.fn_call_toast('잘못된 접근입니다.',1500);
            setTimeout(
                () => {            
                   this.props.navigation.goBack(null);
                },1500
            )
        }
      
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

    closepopLayer2 = (item) => {
        //console.log('eventProduct',item)
        if ( !CommonUtil.isEmpty(item)) {
            this.setState({target_data : item ,inlinkTarket : item.product_pk})
        }
        this.setState({ popLayerView2: false})
    }; 
    showpopLayer2 = () => this.setState({ popLayerView2: true });
  

    registData = async() => {


        this.setState({moreLoading:true})
        let  thumbnail_new = {data:null};
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

        let returnCode = {code:9998};     
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/banner/modify/' + this.state.banner_pk;
           // console.log('url',url) 
            const token = this.props.userToken.apiToken;
            let sendData = {
                link_type : this.state.linkType,
                inlink_type : this.state.inlinkType,
                title :  this.state.formTitle,
                content : this.state.formContents,
                img_url : !CommonUtil.isEmpty(thumbnail_new.data) ? thumbnail_new.data : this.state.thumbnail_img,
                target_pk : this.state.inlinkTarket,
                target_url : !CommonUtil.isEmpty(this.state.formOutLink) ? this.state.formOutLink.toLowerCase() : null,
                display_seq : this.state.formBannerSeq
            }
            console.log('sendData',sendData)   
            returnCode = await apiObject.API_updateCommon(this.props,url,token,sendData);          
            console.log('returnCode',returnCode)   
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
            this.setState({loading:false,moreLoading : false})
        }
        
    }

    actionOrder = async() => {
        //console.log('target_array',this.state.target_array)
        Alert.alert(
            DEFAULT_CONSTANTS.appName,
            "배너정보를 수정하시겠습니까?",
            [
                {text: '네', onPress: () =>  this.registData()},
                {text: '아니오', onPress: () => console.log('Cancle')},
                
            ],
            { cancelable: true }
        )  
    }

    bannerRegist = async() => {
        if ( CommonUtil.isEmpty(this.state.image) && CommonUtil.isEmpty(this.state.thumbnail_img)) {
            CommonFunction.fn_call_toast('배너를 등록해주세요',2000);
            return true;   
        }else if ( CommonUtil.isEmpty(this.state.formTitle)) {
                CommonFunction.fn_call_toast('제목을 입력해주세요',2000);
                return true;  
        }else if ( this.state.formContents.length < 10) {
            CommonFunction.fn_call_toast('내용을 최소 10자이상 입력해주세요',2000);
            return true;           
        }else{
            //console.log('this.state.inlinkTarket',this.state.inlinkTarket)   
            if( this.state.linkType === 'OUTLINK' && CommonUtil.isEmpty(this.state.formOutLink)) {
                CommonFunction.fn_call_toast('브라우저호출시에는 이동할  웹주소를 입력해주세요',2000);
                return true;  
            }else if( this.state.linkType === 'INLINK' && this.state.inlinkType === 'PRODUCT' && CommonUtil.isEmpty(this.state.inlinkTarket)) {
                CommonFunction.fn_call_toast('상품을 선택해주세요',2000);
                return true;  
            }else if( this.state.linkType === 'INLINK' && this.state.inlinkType === 'CATEGORY' && CommonUtil.isEmpty(this.state.inlinkTarket)) {
                CommonFunction.fn_call_toast('카테고리를선택해주세요',2000);
                return true;  
            }else if( this.state.linkType === 'INLINK' && this.state.inlinkType === 'EVENT' && CommonUtil.isEmpty(this.state.inlinkTarket) ) {
                CommonFunction.fn_call_toast('이벤트를 선택해주세요',2000);
                return true;  
            }else{
                this.actionOrder();
            }
           
        }
    }

    removePopop = async(bool) => {
        this.setState({moreLoading :true})
        let returnCode = {code:9998};     
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/banner/remove/' + this.state.banner_pk;
            const token = this.props.userToken.apiToken;
            let sendData = null;
            returnCode = await apiObject.API_removeCommon(this.props,url,token,sendData);          
            //console.log('returnCode',returnCode)   
            if ( returnCode.code === '0000'  ) {
                CommonFunction.fn_call_toast('정상적으로 삭제되었습니다.' ,1500);
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
            "배너을 삭제하시겠습니까?",
            [
                {text: 'OK', onPress: () => this.removePopop()},
                {text: 'CANCEL', onPress: () => console.log('Cancle')},
                
            ],
            { cancelable: true }
        )  
    }

    changeProfile = async(cropit, circular = false, mediaType = 'photo') => {
        
        ImagePicker.openPicker({
            width: 1024,
            height: 768,
            multiple:false,
            cropping: true,
            cropperCircleOverlay: false,
            sortOrder: 'none',
            compressImageMaxWidth: 1024,
            compressImageMaxHeight: 768,
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
         
            //console.log('received image2', response.path);
            this.setState({
                thumbnail_img : response.path,
                newImage : true,
                image: response,
                images: null,
            });
            
        })
        .catch((e) => {
        CommonFunction.fn_call_toast('이미지 선택을 취소하였습니다.',2000)
        });
    }

    moveDetail = (item) => {
        this.props.navigation.navigate('ProductDetailStack',{
            screenData:item
        })
    }

    setBannerType = async(type) => {
        if ( type !== this.state.inlinkType ) {
            this.setState({inlinkTarket : null,target_data : {}})
        }
        if ( type === 'EVENT') {
            //console.log('this.state.eventList',this.state.eventList)   
            if ( this.state.eventList.length === 0 ) {
                await this.getEventList();
            }
            await this.setState({inlinkType:type})
        }else{
            this.setState({inlinkType:type})
        }
        
    }

    setEventList = async(arr) => {
        let newData = [];
        let inlinkTarket = this.state.inlinkTarket;
        await arr.forEach(function(element,index,array){     
            newData.push({id : index,name : element.title,code : element.event_pk ,checked : element.event_pk === inlinkTarket ?  true : false})               
       });
        this.setState({
            eventList : newData
        })
    }

    getEventList = async() => {

        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/event/list';
            const token = this.props.userToken.apiToken;
            let sendData = null;
            returnCode = await apiObject.API_getPageList(this.props,url,token,sendData);          
            //console.log('returnCode',returnCode.data)   
            if ( returnCode.code === '0000'  ) {
                let cateArray = [];
                if ( this.state.inlinkType === 'EVENT') {
                    this.setEventList(returnCode.data.eventList)
                }else {
                    cateArray = await returnCode.data.eventList.map(({ event_pk, title }) => ({ id: event_pk, name: title }));
                }
                
                //console.log('cateArray',cateArray)   
                this.setState({ eventList : cateArray})
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.',2000);
            }
            this.setState({moreLoading:false,loading:false})
        }catch(e){
            this.setState({loading:false,moreLoading : false})
        }
    }

    selectFilter = async(mode,filt) => {     
        //console.log('mode,filt',mode,filt) 
        if ( mode === 'category') {
            this.setState({
                inlinkTarket:filt.id
            });
        }else{
            this.setState({
                inlinkTarket:filt
            });
        }
    }
    renderTarget = (type) => {
        //console.log('renderTarget',type)
        if ( type === 'PRODUCT' ) {
            return (
                <View style={{paddingBottom:15}}>
                    <View style={styles.titleWrap}>
                        <CustomTextR style={CommonStyle.titleText}>상품 선택</CustomTextR>
                        <View style={styles.formTextTypeWrap}>
                            <TouchableOpacity 
                                onPress={()=> this.showpopLayer2()}
                                style={styles.formTextType}
                            >
                                <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#fff'}}>상품선택</CustomTextR>
                            </TouchableOpacity>
                        </View>
                                                    
                    </View>
                    {!CommonUtil.isEmpty(this.state.target_data) &&
                        <View style={styles.boxSubWrap}>
                            <TouchableOpacity 
                                onPress={()=>this.moveDetail({product_pk:this.state.target_data.product_pk})}
                                style={styles.boxLeftWrap}
                            >
                            { !CommonUtil.isEmpty(this.state.target_data.thumb_img) ?
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
                                {this.state.target_data.event_each_price > 0 ?
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
        }else if ( type === 'CATEGORY' ) {
            return (
                <View style={{paddingHorizontal:15,marginTop:10}}>
                    <DropBoxIcon />                           
                    <SelectSearch
                        isSelectSingle
                        showSearchBox={true}
                        searchPlaceHolderText={'카테고리명으로 검색하세요'}
                        style={styles.unSelectedBox}
                        selectedTitleStyle={styles.selectBoxText}
                        colorTheme={DEFAULT_COLOR.base_color_666}
                        popupTitle="카테고리선택"
                        title={'카테고리선택'}
                        cancelButtonText="취소"
                        selectButtonText="선택"
                        data={this.state.topCategory}
                        onSelect={data => {
                            this.selectFilter('category',data)
                        }}
                        onRemoveItem={data => {
                            this.state.topCategory[0].checked = true;
                        }}
                        initHeight={SCREEN_HEIGHT * 0.7}
                    />   
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
                            this.selectFilter('event',data)
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
                <View style={ styles.container }>
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
                    <KeyboardAvoidingView style={{flex:1,paddingVertical:10}} behavior={Platform.OS === 'ios' ? "padding" : 'height'}  enabled> 
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
                            <View style={{backgroundColor:'#e4e4e4',paddingVertical:20}}>
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
                            <View style={{flex:1,paddingHorizontal:20,alignItems:'flex-end'}} >
                                <CustomTextR style={CommonStyle.dataText}>* 가로X세로(4:3)비율의 이미지</CustomTextR>
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
                                <CustomTextR style={CommonStyle.titleText}>내용</CustomTextR>
                                <CustomTextR style={CommonStyle.requiredText2}>{'*'}</CustomTextR>
                            </View>
                            
                            <View style={{paddingHorizontal:15}}>
                                <TextInput         
                                    placeholder={'배너 설명문구 작성(최소10자이상)'}
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                           
                                    style={[
                                        styles.inputBlank,
                                        {
                                            height:100,width:'100%',paddingTop: 5,paddingBottom: 5,paddingLeft: 5,paddingRight: 5,textAlignVertical: 'top',textAlign:'left',fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13)
                                        }]}
                                    value={this.state.formContents}
                                    onChangeText={text=>this.setState({formContents:text})}
                                    multiline={true}
                                    clearButtonMode='always'
                                />
                            </View>
                            <View style={styles.titleWrap}>
                                <CustomTextR style={CommonStyle.titleText}>링크타입</CustomTextR>
                                <CustomTextR style={CommonStyle.requiredText}></CustomTextR>
                            </View>
                            <View style={styles.dataWrap}>
                                <View style={styles.CheckBoxWrap}>
                                    <CheckBox 
                                        containerStyle={{padding:0,margin:0}}   
                                        iconType={'FontAwesome'}
                                        checkedIcon={<Image source={RADIOON_ON} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                        uncheckedIcon={<Image source={RADIOON_OFF} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                        checkedColor={DEFAULT_COLOR.base_color}                          
                                        checked={this.state.linkType === 'INLINK'}
                                        size={PixelRatio.roundToNearestPixel(15)}                                    
                                        onPress={() => this.setState({linkType:'INLINK'})}
                                    />
                                    <TouchableOpacity 
                                        onPress={() => this.setState({linkType:'INLINK'})}
                                        style={[styles.detailRightWrap,{flex:3}]}
                                    >
                                        <CustomTextR style={styles.menuTitleText}>앱내이동</CustomTextR>    
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.CheckBoxWrap}>
                                    <CheckBox 
                                        containerStyle={{padding:0,margin:0}}   
                                        iconType={'FontAwesome'}
                                        checkedIcon={<Image source={RADIOON_ON} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                        uncheckedIcon={<Image source={RADIOON_OFF} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                        checkedColor={DEFAULT_COLOR.base_color}                          
                                        checked={this.state.linkType === 'OUTLINK'}
                                        size={PixelRatio.roundToNearestPixel(15)}                                    
                                        onPress={() => this.setState({linkType:'OUTLINK'})}
                                    />
                                    <TouchableOpacity 
                                        onPress={() => this.setState({linkType:'OUTLINK'})}
                                        style={[styles.detailRightWrap,{flex:3}]}
                                    >
                                        <CustomTextR style={styles.menuTitleText}>브라우저호출</CustomTextR>    
                                    </TouchableOpacity>
                                </View>
                            </View> 
                            {this.state.linkType === 'OUTLINK' ?
                            <View>
                                <View style={styles.titleWrap}>
                                    <CustomTextR style={CommonStyle.titleText}>링크주소</CustomTextR>
                                    <CustomTextR style={CommonStyle.requiredText}></CustomTextR>
                                </View>
                                <View style={{paddingHorizontal:15}}>
                                    <TextInput          
                                        placeholder={'http주소를 포함하여 입력해주세요'}
                                        placeholderTextColor={DEFAULT_COLOR.base_color_666}                           
                                        style={[styles.inputBlank,CommonStyle.defaultOneWayForm]}
                                        value={this.state.formOutLink}
                                        onChangeText={text=>this.setState({formOutLink:text})}
                                        multiline={false}
                                        clearButtonMode='always'
                                    />
                                </View> 
                            </View>
                            :
                            <View>
                                <View style={styles.titleWrap}>
                                    <CustomTextR style={CommonStyle.titleText}>배너분류</CustomTextR>
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
                            }
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
                            <CustomTextB style={CommonStyle.bottomMenuOnText}>삭제</CustomTextB>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={CommonStyle.bottomLeftBox}
                            onPress={()=>this.bannerRegist()}
                        >
                            <CustomTextB style={CommonStyle.bottomMenuOffText}>수정</CustomTextB>
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
    dataTopWrap : {
        flex:1,backgroundColor:'#fff'
    },
    titleWrap : {
        paddingHorizontal:15,paddingVertical:10,marginTop:10,flexDirection:'row'
    },
    dataWrap : {
        flex:1,paddingHorizontal:15,flexDirection:'row',flexGrow:1,flexWrap:'wrap',alignContent:'space-between'
    },
    CheckBoxWrap:{
        flex:1,flexDirection:'row',justifyContent:'center',minWidth:SCREEN_WIDTH/3-20,paddingVertical:5
    },

    popLayerWrap : {
        width:SCREEN_WIDTH*0.9,height:SCREEN_HEIGHT*0.8,backgroundColor:'transparent',margin:0,padding:0
    },
    productArrayWrap : {
        paddingHorizontal:10
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
        paddingHorizontal: 15,
        alignItems: 'center',        
        borderBottomWidth:1,
        borderBottomColor : DEFAULT_COLOR.input_border_color,
        paddingBottom:10
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

export default connect(mapStateToProps,mapDispatchToProps)(BannerModifyScreen);
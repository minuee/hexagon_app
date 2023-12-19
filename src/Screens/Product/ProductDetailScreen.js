import React, { Component,PureComponent } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Image as NativeImage,Dimensions,PixelRatio,BackHandler,Platform,TouchableOpacity,Alert} from 'react-native';
import 'moment/locale/ko'
import  moment  from  "moment";
import Image from 'react-native-image-progress';
import Progress from 'react-native-progress/Bar';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import {Overlay} from 'react-native-elements';
//공통상수 필요에 의해서 사용
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import CommonStyle from '../../Style/CommonStyle';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {CustomTextR,CustomTextL, CustomTextB, CustomTextM, TextRobotoM,TextRobotoR} from '../../Components/CustomText';
import CommonFunction from '../../Utils/CommonFunction';
import CommonUtil from '../../Utils/CommonUtil';
import Loader from '../../Utils/Loader';
import { apiObject } from "../Apis";
import ToggleSwitch from '../../Components/ToggleSwitch';
import ScalableImage from '../../Utils/ScalableImage';
import PopLayerSeleteGoods from '../Banner/PopLayerSeleteAllGoods';

const DefaultPaginate = 100;
class ProductDetailScreen extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            loading : true,
            popLayerView2 : false,
            switchOn1Change :false,
            newReentry :false,
            switchOn1 : false,
            productData : {},
            target_data : null,
            topCategory : [],
            productArray : [],
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
            let newArray = newCategory1.map((e, i) => ({category_pk : e, category_name :newCategory2[i] }));            
            let cateArray = await newArray.map(({ category_pk, category_name }) => ({ id: category_pk, name: category_name }));
            this.setState({
                topCategory : cateArray,
                productArray : arr,
                loading:false,moreLoading : false
            })
        }
    }

    getBaseData2 = async(currentpage,morePage = false) => {
        this.setState({moreLoading : true})
        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/product/all?page=' + currentpage + '&paginate='+DefaultPaginate;
            const token = this.props.userToken.apiToken;
            let sendData = null;
            returnCode = await apiObject.API_getPageList(this.props,url,token,sendData);
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
            this.setState({loading:false,moreLoading : false})
        }
    }

    getBaseData = async(product_pk) => {
        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/product/view/'+product_pk;
            const token = this.props.userToken.apiToken;
            returnCode = await apiObject.API_getDetailDefault(this.props,url,token);
            if ( returnCode.code === '0000'  ) {
                let target_data = {};
                let inlinkTarket = null;
                if ( !CommonUtil.isEmpty(returnCode.data.productDetail.measure )) {
                    target_data = {
                        category_pk: returnCode.data.productDetail.measure_category_pk,
                        each_price: returnCode.data.productDetail.measure_each_price,
                        event_each_price: returnCode.data.productDetail.measure_event_each_price,
                        product_name: returnCode.data.productDetail.measure_product_name,
                        product_pk: returnCode.data.productDetail.measure,
                        thumb_img: returnCode.data.productDetail.measure_thumb_img
                    }
                    inlinkTarket = returnCode.data.productDetail.measure;
                }
                this.setState({
                    target_data,
                    inlinkTarket,
                    productData : CommonUtil.isEmpty(returnCode.data.productDetail) ? [] : returnCode.data.productDetail,
                    switchOn1 : returnCode.data.productDetail.is_soldout 
                })
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.',1500);
                setTimeout(
                    () => {            
                       this.props.navigation.goBack(null);
                    },1500
                )
            }
            this.setState({moreLoading:false,loading:false})
        }catch(e){            
            this.setState({loading:false,moreLoading : false})
        }
    }
    
    async UNSAFE_componentWillMount() {
        if ( !CommonUtil.isEmpty(this.props.extraData.params.screenData)) {
            await this.getBaseData(this.props.extraData.params.screenData.product_pk);
            await this.getBaseData2(1,false);
            this.setState({
                product_pk : this.props.extraData.params.screenData.product_pk
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
            this.getBaseData(this.state.product_pk)
        })

        this.props.navigation.addListener('blur', () => {            
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
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

    sendPushAction = async(item) => {
        const productInfo = this.state.productData;
        console.log('productInfo',productInfo)
        this.setState({moreLoading:true})
        let returnCode = {code:9998};     
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/alarm/pushsend';
            const token = this.props.userToken.apiToken;
            let sendData = {
                title : "["+DEFAULT_CONSTANTS.appName+"]상품 재입고알림",
                comment : productInfo.product_name+' 재입고 되었습니다.',
                routeName : 'ProductDetailStack',
                routeIdx : productInfo.product_pk,
                img_url : !CommonUtil.isEmpty(productInfo.thumb_img) ? DEFAULT_CONSTANTS.defaultImageDomain+productInfo.thumb_img : ''
            }           
            console.log('sendData',sendData) 
            returnCode = await apiObject.API_registCommon(this.props,url,token,sendData);
            console.log('sendPushAction',returnCode)
            if ( returnCode.code === '0000'  ) {
                CommonFunction.fn_call_toast('정상적으로 발송되었습니다.' ,2000);
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.\n[ERR]' + returnCode.msg ,2000);
            }
            this.setState({moreLoading:false,loading:false})
        }catch(e){            
            this.setState({loading:false,moreLoading : false})
        }
    }

    fn_onChangeToggle = async(bool) => {
        const changeText = bool ? '품절처리' : '품절해제'
        let returnCode = {code:9998};     
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/product/soldout/' + this.state.product_pk;
            const token = this.props.userToken.apiToken;
            let sendData = {
                soldout : bool
            }    
            returnCode = await apiObject.API_patchCommon(this.props,url,token,sendData);
            if ( returnCode.code === '0000'  ) {
                CommonFunction.fn_call_toast(changeText + ' 되었습니다.' ,2000);
                if ( bool === false ) {
                    Alert.alert(
                        DEFAULT_CONSTANTS.appName,  
                        "재입고 알림메시지를 발송하시겠습니까?",
                        [
                            {text: '네', onPress: () => this.sendPushAction()},
                            {text: '아니오', onPress: () => console.log('Cancle')},
                            
                        ],
                        { cancelable: true }
                    )  
                }
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.\n[ERR]' + returnCode.msg ,2000);
            }
            this.setState({moreLoading:false,loading:false,switchOn1 : bool,switchOn1Change:true})
        }catch(e){
            this.setState({loading:false,moreLoading:false,switchOn1 : bool,switchOn1Change:true})
        }
    }

    closepopLayer2 = (item) => {        
        if ( !CommonUtil.isEmpty(item)) {
            this.setState({target_data : item ,popLayerView2: false,newReentry:true })
        }else{
            this.setState({ popLayerView2: false})
        }
    }; 
    showpopLayer2 = () => this.setState({ popLayerView2: true,newReentry:false });
    removeRentry = async() => {         
        if ( !CommonUtil.isEmpty(this.state.inlinkTarket)) {
            Alert.alert(
                DEFAULT_CONSTANTS.appName,  
                "대채상품을 삭제하시겠습니까?",
                [
                    {text: '네', onPress: () => this.ActionUpdateReEntry('remove')},
                    {text: '아니오', onPress: () => console.log('Cancle')},
                    
                ],
                { cancelable: true }
            )
        }else{
            this.setState({target_data : null})
        }
    }
    ActionUpdateReEntry = async(mode) => {
        const target_pk = this.state.target_data.product_pk;
        this.setState({ moreLoading: false})
        let returnCode = {code:9998};     
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/product/measure/' + this.state.product_pk;
            const token = this.props.userToken.apiToken;
            let sendData = {
                target_pk,
                process_mode : mode
            }
            returnCode = await apiObject.API_patchCommon(this.props,url,token,sendData);
            if ( returnCode.code === '0000'  ) {
                CommonFunction.fn_call_toast(mode === 'remove' ? '정상적으로 삭제되었습니다.' : '정상적으로 등록/수정되었습니다.' ,2000);
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.\n[ERR]' + returnCode.msg ,2000);
            }
            if ( mode === 'remove'  ) {
                this.setState({moreLoading:false,loading:false,target_data :null, inlinkTarket : null})
            }else{
                this.setState({moreLoading:false,loading:false,inlinkTarket : target_pk})
            }
        }catch(e){            
            this.setState({loading:false,moreLoading:false})
        }
    }

    registReEntry = () => {
        if ( !CommonUtil.isEmpty(this.state.target_data) && this.state.newReentry ) {
            Alert.alert(
                DEFAULT_CONSTANTS.appName,  
                "대채상품을 등록/수정하시겠습니까?",
                [
                    {text: '네', onPress: () => this.ActionUpdateReEntry('modify')},
                    {text: '아니오', onPress: () => console.log('Cancle')},
                ],
                { cancelable: true }
            )  
        }else{
            CommonFunction.fn_call_toast('대체상품을 선택해주세요',2000);
        }
    }

    render() {
        if ( this.state.loading ) {
            return (
                <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} /> 
            )
        }else {  
            return(
                <SafeAreaView style={styles.container}>
                    {
                        this.state.popLayerView2 && (
                        <>
                            <Overlay
                                isVisible={this.state.popLayerView2}                                
                                windowBackgroundColor="rgba(0, 0, 0, 0.8)"
                                overlayBackgroundColor="tranparent"                                
                                containerStyle={{margin:0,padding:0}}
                            >
                                <View style={styles.popLayerWrap}>
                                    <PopLayerSeleteGoods screenState={this.state} />
                                </View>
                                
                            </Overlay>
                        </>
                        )
                    }
                    <ScrollView
                        ref={(ref) => {
                            this.ScrollView = ref;
                        }}
                        onContentSizeChange={() => {
                            // 여기다가 어떤 경우에 스크롤을 하면 될지에 대한 조건문을 추가하면 된다.
                            if ( this.state.target_data || this.state.switchOn1Change ) {
                                this.ScrollView.scrollToEnd({ animated: false })
                            }
                        }}
                        showsVerticalScrollIndicator={false}
                        indicatorStyle={'white'}
                        scrollEventThrottle={16}
                        keyboardDismissMode={'on-drag'}
                        style={{width:'100%',flex:1}}
                    >
                     <View style={styles.mainWrap}>
                        <View style={styles.thumbnailWrap}>
                            { 
                                !CommonUtil.isEmpty(this.state.productData.thumb_img) ?
                                <Image
                                    source={{uri:DEFAULT_CONSTANTS.defaultImageDomain+this.state.productData.thumb_img}}
                                    resizeMode={"contain"}
                                    style={CommonStyle.fullWidthImage}
                                    indicator={Progress.Pie}
                                    indicatorProps={{size: 80,borderWidth: 0,color: DEFAULT_COLOR.base_color,unfilledColor:'#fff'}}
                                />
                                :
                                <Image
                                    source={require('../../../assets/icons/no_image.png')}
                                    resizeMode={"contain"}
                                    style={CommonStyle.fullWidthImage}
                                />
                            }
                        </View> 
                    </View>
                    <View style={styles.productDetailWrap}>
                        <View style={styles.blockWrap}>
                            <CustomTextR style={[styles.menuTitleText,{paddingLeft:20}]}>상품명</CustomTextR>
                        </View>
                        <View style={{marginBottom:10}}>
                            <CustomTextR style={[styles.menuTitleText,{paddingLeft:20,paddingRight:10}]}>
                                {this.state.productData.product_name}
                            </CustomTextR>
                        </View>  
                    </View>  
                    <View style={styles.productDetailWrap}>
                        <View style={styles.blockWrap}>
                            <CustomTextR style={[styles.menuTitleText,{paddingLeft:20}]}>판매가격</CustomTextR>
                        </View>
                        <View style={styles.boxWrap}>
                            <View style={styles.boxLeftWrap}>
                                <CustomTextR style={styles.menuTitleText}>낱개</CustomTextR>
                            </View>
                            <View style={styles.boxRightWrap}>
                                <CustomTextR style={styles.menuTitleText}>
                                    {CommonFunction.currencyFormat(this.state.productData.each_price)}원
                                </CustomTextR>
                            </View>
                        </View>
                        { 
                            this.state.productData.box_price > 0 &&  
                            <View style={styles.boxWrap}>
                                <View style={styles.boxLeftWrap}>
                                    <CustomTextR style={styles.menuTitleText}>박스당</CustomTextR>
                                </View>
                                <View style={styles.boxRightWrap}>
                                    <CustomTextR style={styles.menuTitleText}>{CommonFunction.currencyFormat(this.state.productData.box_price)}원</CustomTextR>
                                    <CustomTextR style={styles.menuTitleText2}>
                                    {CommonFunction.currencyFormat(this.state.productData.box_unit)}개입 / 개당{CommonFunction.currencyFormat(this.state.productData.box_price/this.state.productData.box_unit)}원
                                    </CustomTextR>
                                </View>
                            </View>
                        }
                        { 
                            this.state.productData.carton_price > 0 &&  
                            <View style={styles.boxWrap}>
                                <View style={styles.boxLeftWrap}>
                                    <CustomTextR style={styles.menuTitleText}>카톤당</CustomTextR>
                                </View>
                                <View style={styles.boxRightWrap}>
                                <CustomTextR style={styles.menuTitleText}>{CommonFunction.currencyFormat(this.state.productData.carton_price)}원</CustomTextR>
                                    <CustomTextR style={styles.menuTitleText2}>
                                    {CommonFunction.currencyFormat(this.state.productData.carton_unit)}개입 / 개당{CommonFunction.currencyFormat(this.state.productData.carton_price/this.state.productData.carton_unit)}원
                                    </CustomTextR>
                                </View>
                            </View>
                        }
                    </View>
                    <View style={styles.productDetailWrap}>
                        <View style={styles.blockWrap}>
                            <CustomTextR style={[styles.menuTitleText,{paddingLeft:20}]}>이벤트정보</CustomTextR>
                        </View>
                        <View style={styles.boxWrap}>
                            <View style={styles.boxLeftWrap}>
                                <CustomTextR style={styles.menuTitleText}>낱개</CustomTextR>
                            </View>
                            <View style={styles.boxRightWrap}>
                                <CustomTextR style={styles.menuTitleText}>
                                    {CommonFunction.currencyFormat(this.state.productData.event_each_price)}원
                                </CustomTextR>
                                <CustomTextR style={styles.menuTitleText}>
                                    한정판매 : {CommonFunction.currencyFormat(this.state.productData.event_each_stock)}개
                                </CustomTextR>
                            </View>
                        </View>
                        { 
                            this.state.productData.event_box_price > 0 &&  
                            <View style={styles.boxWrap}>
                                <View style={styles.boxLeftWrap}>
                                    <CustomTextR style={styles.menuTitleText}>박스당</CustomTextR>
                                </View>
                                <View style={styles.boxRightWrap}>
                                    <CustomTextR style={styles.menuTitleText}>{CommonFunction.currencyFormat(this.state.productData.box_price)}원</CustomTextR>
                                    <CustomTextR style={styles.menuTitleText2}>
                                    {CommonFunction.currencyFormat(this.state.productData.box_unit)}개입 / 개당{CommonFunction.currencyFormat(this.state.productData.event_box_price/this.state.productData.event_box_unit)}원 
                                    </CustomTextR>
                                    <CustomTextR style={styles.menuTitleText}>한정판매 : {CommonFunction.currencyFormat(this.state.productData.event_box_stock)}박스</CustomTextR>
                                </View>
                            </View>
                        }
                        { 
                            this.state.productData.event_carton_price > 0 &&  
                            <View style={styles.boxWrap}>
                                <View style={styles.boxLeftWrap}>
                                    <CustomTextR style={styles.menuTitleText}>카톤당</CustomTextR>
                                </View>
                                <View style={styles.boxRightWrap}>
                                <CustomTextR style={styles.menuTitleText}>{CommonFunction.currencyFormat(this.state.productData.event_carton_price)}원</CustomTextR>
                                    <CustomTextR style={styles.menuTitleText2}>
                                    {CommonFunction.currencyFormat(this.state.productData.carton_unit)}개입 / 개당{CommonFunction.currencyFormat(this.state.productData.event_carton_price/this.state.productData.event_carton_unit)}원
                                    </CustomTextR>
                                    <CustomTextR style={styles.menuTitleText}>한정판매 : {CommonFunction.currencyFormat(this.state.productData.event_carton_stock)}카톤</CustomTextR>
                                </View>
                            </View>
                        }
                    </View>

                    <View style={styles.productDetailWrap}>
                        <View style={styles.boxWrap}>
                            <View style={styles.boxLeftWrap}>
                                <CustomTextR style={styles.menuTitleText}>판매단위</CustomTextR>
                            </View>
                            <View style={styles.boxRightWrap}>
                                <CustomTextR style={styles.menuTitleText}>
                                    {this.state.productData.each_price > 0 && '낱개'}
                                    {this.state.productData.box_price > 0 && ',박스'}
                                    {this.state.productData.carton_price > 0 && ',카톤'}
                                </CustomTextR>
                            </View>
                        </View>
                        <View style={styles.boxWrap}>
                            <View style={styles.boxLeftWrap}>
                                <CustomTextR style={styles.menuTitleText}>카테고리</CustomTextR>
                            </View>
                            <View style={styles.boxRightWrap}>
                                <CustomTextR style={styles.menuTitleText}>
                                    {this.state.productData.category_name} ({this.state.productData.category_type === 'B' ?'브랜드':'제품군'})
                                </CustomTextR>
                            </View>
                        </View>
                        <View style={styles.boxWrap}>
                            <View style={styles.boxLeftWrap}>
                                <CustomTextR style={styles.menuTitleText}>재질</CustomTextR>
                            </View>
                            <View style={styles.boxRightWrap}>
                                <CustomTextR style={styles.menuTitleText}>{this.state.productData.material}</CustomTextR>
                            </View>
                        </View>
                        <View style={styles.boxWrap}>
                            <View style={styles.boxLeftWrap2}>
                                <CustomTextR style={styles.menuTitleText}>적립금사용가능여부</CustomTextR>
                            </View>
                            <View style={styles.boxRightWrap2}>
                                <CustomTextR style={styles.menuTitleText9}>
                                    {this.state.productData.can_point ? "가능" : "불가"}
                                </CustomTextR>
                            </View>
                        </View>
                        <View style={styles.boxWrap}>
                            <View style={styles.boxLeftWrap2}>
                                <CustomTextR style={styles.menuTitleText}>적립대상여부</CustomTextR>
                            </View>
                            <View style={styles.boxRightWrap2}>
                                <CustomTextR style={styles.menuTitleText9}>
                                    {this.state.productData.is_nonpoint ? "비대상" : "대상"}
                                </CustomTextR>
                            </View>
                        </View>
                        <View style={styles.boxWrap}>
                            <View style={styles.boxLeftWrap2}>
                                <CustomTextR style={styles.menuTitleText}>사용여부</CustomTextR>
                            </View>
                            <View style={styles.boxRightWrap2}>
                                <CustomTextR style={styles.menuTitleText9}>
                                    {this.state.productData.use_yn ? "사용" : "미사용"}
                                </CustomTextR>
                            </View>
                        </View>
                    </View>
                    <View style={styles.productDetailWrap}>
                        <View style={styles.blockWrap}>
                            <CustomTextR style={[styles.menuTitleText,{paddingLeft:20}]}>상세이미지</CustomTextR>
                        </View>
                        <View style={styles.detailImageWrap}>
                            { 
                                !CommonUtil.isEmpty(this.state.productData.detail_img1) &&
                                <ScalableImage
                                    source={{uri:DEFAULT_CONSTANTS.defaultImageDomain+this.state.productData.detail_img1}}
                                    width={SCREEN_WIDTH-20}
                                    indicator={Progress.Pie}
                                    indicatorProps={{size: 80,borderWidth: 0,color: DEFAULT_COLOR.base_color,unfilledColor:'#fff'}}
                                /> 
                            }
                        </View>
                        <View style={styles.detailImageWrap}>
                            { 
                                !CommonUtil.isEmpty(this.state.productData.detail_img2) &&
                                <ScalableImage
                                    source={{uri:DEFAULT_CONSTANTS.defaultImageDomain+this.state.productData.detail_img2}}
                                    width={SCREEN_WIDTH-20}
                                    indicator={Progress.Pie}
                                    indicatorProps={{size: 80,borderWidth: 0,color: DEFAULT_COLOR.base_color,unfilledColor:'#fff'}}
                                /> 
                            }
                        </View>
                        <View style={styles.detailImageWrap}>
                            { 
                                !CommonUtil.isEmpty(this.state.productData.detail_img3) &&
                                <ScalableImage
                                    source={{uri:DEFAULT_CONSTANTS.defaultImageDomain+this.state.productData.detail_img3}}
                                    width={SCREEN_WIDTH-20}
                                    indicator={Progress.Pie}
                                    indicatorProps={{size: 80,borderWidth: 0,color: DEFAULT_COLOR.base_color,unfilledColor:'#fff'}}
                                />
                            }
                        </View>
                        <View style={styles.detailImageWrap}>
                            { 
                                !CommonUtil.isEmpty(this.state.productData.detail_img4) &&
                                <ScalableImage
                                    source={{uri:DEFAULT_CONSTANTS.defaultImageDomain+this.state.productData.detail_img3}}
                                    width={SCREEN_WIDTH-20}
                                    indicator={Progress.Pie}
                                    indicatorProps={{size: 80,borderWidth: 0,color: DEFAULT_COLOR.base_color,unfilledColor:'#fff'}}
                                />
                            }
                        </View>  
                        
                    </View>
                    <View style={styles.productDetailWrap}>
                        <View style={styles.boxWrap}>
                            <View style={styles.boxLeftWrap}>
                                <CustomTextR style={styles.menuTitleText}>품절</CustomTextR>
                            </View>
                            <View style={styles.boxRightWrap}>
                                <ToggleSwitch
                                    type={0}
                                    containerStyle={styles.ballWarp}
                                    backgroundColorOn='#ccc'
                                    backgroundColorOff='#fff'
                                    circleStyle={styles.ballStyle}
                                    switchOn={!this.state.switchOn1}
                                    onPress={()=> this.fn_onChangeToggle(!this.state.switchOn1)}
                                    circleColorOff={DEFAULT_COLOR.base_color}
                                    circleColorOn='#FFF'
                                    duration={500}
                                />
                            </View>
                        </View>
                    </View>
                    {
                    this.state.switchOn1 && 
                    <>
                        <View style={styles.titleWrap}>
                            <View style={styles.formTextTypeWrap2}>
                                <CustomTextR style={styles.menuTitleText}>대체상품선택</CustomTextR>
                            </View>
                            <View style={styles.formTextTypeWrap}>
                                { (!CommonUtil.isEmpty(this.state.target_data) && this.state.newReentry) &&
                                <TouchableOpacity onPress={()=> this.registReEntry()}style={styles.formTextType}>
                                    <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#fff'}}>등록하기</CustomTextR>
                                </TouchableOpacity>
                                }
                                <TouchableOpacity onPress={()=> this.showpopLayer2()} style={styles.formTextType}>
                                    <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#fff'}}>상품선택</CustomTextR>
                                </TouchableOpacity>                                
                            </View>
                        </View>
                        {
                            !CommonUtil.isEmpty(this.state.target_data) &&
                            <View style={styles.boxSubWrap}>
                                <TouchableOpacity 
                                    onPress={()=>this.moveDetail({product_pk:this.state.target_data.product_pk})}
                                    style={styles.etcBoxLeftWrap}
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
                                    style={styles.etcBoxRightWrap}
                                >
                                    <CustomTextR style={styles.menuTitleText}>{this.state.target_data.product_name}</CustomTextR>
                                    <CustomTextR style={styles.menuPriceText}>{CommonFunction.currencyFormat(this.state.target_data.each_price)}원(낱개)</CustomTextR>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.boxStockWrap}
                                    onPress={()=> this.removeRentry()}
                                    hitSlop={{left:10,right:5,top:10,bottom:20}}
                                >
                                    <NativeImage
                                        source={require('../../../assets/icons/btn_close.png')}
                                        resizeMode={"contain"}
                                        style={{width:CommonUtil.dpToSize(25),height:CommonUtil.dpToSize(25)}}
                                    />
                                </TouchableOpacity>
                            </View>
                        } 
                    </>
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
        //backgroundColor : "#fff",
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mainWrap : {
        flex:1,backgroundColor:'#fff',padding:0
    },
    blockWrap : {
        paddingVertical:Platform.OS === 'ios' ? 10 : 0,marginBottom:20,backgroundColor:'#f7f7f7'
    },
    productDetailWrap : {
        flex:1,marginVertical:2,borderTopWidth:1,borderTopColor:DEFAULT_COLOR.input_border_color,backgroundColor : "#fff"
    },
    thumbnailWrap : {
        paddingHorizontal:0,marginBottom:20,justifyContent:'center',alignItems:'center',overflow:'hidden'
    },
    detailImageWrap : {
        paddingHorizontal:10
    },
    menuTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),paddingRight:10
    },
    menuTitleText2 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),paddingRight:10,color:'#343434'
    },
    menuTitleText9 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),paddingRight:10,color:DEFAULT_COLOR.base_color
    },
    boxWrap : {
        marginBottom:10,flexDirection:'row',paddingVertical:10,
    },
    boxLeftWrap : {
        flex:1,justifyContent:'center',paddingLeft:20
    },
    boxRightWrap : {
        flex:3,justifyContent:'center',alignItems:'flex-end',paddingRight:20
    },
    boxLeftWrap2 : {
        flex:1,justifyContent:'center',paddingLeft:20
    },
    boxRightWrap2 : {
        flex:1,justifyContent:'center',alignItems:'flex-end',paddingRight:20
    },
    ballWarp : {
        marginTop: 0,width: 50,height: 20,borderRadius: 10,padding:5,borderWidth:0.5,borderColor:'#ebebeb',
        ...Platform.select({
            ios: {
                shadowColor: "#ccc",
                shadowOpacity: 0.5,
                shadowRadius: 2,
                shadowOffset: {
                    height: 0,
                    width: 0.1
                }
            },
            android: {
                elevation: 5
            }
        })
    },
    ballStyle : {
        width: 28,height: 28,borderRadius: 14,backgroundColor:'#fff',
    },
    titleWrap : {
        paddingHorizontal:15,paddingVertical:10,marginTop:10,flexDirection:'row',backgroundColor:'#fff',
    },
    formTextTypeWrap : {
        flex:2,flexDirection:'row',alignItems:'center',justifyContent: 'flex-end',
    },
    formTextTypeWrap2 : {
        flex:1,alignItems:'center',justifyContent:'center'
    },
    formTextType : {
        borderWidth:1,borderColor:DEFAULT_COLOR.input_border_color,borderRadius:5,paddingVertical:5,paddingHorizontal:10,backgroundColor:DEFAULT_COLOR.base_color
    },
    boxSubWrap : {
        flex:1,flexDirection:'row',flexGrow:1,padding: 15,alignItems: 'center',borderBottomWidth:1,
        borderBottomColor : DEFAULT_COLOR.input_border_color,backgroundColor:'#fff',
    },
    menuTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),paddingLeft:10
    },
    menuPriceText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),paddingLeft:10,color:'#585858'
    },
    boxStockWrap : {
        flex:1.5,justifyContent:'center',alignItems:'center',
    },
    popLayerWrap : {
        width:SCREEN_WIDTH*0.9,height:SCREEN_HEIGHT*0.8,backgroundColor:'transparent',margin:0,padding:0
    },
    etcBoxLeftWrap : {
        flex:1,        
        justifyContent:'center',
        alignItems:'center'
    },
    etcBoxRightWrap : {
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
export default connect(mapStateToProps,mapDispatchToProps)(ProductDetailScreen);
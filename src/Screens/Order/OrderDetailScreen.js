import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Alert,Dimensions,Linking, PixelRatio,Image,TouchableOpacity,Animated,Platform} from 'react-native';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import {Overlay} from 'react-native-elements';
//공통상수 필요에 의해서 사용
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import CommonStyle from '../../Style/CommonStyle';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import SelectType from "../../Utils/SelectType";
import {CustomTextR,CustomTextL, CustomTextB, CustomTextM, TextRobotoB,TextRobotoM,TextRobotoR} from '../../Components/CustomText';
import CustomAlert from '../../Components/CustomAlert';
import CommonUtil from '../../Utils/CommonUtil';
import CommonFunction from '../../Utils/CommonFunction';
import Loader from '../../Utils/Loader';
import { apiObject } from "../Apis";
const alertContents = 
(<View style={{flex:1,marginTop:10}}>
    <View style={{paddingTop:20}}>
        <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),color:'#494949'}}>
            1800-1800
        </CustomTextR>        
    </View>
</View>);
import ToggleBox from '../../Utils/ToggleBox';

export const DropBoxIcon = () => {
    return (
        <View style={{position:'absolute',top:20,right:25,width:20,height:20,alignItems:'flex-end',zIndex:10}}>
            <Image
                source={require('../../../assets/icons/dropdown.png')}
                resizeMode={"contain"}
                style={{width:PixelRatio.roundToNearestPixel(12),height:PixelRatio.roundToNearestPixel(12)}}
            />
        </View>   
    )
}

class OrderDetailScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : true,
            showTopButton : false,
            showModal :false,
            popLayerView2 :false,
            orderStatusArray : [],
            orderStatus : 'WAIT',
            isUpdate :false,            
            productData : [],
            orderBase : {},
            settleInfo : {},
            cartArray : [],
            orderHistroy : [],
            //poplayer
            popLayerView : false,
            isCancelView : true,
            cancleText : '취소',
            okayText : '통화하기',
            alertTitle : '슈퍼바인더 고객센터',
            alertBody : alertContents,
            clickCancle : this.clickCancle.bind(this),
            closePopLayer : this.closePopLayer.bind(this),

        }
    }

    clickCancle = () => {
        this.setState({popLayerView : false})
    }
    showPopLayer = async() => {
        this.setState({popLayerView : true})
    } 
    closePopLayer = async() => {        
        this.setState({popLayerView : false})
        this.requestService();
    } 
    requestService = async() => {
        let tmpNumber = "18001800";
        if ( !CommonUtil.isEmpty(tmpNumber)) {
            let number = "18001800";//CommonFunction.fn_dataDecode(tmpNumber)
            
            let phoneNumber = '';
            if (Platform.OS === 'android') { phoneNumber = `tel:${number}`; }
            else {phoneNumber = `telprompt:${number}`; }
            Linking.openURL(phoneNumber);
        }
    }

    checkStorageCode = async (arr) => {
        let newCode = [];
        let orderStatus = this.state.orderStatus;        
        let indexNum = 0;
        await arr.forEach(function(element,index){  
            if ( orderStatus === 'WAIT') {
                if ( orderStatus === 'WAIT' || element.code === 'INCOME' || element.code === 'CANCEL_B'  ) {
                    newCode.push({
                        id:indexNum,
                        name:element.code_name + (element.code ===  orderStatus ? '(현재)' : ""),
                        code:element.code,
                        checked :  element.code ===  orderStatus ? true : false
                    });
                    indexNum++;
                }
            }else if ( orderStatus === 'INCOME') {
                if ( orderStatus === 'INCOME' || element.code === 'READY' || element.code === 'CANCEL_B'  ) {
                    newCode.push({
                        id:indexNum,
                        name:element.code_name + (element.code ===  orderStatus ? '(현재)' : ""),
                        code:element.code,
                        checked :  element.code ===  orderStatus ? true : false
                    });
                    indexNum++;
                }
            }else if ( orderStatus === 'READY') {
                if ( element.code === 'READY' ||  element.code === 'TRANSING' ||  element.code === 'CANCEL_B'  ) {
                    newCode.push({
                        id:indexNum,
                        name:element.code_name + (element.code ===  orderStatus ? '(현재)' : ""),
                        code:element.code,
                        checked :  element.code ===  orderStatus ? true : false
                    })
                    indexNum++;
                }
            }else if ( orderStatus === 'TRANSING') {
                if ( element.code === 'TRANSING' ||  element.code === 'TRANSOK') {
                    newCode.push({
                        id:indexNum,
                        name:element.code_name + (element.code ===  orderStatus ? '(현재)' : ""),
                        code:element.code,
                        checked :  element.code ===  orderStatus ? true : false
                    });
                    indexNum++;
                }
            }else if ( orderStatus === 'TRANSOK') {
                if ( element.code === 'TRANSOK' ||  element.code === 'RETURN') {
                    newCode.push({
                        id:indexNum,
                        name:element.code_name + (element.code ===  orderStatus ? '(현재)' : ""),
                        code:element.code,
                        checked :  element.code ===  orderStatus ? true : false
                    })
                    indexNum++;
                }
            }else if ( orderStatus === 'CANCEL_A') {
                if ( element.code === 'CANCEL_A' || element.code === 'CANCEL_B' ) {
                    newCode.push({
                        id:indexNum,
                        name:element.code_name + (element.code ===  orderStatus ? '(현재)' : ""),
                        code:element.code,
                        checked :  element.code ===  orderStatus ? true : false
                    });
                    indexNum++;
                }
            }else if ( orderStatus === 'CANCEL_B') {
                if ( element.code === 'CANCEL_B') {
                    newCode.push({
                        id:indexNum,
                        name:element.code_name + (element.code ===  orderStatus ? '(현재)' : ""),
                        code:element.code,
                        checked :  element.code ===  orderStatus ? true : false
                    });
                    indexNum++;
                }
            }else if ( orderStatus === 'RETURN') {
                if ( element.code === 'READY' ||  element.code === 'RETURN') {
                    newCode.push({
                        id:indexNum,
                        name:element.code_name + (element.code ===  orderStatus ? '(현재)' : ""),
                        code:element.code,
                        checked :  element.code ===  orderStatus ? true : false
                    });
                    indexNum++
                }
            }
            
        })
        await this.setState({orderStatusArray: newCode});
    }
    getBaseData = async(order_pk) => {
        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/order/view/' + order_pk;
            const token = this.props.userToken.apiToken;
            let sendData = null;
            returnCode = await apiObject.API_getPageList(this.props,url,token,sendData);
            if ( returnCode.code === '0000'  ) {
                this.setState({
                    orderStatus : CommonUtil.isEmpty(returnCode.data.orderLog) ? 'WAIT' : returnCode.data.orderBase.order_status,
                    orderBase : CommonUtil.isEmpty(returnCode.data.orderBase) ? [] : returnCode.data.orderBase,
                    productData : CommonUtil.isEmpty(returnCode.data.product) ? [] :returnCode.data.product,
                    settleInfo :  CommonUtil.isEmpty(returnCode.data.settleInfo) ? [] :returnCode.data.settleInfo,
                    orderHistroy : CommonUtil.isEmpty(returnCode.data.orderLog.orderhistory) ? [] : returnCode.data.orderLog.orderhistory,
                    loading:false,moreLoading : false
                })
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.',2000);
                this.setState({moreLoading:false,loading:false})
            }
        }catch(e){            
            this.setState({loading:false,moreLoading : false})
        }
    }

    async UNSAFE_componentWillMount() {
        if ( !CommonUtil.isEmpty(this.props.extraData.params.screenData)) {
            await this.getBaseData(this.props.extraData.params.screenData.order_pk);   
            this.setState({
                order_pk : this.props.extraData.params.screenData.order_pk
            })
            const getCommonCode  = await CommonFunction.getStorageCode('CommonCode');
            let setCommonCode = await getCommonCode.filter((info) => info.code_group === 'ORDER_STATUS')
            this.checkStorageCode(setCommonCode);
        }else{
            CommonFunction.fn_call_toast('잘못된 접근입니다..',2000);
            this.props.navigation.goBack(null)
        }
        this.props.navigation.addListener('focus', () => {            
            this.getBaseData(this.state.order_pk);   
        })
    }

    componentDidMount() {
    }

    handleOnScroll (event) {             
        if ( event.nativeEvent.contentOffset.y >= 150 ) {
            this.setState({showTopButton : true}) 
        }else{
            this.setState({showTopButton : false}) 
        }
        let paddingToBottom = 1;
        paddingToBottom += event.nativeEvent.layoutMeasurement.height;                            
        if (event.nativeEvent.contentOffset.y + paddingToBottom >= event.nativeEvent.contentSize.height) {            
            //this.scrollEndReach();
        }
    }

    scrollEndReach = () => {
        if ( this.state.moreLoading === false && this.state.ismore) {            
            this.setState({moreLoading : true})   
        }
    }

    upButtonHandler = () => {        
        this.ScrollView.scrollTo({ x: 0,  animated: true });
    };

    animatedHeight = new Animated.Value(SCREEN_HEIGHT * 0.8);
    closeModal = () => { this.setState({showModal :false})};
    showModal = () => { this.setState({showModal :true})};

    selectFilter = (filt) => {    
        console.log('selectFilter',filt) 
        const newCode = this.state.orderStatusArray[filt].code
        this.setState({formOrderStaus :newCode ,isUpdate:true}) ;            
    }

    pointReturnAction = () => {
        Alert.alert(
            DEFAULT_CONSTANTS.appName,
            "적립금으로 환급진행하시겠습니까?",
            [
                {text: '네', onPress: () =>  this.actionPointReturnAction()},
                {text: '아니오', onPress: () => console.log('Cancle')},
                
            ],
            { cancelable: true }
        )
    }

    actionPointReturnAction = async() => {
        let returnCode = {code:9998};     
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/order/pointrefund/'+this.state.order_pk;
            const token = this.props.userToken.apiToken;
            let sendData = {
                order_pk : this.state.order_pk,
                member_pk : this.state.orderBase.member_pk,
                refund_point : this.state.orderBase.total_amount + this.state.orderBase.coupon_amount + this.state.orderBase.point_amount
            }
            returnCode = await apiObject.API_updateCommon(this.props,url,token,sendData);
            if ( returnCode.code === '0000'  ) {
                CommonFunction.fn_call_toast('정상적으로 환급처리되었습니다' ,1000);
                this.setState({moreLoading:false,loading:false})
                this.props.navigation.goBack();
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.\n[ERR]' + returnCode.msg ,2000);
                this.setState({moreLoading:false,loading:false})
            }
        }catch(e){            
            this.setState({loading:false,moreLoading : false})
        }
    }

    updateData = async() => {
        Alert.alert(
            DEFAULT_CONSTANTS.appName,
            "주문상태를 변경하시겠습니까?",
            [
                {text: '네', onPress: () =>  this.actionOrderStatus()},
                {text: '아니오', onPress: () => console.log('Cancle')},
                
            ],
            { cancelable: true }
        )
    }
    actionOrderStatus = async() => {
        let returnCode = {code:9998};     
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/order/modify/'+this.state.order_pk;
            const token = this.props.userToken.apiToken;
            let sendData = {
                order_pk : this.state.order_pk,
                member_pk : this.state.orderBase.member_pk,
                nowOrderStatus : this.state.orderStatus,
                newOrderStatus : this.state.formOrderStaus,
            }
            returnCode = await apiObject.API_updateCommon(this.props,url,token,sendData);
            if ( returnCode.code === '0000'  ) {
                CommonFunction.fn_call_toast('정상적으로 수정되었습니다.' ,1000);
                //this.getBaseData(this.state.order_pk); 
                this.props.navigation.goBack();
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.\n[ERR]' + returnCode.msg ,2000);
                this.setState({moreLoading:false,loading:false})
            }
        }catch(e){            
            this.setState({loading:false,moreLoading : false})
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
                {   
                    this.state.showTopButton &&
                    <TouchableOpacity style={styles.fixedUpButton} onPress={e => this.upButtonHandler()}>
                        <Icon name="up" size={25} color="#000" />
                    </TouchableOpacity>
                }
                {
                    this.state.popLayerView && (
                    <View>
                        <Overlay
                            onBackdropPress={()=>this.clickCancle()}
                            isVisible={this.state.popLayerView}
                            windowBackgroundColor="rgba(0, 0, 0, 0.8)"
                            overlayBackgroundColor="tranparent"
                            containerStyle={{}}
                        >
                            <View style={{width:SCREEN_WIDTH*0.8,height:SCREEN_HEIGHT*0.3,backgroundColor:'transparent'}}>
                                <CustomAlert screenState={this.state} />
                            </View>
                            
                        </Overlay>
                    </View>
                    )
                }
                <ScrollView
                    ref={(ref) => {
                        this.ScrollView = ref;
                    }}
                    showsVerticalScrollIndicator={false}
                    indicatorStyle={'white'}
                    scrollEventThrottle={16}
                    keyboardDismissMode={'on-drag'}
                    onScroll={e => this.handleOnScroll(e)}
                    onMomentumScrollEnd = {({nativeEvent}) => { 
                        
                    }}
                    onScrollEndDrag ={({nativeEvent}) => { 
                    }}
                    style={{flex:1, backgroundColor:'#f5f6f8'}}
                >
                    <View style={styles.termLineWrap} />  
                    <View style={styles.defaultWrap}>
                        <CustomTextR style={styles.dataTitleText}>{this.state.orderBase.order_no}</CustomTextR>       
                    </View>
                    <View style={styles.defaultWrap}>
                        <CustomTextR style={CommonStyle.titleText15}>주문 상품</CustomTextR>
                    </View>
                    <View style={{flex:1,paddingHorizontal:0}}>
                    {
                        this.state.productData.map((pitem, index) => {  
                        let item = pitem.product_info;
                        return (
                        <View key={index} style={styles.boxSubWrap}>
                            <View style={styles.itemTitleWrap}>
                                <CustomTextR style={styles.dataTitleText}>
                                    {pitem.product_name} <CustomTextR style={CommonStyle.requiredText2}>{pitem.event_limit_price > 0 && "  (한정판매 대상상품)"}</CustomTextR>
                                </CustomTextR>  
                            </View>
                            <View style={styles.itemDataWrap}>
                                <View style={styles.detailLeftWrap}>
                                { !CommonUtil.isEmpty(item.thumb_img) ?
                                    <Image
                                        source={{uri:DEFAULT_CONSTANTS.defaultImageDomain+item.thumb_img}}
                                        resizeMode={"contain"}
                                        style={CommonStyle.defaultIconImage60}
                                    />
                                    :
                                    <Image
                                        source={require('../../../assets/icons/no_image.png')}
                                        resizeMode={"contain"}
                                        style={CommonStyle.defaultIconImage60}
                                    />
                                }  
                                </View>
                                <View style={[styles.detailRightWrap,{flex:4}]}>
                                { 
                                pitem.product_info.child.map((titem, tindex) => {  
                                    
                                    return (
                                    <View style={styles.boxSubWrap2} key={tindex}>
                                        { titem.event_price > 0 ?
                                            <View style={styles.unitWrap}>
                                                <CustomTextR style={CommonStyle.dataText}>{CommonFunction.replaceUnitType(titem.unit_type)}  <CustomTextR style={[CommonStyle.priceText545454,CommonStyle.fontStrike]}>{CommonFunction.currencyFormat(titem.price)}원</CustomTextR> {" "} {CommonFunction.currencyFormat(titem.event_price)}원</CustomTextR>
                                                <CustomTextR style={CommonStyle.dataText}> 수량:{CommonFunction.currencyFormat(titem.quantity)}</CustomTextR>
                                            </View>
                                            :
                                            <View style={styles.unitWrap}>
                                                <CustomTextR style={CommonStyle.dataText}>{CommonFunction.replaceUnitType(titem.unit_type)}({CommonFunction.currencyFormat(titem.price)}원)</CustomTextR>
                                                <CustomTextR style={CommonStyle.dataText}> 
                                                    수량:{CommonFunction.currencyFormat(titem.quantity)}
                                                    {CommonFunction.replaceUnitCount(titem.unit_type,pitem.product_info)}
                                                </CustomTextR>
                                                
                                            </View>
                                        }
                                    </View>
                                    )
                                    })
                                }    
                                </View>
                            </View> 
                            <View style={[styles.itemTitleWrap,{alignItems:'flex-end',paddingRight:20}]}>
                                { item.eventTotalPrice > 0 ?
                                <TextRobotoM style={CommonStyle.titleText}>{"합계금액 : "}
                                <TextRobotoM style={[CommonStyle.priceText545454,CommonStyle.fontStrike]}>{CommonFunction.currencyFormat(item.totalPrice)}원</TextRobotoM> {" "} {CommonFunction.currencyFormat(item.eventTotalPrice)}원</TextRobotoM>
                                :
                                <TextRobotoM style={CommonStyle.titleText}>합계금액 : {CommonFunction.currencyFormat(item.totalPrice)}원</TextRobotoM>  
                                }
                            </View>                           
                        </View>
                        )})
                    }
                    </View>
                    
                    <View style={styles.termLineWrap} /> 
                    <ToggleBox 
                        label='주문자 정보' 
                        value='' 
                        //expanded={true}
                        arrowColor={'#000'}
                        style={styles.toggleboxWrap}
                    >
                        <View style={{paddingVertical:15}}>
                            <View style={styles.dataSubWrap}>
                                <View style={styles.detailLeftWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>주문자 명</CustomTextR>
                                </View>
                                <View style={styles.detailRightWrap}>
                                    <CustomTextR style={CommonStyle.dataText}>{this.state.orderBase.name}</CustomTextR>        
                                </View>
                            </View>
                            <View style={styles.dataSubWrap}>
                                <View style={styles.detailLeftWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>휴대폰</CustomTextR>
                                </View>
                                <View style={styles.detailRightWrap}>
                                    <CustomTextR style={CommonStyle.dataText}>{CommonFunction.fn_dataDecode(this.state.orderBase.phone)}</CustomTextR>    
                                </View>
                            </View>
                            <View style={styles.dataSubWrap}>
                                <View style={styles.detailLeftWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>이메일</CustomTextR>
                                </View>
                                <View style={styles.detailRightWrap}>
                                    <CustomTextR style={CommonStyle.dataText}>{CommonFunction.fn_dataDecode(this.state.orderBase.email)}</CustomTextR>      
                                </View>
                            </View>
                        </View>
                        
                    </ToggleBox>
                    <View style={styles.termLineWrap} />  
                    <ToggleBox 
                        label='배송 정보' 
                        value='' 
                        arrowColor={'#000'}
                        style={styles.toggleboxWrap}
                    >
                        <View style={{paddingVertical:15}}>
                            <View style={styles.dataSubWrap}>
                                <View style={styles.detailLeftWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>수신자명</CustomTextR>
                                </View>
                                <View style={styles.detailRightWrap}>
                                    <CustomTextR style={CommonStyle.dataText}>{this.state.orderBase.delivery_receiver}</CustomTextR> 
                                </View>
                            </View>
                            <View style={styles.dataSubWrap}>
                                <View style={styles.detailLeftWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>휴대폰</CustomTextR>
                                </View>
                                <View style={styles.detailRightWrap}>
                                    <CustomTextR style={CommonStyle.dataText}>{CommonFunction.fn_dataDecode(this.state.orderBase.delivery_phone)}</CustomTextR>       
                                </View>
                            </View>
                            <View style={styles.dataSubWrap}>
                                <View style={styles.detailLeftWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>주소</CustomTextR>
                                </View>
                                <View style={styles.detailRightWrap}>
                                    <CustomTextR style={CommonStyle.dataText}>{this.state.orderBase.delivery_address}</CustomTextR>   
                                </View>
                            </View>
                            <View style={styles.dataSubWrap}>
                                <View style={styles.detailLeftWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>배송시{"\n"}요청사항</CustomTextR>
                                </View>
                                <View style={styles.detailRightWrap}>
                                    <CustomTextR style={CommonStyle.dataText}>{this.state.orderBase.delivery_memo}</CustomTextR>     
                                </View>
                            </View>
                        </View>                        
                    </ToggleBox>
                    <View style={styles.termLineWrap} />  
                    <ToggleBox 
                        label='결제 금액' 
                        value={CommonFunction.currencyFormat(this.state.orderBase.total_amount) + '원'} 
                        arrowColor={'#000'}
                        style={styles.toggleboxWrap}
                    >
                        <View style={{paddingVertical:15}}>
                            <View style={styles.dataSubWrap}>
                                <View style={styles.detailLeftWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>상품금액</CustomTextR>
                                </View>
                                <View style={styles.priceDetailRightWrap}>
                                    <TextRobotoR style={CommonStyle.dataText}>{CommonFunction.currencyFormat(this.state.orderBase.product_amount)}원</TextRobotoR>
                                </View>
                            </View>
                            <View style={styles.dataSubWrap}>
                                <View style={styles.detailLeftWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>상품할인금액</CustomTextR>
                                </View>
                                <View style={styles.priceDetailRightWrap}>
                                    <TextRobotoR style={CommonStyle.dataText}>{CommonFunction.currencyFormat(this.state.orderBase.discount_amount)}원</TextRobotoR>     
                                </View>
                            </View>
                            <View style={styles.dataSubWrap}>
                                <View style={styles.detailLeftWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>배송비</CustomTextR>
                                </View>
                                <View style={styles.priceDetailRightWrap}>
                                    <TextRobotoR style={CommonStyle.dataText}>{CommonFunction.currencyFormat(this.state.orderBase.delivery_amount)}원</TextRobotoR>    
                                </View>
                            </View>
                            <View style={styles.dataSubWrap}>
                                <View style={styles.detailLeftWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>포인트사용</CustomTextR>
                                </View>
                                <View style={styles.priceDetailRightWrap}>
                                    <TextRobotoR style={CommonStyle.dataText}>{CommonFunction.currencyFormat(this.state.orderBase.point_amount)}원</TextRobotoR>     
                                </View>
                            </View>
                            <View style={styles.dataSubWrap}>
                                <View style={styles.detailLeftWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>쿠폰사용</CustomTextR>
                                </View>
                                <View style={styles.priceDetailRightWrap}>
                                    <TextRobotoR style={CommonStyle.dataText}>{CommonFunction.currencyFormat(this.state.orderBase.coupon_amount)}원</TextRobotoR>     
                                </View>
                            </View>
                            <View style={styles.dataSubWrap}>
                                <View style={styles.detailLeftWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>적립예정금</CustomTextR>
                                </View>
                                <View style={styles.priceDetailRightWrap}>
                                    <TextRobotoR style={CommonStyle.dataText}>{CommonFunction.currencyFormat(this.state.orderBase.order_reward_point)}원</TextRobotoR>    
                                </View>
                            </View>
                            <View style={styles.dataSubWrap}>
                                <View style={styles.detailLeftWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>최종결제금액</CustomTextR>
                                </View>
                                <View style={styles.priceDetailRightWrap}>
                                    <TextRobotoM style={CommonStyle.dataText}>{CommonFunction.currencyFormat(this.state.orderBase.total_amount)}원</TextRobotoM>    
                                </View>
                            </View>
                        </View>                        
                    </ToggleBox>
                    <View style={styles.termLineWrap} />  
                    <ToggleBox 
                        label='결제 수단' 
                        value='' 
                        arrowColor={'#000'}
                        style={styles.toggleboxWrap}
                    >
                        <View style={{paddingVertical:15}}>
                            <View style={styles.dataSubWrap}>
                                <View style={styles.detailLeftWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>결제수단</CustomTextR>
                                </View>
                                <View style={styles.detailRightWrap}>
                                    <CustomTextR style={CommonStyle.dataText}>
                                        {this.state.orderBase.settle_type_name}{this.state.orderBase.settle_type}
                                    </CustomTextR>    
                                </View>
                            </View>
                            {this.state.orderBase.settle_type === 'card' &&
                            <View style={styles.dataSubWrap}>
                                <View style={styles.detailLeftWrap}>
                                    <CustomTextR style={CommonStyle.titleText}>주문카드</CustomTextR>
                                </View>
                                <View style={styles.detailRightWrap}>
                                    <CustomTextR style={CommonStyle.dataText}>
                                        {CommonUtil.cardMiddleMask(this.state.settleInfo.card_number,'*')}
                                    </CustomTextR>  
                                    <CustomTextR style={CommonStyle.dataText}>
                                        (
                                        {this.state.settleInfo.card_quota > 1 ?
                                        parseInt(this.state.settleInfo.card_quota-1)+'개월 할부'
                                        :'일시불'
                                        }
                                        )
                                    </CustomTextR>    
                                </View>
                            </View>
                            }
                            { 
                                this.state.orderBase.settle_type == 'vbank' ?
                                <View style={styles.dataSubWrap}>
                                    <View style={styles.detailLeftWrap}>
                                        <CustomTextR style={CommonStyle.titleText}>입금계좌</CustomTextR>
                                    </View>
                                    <View style={styles.detailRightWrap}>
                                        <CustomTextR style={CommonStyle.dataText}>
                                        {this.state.settleInfo.vbank_name}  {this.state.settleInfo.vbank_num}
                                        </CustomTextR>     
                                    </View>
                                </View>
                                :
                                null
                            }
                            { 
                                (this.state.orderBase.settle_type === 'vbank'  && this.state.orderBase.order_status === 'WAIT' ) &&
                                <View style={styles.dataSubWrap}>
                                    <View style={styles.detailLeftWrap}>
                                        <CustomTextR style={CommonStyle.titleText}>입금기한</CustomTextR>
                                    </View>
                                    <View style={styles.detailRightWrap}>
                                        { !CommonUtil.isEmpty(this.state.orderBase.income_limit_dt) &&
                                        <CustomTextR style={CommonStyle.dataText}>{CommonFunction.convertUnixToDate(this.state.orderBase.income_limit_dt,"YYYY.MM.DD")}</CustomTextR> 
                                        }  
                                    </View>
                                </View>
                            }
                        </View>                        
                    </ToggleBox>
                    <View style={styles.termLineWrap} />  
                    <ToggleBox 
                        label='미출고시 조치방법' 
                        value='' 
                        arrowColor={'#000'}
                        style={styles.toggleboxWrap}
                    >
                        <View style={{paddingVertical:15}}>
                            <View style={styles.dataSubWrap}>
                                <View style={styles.detailRightWrap}>
                                    {
                                        this.state.orderBase.refund_type === 'Cash' ?
                                        <CustomTextR style={CommonStyle.dataText}>{DEFAULT_CONSTANTS.return_CashTitle}</CustomTextR>
                                        :
                                        this.state.orderBase.refund_type === 'Product' ?
                                        <CustomTextR style={CommonStyle.dataText}>{DEFAULT_CONSTANTS.return_ProductTitle}</CustomTextR>
                                        :
                                        <CustomTextR style={CommonStyle.dataText}>{DEFAULT_CONSTANTS.return_ProductPartTitle}</CustomTextR>
                                    }
                                </View>
                                {
                                    ( this.state.orderBase.refund_type === 'Cash' &&  !this.state.orderBase.is_refund_point  ) &&
                                    <TouchableOpacity 
                                        style={[styles.detailRightWrap,{alignItems:'flex-end'}]}
                                        onPress={() => this.pointReturnAction()}
                                    >
                                        <View  style={styles.buttonWrap}>
                                            <CustomTextR style={[CommonStyle.dataText,{color:'#fff'}]}>환급처리</CustomTextR>
                                        </View>
                                    </TouchableOpacity>
                                }
                            </View>
                            
                        </View>                        
                    </ToggleBox>
                    <View style={styles.termLineWrap} />  
                    {
                        this.props.userToken.is_salesman ?
                        <View style={styles.productDetailWrap}>
                            <View style={{flex:1,paddingVertical:15}}>
                                <CustomTextB style={styles.menuTitleText}>주문상태</CustomTextB>
                            </View>
                            <View style={{flex:1,justifyContent:'center',alignItems:'flex-end',paddingRight:25}}>
                                <CustomTextR style={CommonStyle.dataText}>{this.state.orderBase.order_status_name}</CustomTextR>
                            </View>
                        </View>
                        :
                        <View style={styles.productDetailWrap}>
                            <View style={{flex:1,paddingVertical:15}}>
                                <CustomTextB style={styles.menuTitleText}>주문상태</CustomTextB>
                            </View>
                            <DropBoxIcon />
                            <View style={{flex:1,paddingVertical:5}}>
                                <SelectType
                                    isSelectSingle
                                    style={{borderWidth:0,alignItems:'flex-end'}}
                                    selectedTitleStyle={{
                                        color: DEFAULT_COLOR.base_color_666,
                                        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),
                                        lineHeight: DEFAULT_TEXT.fontSize14 * 1.42,
                                    }}
                                    colorTheme={DEFAULT_COLOR.base_color_666}
                                    popupTitle="주문상태"
                                    title={'주문상태'}
                                    showSearchBox={false}
                                    cancelButtonText="취소"
                                    selectButtonText="선택"
                                    data={this.state.orderStatusArray}
                                    onSelect={data => {
                                        this.selectFilter(data)
                                    }}
                                    onRemoveItem={data => {
                                        this.state.orderStatusArray[0].checked = true;
                                    }}
                                    initHeight={SCREEN_HEIGHT * 0.6}
                                />
                            </View>
                        </View>
                    }
                    <View style={styles.termLineWrap} />  
                    <ToggleBox 
                        label='주문히스토리' 
                        value='' 
                        arrowColor={'#000'}
                        style={styles.toggleboxWrap}
                    >
                        <View style={{paddingVertical:15}}>
                            <View style={styles.dataSubWrap3}>
                                {this.state.orderHistroy.map((item,index) => {
                                    return (
                                        <View style={styles.detailLeftWrap} key={index}>
                                            <CustomTextR style={CommonStyle.dataText}>
                                                {item.comment} ({CommonFunction.convertUnixToDate(item.reg_dt,"YYYY.MM.DD HH:mm")})
                                            </CustomTextR>
                                        </View>
                                    )
                                })}
                            </View>
                        </View>
                    </ToggleBox>
                    <View style={styles.termLineWrap} />  
                    <View style={CommonStyle.blankArea}></View>
                    { 
                        this.state.moreLoading &&
                        <View style={CommonStyle.moreWrap}>
                            <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} />
                        </View>
                    }
                </ScrollView>    
                {
                    this.state.isUpdate &&
                    <View style={CommonStyle.bottomButtonWrap}>
                        <TouchableOpacity 
                            style={CommonStyle.bottomLeftBox}
                            onPress={()=>this.updateData()}
                        >
                            <CustomTextB style={CommonStyle.bottomMenuOffText}>주문상태 변경</CustomTextB>
                        </TouchableOpacity>
                    </View> 
                }         
            </SafeAreaView>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor : "#fff"
    },
    productDetailWrap : {
        flex:1,paddingVertical:0,paddingLeft:20,backgroundColor:'#fff',flexDirection:'row'
    },
    defaultWrap:{
        flex:1,borderTopWidth:1,borderTopColor:DEFAULT_COLOR.input_border_color,backgroundColor : "#fff",justifyContent:'center',paddingHorizontal:20,backgroundColor:DEFAULT_COLOR.input_bg_color,paddingVertical:15
    },
    itemTitleWrap : {
        flex:1,padding:10,borderBottomColor:'#efefef',borderBottomWidth:1
    },
    itemDataWrap : {
        flex:1,flexDirection:'row',flexGrow:1,  alignItems: 'center', padding:10
    },
    toggleboxWrap :{
        backgroundColor: '#fff', borderBottomWidth: 0,paddingHorizontal:10
    },
    buttonWrap : {
        width:100,height:30,padding:5,justifyContent:'center',alignItems:'center',
        backgroundColor:'blue'
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
    modalTitleWrap : {
        paddingHorizontal:20,paddingVertical:15,flexDirection:'row',
        //paddingHorizontal:5,paddingVertical:10,marginTop:10,flexDirection:'row'
    },
    modalDefaultWrap : {
        paddingHorizontal:20,paddingVertical:15,
    },
    modalSelectedWrap : {
        paddingHorizontal:20,paddingVertical:15,backgroundColor:'#f4f4f4'
    },
    modalLeftWrap : {
        flex:1,justifyContent:'center'
    },
    modalRightWrap : {
        flex:1,justifyContent:'center',alignItems:'flex-end'
    },
    bottomWrap : {
        height:60,justifyContent:'center',alignItems:'center',flexDirection:'row'
    },
    bottomDataWrap : {
        width:80,backgroundColor:'#e1e1e1',justifyContent:'center',alignItems:'center',padding:5,marginRight:5
    },
    formWrap : {
        marginHorizontal:0,marginVertical:15,height:40
    },
    formTitleWrap : {
        position:'absolute',left:20,top:-15,width:'100%'
    },
    formTitleText : {
        color: DEFAULT_COLOR.base_color, fontSize: PixelRatio.roundToNearestPixel(10), fontWeight: '500', letterSpacing: -0.5
    },
    /**** Modal  *******/
    fixedUpButton : {
        position:'absolute',bottom:30,right:50,width:50,height:50,borderColor:'#ccc',borderWidth:1,borderRadius:25,alignItems:'center',justifyContent:'center',zIndex:10
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    topRepeatWrap : {
        marginHorizontal:10,paddingVertical:Platform.OS === 'ios' ? 10 : 5 ,justifyContent:'center',alignItems:'center',borderWidth:1,borderColor:DEFAULT_COLOR.base_color
    },
    bottomCancleWrap : {
        marginHorizontal:10,paddingVertical:Platform.OS === 'ios' ? 10 : 5,justifyContent:'center',alignItems:'center',backgroundColor:DEFAULT_COLOR.base_color
    },
    mainTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)
    },
    termLineWrap : {
        flex:1,
        paddingVertical:5,
        backgroundColor:'#f5f6f8'
    },
    boxWrap : {
        flex:1,
        flexDirection:'row',    
        flexGrow:1,    
        paddingHorizontal:20,paddingVertical:15,
        backgroundColor:'#f5f6f8',
        borderBottomWidth:1,
        borderBottomColor : DEFAULT_COLOR.input_border_color
    },
    boxSubWrap : {
        flex:1,
        backgroundColor:'#fff',
        paddingHorizontal:10,
        borderBottomWidth:1,
        borderBottomColor : DEFAULT_COLOR.input_border_color
    },
    boxSubWrap2 : {
        flex:1,  
        backgroundColor:'#fff',
        paddingHorizontal:20,
        justifyContent: 'center',
    },
    unitWrap : {
        flex:1,flexDirection:'row',alignItems:'center'
    },
    dataSubWrap : {
        flex:1,
        flexDirection:'row',    
        flexGrow:1,    
        paddingHorizontal:20,paddingVertical:5,
        alignItems: 'center',        
    },

    dataSubWrap3 : {
        flex:1,    
        paddingHorizontal:20,paddingVertical:5,
        justifyContent: 'center',        
    },
    boxCenterWrap : {
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    boxLeftWrap : {
        flex:5,
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center'
    },
    boxRightWrap : {
        flex:1,        
        justifyContent:'center',
        alignItems:'flex-end'
    },
    detailLeftWrap : {
        flex:1.2,
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center'
    },
    detailRightWrap : {
        flex:3,        
        justifyContent:'center'
    },
    goodsDetailRightWrap : {
        flex:3,        
        justifyContent:'center',paddingLeft:10
    },
    priceDetailRightWrap : {
        flex:3,        
        justifyContent:'center',alignItems:'flex-end',paddingRight:15
    },
    menuTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize25)
    },
    menuTitleText2 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#fff'
    },
    menuTitleSubText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#111'
    },
    dataTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)
    },
    dataTitleText2 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#666'
    },
    ballWarp : {
        marginTop: 0,width: 50,height: 15,borderRadius: 10,padding:5,borderWidth:0.5,borderColor:'#ebebeb',
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
        width: 24,height: 24,borderRadius: 12,backgroundColor:'#fff',
        
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
        },
        _saveNonUserToken:(str)=> {
            dispatch(ActionCreator.saveNonUserToken(str))
        }
    };
}


export default connect(mapStateToProps,mapDispatchToProps)(OrderDetailScreen);
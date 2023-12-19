import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Alert,Dimensions,Linking, PixelRatio,Image,TouchableOpacity,Animated,Platform} from 'react-native';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import AsyncStorage from '@react-native-community/async-storage';
import Modal from 'react-native-modal';
import {Overlay,Input} from 'react-native-elements';
//공통상수 필요에 의해서 사용
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import CommonStyle from '../../Style/CommonStyle';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import SelectType from "../../Utils/SelectType";
import {CustomTextR,CustomTextL, CustomTextB, CustomTextM, TextRobotoB,TextRobotoM,TextRobotoR,DropBoxIcon} from '../../Components/CustomText';
import CustomAlert from '../../Components/CustomAlert';
import CommonUtil from '../../Utils/CommonUtil';
import CommonFunction from '../../Utils/CommonFunction';
const alertContents = 
(<View style={{flex:1,marginTop:10}}>
    <View style={{paddingTop:20}}>
        <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),color:'#494949'}}>
            1800-1800
        </CustomTextR>        
    </View>
</View>);
import ToggleBox from '../../Utils/ToggleBox';
const mockData1  = 
    {id : 1, date : '2020.11.11 13:59:45' ,title : '주문번호 20201101-D12341',price : 35000 , product : '수세미수세미외 1건' , status : '입금완료'};

const mockData2  = [
    {id : 1, date : '2020.11.11 13:59:45' ,title : '주문번호 20201101-D12341',price : 35000 , product : '수세미수세미외 1건' , status : '입금완료'},
    {id : 2, date : '2020.11.11 13:59:45' ,title : '주문번호 20201101-D12342', price : 35000 , product : '수세미수세미외 1건' , status : '입금대기'},    
]


const COMMON_CODE_BANK = [
    { id : 1 , code  : '1' , name  : '신한은행'},
    { id : 2 , code  : '2' , name  : '국민은행'},
    { id : 3 , code  : '3' , name  : '우리은행'},
    { id : 4 , code  : '4' , name  : '카카오뱅크'},
    { id : 5 , code  : '5' , name  : '산업은행'},
    { id : 6 , code  : '99' , name  : '기타은행'},
]

class OrderDetailScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : false,
            showTopButton : false,
            showModal :false,
            popLayerView2 :false,
            bankCode : [],
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
        //console.log('BankCode',arr)  
        let newBankCode = [];
        await JSON.parse(arr).forEach(function(element,index,array){            
            if ( element.bankcode) {
                newBankCode.push({
                    id:index,
                    idx:element.bankidx,
                    name:element.bankname,
                    code:element.bankcode
                })
            }
        })
        await this.setState({bankCode: newBankCode});
    }
    async UNSAFE_componentWillMount() {
        const BankCode = await AsyncStorage.getItem('BankCode');
        if ( !CommonUtil.isEmpty(BankCode)) {
            this.checkStorageCode(BankCode);
            //console.log('BankCode',BankCode)  
        }
        
        
    }

    componentDidMount() {
        if ( !CommonUtil.isEmpty(this.state.bankCode)) {
            
        }
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
            setTimeout(
                () => {            
                    
                },500
            )
            
        }
    }

    upButtonHandler = () => {        
        this.ScrollView.scrollTo({ x: 0,  animated: true });
    };

    animatedHeight = new Animated.Value(SCREEN_HEIGHT * 0.8);
    closeModal = () => { this.setState({showModal :false})};
    showModal = () => { this.setState({showModal :true})};
    hidePopLayer = async() => { this.setState({popLayerView2 :false}) }
    moveDetail = (nav,item) => {
        this.props.navigation.navigate('OrderDetailStack',{
            screenTitle:item
        })
    }
    orderCancle = async() => {
        Alert.alert(
            "주문 취소",      
            "정말로 주문을 취소하시겠습니까?",
            [
                {text: 'OK', onPress: () =>  this.props.navigation.navigate('OrderCancelStack',{
                    screenData:null
                })},
                {text: 'CANCEL', onPress: () => console.log('Cancle')},
                
            ],
            { cancelable: true }
        )  
    }
    
    cartInsertAgiain = async() => {
        CommonFunction.fn_call_toast('준비중입니다',2000)
    }

    selectFilter = (mode,filt) => {     
        //console.log('filt',filt)  
        
        switch( mode) {
            case 'bank' : this.setState({formBank : this.state.bankCode[filt-1].code}) ; break;
        }
        
    }

    render() {
        return(
            <SafeAreaView style={ styles.container }>
                { this.state.showTopButton &&
                    <TouchableOpacity 
                        style={styles.fixedUpButton}
                        onPress={e => this.upButtonHandler()}
                    >
                        <Icon name="up" size={25} color="#000" />
                    </TouchableOpacity>
                }
                {this.state.popLayerView && (
                    <View >
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
                )}

                {this.state.popLayerView2 && (
                    <View >
                        <Overlay
                            onBackdropPress={()=>this.hidePopLayer()}
                            isVisible={this.state.popLayerView2}
                            windowBackgroundColor="rgba(0, 0, 0, 0.8)"
                            overlayBackgroundColor="tranparent"
                            containerStyle={{}}
                        >
                            <View style={{width:SCREEN_WIDTH*0.8,height:SCREEN_HEIGHT*0.5,backgroundColor:'transparent'}}>
                                <View style={styles.modalTitleWrap} >
                                    <View style={styles.modalLeftWrap}>
                                        <CustomTextB style={styles.menuTitleText}>환급정보 등록</CustomTextB>
                                    </View>    
                                </View>    
                                    
                                <View >       
                                    <View style={styles.formWrap}>
                                        <View style={styles.formTitleWrap}>
                                            <CustomTextM style={styles.formTitleText}>은행선택</CustomTextM>
                                        </View>
                                        <View style={{flex: 7,justifyContent: 'center',alignItems: 'center',}}>
                                            <DropBoxIcon />
                                            <SelectType
                                                isSelectSingle
                                                style={{borderWidth:0,justifyContent:'center'}}
                                                selectedTitleStyle={{
                                                    color: DEFAULT_COLOR.base_color_666,
                                                    fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),
                                                    lineHeight: DEFAULT_TEXT.fontSize14 * 1.42,
                                                }}
                                                colorTheme={DEFAULT_COLOR.base_color_666}
                                                popupTitle="은행선택"
                                                title={'은행선택'}
                                                showSearchBox={false}
                                                cancelButtonText="취소"
                                                selectButtonText="선택"
                                                data={this.state.bankCode}
                                                onSelect={data => {
                                                    this.selectFilter('bank',data)
                                                }}
                                                onRemoveItem={data => {
                                                    this.state.bankCode[0].checked = true;
                                                }}
                                                initHeight={SCREEN_HEIGHT * 0.6}
                                            />
                                        </View>
                                        
                                    </View>
                                    <View style={styles.formWrap}>
                                        <View style={styles.formTitleWrap}>
                                        <CustomTextM style={styles.formTitleText}>계좌번호</CustomTextM>
                                        </View>
                                        <Input
                                            placeholder="계좌번호를 입력해주세요"
                                            keyboardType={'number-pad'}
                                            inputContainerStyle={CommonStyle.inputBlank}                    
                                            inputStyle={CommonStyle.defaultOneWayForm}
                                            onChangeText={value => console.log(value)}
                                        />
                                    </View>
                                    <View style={styles.formWrap}>
                                        <View style={styles.formTitleWrap}>
                                        <CustomTextM style={styles.formTitleText}>수신명을</CustomTextM>
                                        </View>
                                        <Input
                                            placeholder="수신명을 입력해주세요"
                                            inputContainerStyle={CommonStyle.inputBlank}                    
                                            inputStyle={CommonStyle.defaultOneWayForm}
                                            onChangeText={value => console.log(value)}
                                        />
                                    </View>
                                </View> 
                                <View style={styles.bottomWrap}>
                                    <TouchableOpacity 
                                        onPress={()=> this.hidePopLayer()}
                                        style={styles.bottomDataWrap}
                                    >
                                        <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#9f9f9f'}}>취소</CustomTextM>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        onPress={()=>this.orderCancle()}
                                        style={[styles.bottomDataWrap,{backgroundColor:DEFAULT_COLOR.base_color}]}
                                    >
                                        <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#fff'}}>주문취소</CustomTextM>
                                    </TouchableOpacity>
                                    
                                </View> 
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
                    onScroll={e => this.handleOnScroll(e)}
                    onMomentumScrollEnd = {({nativeEvent}) => { 
                        
                    }}
                    onScrollEndDrag ={({nativeEvent}) => { 
                    }}
                    style={{flex:1, backgroundColor:'#f5f6f8'}}
                >
                   <View style={styles.termLineWrap} />  
     
                    <View style={styles.boxSubWrap}>
                        <View style={styles.boxLeftWrap}>
                            <CustomTextR style={styles.dataTitleText}>{mockData1.title}</CustomTextR>          
                        </View>
                    </View>
                    <View style={styles.boxSubWrap2}>
                        <CustomTextR style={styles.dataTitleText}>아릭스 수세미 스펀지 외 1건</CustomTextR>
                    </View>
                    <View style={styles.boxSubWrap}>
                        <View style={styles.detailLeftWrap}>
                            <Image
                                source={require('../../../assets/images/sample001.png')}
                                resizeMode={"contain"}
                                style={{flex:1,width:'90%',aspectRatio: 1}}
                            /> 
                        </View>
                        <View style={styles.goodsDetailRightWrap}>
                            <CustomTextR style={styles.dataTitleText}>아릭스 스세미 스펀지</CustomTextR>  
                            <CustomTextR style={styles.dataTitleText2}>낱개(1,050원) - 8개</CustomTextR>  
                            <CustomTextR style={styles.dataTitleText2}>박스(5,000원) - 1개</CustomTextR>  
                            <CustomTextR style={styles.dataTitleText}>합계 : 13,400원</CustomTextR>          
                        </View>
                    </View>
                    <View style={styles.boxSubWrap}>
                        <View style={styles.detailLeftWrap}>
                            <Image
                                source={require('../../../assets/images/sample001.png')}
                                resizeMode={"contain"}
                                style={{flex:1,width:'90%',aspectRatio: 1}}
                            /> 
                        </View>
                        <View style={styles.goodsDetailRightWrap}>
                            <CustomTextR style={styles.dataTitleText}>아릭스 스세미 스펀지</CustomTextR>  
                            <CustomTextR style={styles.dataTitleText2}>낱개(1,050원) - 8개</CustomTextR>  
                            <CustomTextR style={styles.dataTitleText2}>박스(5,000원) - 1개</CustomTextR> 
                            <CustomTextR style={styles.dataTitleText}>합계 : 8,400원</CustomTextR>          
                        </View>
                    </View>
                    <View style={styles.termLineWrap} /> 
                    <ToggleBox 
                        label='주문자 정보' 
                        value='' 
                        //expanded={true}
                        arrowColor={'#000'}
                        style={{backgroundColor: '#fff', borderBottomWidth: 0,paddingHorizontal:10}}
                        
                    >
                        <View style={{paddingVertical:15}}>
                            <View style={styles.dataSubWrap}>
                                <View style={styles.detailLeftWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>주문자 명</CustomTextR>
                                </View>
                                <View style={styles.detailRightWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>홍길동</CustomTextR>     
                                </View>
                            </View>
                            <View style={styles.dataSubWrap}>
                                <View style={styles.detailLeftWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>휴대폰</CustomTextR>
                                </View>
                                <View style={styles.detailRightWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>010123456578</CustomTextR>     
                                </View>
                            </View>
                            <View style={styles.dataSubWrap}>
                                <View style={styles.detailLeftWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>이메일</CustomTextR>
                                </View>
                                <View style={styles.detailRightWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>sample@superbinder.com</CustomTextR>     
                                </View>
                            </View>
                        </View>
                        
                    </ToggleBox>
                    <View style={styles.termLineWrap} />  
                    <ToggleBox 
                        label='배송 정보' 
                        value='' 
                        arrowColor={'#000'}
                        style={{backgroundColor: '#fff', borderBottomWidth: 0,paddingHorizontal:10}}
                    >
                        <View style={{paddingVertical:15}}>
                            <View style={styles.dataSubWrap}>
                                <View style={styles.detailLeftWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>수신자명</CustomTextR>
                                </View>
                                <View style={styles.detailRightWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>홍길동</CustomTextR>     
                                </View>
                            </View>
                            <View style={styles.dataSubWrap}>
                                <View style={styles.detailLeftWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>휴대폰</CustomTextR>
                                </View>
                                <View style={styles.detailRightWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>010123456578</CustomTextR>     
                                </View>
                            </View>
                            <View style={styles.dataSubWrap}>
                                <View style={styles.detailLeftWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>주소</CustomTextR>
                                </View>
                                <View style={styles.detailRightWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>서울시 관악구 남사당로 192[06312]</CustomTextR>     
                                </View>
                            </View>
                            <View style={styles.dataSubWrap}>
                                <View style={styles.detailLeftWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>배송시{"\n"}요청사항</CustomTextR>
                                </View>
                                <View style={styles.detailRightWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>도착시 전화주세요</CustomTextR>     
                                </View>
                            </View>
                        </View>                        
                    </ToggleBox>
                    <View style={styles.termLineWrap} />  
                    <ToggleBox 
                        label='결제 금액' 
                        value='' 
                        arrowColor={'#000'}
                        style={{backgroundColor: '#fff', borderBottomWidth: 0,paddingHorizontal:10}}
                    >
                        <View style={{paddingVertical:15}}>
                            <View style={styles.dataSubWrap}>
                                <View style={styles.detailLeftWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>상품금액</CustomTextR>
                                </View>
                                <View style={styles.priceDetailRightWrap}>
                                    <TextRobotoR style={styles.menuTitleSubText}>{CommonFunction.currencyFormat(9000)}원</TextRobotoR>     
                                </View>
                            </View>
                            <View style={styles.dataSubWrap}>
                                <View style={styles.detailLeftWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>상품할인금액</CustomTextR>
                                </View>
                                <View style={styles.priceDetailRightWrap}>
                                    <TextRobotoR style={styles.menuTitleSubText}>{CommonFunction.currencyFormat(600)}원</TextRobotoR>     
                                </View>
                            </View>
                            <View style={styles.dataSubWrap}>
                                <View style={styles.detailLeftWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>배송비</CustomTextR>
                                </View>
                                <View style={styles.priceDetailRightWrap}>
                                    <TextRobotoR style={styles.menuTitleSubText}>{CommonFunction.currencyFormat(2500)}원</TextRobotoR>     
                                </View>
                            </View>
                            <View style={styles.dataSubWrap}>
                                <View style={styles.detailLeftWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>최종결제금액</CustomTextR>
                                </View>
                                <View style={styles.priceDetailRightWrap}>
                                    <TextRobotoM style={styles.menuTitleSubText}>{CommonFunction.currencyFormat(10900)}원</TextRobotoM>     
                                </View>
                            </View>
                        </View>                        
                    </ToggleBox>
                    <View style={styles.termLineWrap} />  
                    <ToggleBox 
                        label='결제 수단' 
                        value='' 
                        arrowColor={'#000'}
                        style={{backgroundColor: '#fff', borderBottomWidth: 0,paddingHorizontal:10}}
                    >
                        <View style={{paddingVertical:15}}>
                            <View style={styles.dataSubWrap}>
                                <View style={styles.detailLeftWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>결제수단</CustomTextR>
                                </View>
                                <View style={styles.detailRightWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>무통장입금/신용카드/휴대폰결제</CustomTextR>     
                                </View>
                            </View>
                            <View style={styles.dataSubWrap}>
                                <View style={styles.detailLeftWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>주문카드</CustomTextR>
                                </View>
                                <View style={styles.detailRightWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>신한카드 1234********1234</CustomTextR>     
                                </View>
                            </View>
                            <View style={styles.dataSubWrap}>
                                <View style={styles.detailLeftWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>입금계좌</CustomTextR>
                                </View>
                                <View style={styles.detailRightWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>신한은행 123456787 슈퍼바인더</CustomTextR>     
                                </View>
                            </View>
                        </View>                        
                    </ToggleBox>
                </ScrollView>              
            </SafeAreaView>
        );
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor : "#fff"
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
        paddingHorizontal:20,paddingVertical:15,flexDirection:'row'
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
        flexDirection:'row',    
        flexGrow:1,    
        backgroundColor:'#fff',
        paddingHorizontal:20,paddingVertical:15,
        alignItems: 'center',        
        borderBottomWidth:1,
        borderBottomColor : DEFAULT_COLOR.input_border_color
    },

    boxSubWrap2 : {
        flex:1,  
        backgroundColor:'#fff',
        paddingHorizontal:20,paddingTop:15,
        justifyContent: 'center',
    },
    
    dataSubWrap : {
        flex:1,
        flexDirection:'row',    
        flexGrow:1,    
        paddingHorizontal:20,paddingVertical:5,
        alignItems: 'center',        
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
        flex:1,
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
import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Text,Dimensions,RefreshControl,PixelRatio,Image,TouchableOpacity,BackHandler,TextInput,KeyboardAvoidingView,Animated,Alert} from 'react-native';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
import 'moment/locale/ko'
import  moment  from  "moment";
import {CheckBox,Overlay} from 'react-native-elements';
//공통상수 필요에 의해서 사용
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import CommonStyle from '../../Style/CommonStyle';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {CustomTextR,CustomTextL, CustomTextB, CustomTextM, TextRobotoM,TextRobotoR,DropBoxSearchIcon} from '../../Components/CustomText';
import CommonUtil from '../../Utils/CommonUtil';
import CommonFunction from '../../Utils/CommonFunction';
import Loader from '../../Utils/Loader';
import { apiObject } from "../Apis";
import PopLayerSelect from './PopLayerSelect';
const currentDate =  moment().format('YYYY-MM-DD H:m');
const minDate =  moment().format('YYYY-MM-DD');
const maxDate =  moment().add(90, 'd').format('YYYY-MM-DD 23:59');

const RADIOON_OFF = require('../../../assets/icons/check_off.png');
const RADIOON_ON = require('../../../assets/icons/check_on.png');
const DefaultPaginate = 20;
const couponBaseList = [
    { id: 1, name : '5천원', code : 5000,checked:false},
    { id: 2, name : '1만원', code : 10000,checked:false},
    { id: 3, name : '5만원', code : 50000,checked:false},
    { id: 4, name : '10만원', code : 100000,checked:false},
    { id: 5, name : '직접입력', code : 9,checked:false},
   
]

class CouponRegistScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading : true,
            couponType : 5000,
            couponTypeEtc : 0,
            moreLoading : false,
            totalCount : 0,
            ismore :  false,
            currentPage : 1,
            targetMember : null,
            formReaseon : '',
            userList : [],
            target_array : [],
            popLayerView2 : false,
            closepopLayer2 : this.closepopLayer2.bind(this),
            setProductArray : this.setProductArray.bind(this)
        }
    }

    resetForm = () => {
        this.setState({
            loading : true,
            couponType : 5000,
            couponTypeEtc : 0,
            formReaseon : '',
            targetMember : null,
            target_array : []
        })
    }


    setProductArray = (data) => {
        this.setState({
            userList : data.userList,
            currentPage : data.currentPage,
            ismore : data.ismore
        })
    }
    setUserList = async(returnCode) => {
        let newData = [];
        await returnCode.data.userList.forEach(function(element,index,array){     
            newData.push({id : index,name : element.name,code : element.member_pk ,checked : false,...element})               
        });
        this.setState({
            totalCount : returnCode.total,
            ismore : parseInt(this.state.currentPage)  < parseInt(returnCode.lastPage) ? true : false,
            userList : newData
        })

    }

    getBaseData = async() => {
        let returnCode = {code:9998};
        const sort_Item = "&sort_item=uname";
        const sort_Type = "&sort_type=ASC";
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/member/list?is_approval=true&paginate=' + DefaultPaginate + '&page=1' + sort_Item + sort_Type;
            //console.log('url',url) 
            const token = this.props.userToken.apiToken;
            let sendData = null;
            returnCode = await apiObject.API_getPageList(this.props,url,token,sendData);          
            //console.log('returnCode',returnCode)   
            if ( returnCode.code === '0000'  ) {
                this.setState({currentPage : returnCode.currentPage})
                if ( !CommonUtil.isEmpty(returnCode.data.userList)) {
                    this.setUserList(returnCode)
                }
                
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.',2000);
            }
            this.setState({moreLoading:false,loading:false})
        }catch(e){
            this.setState({loading:false,moreLoading : false})
        }
    }
    
    async UNSAFE_componentWillMount() {
        await this.getBaseData();
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


    closepopLayer2 = (arr) => {
        if ( !CommonUtil.isEmpty(arr)) {
            this.setState({target_array : arr})
        }
        this.props._fn_toggleKeyboardFocus(false);
        this.setState({popLayerView2: false});
    }; 
    showpopLayer2 = () => {
        this.props._fn_toggleKeyboardFocus(false);
        this.setState({ popLayerView2: true });
    }

    registData = async() => {
        this.setState({moreLoading:true})
        let expireDate = moment().add(90, 'd').format('YYYY-MM-DD 23:59');
        let returnCode = {code:9998};     
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/coupon/regist';           
            const token = this.props.userToken.apiToken;
            let sendData = {
                is_App : true,
                coupon_type : this.state.couponType,
                issue_reason :  this.state.formReaseon,
                price : this.state.couponType == 9 ? this.state.couponTypeEtc*1 : this.state.couponType,
                is_direct : this.state.couponType == 9 ? true : false,
                end_dt : CommonFunction.convertDateToUnix(expireDate),
                target_array : this.state.target_array,
            }
            console.log('sendData',sendData)
            returnCode = await apiObject.API_registCommon(this.props,url,token,sendData);          
            console.log('ddd',returnCode)
            if ( returnCode.code === '0000'  ) {
                CommonFunction.fn_call_toast('정상적으로 등록되었습니다.' ,2000);
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
            "쿠폰을 발급하시겠습니까?",
            [
                {text: '네', onPress: () =>  this.registData()},
                {text: '아니오', onPress: () => console.log('Cancle')}
            ],
            { cancelable: true }
        )  
    }

    showModalCheck = async() => {        
        if ( CommonUtil.isEmpty(this.state.formReaseon)) {
            CommonFunction.fn_call_toast('발급사유를 입력해주세요',2000);
            return true;   
        }else if ( this.state.target_array.length === 0) {
            CommonFunction.fn_call_toast('대상자를 선택해주세요',2000);
            return true;
        }else if ( this.state.couponType === 9 && this.state.couponTypeEtc < 1 ) {
            CommonFunction.fn_call_toast('쿠폰금액을 입력해주세요',2000);
            return true;           
        }else{
            this.actionOrder();
        }
    }

    selectFilter = async(mode,filt) => {
        let arr = await this.state.userList.filter(function(obj) {
            return obj.checked === true
        })
        .map(function(obj) {
            return obj.code;
        });        
        this.setState({
            target_array : arr
        })
    }

    removeProducts = async(idx) => { 
        let newArray = this.state.target_array.filter((item,index) => index !== idx );
        console.log('target_array',newArray)
        this.setState({
            target_array : newArray
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
                    <KeyboardAvoidingView style={{flex:1,paddingVertical:10}} behavior={Platform.OS === 'ios' ? "padding" : 'height'}  enabled> 
                    {
                        this.state.popLayerView2 && (
                        <View >
                            <Overlay
                                isVisible={this.state.popLayerView2}
                                //onBackdropPress={this.closepopLayer2}
                                windowBackgroundColor="rgba(0, 0, 0, 0.8)"
                                overlayBackgroundColor="tranparent"                                
                                containerStyle={{margin:0,padding:0}}
                            >
                                <View style={[styles.popLayerWrap,this.props.toggleKeyboardFocus ? styles.popLayerWrapH5 : styles.popLayerWrapH8]}>
                                    <PopLayerSelect screenState={this.state} />
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
                        style={{width:'100%'}}
                    >
                        <View style={styles.dataTopWrap}>
                            <View style={styles.titleWrap}>
                                <CustomTextR style={CommonStyle.titleText}>쿠폰구분</CustomTextR>
                                <CustomTextR style={CommonStyle.requiredText}></CustomTextR>
                            </View>
                            <View style={styles.dataWrap}>
                                {
                                couponBaseList.map((item, index) => {  
                                return (
                                    <View style={styles.CheckBoxWrap} key={index}>
                                        <CheckBox 
                                            containerStyle={{padding:0,margin:0}}   
                                            iconType={'FontAwesome'}
                                            checkedIcon={<Image source={RADIOON_ON} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                            uncheckedIcon={<Image source={RADIOON_OFF} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                            checkedColor={DEFAULT_COLOR.base_color}                          
                                            checked={this.state.couponType === item.code}
                                            size={PixelRatio.roundToNearestPixel(15)}                                    
                                            onPress={() => this.setState({couponType:item.code})}
                                        />
                                        <TouchableOpacity 
                                            onPress={() => this.setState({couponType:item.code})}
                                            style={[styles.detailRightWrap,{flex:3}]}
                                        >
                                            <CustomTextR style={styles.menuTitleText}>{item.name}</CustomTextR>    
                                        </TouchableOpacity>
                                    </View>
                                )
                                })
                            }
                            </View> 
                            {
                            this.state.couponType === 9 && 
                                <View style={{paddingHorizontal:5}}>
                                    <TextInput          
                                        placeholder={'금액을 입력하세요)'}
                                        keyboardType={"number-pad"}
                                        maxLength={55}
                                        placeholderTextColor={DEFAULT_COLOR.base_color_666}                           
                                        style={[styles.inputBlank,CommonStyle.defaultOneWayForm]}
                                        value={this.state.couponTypeEtc}
                                        onChangeText={text=>this.setState({couponTypeEtc:text.trim()})}
                                        multiline={false}
                                        clearButtonMode='always'
                                    />
                                </View> 
                            }

                            <View style={styles.titleWrap}>
                                <CustomTextR style={CommonStyle.titleText}>발급사유</CustomTextR>
                                <CustomTextR style={CommonStyle.requiredText}>{'*'}</CustomTextR>
                            </View>
                            <View style={{paddingHorizontal:5}}>
                                <TextInput          
                                    placeholder={'발급사유을 입력해주세요(50자이내)'}
                                    maxLength={55}
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                           
                                    style={[styles.inputBlank,CommonStyle.defaultOneWayForm]}
                                    value={this.state.formReaseon}
                                    onChangeText={text=>this.setState({formReaseon:text.trim()})}
                                    multiline={false}
                                    clearButtonMode='always'
                                />
                            </View> 
                           
                            <View style={styles.titleWrap}>
                                <CustomTextR style={CommonStyle.titleText}>회원선택</CustomTextR>
                                <View style={styles.formTextTypeWrap}>
                                    <TouchableOpacity 
                                        onPress={()=> this.showpopLayer2()}
                                        style={styles.formTextType}
                                    >
                                        <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#fff'}}>회원선택</CustomTextR>
                                    </TouchableOpacity>
                                </View>                                
                            </View>
                            { 
                                this.state.target_array.length === 0  ?
                                <View style={{paddingHorizontal:5}}>
                                    <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:DEFAULT_COLOR.base_color_666}}>
                                        대상 회원을 선택해주세요
                                    </CustomTextR>
                                </View> 
                                :
                                <View style={styles.productArrayWrap}>
                                {
                                    this.state.target_array.map((item, index) => {  
                                    return (
                                        <View key={index} style={styles.boxSubWrap}>
                                            <View style={styles.boxRightWrap}>
                                                <CustomTextR style={styles.menuTitleText}>{item.name}</CustomTextR>
                                                <CustomTextR style={styles.menuPriceText}>{item.grade_name}</CustomTextR>
                                            </View>
                                            <View style={styles.boxRightWrap2}>
                                                <CustomTextR style={CommonStyle.dataText}>구매누적액:<TextRobotoR style={CommonStyle.dataText2}>{CommonFunction.currencyFormat(item.total_amount)}원</TextRobotoR></CustomTextR>
                                                <CustomTextR style={CommonStyle.dataText}>리워드금액 <TextRobotoR style={CommonStyle.dataText2}>{CommonFunction.currencyFormat(item.total_reward)}원</TextRobotoR></CustomTextR>
                                            </View>
                                            <TouchableOpacity 
                                                style={styles.boxLeftWrap}
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

                            <View>
                                <View style={styles.titleWrap}>
                                    <CustomTextR style={CommonStyle.titleText}>사용가능일자</CustomTextR>
                                    <CustomTextR style={CommonStyle.requiredText}></CustomTextR>
                                </View>
                                <View style={{paddingHorizontal:5}}>
                                    <CustomTextR style={CommonStyle.dataText}>{currentDate} ~ {maxDate}</CustomTextR>
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
                    </KeyboardAvoidingView>
                    <View style={CommonStyle.bottomButtonWrap}>
                        <TouchableOpacity 
                            style={CommonStyle.bottomLeftBox}
                            onPress={()=>this.showModalCheck()}
                        >
                            <CustomTextB style={CommonStyle.bottomMenuOffText}>생성 및 발급진행</CustomTextB>
                        </TouchableOpacity>
                    </View>
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
        paddingHorizontal:5,paddingVertical:10,marginTop:10,flexDirection:'row'
    },
    dataWrap : {
        flex:1,paddingHorizontal:15,flexDirection:'row',flexGrow:1,flexWrap:'wrap',alignContent:'space-between'
    },
    CheckBoxWrap:{
        flex:1,flexDirection:'row',alignItems:'center',minWidth:SCREEN_WIDTH/3-20,paddingVertical:5
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
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14)
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
        flex:0.5,        
        justifyContent:'center',
        alignItems:'center'
    },
    boxRightWrap : {
        flex:2,        
        justifyContent:'center',
        alignItems:'flex-start'
    },
    boxRightWrap2 : {
        flex:2,        
        justifyContent:'center',
        alignItems:'flex-end'
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
    popLayerWrap : {
        width:SCREEN_WIDTH*0.9,backgroundColor:'transparent',margin:0,padding:0
    },
    popLayerWrapH8 : {
        height:SCREEN_HEIGHT*0.8,
    },
    popLayerWrapH5 : {
        height:SCREEN_HEIGHT*0.5,
    }
});


function mapStateToProps(state) {
    return {
        userToken : state.GlabalStatus.userToken,
        toggleKeyboardFocus : state.GlabalStatus.toggleKeyboardFocus
    };
}
function mapDispatchToProps(dispatch) {
    return {                
        _saveUserToken:(str)=> {
            dispatch(ActionCreator.saveUserToken(str))
        },
        _fn_toggleKeyboardFocus:(bool) => {
            dispatch(ActionCreator.fn_toggleKeyboardFocus(bool))
        }
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(CouponRegistScreen);
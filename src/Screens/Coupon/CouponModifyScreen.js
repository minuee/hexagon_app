import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Text,Dimensions,PixelRatio,Image,TouchableOpacity,BackHandler,TextInput,KeyboardAvoidingView,Animated,Alert,Platform} from 'react-native';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
import 'moment/locale/ko'
import  moment  from  "moment";
import Modal from 'react-native-modal';
import {CheckBox} from 'react-native-elements';
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
import SelectSearch2 from "../../Utils/SelectSearch2";
import SelectCalendar from '../../Utils/SelectCalendar';
import Loader from '../../Utils/Loader';
import { apiObject } from "../Apis";

const currentDate =  moment().format('YYYY-MM-DD H:m');
const minDate =  moment().format('YYYY-MM-DD');
const maxDate =  moment().add(150, 'd').format('YYYY-MM-DD 23:59');


const RADIOON_OFF = require('../../../assets/icons/check_off.png');
const RADIOON_ON = require('../../../assets/icons/check_on.png');

const couponBaseList = [
    { id: 1, name : '5천원', code : 5000,checked:false},
    { id: 2, name : '1만원', code : 10000,checked:false},
    { id: 3, name : '5만원', code : 50000,checked:false},
    { id: 4, name : '10만원', code : 100000,checked:false},
    { id: 5, name : '직접입력', code : 9,checked:false},
]

class CouponModifyScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading : true,
            showModal: false ,
            maxDate : null,
            coupon_pk : 0,
            member_pk : 0,
            couponType : 1,
            couponCode : 5000,
            couponTypeEtc : 0,
            targetMember : null,
            issue_reason : '',
            reg_dt : 0,
            end_dt : 0,
            formExpireDate : null,            
        }
    }

   
    async UNSAFE_componentWillMount() {
        if ( !CommonUtil.isEmpty(this.props.extraData.params.screenData)) {
            console.log('ddd', this.props.extraData.params.screenData)
            this.setState({
                coupon_pk : this.props.extraData.params.screenData.coupon_pk,
                member_pk : this.props.extraData.params.screenData.member_pk,
                reg_dt : this.props.extraData.params.screenData.reg_dt,
                end_dt : this.props.extraData.params.screenData.end_dt,
                couponType : this.props.extraData.params.screenData.is_direct ? 9 : this.props.extraData.params.screenData.price,
                couponTypeEtc : this.props.extraData.params.screenData.price.toString(),
                couponCode : this.props.extraData.params.screenData.price,
                issue_reason : this.props.extraData.params.screenData.issue_reason,
                targetMember  : this.props.extraData.params.screenData.member_name,
                maxDate : CommonFunction.convertUnixToDate(this.props.extraData.params.screenData.end_dt)
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
        let expireDate = this.state.formExpireDate + ' 23:59';
        let returnCode = {code:9998};     
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/coupon/modify/'+this.state.coupon_pk;           
            const token = this.props.userToken.apiToken;
            let sendData = {
                member_pk : this.state.member_pk,
                coupon_type : this.state.couponType,
                price : this.state.couponType == 9 ? this.state.couponTypeEtc*1 : this.state.couponType,
                is_direct : this.state.couponType == 9 ? true : false,
                end_dt : CommonUtil.isEmpty(this.state.formExpireDate) ? this.state.end_dt :  CommonFunction.convertDateToUnix(expireDate),
                update_reason : this.state.formReaseon
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
            "쿠폰정보를 수정하시겠습니까?",
            [
                {text: '네', onPress: () =>  this.registData()},
                {text: '아니오', onPress: () => console.log('Cancle')},
                
            ],
            { cancelable: true }
        )  
    }

    showModalCheck = async() => {        
        if ( CommonUtil.isEmpty(this.state.formReaseon)) {
            CommonFunction.fn_call_toast('변경사유를 입력해주세요',2000);
            return true;           
        }else{
            this.actionOrder();

        }
    }

    selectFilter = async(filt) => {
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

    animatedHeight = new Animated.Value(SCREEN_HEIGHT * 0.5);
    closeModal = () => {
        this.setState({ showModal: false });
      
    }
    showModal = () => {
        this.setState({ 
            showModal: true
        })
    }

    onDayPress = (days) => {
        this.setState({formExpireDate:days.dateString});
        this.closeModal();
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
                    <ScrollView
                        ref={(ref) => {
                            this.ScrollView2 = ref;
                        }}
                        showsVerticalScrollIndicator={false}
                        indicatorStyle={'white'}
                        scrollEventThrottle={16}
                        //keyboardDismissMode={'on-drag'}
                        style={{width:'100%'}}
                    >
                        <View style={styles.dataTopWrap}>
                            <View style={styles.titleWrap}>
                                <CustomTextM style={CommonStyle.titleText}>쿠폰구분</CustomTextM>
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
                                <CustomTextM style={CommonStyle.titleText}>대상자</CustomTextM>
                                <CustomTextR style={CommonStyle.requiredText}></CustomTextR>
                            </View>
                            <View style={styles.contentWrap}>
                                <CustomTextR style={CommonStyle.dataText}>{this.state.targetMember}</CustomTextR>
                            </View> 

                            <View style={styles.titleWrap}>
                                <CustomTextM style={CommonStyle.titleText}>사용가능일자</CustomTextM>
                                <CustomTextR style={CommonStyle.requiredText}></CustomTextR>
                            </View>
                            <View style={styles.contentWrap}>
                                <CustomTextR style={CommonStyle.dataText}>
                                    {
                                    CommonUtil.isEmpty(this.state.formExpireDate) ?
                                    `${CommonFunction.convertUnixToDate(this.state.reg_dt,'YYYY.MM.DD')} ~ ${CommonFunction.convertUnixToDate(this.state.end_dt,'YYYY.MM.DD')}`
                                    :
                                    `${CommonFunction.convertUnixToDate(this.state.reg_dt,'YYYY.MM.DD')} ~ ${this.state.formExpireDate}`
                                    }
                                </CustomTextR>
                                <TouchableOpacity style={styles.buttonWrap} onPress={()=> this.showModal()}>
                                    <CustomTextR style={CommonStyle.titleText}>변경</CustomTextR>
                                </TouchableOpacity>
                            </View>                             
                            <View style={styles.titleWrap}>
                                <CustomTextM style={CommonStyle.titleText}>발급사유</CustomTextM>
                                <CustomTextR style={CommonStyle.requiredText}>{'*'}</CustomTextR>
                            </View>
                            <View style={styles.contentWrap}>
                                <CustomTextR style={CommonStyle.dataText}>{this.state.issue_reason}</CustomTextR>
                            </View>
                            <View style={styles.titleWrap}>
                                <CustomTextM style={CommonStyle.titleText}>변경사유</CustomTextM>
                                <CustomTextR style={CommonStyle.requiredText}>{'*'}</CustomTextR>
                            </View>
                            <View style={{paddingHorizontal:5}}>
                                <TextInput          
                                    placeholder={'수정사유을 입력해주세요(50자이내)'}
                                    maxLength={55}
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                           
                                    style={[styles.inputBlank,CommonStyle.defaultOneWayForm]}
                                    value={this.state.formReaseon}
                                    onChangeText={text=>this.setState({formReaseon:text})}
                                    onFocus={()=>this.ScrollView2.scrollToEnd({ animated: true })}
                                    multiline={false}
                                    clearButtonMode='always'
                                />
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
                        <TouchableOpacity style={CommonStyle.bottomLeftBox} onPress={()=>this.showModalCheck()}>
                            <CustomTextB style={CommonStyle.bottomMenuOffText}>쿠폰정보수정</CustomTextB>
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
                                current={this.state.maxDate}
                                minDate={currentDate}
                                maxDate={maxDate}                            
                                onDayLongPress={(day)=>this.onDayPress(day)}
                            />
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
        paddingHorizontal:5,paddingVertical:10,marginTop:10,flexDirection:'row'
    },
    dataWrap : {
        flex:1,paddingHorizontal:15,flexDirection:'row',flexGrow:1,flexWrap:'wrap',alignContent:'space-between'
    },
    contentWrap : {
        paddingHorizontal:5,flexDirection:'row',justifyContent:'flex-end',paddingRight:20
    },
    CheckBoxWrap:{
        flex:1,flexDirection:'row',alignItems:'center',minWidth:SCREEN_WIDTH/3-20,paddingVertical:5
    },
    buttonWrap : {
        marginLeft:20,width:50,paddingHorizontal:5,justifyContent:'center',alignItems:'center',borderWidth:1,borderColor:'#ccc',backgroundColor:'#efefef'
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
export default connect(mapStateToProps,mapDispatchToProps)(CouponModifyScreen);
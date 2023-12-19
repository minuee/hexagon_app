import React, { Component } from 'react';
import {KeyboardAvoidingView,ScrollView,View,StyleSheet,Alert,Dimensions,PixelRatio,Image,TouchableOpacity,Platform} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import {CheckBox,Input} from 'react-native-elements';
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import CommonStyle from '../../Style/CommonStyle';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {CustomTextR,CustomTextL, CustomTextB, CustomTextM, TextRobotoM,TextRobotoR} from '../../Components/CustomText';
import CommonUtil from '../../Utils/CommonUtil';
import CommonFunction from '../../Utils/CommonFunction';
import Loader from '../../Utils/Loader';
import { apiObject } from "../Apis";

const RADIOON_OFF = require('../../../assets/icons/checkbox_off.png');
const RADIOON_ON = require('../../../assets/icons/checkbox_on.png');

const DefaultPaginate = 20;
class PopLayerSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:true,
            moreLoading : false,
            totalCount : 0,
            focusOn : false,
            ismore :  false,
            searchKeyword : '',
            target_array : [],
            currentPage : 1,
            selectedProduct : {},
            selectedProduct_pk : 0,
            selectedCategory : 0,
            topCategory : [],
            userList : []
        }
    }

    setNewArray = async(arr) => {
        let newArray = [];
        const mockData1 = await Object.assign([],this.state.userList);
        await mockData1.forEach(function(element,index){   
            newArray.push({...element,checked : arr.find((info) => info.member_pk === element.member_pk) ? true : false});
        }); 
        this.setState({
            target_array : arr,
            userList : newArray
        })
    }

    moreDataUpdate = async( baseData , addData) => {     
        let newArray = await baseData.concat(addData.data.userList);
        this.setState({            
            moreLoading : false,
            loading : false,
            userList : newArray,
            ismore : parseInt(this.state.currentPage) < parseInt(addData.lastPage) ? true : false
        })
        await this.setNewArray(this.state.target_array);
        this.props.screenState.setProductArray( {
            userList : newArray,
            currentPage : addData.currentPage,
            ismore : parseInt(this.state.currentPage) < parseInt(addData.lastPage) ? true : false
        }) ;
    }

    getBaseData = async(currentpage,morePage = false) => {
        this.setState({moreLoading : true})
        let returnCode = {code:9998};
        const sort_Item = "&sort_item=uname";
        const sort_Type = "&sort_type=ASC";
        const searchFilte = '&search_word=' + this.state.searchKeyword;
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/member/list?is_approval=true&paginate=' + DefaultPaginate + '&page=' + currentpage + sort_Item + sort_Type + searchFilte;
            const token = this.props.userToken.apiToken;
            let sendData = null;
            returnCode = await apiObject.API_getPageList(this.props,url,token,sendData);            
            if ( returnCode.code === '0000'  ) {
                this.setState({currentPage : returnCode.currentPage})
                if ( morePage ) {
                    this.moreDataUpdate(this.state.userList,returnCode )
                }else{
                    await this.setState({
                        totalCount : returnCode.total,
                        ismore : parseInt(this.state.currentPage)  < parseInt(returnCode.lastPage) ? true : false,
                        userList : CommonUtil.isEmpty(returnCode.data.userList) ? [] : returnCode.data.userList
                    })
                    await this.setNewArray(this.state.target_array)   
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
        if ( this.props.screenState.userList.length === 0) {
            await this.getBaseData(1,false);
        }else{
            await this.setState({
                target_array : this.props.screenState.target_array,
                userList : this.props.screenState.userList,
                currentPage : this.props.screenState.currentPage,
                totalCount : this.props.screenState.totalCount,
                ismore : this.props.screenState.ismore,
                loading:false,moreLoading : false
            });
        }
        await this.setNewArray(this.props.screenState.target_array)
    }  
   
    selectMember = async() =>  {
        let checkedArray = await this.state.userList.filter((info) =>  info.checked === true)
        if ( checkedArray.length === 0 ) {
            Alert.alert(
                DEFAULT_CONSTANTS.appName,      
                "최소1개이상의  회원을 선택해주세요!",
                [
                    {text: 'OK', onPress: () => console.log('Cancle')}
                ],
                { cancelable: true }
            )
        }else{
            this.props.screenState.closepopLayer2(checkedArray)
        }
    }

    checkItem = async(item,idx) => {        
        const mockData1 = await Object.assign([],this.state.userList);
        const isMember = (info) => info.member_pk === item.member_pk;
        let arrIndex = mockData1.findIndex(isMember);
        if ( arrIndex != -1 ){
            try {
                this.state.userList[arrIndex].checked = !this.state.userList[arrIndex].checked;
            }catch(e) {
            }
        }
        this.setState({loading:false})
    }
    
    selectSampleKeyword = async(item,idx) => {
        this.setState({selectedCategory : item.category_pk});
    }

    getSearchResult = async() => {
        await this.getBaseData(1,false);
    }
    _onFocus = (mode) => {
        if ( Platform.OS === 'android') {            
            this.props._fn_toggleKeyboardFocus(mode);
        }
    }

    clearInputText = field => {
        this.setState({[field]: '',isResult:false});
    };
    render() {        
        if ( this.state.loading ) {
            return (
                <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} /> 
            )
        }else { 
        return(
            <View style={ styles.container }>
                <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === 'ios' ? "padding" : 'padding'}  enabled={false}> 
                <View style={{height:50,justifyContent:'center'}}>
                    <TouchableOpacity 
                        onPress={()=> this.props.screenState.closepopLayer2()}
                        hitSlop={{left:10,right:5,top:10,bottom:20}}
                        style={{position:'absolute',top:0,right:0,width:40,height:40,justifyContent:'center'}}
                    >
                        <Image
                            source={require('../../../assets/icons/btn_close.png')}
                            resizeMode={"contain"}
                            style={CommonStyle.defaultIconImage}
                        />
                    </TouchableOpacity>
                    <View style={{width:'60%',paddingLeft:20,justifyContent:'center'}}>
                        <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#333'}}>회원 선택</CustomTextM>
                    </View>
                </View>
                <View style={{height:50,justifyContent:'center',borderBottomColor:'#ccc',borderBottomWidth:1}}>
                    <Input
                        value={this.state.searchKeyword}    
                        placeholder="회원이름을 입력해주세요"
                        placeholderTextColor={DEFAULT_COLOR.base_color_666}
                        inputContainerStyle={CommonStyle.searchinputContainer}
                        leftIcon={{ type: 'fontawesome', name: 'search',color:'#808080',size:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize25) }}
                        leftIconContainerStyle={CommonStyle.searchLeftIcon}
                        rightIcon={ () => { return (<TouchableOpacity onPress={()=>this.getSearchResult()} style={CommonUtil.isEmpty(this.state.searchKeyword) ? styles.searchBtnDefault : styles.searchBtnCan}><CustomTextM style={CommonStyle.bottomMenuOffText}>검색</CustomTextM></TouchableOpacity>)}}
                        clearButtonMode={'always'}
                        rightIconContainerStyle={CommonUtil.isEmpty(this.state.searchKeyword) ? CommonStyle.searchrightIconContainer : CommonStyle.searchrightIconContainerOn}
                        inputStyle={CommonStyle.searchFormWrap}
                        onChangeText={value => this.setState({searchKeyword:value,isResult:false})}
                        onFocus={()=>this._onFocus(true)}
                        onBlur={()=>this._onFocus(false)}
                    />
                    {
                        ( Platform.OS === 'android' && this.state.searchKeyword !== '' ) && 
                        (
                        <TouchableOpacity 
                            hitSlop={{left:10,right:10,bottom:10,top:10}}
                            style={{position: 'absolute', right: 70,top:0}} 
                            onPress={() => this.clearInputText('searchKeyword')}
                        >
                            <Image source={require('../../../assets/icons/btn_remove.png')} resizeMode={'contain'} style={CommonStyle.defaultIconImage20} />
                        </TouchableOpacity>
                        )
                    }
                </View>
                <View style={{flex:4}}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        indicatorStyle={'white'}
                    >
                         
                        <View style={{width:SCREEN_WIDTH-50}}>
                            {
                                this.state.userList.length === 0 ? 
                                <View style={CommonStyle.emptyWrap} >
                                    <CustomTextR style={CommonStyle.dataText}>결과데이터가 없습니다.</CustomTextR>
                                </View>
                                :
                                this.state.userList.map((item, index) => {
                                return (
                                    <TouchableOpacity 
                                        onPress={() => this.checkItem(item,index)}
                                        key={index} style={styles.boxSubWrap}
                                    >
                                        <View style={styles.boxLeftWrap}>
                                            <CheckBox 
                                                containerStyle={{padding:0,margin:0}}   
                                                iconType={'FontAwesome'}
                                                checkedIcon={<Image source={RADIOON_ON} style={CommonStyle.checkboxIcon} />}
                                                uncheckedIcon={<Image source={RADIOON_OFF} style={CommonStyle.checkboxIcon} />}
                                                checkedColor={DEFAULT_COLOR.base_color}                          
                                                checked={item.checked}
                                                size={PixelRatio.roundToNearestPixel(15)}                                    
                                                onPress={() => this.checkItem(item,index)}
                                            />
                                        </View>                                        
                                        <View style={styles.boxRightWrap}>
                                            <CustomTextR style={styles.menuTitleText}>{item.name}</CustomTextR>
                                            <CustomTextR style={styles.menuPriceText}>{item.grade_name}</CustomTextR>
                                        </View>
                                        <View style={styles.boxRightWrap2}>
                                            <CustomTextR style={CommonStyle.dataText}>구매누적액:<TextRobotoR style={CommonStyle.dataText2}>{CommonFunction.currencyFormat(item.total_amount)}원</TextRobotoR></CustomTextR>
                                            <CustomTextR style={CommonStyle.dataText}>리워드금액 <TextRobotoR style={CommonStyle.dataText2}>{CommonFunction.currencyFormat(item.total_reward)}원</TextRobotoR></CustomTextR>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })
                        } 
                        </View>
                        {
                            this.state.ismore &&
                            <View style={CommonStyle.moreButtonWrap}>
                                <TouchableOpacity 
                                    onPress={() => this.getBaseData(this.state.currentPage+1,true)}
                                    style={CommonStyle.moreButton}
                                >
                                <CustomTextL style={CommonStyle.moreText}>더보기</CustomTextL>
                                </TouchableOpacity>
                            </View>
                        }
                       
                       <View style={CommonStyle.blankArea}></View>
                   </ScrollView>
                </View> 
                </KeyboardAvoidingView>
                <View  style={styles.bottomButtonWrap}>
                    <TouchableOpacity 
                        style={styles.bottomRightBox}
                        onPress={()=> this.props.screenState.closepopLayer2(this.state.selectMember)}
                    >
                        <CustomTextB style={styles.bottomMenuOnText}>취소</CustomTextB>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.bottomLeftBox}
                        onPress={()=>this.selectMember()}
                    >
                        <CustomTextB style={styles.bottomMenuOffText}>선택</CustomTextB>
                    </TouchableOpacity>
                </View>   
                { 
                    this.state.moreLoading &&
                    <View style={CommonStyle.moreWrap}>
                        <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} />
                    </View>
                }
            </View>
        );
        }
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1, width: '100%', justifyContent: 'flex-end'
    },
    bottomButtonWrap : {
        position:'absolute',left:0,bottom:0,width:'100%',height:50,backgroundColor:DEFAULT_COLOR.base_color,justifyContent:'center',alignItems:'center',flexDirection:'row',borderWidth:1, borderColor:DEFAULT_COLOR.base_color
    },
    bottomLeftBox : {
        flex:1,backgroundColor:DEFAULT_COLOR.base_color,justifyContent:'center',alignItems:'center'
    },
    bottomRightBox : {
        flex:1,backgroundColor:'#fff',justifyContent:'center',alignItems:'center',height:'100%'
    },
    bottomMenuOnText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.base_color
    },
    bottomMenuOffText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#fff'
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        //backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputBlankNull : {
        borderWidth:1,borderColor:'#fff'
    },
    inputBlank : {
        borderWidth:1,borderColor:DEFAULT_COLOR.input_border_color,borderRadius:5,backgroundColor:'#fff',marginVertical:7,height:41
    },
    boxAbsentWrap : {
        width:SCREEN_WIDTH/4,marginBottom:10
    },
    sampleContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    sampleContainerOn: {
        flex: 1,
        justifyContent: 'center',
    },
    sampleBorderOn: {
        alignSelf: 'center',
        width: '80%',
        height: 2,
        backgroundColor: DEFAULT_COLOR.base_color,
    },
    sampleBorder: {
        width: '100%',
        height: 1,
        backgroundColor: DEFAULT_COLOR.input_border_color,
    },
    sampleWrapper : {
        marginHorizontal:5,
        paddingVertical:10,
        paddingHorizontal:10,
        backgroundColor:'transparent',
    },
    sampleWrapperOn : {
        marginHorizontal:5,
        paddingVertical:10,
        paddingHorizontal:10,
        backgroundColor:'#fff',
    },
    smapleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),
        color:'#585858',
        lineHeight: PixelRatio.roundToNearestPixel(7.1),
        letterSpacing: -0.95,
    },
    smapleTextOn : {
        color:DEFAULT_COLOR.base_color,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),
        lineHeight: PixelRatio.roundToNearestPixel(7.1),
        letterSpacing: -0.95,
    },
    itemWrap : {                
        marginHorizontal:10,        
        borderBottomWidth:1,
        borderBottomColor:'#ccc',
        marginVertical:10,        
        paddingVertical:10
    },

    fixedWriteButton : {
        position:'absolute',bottom:70,right:20,width:50,height:50,backgroundColor:'#222',alignItems:'center',justifyContent:'center',zIndex:2,borderColor:'#ccc',borderWidth:1,borderRadius:25,opacity:0.8
    },
    fixedWriteButton2 : {
        position:'absolute',bottom:70,right:20,width:50,height:50,backgroundColor:'#222',alignItems:'center',justifyContent:'center',zIndex:3,borderColor:'#ccc',borderWidth:1,borderRadius:25,
    },

    slideCommonWrap: {        
        flexDirection:'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal:5,
        marginVertical:2,
        paddingHorizontal:5,
        paddingVertical:7,
        backgroundColor:'#fff',
        borderWidth:1,
        borderColor:DEFAULT_COLOR.input_border_color,
        borderRadius:5
    },

    boxSubWrap : {
        flex:1,
        flexDirection:'row',    
        flexGrow:1,    
        paddingVertical: Platform.OS === 'android' ? 10 : 15,
        alignItems: 'center',        
        borderBottomWidth:1,
        borderBottomColor : DEFAULT_COLOR.input_border_color
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
    searchBtnDefault : {
        justifyContent:'center',paddingHorizontal:10,width:'100%',height:45,
    },
    searchBtnCan : {
        justifyContent:'center',backgroundColor:DEFAULT_COLOR.base_color,paddingHorizontal:10,height:45,
    },
    boxRightWrap2 : {
        flex:3,        
        justifyContent:'center',
        alignItems:'flex-end'
    },
    menuTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),paddingLeft:10
    },
    menuPriceText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),paddingLeft:10,color:'#585858'
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
        },
        _fn_toggleKeyboardFocus:(bool) => {
            dispatch(ActionCreator.fn_toggleKeyboardFocus(bool))
        }
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(PopLayerSelect);
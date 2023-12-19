import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Text,Dimensions,RefreshControl, PixelRatio,Image,TouchableOpacity, Platform,Alert} from 'react-native';
import {connect} from 'react-redux';
import {useSelector} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import Modal from 'react-native-modal';
import {CheckBox} from 'react-native-elements';
import SortableListView from '../../Utils/SortableListView';
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


const RowComponent = (props)  => {
    const reduxData = useSelector(state => state);
    const {choiceProductArray} = reduxData.GlabalStatus;
    let isIndexOf = choiceProductArray.findIndex(
        info => info.product_pk === props.data.product_pk
    );  
    let isChecked = isIndexOf != -1 ?  true : false;
    return (
        <TouchableOpacity
            underlayColor={'#ff0000'}
            style={styles.boxSubWrap}
            {...props.sortHandlers}
        >
            <View style={styles.boxLeftWrap}>
                <CheckBox 
                    containerStyle={{padding:0,margin:0}}   
                    iconType={'FontAwesome'}
                    checkedIcon={<Image source={require('../../../assets/icons/checkbox_on.png')} style={CommonStyle.checkboxIcon} />}
                    uncheckedIcon={<Image source={require('../../../assets/icons/checkbox_off.png')} style={CommonStyle.checkboxIcon} />}
                    checkedColor={DEFAULT_COLOR.base_color}                          
                    checked={isChecked}
                    size={PixelRatio.roundToNearestPixel(15)}                                    
                    onPress={() => props.screenState.checkItem(props.data,isChecked)}
                />
            </View>
            <View style={styles.boxLeftWrap}>
                { 
                    !CommonUtil.isEmpty(props.data.thumb_img) ?
                    <Image
                        source={{uri:DEFAULT_CONSTANTS.defaultImageDomain+props.data.thumb_img}}
                        resizeMode={"contain"}
                        style={{width:PixelRatio.roundToNearestPixel(55),height:PixelRatio.roundToNearestPixel(55)}}
                    />
                    :
                    <Image
                        source={require('../../../assets/icons/no_image.png')}
                        resizeMode={"contain"}
                        style={CommonStyle.defaultIconImage}
                    />
                }
            </View>
            <View style={styles.boxRightWrap}>
                <CustomTextR style={[styles.menuTitleText,{paddingLeft:20}]}>{props.data.product_name}</CustomTextR>
            </View>
            <View style={styles.boxLeftWrap}>
                <Image
                    source={require('../../../assets/icons/icon_menu.png')}
                    resizeMode={"contain"}
                    style={{width:PixelRatio.roundToNearestPixel(25),height:PixelRatio.roundToNearestPixel(25)}}
                />
            </View>                
        </TouchableOpacity>
    )
}

const DefaultPaginate = 1000;
class ProductListModifyScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : true,
            oneHeight : 80,
            scrollEnabled: false,
            isEditState: true,
            selectedArray : [],
            checkItem : this.checkItem.bind(this),
            category_pk : 0,
            mockData1 : []
        }
    }

    getBaseData = async(category_pk) => {        
        this.setState({moreLoading : true})
        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/product/list?category_pk=' + category_pk + '&page=1&paginate='+DefaultPaginate;
            const token = this.props.userToken.apiToken;
            let sendData = null;
            returnCode = await apiObject.API_getPageList(this.props,url,token,sendData);
            if ( returnCode.code === '0000'  ) {                
                this.setState({    
                    category_pk, 
                    moreLoading:false,loading:false,           
                    mockData1 : CommonUtil.isEmpty(returnCode.data.productList) ? [] : returnCode.data.productList.filter((info) => info.product_yn === true )
                })
            }else{
                this.setState({moreLoading:false,loading:false})
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.',2000);
            }
        }catch(e){            
            this.setState({loading:false,moreLoading : false})
        }
    }

    async UNSAFE_componentWillMount() {
        let resetArray = [];
        this.props._fn_ChoiceProductArray(resetArray);        
        if ( !CommonUtil.isEmpty(this.props.extraData.params.screenData.category_pk)) {
            await this.getBaseData(this.props.extraData.params.screenData.category_pk);
        }else{
            CommonFunction.fn_call_toast('잘못된 접근입니다.',2000);
            setTimeout(
                () => {
                   this.props.navigation.goBack(null);
                },500
            )
        }
    }

    componentDidMount() {
    }

    handleOnScroll (event) {             
        if ( event.nativeEvent.contentOffset.y >= 200 ) {
            //this.setState({showTopButton : true}) 
        }else{
            //this.setState({showTopButton : false}) 
         }

        let paddingToBottom = 1;
        paddingToBottom += event.nativeEvent.layoutMeasurement.height;                            
        if (event.nativeEvent.contentOffset.y + paddingToBottom >= event.nativeEvent.contentSize.height) {            
            //this.scrollEndReach();
        }
    }

    scrollEndReach = () => {       
       
    }
    refreshingData = async() => {
    }


    checkItem = async(item,bool) => {        
        let nowArray = await CommonFunction.copyObject(this.state.selectedArray);
        if ( bool ) {
            const removeIdx = await nowArray.findIndex(function(info) {return info.product_pk === item.product_pk});
            await nowArray.splice(removeIdx, 1)
        }else{
            await nowArray.push({product_pk:item.product_pk});
        }
        setTimeout(
            () => {            
                this.props._fn_ChoiceProductArray(nowArray);
                this.setState({
                    selectedArray:nowArray,
                })
            },200
        )
    }

    removeActionCategory = async(resetData) => {        
        this.setState({moreLoading:true})
        let returnCode = {code:9998};     
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/product/remove';            
            const token = this.props.userToken.apiToken;
            let sendData = {
                product_array : resetData
            }
            returnCode = await apiObject.API_removeCommon(this.props,url,token,sendData);
            if ( returnCode.code === '0000'  ) {
                CommonFunction.fn_call_toast('정상적으로 삭제되었습니다.' ,2000);
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

    removeCategory = async() => {        
        if ( this.state.selectedArray.length > 0 ) {
            let resetData = await this.setSortData();
            Alert.alert(
                DEFAULT_CONSTANTS.appName,
                "선택하신 상품을 사용중지하시겠습니까?",
                [
                    {text: '네', onPress: () =>  this.removeActionCategory(this.state.selectedArray)},
                    {text: '아니오', onPress: () => console.log('Cancle')}
                ],
                { cancelable: true }
            )  
        }else{
            CommonFunction.fn_call_toast('선택된 상품이 없습니다.',2000);
        }
    }

    setSortData = async() => {
        let newData = []
        await this.state.mockData1.forEach(function(element,index,array){     
            newData.push({id : index,product_pk : element.product_pk,display_seq : index+1 })               
        }); 
        return newData;

    }

    updateActionCategory = async(resetData) => {        
        this.setState({moreLoading:true})
        let returnCode = {code:9998};     
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/product/seqmodify';
            const token = this.props.userToken.apiToken;
            let sendData = {
                category_pk : this.state.category_pk,
                product_array : resetData
            }
            returnCode = await apiObject.API_updateCommon(this.props,url,token,sendData);
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

    updateCategory = async() => {
        if ( this.state.isUpdated ) {
            let resetData = await this.setSortData();
            Alert.alert(
                DEFAULT_CONSTANTS.appName,
                "카테고리 정렬순서를 수정하시겠습니까?",
                [
                    {text: '네', onPress: () =>  this.updateActionCategory(resetData)},
                    {text: '아니오', onPress: () => console.log('Cancle')}
                ],
                { cancelable: true }
            )  
        }else{
            CommonFunction.fn_call_toast('변경된 정보가 없습니다.',2000);
        }
    }

    onSelectedDrag = async(mode) => {
        if ( mode) {
            this.setState({scrollEnabled: false})
        } else {
            this.setState({scrollEnabled: true})
        }
    }

    render() {
        const ONE_SECOND_IN_MS = 1000;        
        let orders = Object.keys(this.state.mockData1);
        const PATTERN = [
            1 * ONE_SECOND_IN_MS,
            2 * ONE_SECOND_IN_MS,
            3 * ONE_SECOND_IN_MS
        ];
        if ( this.state.loading ) {
            return (
                <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} /> 
            )
        }else { 
        return(
            <SafeAreaView style={ styles.container }>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    indicatorStyle={'white'}
                    scrollEnabled = {this.state.scrollEnabled}
                    nestedScrollEnabled={true}                    
                >
                    {
                    this.state.mockData1.length === 0 ?
                        <View style={styles.emptyDataWarp} >
                            <CustomTextR
                                style={CommonStyle.dataText}
                            >등록된 상품이 없습니다.</CustomTextR>
                        </View>
                    :
                    <View style={{flex:1,width:SCREEN_WIDTH,backgroundColor:'transparent',height :  this.state.mockData1.length === 0 ? parseInt(this.state.oneHeight) : this.state.mockData1.length*parseInt(this.state.oneHeight)}}>
                        <SortableListView
                            style={{ flex: 1 }}
                            data={this.state.mockData1}
                            order={orders}
                            activeOpacity={1} //활성 요소의 불투명도를 설정합니다. 기본 값 : 0.2.
                            onMoveStart={() => {                                
                                this.setState({scrollEnabled: false});                                       
                                }
                            }
                            onRowActive={(e) => {                                
                            }}
                            onMoveEnd={() => {
                                this.onSelectedDrag(false);
                                }
                            }
                            limitScrolling={false}
                            onRowMoved={e => {                                
                                try {
                                    this.state.mockData1.splice(e.to, 0, this.state.mockData1.splice(e.from, 1)[0])                                            
                                    this.forceUpdate();
                                    this.setState({isUpdated : true})
                                }catch(e) {
                                }
                            }}
                            renderRow={row => <RowComponent data={row} screenState={this.state} screenProps={this.props} />}
                        />
                    </View>
                    }
                    <View style={CommonStyle.blankArea}></View>
                    { 
                        this.state.moreLoading &&
                        <View style={CommonStyle.moreWrap}>
                            <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} />
                        </View>
                    }                   
                
                </ScrollView>    
                <View style={CommonStyle.scrollFooterWrap}>
                    <TouchableOpacity 
                        style={CommonStyle.scrollFooterLeftWrap}
                        onPress={()=>this.updateCategory()}
                    >
                        <CustomTextB style={CommonStyle.scrollFooterText}>완료</CustomTextB>
                    </TouchableOpacity>
                        <TouchableOpacity 
                        style={CommonStyle.scrollFooterRightWrap}
                        onPress={()=>this.removeCategory()}
                    >
                        <CustomTextB style={CommonStyle.scrollFooterText}>삭제</CustomTextB>
                    </TouchableOpacity>
                </View>                
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
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    fixedUpButton : {
        position:'absolute',bottom:80,right:20,width:50,height:50,backgroundColor:DEFAULT_COLOR.base_color,borderColor:'#ccc',borderWidth:1,borderRadius:25,alignItems:'center',justifyContent:'center',zIndex:10
    },
    emptyDataWarp :{ 
        alignItems:'center',justifyContent:'center',paddingVertical:30
    },
    boxWrap : {
        flex:1,
        flexDirection:'row',    
        flexGrow:1,    
        paddingVertical:10,paddingHorizontal:20,
        backgroundColor:'#f5f6f8',
        borderBottomWidth:1,
        borderBottomColor : DEFAULT_COLOR.input_border_color
    },
    boxSubWrap : {
        flex:1,
        flexDirection:'row',    
        flexGrow:1,    
        paddingLeft:10,paddingRight:20,paddingVertical: Platform.OS === 'android' ? 5 : 10,
        alignItems: 'center',        
        borderBottomWidth:1,
        borderBottomColor : DEFAULT_COLOR.input_border_color
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
    menuTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),paddingRight:10
    },
   
});

function mapStateToProps(state) {
    return {
        userToken : state.GlabalStatus.userToken,
        choiceProductArray: state.GlabalStatus.choiceProductArray,
    };
}
function mapDispatchToProps(dispatch) {
    return {       
        _saveUserToken:(str)=> {
            dispatch(ActionCreator.saveUserToken(str))
        },         
        _fn_ChoiceProductArray:(arr)=> {
            dispatch(ActionCreator.fn_ChoiceProductArray(arr))
        }
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(ProductListModifyScreen);
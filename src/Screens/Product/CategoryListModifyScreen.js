import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Text,Dimensions,RefreshControl, PixelRatio,Image,TouchableOpacity, Platform,Animated,Alert} from 'react-native';
import {connect} from 'react-redux';
import {useSelector} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import Modal from 'react-native-modal';
import SortableListView from '../../Utils/SortableListView';
import {CheckBox,Tooltip} from 'react-native-elements';
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
    const {choiceCategoryArray} = reduxData.GlabalStatus;    
    let isIndexOf = choiceCategoryArray.findIndex(
        info => info.category_pk === props.data.category_pk
    );  
    let isChecked = isIndexOf != -1 ?  true : false;
    return (
        <TouchableOpacity underlayColor={'#ff0000'} style={styles.boxSubWrap} {...props.sortHandlers}>
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
                <CustomTextR style={[styles.menuTitleText,{paddingLeft:20}]}>{props.data.category_name}</CustomTextR>
            </View>
            <View style={styles.boxRightWrap}>
                <Image
                    source={require('../../../assets/icons/icon_menu.png')}
                    resizeMode={"contain"}
                    style={{width:PixelRatio.roundToNearestPixel(25),height:PixelRatio.roundToNearestPixel(25)}}
                />
            </View>
        </TouchableOpacity>
    )
}

class CategoryModifyScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : false,
            oneHeight : 60,
            scrollEnabled: false,
            isEditState: true,
            isUpdated : false,
            selectedArray : [],
            checkItem : this.checkItem.bind(this),
            categoryType : 'B',
            mockData1 : []
        }
    }

    async UNSAFE_componentWillMount() {        
        if ( !CommonUtil.isEmpty(this.props.extraData.params.screenData)) {
            this.setState({
                categoryType : this.props.extraData.params.categoryType,
                mockData1 : this.props.extraData.params.screenData.filter((info) => info.category_yn === true ),
            })
            let resetArray = [];
            this.props._fn_ChoiceCategoryArray(resetArray);
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
        }else{         
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
            const removeIdx = await nowArray.findIndex(function(info) {return info.category_pk === item.category_pk});
            await nowArray.splice(removeIdx, 1)
        }else{
            await nowArray.push({category_pk:item.category_pk});
        }
        setTimeout(
            () => {            
                this.props._fn_ChoiceCategoryArray(nowArray);
                this.setState({selectedArray:nowArray})                
            },200
        )
    }

    removeActionCategory = async(resetData) => {        
        this.setState({moreLoading:true})
        let returnCode = {code:9998};     
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/category/remove';            
            const token = this.props.userToken.apiToken;
            let sendData = {
                category_array : resetData
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
                "선택하신 카테고리를 삭제하시겠습니까?\n해당하는 상품들도 노출이 중지됩니다.",
                [
                    {text: '네', onPress: () =>  this.removeActionCategory(this.state.selectedArray)},
                    {text: '아니오', onPress: () => console.log('Cancle')},
                ],
                { cancelable: true }
            )  
        }else{
            CommonFunction.fn_call_toast('변경된 정보가 없습니다.',2000);
        }
    }

    setSortData = async() => {
        let newData = []
        await this.state.mockData1.forEach(function(element,index,array){     
            newData.push({id : index,category_pk : element.category_pk,category_seq : index+1 })               
        }); 
        return newData;
    }

    updateActionCategory = async(resetData) => {        
        this.setState({moreLoading:true})
        let returnCode = {code:9998};     
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/category/seqmodify';            
            const token = this.props.userToken.apiToken;
            let sendData = {
                category_type : this.state.categoryType,
                category_array : resetData
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

    updateCategory = async() => {
        if ( this.state.isUpdated ) {
            let resetData = await this.setSortData();            
            Alert.alert(
                DEFAULT_CONSTANTS.appName,
                "카테고리 정렬순서를 수정하시겠습니까?",
                [
                    {text: '네', onPress: () =>  this.updateActionCategory(resetData)},
                    {text: '아니오', onPress: () => console.log('Cancle')},
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
        return(
            <SafeAreaView style={ styles.container }>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    indicatorStyle={'white'}
                    scrollEnabled = {this.state.scrollEnabled}
                    nestedScrollEnabled={true}
                    style={{width:'100%',backgroundColor:'#fff'}}
                >
                    {
                    this.state.mockData1.length === 0 ?
                        <View style={styles.emptyDataWarp} >
                            <CustomTextR
                                style={CommonStyle.dataText}
                            >카데고리가가 존재하지 않습니다</CustomTextR>
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
                            }}
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
                    <TouchableOpacity style={CommonStyle.scrollFooterLeftWrap} onPress={()=>this.updateCategory()}>
                        <CustomTextB style={CommonStyle.scrollFooterText}>완료</CustomTextB>
                    </TouchableOpacity>
                    <TouchableOpacity  style={CommonStyle.scrollFooterRightWrap} onPress={()=>this.removeCategory()}>
                        <CustomTextB style={CommonStyle.scrollFooterText}>삭제</CustomTextB>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
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
    boxWrap : {
        flex:1,
        flexDirection:'row',    
        flexGrow:1,    
        padding:20,
        backgroundColor:'#f5f6f8',
        borderBottomWidth:1,
        borderBottomColor : DEFAULT_COLOR.input_border_color
    },
    boxSubWrap : {
        flex:1,
        flexDirection:'row',    
        flexGrow:1,    
        paddingLeft:10,paddingRight:20,paddingVertical: Platform.OS === 'android' ? 5 : 15,
        alignItems: 'center',        
        borderBottomWidth:1,
        borderBottomColor : DEFAULT_COLOR.input_border_color
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
    menuTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),paddingRight:10
    },
    emptyDataWarp :{ 
        alignItems:'center',justifyContent:'center',paddingVertical:30
    },
    /**** Modal  *******/
    modalContainer: {   
        zIndex : 10,     
        position :'absolute',
        left:0,        
        width:SCREEN_WIDTH,
        height: SCREEN_HEIGHT-200,
        paddingTop: 16,
        backgroundColor: '#fff'
    },
});

function mapStateToProps(state) {
    return {
        userToken : state.GlabalStatus.userToken,
        chocieCategoryArray : state.GlabalStatus.chocieCategoryArray
    };
}

function mapDispatchToProps(dispatch) {
    return {    
        _saveUserToken:(str)=> {
            dispatch(ActionCreator.saveUserToken(str))
        },           
        _fn_ChoiceCategoryArray:(arr)=> {
            dispatch(ActionCreator.fn_ChoiceCategoryArray(arr))
        }
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(CategoryModifyScreen);
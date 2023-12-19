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
        info => info.banner_pk === props.data.banner_pk
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
                { !CommonUtil.isEmpty(props.data.img_url) ?
                    <Image
                        //source={props.data.img_url}
                        source={{uri:DEFAULT_CONSTANTS.defaultImageDomain+props.data.img_url}}
                        resizeMode={"contain"}
                        style={{width:PixelRatio.roundToNearestPixel(55),height:PixelRatio.roundToNearestPixel(55)}}
                        //style={CommonStyle.defaultIconImage}
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
                <CustomTextR 
                    style={[styles.menuTitleText,{paddingLeft:20}]}
                    numberOfLines={2} ellipsizeMode={'tail'}
                >
                    {props.data.title}
                </CustomTextR>
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
class BannerListModifyScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : true,
            oneHeight : 90,
            scrollEnabled: false,
            isEditState: true,
            selectedArray : [],
            checkItem : this.checkItem.bind(this),
            category_pk : 0,
            mockData1 : [
                //{ id: 1, icon : require('../../../assets/images/sample001.png'),name : '아릭스 수세미 1',price : 1000},
                
            ]
        }
    }

    async UNSAFE_componentWillMount() {
        let resetArray = [];
        this.props._fn_ChoiceProductArray(resetArray);
        if ( !CommonUtil.isEmpty(this.props.extraData.params.screenData)) {
            this.setState({
                mockData1 : this.props.extraData.params.screenData
            })
            
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
        setTimeout(
            () => {            
               this.setState({loading:false})
            },1000
        )
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
        //console.log('item',item);
        let nowArray = await CommonFunction.copyObject(this.state.selectedArray);
        if ( bool ) {
            const removeIdx = await nowArray.findIndex(function(info) {return info.banner_pk === item.banner_pk});
            await nowArray.splice(removeIdx, 1)
        }else{
            await nowArray.push({banner_pk:item.banner_pk});
        }
        setTimeout(
            () => {        
                this.props._fn_ChoiceProductArray(nowArray);    
                this.setState({
                    selectedArray:nowArray,
                })
                //console.log('nowArray',nowArray);
            },200
        )
    }

  
    removeActionBanner = async(resetData) => {
        //console.log('resetData', resetData)
        this.setState({moreLoading:true})
        let returnCode = {code:9998};     
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/banner/removes';
            // console.log('url',url) 
            const token = this.props.userToken.apiToken;
            let sendData = {
                banner_array : resetData
            }
            //const sendData = new FormData();       
            //sendData.append('category_array', resetData); 
            returnCode = await apiObject.API_updateCommon(this.props,url,token,sendData);          
            //console.log('returnCode',returnCode)   
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
        //CommonFunction.fn_call_toast('준비중입니다.',2000);
    }

    removeCategory = async() => {
        //console.log('resetData', this.state.selectedArray)
        if ( this.state.selectedArray.length > 0 ) {
            let resetData = await this.setSortData();
            
            Alert.alert(
                DEFAULT_CONSTANTS.appName,
                "선택하신 배너를 삭제하시겠습니까?",
                [
                    {text: '네', onPress: () =>  this.removeActionBanner(this.state.selectedArray)},
                    {text: '아니오', onPress: () => console.log('Cancle')},
                    
                ],
                { cancelable: true }
            )  
        }else{
            CommonFunction.fn_call_toast('삭제할 배너를 선택해주세요.',2000);
        }
    }

    setSortData = async() => {
        let newData = []
        await this.state.mockData1.forEach(function(element,index,array){     
            newData.push({id : index,banner_pk : element.banner_pk,display_seq : index+1 })               
        }); 
        return newData;

    }

    updateActionCategory = async(resetData) => {
        //console.log('resetData', resetData)
        this.setState({moreLoading:true})
        let returnCode = {code:9998};     
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/banner/seqmodify';
            ////console.log('url',url) 
            const token = this.props.userToken.apiToken;
            let sendData = {
                banner_array : resetData
            }
            returnCode = await apiObject.API_updateCommon(this.props,url,token,sendData);          
            //console.log('returnCode',returnCode)   
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
        //CommonFunction.fn_call_toast('준비중입니다.',2000);
    }

    updateCategory = async() => {
        if ( this.state.isUpdated ) {
            let resetData = await this.setSortData();
            //console.log('resetData', resetData)
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
        //console.log('onSelectedDrag', mode)
        if ( mode) {
            this.setState({scrollEnabled: false})
        } else {
            this.setState({scrollEnabled: true})
        }        
    }

    render() {
        const ONE_SECOND_IN_MS = 1000;
        //console.log('this.state.mockData1',this.state.mockData1);
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
                                //console.log('onMoveStart',this.state.scrollEnabled);
                                this.setState({scrollEnabled: false});                                       
                                }
                            }
                            onRowActive={(e) => {                                        
                                //console.log('onRowActive',this.state.scrollEnabled);
                            }}
                            onMoveEnd={() => {
                                this.onSelectedDrag(false);
                                //console.log('onMoveEnd',this.state.mockData1);
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
                    { this.state.moreLoading &&
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

export default connect(mapStateToProps,mapDispatchToProps)(BannerListModifyScreen);
import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Text,Dimensions,RefreshControl,PixelRatio,Image,TouchableOpacity,BackHandler,TextInput,KeyboardAvoidingView,Animated,Alert,LogBox} from 'react-native';
LogBox.ignoreLogs(['Animated.event now requires a second argument for options']);
import {connect} from 'react-redux';
import {useSelector} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
import 'moment/locale/ko'
import  moment  from  "moment";
import {Overlay} from 'react-native-elements';
import SortableListView from '../../Utils/SortableListView';
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
import Loader from '../../Utils/Loader';
import PopLayerSeleteGoods from '../Popup/PopLayerSeleteGoods';
import { apiObject } from "../Apis";

const RowComponent = (props)  => {
    const reduxData = useSelector(state => state);
    const {choiceProductArray} = reduxData.GlabalStatus;
    let isIndexOf = choiceProductArray.findIndex(
        info => info.product_pk === props.item.product_pk
    );  
    let isChecked = isIndexOf != -1 ?  true : false;
    return (
        <TouchableOpacity
            underlayColor={'#ff0000'}
            style={styles.itemBoxSubWrap}
            {...props.sortHandlers}
        >   
            <View style={styles.boxLeftWrap}>
            { 
                !CommonUtil.isEmpty(props.item.thumb_img) ?
                <Image
                    source={{uri:DEFAULT_CONSTANTS.defaultImageDomain + props.item.thumb_img}}
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
            </View>
            <View style={styles.boxRightWrap}>
                <CustomTextR style={styles.menuTitleText} numberOfLines={1} ellipsizeMode={'tail'}>{props.item.product_name}</CustomTextR>
                <CustomTextR style={styles.menuPriceText}>{CommonFunction.currencyFormat(props.item.each_price)}원(낱개)</CustomTextR>
            </View>
            <TouchableOpacity 
                style={styles.boxCloseWrap}
                onPress={()=> props.screenState.removeProducts(props.item.product_pk)}
                hitSlop={{left:10,right:5,top:10,bottom:20}}
            >
                <Image
                    source={require('../../../assets/icons/btn_close.png')}
                    resizeMode={"contain"}
                    style={CommonStyle.defaultIconImage}
                />
            </TouchableOpacity>
        </TouchableOpacity>
    )
}

class MDProductListScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : true,
            formEventGoods : [],
            moreloading : false, 
            oneHeight : 80,
            scrollEnabled: false,
            isEditState: true,
            popLayerView2 : false,
            closepopLayer2 : this.closepopLayer2.bind(this),
            productArray : [],
            setProductArray : this.setProductArray.bind(this),
            removeProducts :  this.removeProducts.bind(this)
        }
    }
   

    setProductArray = (arr) => {
        this.setState({
            productArray : arr
        })
    }

    getBaseData = async() => {
        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/product/mdlist';
            const token = this.props.userToken.apiToken;
            let sendData = null;
            returnCode = await apiObject.API_getPageList(this.props,url,token,sendData);
            if ( returnCode.code === '0000'  ) {
                this.setState({
                    totalCount : returnCode.total,
                    formEventGoods : CommonUtil.isEmpty(returnCode.data.productList) ? [] : returnCode.data.productList,
                    ismore : parseInt(this.state.currentPage)  < parseInt(returnCode.lastPage) ? true : false
                })
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
        this.props.navigation.addListener('focus', () => {             
            BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
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
    }
    
    closepopLayer2 = (arr=[]) => {        
        this.setState({
            formEventGoods : arr,
            popLayerView2: false
        })
    } 
    showpopLayer2 = () => this.setState({ popLayerView2: true });
    animatedHeight = new Animated.Value(SCREEN_HEIGHT * 0.5);
    
    cancleRegist = () => {
        Alert.alert(
            DEFAULT_CONSTANTS.appName,
            "추천상품수정을 취소하시겠습니까?",
            [
                {text: '네', onPress: () => this.props.navigation.goBack(null)},
                {text: '아니오', onPress: () => console.log('Cancle')},
                
            ],
            { cancelable: true }
        )  
    }

    actionUpdateData = async(newData) => {
        this.setState({moreLoading:true})
        let returnCode = {code:9998};     
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/product/mdrecom';           
            const token = this.props.userToken.apiToken;
            let sendData = {
                product_array : newData
            }            
            returnCode = await apiObject.API_updateCommon(this.props,url,token,sendData);
            if ( returnCode.code === '0000'  ) {
                CommonFunction.fn_call_toast('정상적으로 수정되었습니다.' ,2000);                
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.\n[ERR]' + returnCode.msg ,2000);
            }            
            this.setState({moreLoading:false})
        }catch(e){            
            this.setState({moreLoading : false})
        }
    }

    updateData = async() => {
       
        if ( this.state.formEventGoods.length > 0 ) {
            let newData = []
            let maxSeq = this.state.formEventGoods.length+1;
            const reArray = this.state.formEventGoods.forEach(function(element,index,array){     
                newData.push({...element, md_recom : maxSeq-- })               
            });             
            Alert.alert(
                DEFAULT_CONSTANTS.appName,
                "추천상품을 수정하시겠습니까?",
                [
                    {text: '네', onPress: () =>  this.actionUpdateData(newData)},
                    {text: '아니오', onPress: () => console.log('Cancle')}
                ],
                { cancelable: true }
            )    
        }      
    }


    removeProducts = async(idx) => { 
        let newArray = this.state.formEventGoods.filter((item,index) => item.product_pk !== idx );
        this.setState({
            formEventGoods : newArray
        })
    }
    onSelectedDrag = async(mode) => {
        if ( mode) {
            this.setState({scrollEnabled: false})
        } else {
            this.setState({scrollEnabled: true})
        }
    }
    render() {
        if ( this.state.loading ) {
            return (
                <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} /> 
            )
        }else {     
            const ONE_SECOND_IN_MS = 1000;            
            let orders = Object.keys(this.state.formEventGoods);
            const PATTERN = [
                1 * ONE_SECOND_IN_MS,
                2 * ONE_SECOND_IN_MS,
                3 * ONE_SECOND_IN_MS
            ];
            return(
                <SafeAreaView style={ styles.container }>
                    <KeyboardAvoidingView style={{paddingVertical:0}} behavior="height" enabled> 
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
                                <View style={styles.popLayerWrap}>
                                    <PopLayerSeleteGoods screenState={this.state} />
                                </View>
                                
                            </Overlay>
                        </View>
                        )
                    }
                    <View style={styles.titleWrap}>
                        <View style={styles.formTitleTypeWrap}>
                            <CustomTextR style={CommonStyle.titleText}>추천상품을 등록하세요</CustomTextR>
                            <CustomTextR style={styles.priceText}>{"상품선택후 Drag&Drop으로 순서조정"}</CustomTextR>
                        </View>
                        <View style={styles.formTextTypeWrap}>
                            <TouchableOpacity onPress={()=> this.showpopLayer2()} style={styles.formTextType}>
                                <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#fff'}}>상품선택</CustomTextR>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        indicatorStyle={'white'}
                        scrollEnabled = {this.state.scrollEnabled}
                        nestedScrollEnabled={true}  
                    >
                        <View style={{flex:1,width:SCREEN_WIDTH,backgroundColor:'transparent',height :  this.state.oneHeight.length === 0 ? parseInt(this.state.oneHeight) : this.state.formEventGoods.length*parseInt(this.state.oneHeight)}}>
                            <SortableListView
                                style={{ flex: 1 }}
                                data={this.state.formEventGoods}
                                order={orders}
                                activeOpacity={1}
                                onMoveStart={() => {                                    
                                    this.setState({scrollEnabled: false});                                       
                                }}
                                onRowActive={(e) => {                                        
                                    //console.log('onRowActive',this.state.scrollEnabled);
                                }}
                                onMoveEnd={() => {
                                    this.onSelectedDrag(false);
                                    }
                                }
                                limitScrolling={false}
                                onRowMoved={e => {                                
                                    try {
                                        this.state.formEventGoods.splice(e.to, 0, this.state.formEventGoods.splice(e.from, 1)[0])
                                        this.forceUpdate();
                                        this.setState({isUpdated : true})
                                    }catch(e) {
                                    }
                                }}
                                renderRow={row => <RowComponent item={row} screenState={this.state} screenProps={this.props} />}
                            />
                        </View>
                        <View style={CommonStyle.blankArea}></View>
                    </ScrollView>                    
                    </KeyboardAvoidingView>
                    <View style={CommonStyle.bottomButtonWrap}>
                        <TouchableOpacity style={CommonStyle.bottomRightBox} onPress={()=>this.cancleRegist()}>
                            <CustomTextB style={CommonStyle.bottomMenuOnText}>취소</CustomTextB>
                        </TouchableOpacity>
                        <TouchableOpacity style={CommonStyle.bottomLeftBox} onPress={()=>this.updateData()}>
                            <CustomTextB style={CommonStyle.bottomMenuOffText}>등록</CustomTextB>
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
        flex:1,backgroundColor:'#fff',paddingHorizontal:15
    },
    titleWrap : {
        paddingHorizontal:20,paddingVertical:10,flexDirection:'row',alignItems:'center'
    },

    popLayerWrap : {
        width:SCREEN_WIDTH*0.9,height:SCREEN_HEIGHT*0.8,backgroundColor:'transparent',margin:0,padding:0
    },
    formTitleTypeWrap : {
        flex:2,alignItems:'flex-start',justifyContent: 'center',
    },
    formTextTypeWrap : {
        flex:1,alignItems:'flex-end',justifyContent: 'center',
    },
    formTextType : {
        borderWidth:1,borderColor:DEFAULT_COLOR.input_border_color,borderRadius:5,paddingVertical:5,paddingHorizontal:10,backgroundColor:DEFAULT_COLOR.base_color
    },
    priceText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11),color:'#555'
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
    itemBoxSubWrap : {
        flex:1,
        flexDirection:'row',    
        flexGrow:1,    
        paddingVertical: Platform.OS === 'android' ? 10 : 15,
        paddingHorizontal:20,
        alignItems: 'center',        
        borderBottomWidth:1,
        borderBottomColor : DEFAULT_COLOR.input_border_color
    },
    productArrayWrap : {
        paddingHorizontal:10
    },
    menuTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),paddingLeft:10
    },
    menuPriceText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),paddingLeft:10,color:'#585858'
    },
    /**** Modal  *******/
    
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
    boxStockWrap : {
        flex:1.5,        
        justifyContent:'center',
        alignItems:'center'
    },
    boxCloseWrap : {
        flex:0.8,      
        justifyContent:'center',
        alignItems:'flex-end'
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
export default connect(mapStateToProps,mapDispatchToProps)(MDProductListScreen);
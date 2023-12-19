import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Alert,Dimensions,PixelRatio,Image,TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import {CheckBox,Input} from 'react-native-elements';
import LinearGradient from "react-native-linear-gradient";
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

const RADIOON_OFF = require('../../../assets/icons/check_off.png');
const RADIOON_ON = require('../../../assets/icons/check_on.png');

const DefaultPaginate = 300000;
class PopLayerSelectAllGoods extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:true,
            moreLoading : false,
            totalCount : 0,
            ismore :  false,
            currentPage : 1,
            selectedProduct : {},
            selectedProduct_pk : 0,
            selectedCategory : 0,
            topCategory : [],
            productList : []
        }
    }
    setCategory = async(arr) => {
        if ( !CommonUtil.isEmpty(arr) ) {
            let newCategory1 = [...new Set(arr.map(item => item.category_pk))];
            let newCategory2 = [...new Set(arr.map(item => item.category_name))];
            let baseArray = [{category_pk:0,category_name : '전체'},];
            let newArray = baseArray.concat(newCategory1.map((e, i) => ({category_pk : e, category_name :newCategory2[i] })));
            this.setState({
                topCategory : newArray,
                productList : arr,
                loading:false,moreLoading : false
            })
            this.props.screenState.setProductArray(arr) ;
        }
    }

    moreDataUpdate = async( baseData , addData) => {     
        let newArray = await baseData.concat(addData.data.productList);
        this.setState({            
            moreLoading : false,
            loading : false,
            productList : newArray,
            ismore : parseInt(this.state.currentPage) < parseInt(addData.lastPage) ? true : false
        })
        await this.setCategory(newArray);
    }

    getBaseData = async(currentpage,morePage = false) => {
        this.setState({moreLoading : true})
        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/product/alllist?category_pk=&page=' + currentpage + '&paginate='+DefaultPaginate;
            //console.log('url',url) 
            const token = this.props.userToken.apiToken;
            let sendData = null;
            returnCode = await apiObject.API_getPageList(this.props,url,token,sendData);
            //console.log('returnCo333de',returnCode.data) 
            if ( returnCode.code === '0000'  ) {
                this.setState({currentPage : returnCode.currentPage})
                if ( morePage ) {
                    this.moreDataUpdate(this.state.productList,returnCode )
                }else{
                    await this.setCategory(returnCode.data.productList);
                    this.setState({
                        totalCount : returnCode.total,
                        ismore : parseInt(this.state.currentPage)  < parseInt(returnCode.lastPage) ? true : false,
                        productList : CommonUtil.isEmpty(returnCode.data.productList) ? [] : returnCode.data.productList
                    })
                }
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.',2000);
            }

            this.setState({moreLoading:false,loading:false})
        }catch(e){
            //console.log('e',e) 
            this.setState({loading:false,moreLoading : false})
        }
    }
    
    async UNSAFE_componentWillMount() {
        await this.getBaseData(1,false);
        /* if ( this.props.screenState.productArray.length === 0) {
            
        }else{
            console.log('is ui',this.props.screenState.ismore) 
            await this.setCategory(this.props.screenState.productArray)
        }

        this.setState({
            currentPage : this.props.screenState.currentPage,
            totalCount : this.props.screenState.totalCount,
            ismore : this.props.screenState.ismore,
            selectedProduct : this.props.screenState.target_data,
            selectedProduct_pk : CommonUtil.isEmpty(this.props.screenState.target_data) ? 0 : this.props.screenState.target_data.product_pk
        }); */
    }  
   
    selectMember = async() =>  {
        if ( CommonUtil.isEmpty(this.state.selectedProduct)) {
            Alert.alert(
                DEFAULT_CONSTANTS.appName,      
                "대상상품을 선택해주세요!",
                [
                    {text: 'OK', onPress: () => console.log('Cancle')},
                    
                ],
                { cancelable: true }
            )  
           
        }else{
            this.props.screenState.closepopLayer2(this.state.selectedProduct)
        }
        
    }

    checkItem = async(idx) => {
        //console.log('idx',idx);
        let mockData1 = this.state.selectedCategory === 0 ? this.state.productList : this.state.productList.filter((info) => info.category_pk === this.state.selectedCategory);

        let targetData = await mockData1[idx];
        //console.log('targetData',targetData);
        this.setState({
            selectedProduct:targetData,
            selectedProduct_pk : targetData.product_pk
        })
     }
   
    

    selectSampleKeyword = async(item,idx) => {
        this.setState({selectedCategory : item.category_pk});
    }

    render() {
        let mockData1 = this.state.selectedCategory === 0 ? this.state.productList : this.state.productList.filter((info) => info.category_pk === this.state.selectedCategory);
        if ( this.state.loading ) {
            return (
                <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} /> 
            )
        }else { 
        return(
            <View style={ styles.container }>
                <View style={{flex:0.4,justifyContent:'center',borderBottomColor:'#ccc',borderBottomWidth:1}}>
                    <TouchableOpacity 
                        onPress={()=> this.props.screenState.closepopLayer2()}
                        hitSlop={{left:10,right:5,top:10,bottom:20}}
                        style={{position:'absolute',top:10,right:0,width:40,height:40}}
                    >
                        <Image
                            source={require('../../../assets/icons/btn_close.png')}
                            resizeMode={"contain"}
                            style={CommonStyle.defaultIconImage}
                        />
                    </TouchableOpacity>
                    <View style={{width:'60%',paddingLeft:20}}>
                        <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#333'}}>상품 선택</CustomTextM>
                    </View>
                </View>
                <View style={{flex:0.4,minHeight:10,justifyContent:'center',alignItems:'flex-start',marginTop:5,maxWidth:SCREEN_WIDTH*0.9}}>
                    <ScrollView
                        horizontal={true}
                        nestedScrollEnabled={true}
                        showsHorizontalScrollIndicator={false}
                        style={{minWidth:SCREEN_WIDTH*0.9,paddingRight:20}}
                    >
                    {
                        this.state.topCategory.map((xitem,xindex)=> {
                            return (
                                <View key={xindex} style={this.state.selectedCategory === xitem.category_pk ? styles.sampleContainerOn : styles.sampleContainer}>
                                    <TouchableOpacity
                                        onPress={()=>this.selectSampleKeyword(xitem,xindex)}
                                        style={this.state.selectedCategory === xitem.category_pk ? styles.sampleWrapperOn: styles.sampleWrapper}
                                    >
                                        {
                                        this.state.selectedCategory === xitem.category_pk
                                        ?
                                        <CustomTextB style={styles.smapleTextOn}>
                                            {xitem.category_name}
                                        </CustomTextB>
                                        :
                                        <CustomTextL style={styles.smapleText}>
                                            {xitem.category_name}
                                        </CustomTextL>
                                        }
                                    </TouchableOpacity>
                                    <View style={this.state.selectedCategory === xitem.category_pk? styles.sampleBorderOn: styles.sampleBorder} />
                                </View>
                            )
                            
                        })
                    }
                    </ScrollView>
                    <LinearGradient
                        colors={["rgba(255,255,255,1)", "rgba(255,255,255,0.5)", "rgba(255,255,255,0)"]}
                        locations={[0, 0.5, 1]}
                        style={{position: "absolute", height: "100%", width:30, right:0,bottom:2}}
                    />
                </View>
                <View style={{flex:4}}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        indicatorStyle={'white'}
                    >
                         
                        <View style={{width:SCREEN_WIDTH-50}}>
                            {
                                mockData1.length === 0 ? 
                                <View style={CommonStyle.emptyWrap} >
                                    <CustomTextR style={CommonStyle.dataText}>이벤트상품이 없습니다.</CustomTextR>
                                </View>
                                :
                                mockData1.map((item, index) => {  
                                ///console.log('selectedProduct_pk',this.state.selectedProduct_pk,item.product_pk)
                                return (
                                    <TouchableOpacity 
                                        onPress={() => this.checkItem(index)}
                                        key={index} style={styles.boxSubWrap}
                                    >
                                        <View style={styles.boxLeftWrap}>
                                            <CheckBox 
                                                containerStyle={{padding:0,margin:0}}   
                                                iconType={'FontAwesome'}
                                                checkedIcon={<Image source={RADIOON_ON} style={CommonStyle.checkboxIcon} />}
                                                uncheckedIcon={<Image source={RADIOON_OFF} style={CommonStyle.checkboxIcon} />}
                                                checkedColor={DEFAULT_COLOR.base_color}                          
                                                checked={item.product_pk == this.state.selectedProduct_pk ? true : false}
                                                size={PixelRatio.roundToNearestPixel(15)}                                    
                                                onPress={() => this.checkItem(index)}
                                            />
                                        </View>
                                        <View style={styles.boxLeftWrap}>
                                            { !CommonUtil.isEmpty(item.thumb_img) ?
                                                <Image
                                                    source={{uri:DEFAULT_CONSTANTS.defaultImageDomain + item.thumb_img}}
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
                                            <CustomTextR style={styles.menuTitleText}>{item.product_name}</CustomTextR>
                                            <CustomTextR style={styles.menuPriceText}>{CommonFunction.currencyFormat(item.event_each_price)}원(낱개)</CustomTextR>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })
                        } 
                        </View>
                        {
                            (this.state.selectedCategory === 0 && this.state.ismore) &&
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
                <View 
                style={styles.bottomButtonWrap}
                //style={{flex:1,justifyContent:'center',alignItems:'center',flexDirection:'row'}}
                >
                    
                    <TouchableOpacity 
                        style={styles.bottomRightBox}
                        onPress={()=> this.props.screenState.closepopLayer2(null)}
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
            </View>
        );
        }
    }
}



const styles = StyleSheet.create({
    container: {
        flex:1
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
        paddingVertical: Platform.OS === 'android' ? 5 : 15,
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
        }
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(PopLayerSelectAllGoods);
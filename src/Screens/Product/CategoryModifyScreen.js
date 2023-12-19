import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Text,Dimensions,RefreshControl,PixelRatio,Image,TouchableOpacity,BackHandler,TextInput,KeyboardAvoidingView,Animated,Alert} from 'react-native';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
import 'moment/locale/ko'
import  moment  from  "moment";
import ImagePicker from 'react-native-image-crop-picker';
import {CheckBox} from 'react-native-elements';
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
import SelectCityType from "../../Utils/SelectCityType";
import Loader from '../../Utils/Loader';
import { apiObject } from "../Apis";

const RADIOON_OFF = require('../../../assets/icons/check_off.png');
const RADIOON_ON = require('../../../assets/icons/check_on.png');
const mockData1 = [
    { id: 1, name : '아릭스', code:1, checked : false},
    { id: 2, name : '클릭로직', code:1, checked : false},
    { id: 3, name : '드라이팍', code:1, checked : false},
    { id: 4, name : '라코로나', code:1, checked : false},
    { id: 5, name : '톤키타', code:1, checked : false},
   
]
const currentDate =  moment().add(0, 'd').format('YYYY-MM-DD');
const minDate =  moment().add(1, 'd').format('YYYY-MM-DD');
const maxDate =  moment().add(60, 'd').format('YYYY-MM-DD');

class CategoryModifyScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading : true,
            showModal : false,
            showModalType : 1,
            moreloading : false,
            isNewImage : false,
            image : {},
            images : {},
            thumbnail_img : null,
            formCategoryIdx : 0,
            formCategorySeq : 0,
            formCategoryName : null,
            formCategoryCode : 0,
            categoryType : 'N',
            categoryUse : true,
            categoryData : {},
            normalCategoryDetph1 : [],
            normalCategoryDetph2 : [],
            normalCategoryDetph3 : [],
            categoryDetph2 : [],
            categoryDetph3 : [],
            
        }
    }

    getCateogoryCode = async (thisCode) => {
        //어지뙤었든 전부 codelist 에서 가져온건 code
        let detph1Category = thisCode.depth1code;
        let detph2Category = thisCode.depth2code;
        let detph3Category = thisCode.depth3code;
        const CategoryCode  = await CommonFunction.getStorageCode('CategoryCode');
        let CategoryCodeDepth1 = await CategoryCode.filter((info) => info.depth === 1 ); 
        let CategoryCodeDepth2 = await CategoryCode.filter((info) => info.depth === 2 ); 
        let CategoryCodeDepth3 = await CategoryCode.filter((info) => info.depth === 3 ); 
        let newData01 = [];
        await CategoryCodeDepth1.forEach(function(element,index,array){     
             newData01.push({id : index,name : element.name,code : element.code,codeidx : element.normalcategory_pk ,checked : detph1Category === element.code ? true : false})               
        });  

        let itemlist2 = await CategoryCodeDepth2.filter((info) => info.group_code === detph1Category); 
        let newData2 = [];
        await itemlist2.forEach(function(element,index,array){     
            newData2.push({id : index,name : element.name,code : element.code,codeidx : element.normalcategory_pk ,checked : detph2Category === element.code ? true : false})               
        }); 
        let itemlist3 = await CategoryCodeDepth3.filter((info) => info.group_code === detph2Category); 
        let newData3 = [];
        await itemlist3.forEach(function(element,index,array){     
            newData3.push({id : index,name : element.name,code : element.code,codeidx : element.normalcategory_pk ,checked : detph3Category === element.code ? true : false})               
        });  
        this.setState({
            categoryCode : CategoryCode,
            normalCategoryDetph1:newData01,
            categoryDetph2:CategoryCodeDepth2,
            categoryDetph3:CategoryCodeDepth3,
            normalCategoryDetph2 : newData2,
            normalCategoryDetph3 : newData3,
            loading: false
        })
    }
    
    async UNSAFE_componentWillMount() {        
        if ( !CommonUtil.isEmpty(this.props.extraData.params.screenData)) {
            this.setState({
                categoryData : this.props.extraData.params.screenData,
                formCategoryIdx : this.props.extraData.params.screenData.category_pk,
                thumbnail_img : this.props.extraData.params.screenData.category_logo,
                formCategoryName : this.props.extraData.params.screenData.category_name,
                formCategoryCode : this.props.extraData.params.screenData.normalcategory_pk,
                formCategorySeq : this.props.extraData.params.screenData.category_seq,
                categoryType : this.props.extraData.params.screenData.category_type,
                categoryUse : this.props.extraData.params.screenData.category_yn,
                detph1Category : this.props.extraData.params.screenData.depth1code,
                detph2Category : this.props.extraData.params.screenData.depth2code,
                detph3Category : this.props.extraData.params.screenData.depth3code 
            })
            await this.getCateogoryCode(this.props.extraData.params.screenData);
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

    selectFilter = async(mode,filt) => {
        switch(mode) {
            case 'maker' :
                this.setState({
                    formMakerCode:mockData1[filt.id-1].id,
                    formMakerName:mockData1[filt.id-1].name
                });break;           
            default : console.log('');
        }
    }
  
    animatedHeight = new Animated.Value(SCREEN_HEIGHT * 0.5);
    closeModal = () => {
        this.setState({ showModal: false });      
    }
    showModal = (mode) => {
        this.setState({showModal: true,showModalType : mode})
    }
    updateData = async() => {
        CommonFunction.fn_call_toast('준비중입니다.',2000);
    }

    changeProfile = async(cropit, circular = false, mediaType = 'photo') => {   
        ImagePicker.openPicker({
            width: 900,
            height: 900,
            multiple:false,
            cropping: true,
            cropperCircleOverlay: circular,
            sortOrder: 'none',
            compressImageMaxWidth: 1000,
            compressImageMaxHeight: 1000,
            compressImageQuality: 1,
            compressVideoPreset: 'MediumQuality',
            includeExif: true,
            cropperStatusBarColor: 'white',
            cropperToolbarColor: 'white',
            cropperActiveWidgetColor: 'white',
            cropperToolbarWidgetColor: '#3498DB',
            loadingLabelText:'처리중...',
            forceJpg:true
        })
          .then((response) => {            
            this.setState({
                thumbnail_img : response.path,
                isNewImage : true,
                image: response,
                images: null,
            });
          })
          .catch((e) => {            
            CommonFunction.fn_call_toast('이미지 선택을 취소하였습니다.',2000)            
          });
    }

    setCatetegoryGubun = async(type) => {
        if ( type === 'B') {

        }
        this.setState({
            categoryType : type,
            formCategoryName : null,
            formCategoryCode : 0
        });
    }

    selectFilterDepth1 = async(filt) => {       
        
        try {        
            let depthcode1 = this.state.normalCategoryDetph1[filt.id].code;
            let itemlist = await this.state.categoryDetph2.filter((info) => info.group_code === depthcode1); 
            let newData2 = [];
            await itemlist.forEach(function(element,index,array){     
                newData2.push({id : index,name : element.name,code : element.code,codeidx : element.normalcategory_pk ,checked : false})               
            });  
        
            this.timeout = setTimeout(
                () => {
                    this.setState({
                        normalCategoryDetph2:newData2,
                        formCategoryName : null,
                        formCategoryCode : 0
                    });
                },
                500
            ); 
        }catch {          
            this.state.normalCategoryDetph1[0].checked = true;
            return true;
        }        
    }

    selectFilterDepth2 = async(filt) => {       
        try {        
            let depthcode2 = this.state.normalCategoryDetph2[filt.id].code;
            let itemlist = await this.state.categoryDetph3.filter((info) => info.group_code === depthcode2); 
            let newData3 = [];
            await itemlist.forEach(function(element,index,array){     
                newData3.push({id : index,name : element.name,code : element.code,codeidx : element.normalcategory_pk ,checked : false})               
            });  
        
            this.timeout = setTimeout(
                () => {
                    this.setState({
                        normalCategoryDetph3:newData3,
                        formCategoryName : null,
                        formCategoryCode : 0
                    })
                },500
            ); 
        }catch {          
            this.state.normalCategoryDetph2[0].checked = true;
            return true;
        }        
    }

    selectFilterDepth3 = (filt) => {
        try {         
            this.setState({
                formCategoryName : this.state.normalCategoryDetph3[filt.id].name,
                formCategoryCode : this.state.normalCategoryDetph3[filt.id].codeidx
            })
        }catch {            
            this.state.normalCategoryDetph3[0].checked = true;
            return true;
        }
    }

    registData = async() => {

        this.setState({moreLoading:true})
        let  thumbnail_new = {data:null};
        let category_logo = this.state.thumbnail_img;        
        if ( this.state.isNewImage && !CommonUtil.isEmpty(this.state.image)) {
            let filename = this.state.image.filename;
            if ( CommonUtil.isEmpty(this.state.image.filename)) {
                let spotCount = this.state.image.path.split('.').length-1;
                let pathExplode = this.state.image.path.split('.') 
                filename = Platform.OS + moment().unix() + '.'+pathExplode[spotCount];
            }
            try {
                let newImageadata = {
                    name: filename, 
                    size : this.state.image.size,
                    uri:  this.state.image.path , 
                    type: this.state.image.mime
                }
                thumbnail_new = await CommonUtil.SingleImageUpload(this.props.userToken.apiToken,newImageadata,'product');
            }catch(e) {
                this.setState({loading:false,moreLoading : false})
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.',2000);
                return;
            }
        }
        
        let returnCode = {code:9998};     
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/category/modify/'+ this.state.formCategoryIdx;            
            const token = this.props.userToken.apiToken;
            let sendData = {
                category_name : this.state.formCategoryName,
                category_logo : !CommonUtil.isEmpty(thumbnail_new.data) ? thumbnail_new.data : category_logo,
                category_seq : this.state.formCategorySeq,
                category_type : this.state.categoryType,
                category_yn : this.state.categoryUse,
                normalcategory_pk : this.state.formCategoryCode
            }            
            returnCode = await apiObject.API_updateCommon(this.props,url,token,sendData);
            if ( returnCode.code === '0000'  ) {
                CommonFunction.fn_call_toast('정상적으로 수정되었습니다.' ,2000);
                this.props._fn_selectCategoryName(this.state.formCategoryName);
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
            CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.' + e ,2000);
            this.setState({loading:false,moreLoading : false})
        }
    }

    actionOrder = async() => {
        Alert.alert(
            DEFAULT_CONSTANTS.appName,
            "카테고리를 수정하시겠습니까?",
            [
                {text: '네', onPress: () =>  this.registData()},
                {text: '아니오', onPress: () => console.log('Cancle')},
            ],
            { cancelable: true }
        )  
    }

    showModalCheck = async() => {
        if ( CommonUtil.isEmpty(this.state.formCategoryName)) {
            CommonFunction.fn_call_toast('카테고리명을 입력해주세요',2000);
            return true;           
        }else{
            if ( this.state.categoryType === 'N' && CommonUtil.isEmpty(this.state.formCategoryCode)) {
                CommonFunction.fn_call_toast('소분류단계까지 선택해주세요',2000);
                return true;   
            }else{
                this.actionOrder();
            }
        }
    }

    render() {
        if ( this.state.loading ) {
            return (
                <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} /> 
            )
        }else {        
            return(
                <View style={ styles.container }>
                    <KeyboardAvoidingView style={{paddingVertical:10}} behavior={Platform.OS === 'ios' ? "padding" : 'height'}  enabled> 
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
                         <View style={styles.mainWrap}>
                            <View style={styles.imageThumbWrap}>
                                <TouchableOpacity 
                                    onPress={()=>this.changeProfile(true,true)}
                                    style={{flex:1,justifyContent:'center'}} 
                                >
                                { 
                                    !CommonUtil.isEmpty(this.state.thumbnail_img) ?
                                    <Image
                                        source={{uri:DEFAULT_CONSTANTS.defaultImageDomain+ this.state.thumbnail_img}}
                                        resizeMode={"contain"}
                                        style={CommonStyle.defaultImage97}
                                    />
                                    :
                                    <Image
                                        source={require('../../../assets/icons/no_image.png')}
                                        resizeMode={"contain"}
                                        style={CommonStyle.defaultImage97}
                                    />
                                }
                                </TouchableOpacity>
                            </View>
                            <View style={styles.titleWrap}>
                                <CustomTextR style={CommonStyle.titleText}>사용여부</CustomTextR>
                                <CustomTextR style={CommonStyle.requiredText}></CustomTextR>
                            </View>
                            <View style={{paddingHorizontal:10,flexDirection:'row'}}>    
                                <CheckBox 
                                    containerStyle={{padding:0,margin:0}}   
                                    iconType={'FontAwesome'}
                                    checkedIcon={<Image source={RADIOON_ON} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                    uncheckedIcon={<Image source={RADIOON_OFF} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                    checkedColor={DEFAULT_COLOR.base_color}                          
                                    checked={this.state.categoryUse}
                                    size={PixelRatio.roundToNearestPixel(15)}                                    
                                    onPress={() => this.setState({categoryUse:true})}
                                />                           
                                <CustomTextM style={CommonStyle.dataText}> 사용</CustomTextM>
                                <CheckBox 
                                    containerStyle={{padding:0,margin:0}}   
                                    iconType={'FontAwesome'}
                                    checkedIcon={<Image source={RADIOON_ON} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                    uncheckedIcon={<Image source={RADIOON_OFF} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                    checkedColor={DEFAULT_COLOR.base_color}                          
                                    checked={!this.state.categoryUse}
                                    size={PixelRatio.roundToNearestPixel(15)}                                    
                                    onPress={() => this.setState({categoryUse:false})}
                                />                           
                                <CustomTextM style={CommonStyle.dataText}> 미사용</CustomTextM>
                            </View>
                            <View style={styles.titleWrap}>
                                <CustomTextR style={CommonStyle.titleText}>카테고리구분</CustomTextR>
                                <CustomTextR style={CommonStyle.requiredText}></CustomTextR>
                            </View>
                            <View style={{paddingHorizontal:10,flexDirection:'row'}}>                                
                                <CustomTextB style={styles.menuTitleText}>
                                    { this.state.categoryType === 'B' ? '브랜드' : '제품군'}
                                </CustomTextB> 
                            </View>
                            { 
                                this.state.categoryType === 'B' ?
                                <View>
                                   <View style={styles.titleWrap}>
                                        <CustomTextR style={CommonStyle.titleText}>카테고리명</CustomTextR>
                                        <CustomTextR style={CommonStyle.requiredText}>{'*'}</CustomTextR>
                                    </View>
                                    <View style={{paddingHorizontal:5,flexDirection:'row'}}>
                                        <TextInput                                    
                                            style={[styles.inputBlank,CommonStyle.defaultOneWayForm]}
                                            value={this.state.formCategoryName}
                                            onChangeText={text=>this.setState({formCategoryName:text})}
                                            multiline={false}
                                            clearButtonMode='always'
                                        />
                                    </View>
                                </View>
                                :
                                <View style={{paddingTop:20}}>
                                    <View style={styles.selecterWrap}>
                                        <DropBoxIcon />  
                                        <SelectCityType
                                            isSelectSingle
                                            style={{borderWidth:0}}
                                            selectedTitleStyle={CommonStyle.selecterBoxText}
                                            colorTheme={DEFAULT_COLOR.base_color_666}
                                            popupTitle="대분류를 선택해주세요"
                                            title={'대분류'}
                                            showSearchBox={false}
                                            cancelButtonText="취소"
                                            selectButtonText="선택"
                                            data={this.state.normalCategoryDetph1}
                                            onSelect={data => {
                                                this.selectFilterDepth1(data)
                                            }}
                                            onRemoveItem={data => {
                                                this.state.normalCategoryDetph1[0].checked = true;
                                            }}
                                            initHeight={SCREEN_HEIGHT * 0.7}
                                        />
                                    </View>
                                    <View style={styles.selecterWrap}>
                                        <DropBoxIcon />  
                                        <SelectCityType
                                            isSelectSingle
                                            style={{borderWidth:0}}
                                            selectedTitleStyle={CommonStyle.selecterBoxText}
                                            colorTheme={DEFAULT_COLOR.base_color_666}
                                            popupTitle="중분류를 선택해주세요"
                                            listEmptyTitle={"대분류를 먼저 선택해주세요"}
                                            title={'중분류'}
                                            showSearchBox={false}
                                            cancelButtonText="취소"
                                            selectButtonText="선택"
                                            data={this.state.normalCategoryDetph2}
                                            onSelect={data => {
                                                this.selectFilterDepth2(data)
                                            }}
                                            onRemoveItem={data => {
                                                this.state.normalCategoryDetph2[0].checked = true;
                                            }}
                                            initHeight={SCREEN_HEIGHT * 0.7}
                                        />
                                    </View>
                                    <View style={styles.selecterWrap}>
                                        <DropBoxIcon />  
                                        <SelectCityType
                                            isSelectSingle
                                            style={{borderWidth:0}}
                                            selectedTitleStyle={CommonStyle.selecterBoxText}
                                            colorTheme={DEFAULT_COLOR.base_color_666}
                                            popupTitle="소분류를 선택해주세요"
                                            listEmptyTitle={"중분류를 먼저 선택해주세요"}
                                            title={'소분류'}
                                            showSearchBox={false}
                                            cancelButtonText="취소"
                                            selectButtonText="선택"
                                            data={this.state.normalCategoryDetph3}
                                            onSelect={data => {
                                                this.selectFilterDepth3(data)
                                            }}
                                            onRemoveItem={data => {
                                                this.state.normalCategoryDetph3[0].checked = true;
                                            }}
                                            initHeight={SCREEN_HEIGHT * 0.7}
                                        />
                                    </View>
                                </View>
                            }
                        </View>
                        <View style={{backgroundColor:'#fff',height:20}} />
                        
                        <View style={{padding:15,marginTop:10,justifyContent:'center',flexDirection:'row'}}>
                            <TouchableOpacity 
                                onPress={()=>this.showModalCheck()}
                                style={{flex:1,maxWidth:90,backgroundColor:DEFAULT_COLOR.base_color,padding:5,justifyContent:'center',alignItems:'center',borderRadius:5}}
                            >
                                <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize17),color:'#fff'}}>수정</CustomTextM>
                            </TouchableOpacity>
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
                </View>
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
    mainWrap : {
        flex:1,backgroundColor:'#fff',padding:15
    },
    imageThumbWrap : {
        paddingHorizontal:5,flexDirection:'row'
    },
    titleWrap : {
        paddingHorizontal:5,paddingVertical:10,marginTop:10,flexDirection:'row'
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
        userToken : state.GlabalStatus.userToken,
        selectCategoryName :  state.GlabalStatus.selectCategoryName
    };
}

function mapDispatchToProps(dispatch) {
    return {     
        _saveUserToken:(str)=> {
            dispatch(ActionCreator.saveUserToken(str))
        },           
        _fn_ToggleCategory:(bool)=> {
            dispatch(ActionCreator.fn_ToggleCategory(bool))
        },
        _fn_selectCategoryName:(str)=> {
            dispatch(ActionCreator.fn_selectCategoryName(str))
        }
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(CategoryModifyScreen);
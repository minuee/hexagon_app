import React from 'react';
import {StyleSheet,SafeAreaView,Platform,Image,View,TouchableOpacity,Dimensions,StatusBar,Text,ScrollView,Animated,PixelRatio,TextInput,BackHandler} from 'react-native';
import { Overlay } from 'react-native-elements';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
import {connect} from 'react-redux';
import ActionCreator from '../Ducks/Actions/MainActions';

const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT} = Dimensions.get("window");

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import * as COMMON_CODES from '../Constants/Codes';
import {CustomTextR, CustomTextB, CustomTextM, TextRobotoM,TextRobotoR} from '../Components/CustomText';
import CommonFunction from '../Utils/CommonFunction';

async function getCodestart() {
    const returnCode = await COMMON_CODES.default();
    //returnCode_Sex = returnCode[0];
    //returnCode_Distance  = returnCode[1];

   
    return returnCode;
}
//const COOOOCODE  = getCodestart();
//console.log('COOOOCODE', COOOOCODE[0])

const BASE_HEIGHY = Platform.OS === 'android' ? 100 : CommonFunction.isIphoneX() ? 150 : 110;



class CommonHeader extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            topShowModal : false,
            showModal : false,
            headerHeight : BASE_HEIGHY,
            myFilterItems : [],
            tmpmyFilterItemsTmp : [],

            mockSubData01 : [],
            mockSubData02 : [],
            mockSubData03 : [],
            mockSubData04 : [],
            mockSubData05 : []
        } 
    }

    static navigationOptions = () => {
        return {
            header: null
        };
    };
  
    async UNSAFE_componentWillMount() {

       
     
    }
    
    componentDidMount() {
        
    }

    UNSAFE_componentWillUnmount() { 
    
    }

    onLayoutHeader = (evt ) => {
        
        console.log('height',evt.nativeEvent.layout.height);
        this.setState({headerHeight : evt.nativeEvent.layout.height});
    }

    animatedHeight = new Animated.Value(SCREEN_HEIGHT - BASE_HEIGHY);

 
    setOnceChecked = async(data,mode = null ) => {
        let tmp2 = this.state.tmpmyFilterItemsTmp
        let selectedFilterCodeList = CommonFunction.copyObject(tmp2);        
        if ( mode === 'remove' ) {
            selectedFilterCodeList = await selectedFilterCodeList.filter((info) => info.code !== data.code);   
        }else{
            await selectedFilterCodeList.push({code:data.code,name:data.name,info:data});
        }
        return selectedFilterCodeList;
    }
    
    //this setup each
    _selectFilter = async(data,mode=null) => {
        let returnArray = await this.setOnceChecked(data,mode);
        //Database to save
        this.setState({tmpmyFilterItemsTmp:returnArray})

    }

    _saveFilter = async() => {
        let tmp = this.state.tmpmyFilterItemsTmp;        
        await this.setState({myFilterItems:tmp});
        this.setState({ 
            topShowModal: false ,
            showModal :false
        })
    }

    _topCloseModal = async() => {        
        let tmp = this.state.myFilterItems;
        this.setState({tmpmyFilterItemsTmp : tmp})
        this.setState({ 
            topShowModal: false ,
            showModal : false
        })        
    };

    _topShowModal = async(bool) => {       
        let tmp = this.state.myFilterItems;   
        if ( bool ) {
            await this.setState({tmpmyFilterItemsTmp : tmp})
        }
        this.setState({  
            topShowModal: bool
        })
    }

    animatedHeight2 = new Animated.Value(SCREEN_HEIGHT - BASE_HEIGHY);
    closeModal = () => this.setState({ showModal: false });
    showModal = () => this.setState({ showModal: true });

    moveMap = () => {
        this.props.navigation.navigate('AreaGamesStack');
    }

    render() {
       
        const mockData1  = [
            { id: 1, name : '거리', checked: false ,child : this.state.mockSubData01
            },
            { id: 2, name : '종목', checked: false, child : this.state.mockSubData02
            },
            { id: 3, name : '레벨', checked: false, child : this.state.mockSubData03
            },
            { id: 4, name : '성별', checked: false, child : this.state.mockSubData04
            },
            { id: 5, name : '나이', checked: false, child : this.state.mockSubData05
            }
        ];

        return (
           <SafeAreaView style={styles.Rootcontainer} onLayout={(e)=>this.onLayoutHeader(e)}>
                
                <View style={styles.container}>
                    <TouchableOpacity 
                        onPress={() =>  this.moveMap()}
                        style={{flex:1,justifyContent:'center'}}
                    >
                        <Image 
                            source={require('../../assets/icons/drawable-xhdpi/main_location_btn.png')}
                            resizeMode={'contain'}
                            style={{width:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize25),height:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize25)}}
                        />               
                    </TouchableOpacity>
                    <View style={{flex:5,flexDirection:'row',justifyContent:'center',alignItems:'center',borderBottomColor :'#979797',borderBottomWidth : 0.3}}>
                        <View style={{flex:10}}>
                            <TextInput                                        
                                placeholder="검색어를 입력해주세요"                               
                                style={styles.inputText}
                                onChangeText={text => {
                                    this.setState({searchKeyword : text})
                                }}
                            />
                        </View>
                        <TouchableOpacity 
                            style={{flex:1}}
                        >
                            <Image 
                                source={require('../../assets/icons/drawable-xhdpi/main_search_btn.png')}
                                resizeMode={'contain'}
                                style={{width:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize25),height:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize25)}}
                            />               
                        </TouchableOpacity>
                        
                    </View>
                </View>
                <View style={[styles.container,{alignItems:'center',justifyContent:'center'}]}>
                    <View style={{flex:8}}>
                        <View style={{flexDirection:'row',justifyContent:'space-between',flexWrap:'wrap'}}>
                            {
                                mockData1.map((data, index) => {  
                                    return (
                                    <View key={index} style={styles.boxWrap}>
                                        <CustomTextB style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize9),color:'#494949'}}>{data.name}</CustomTextB>
                                    </View>
                                    )
                                })
                            }
                        </View>
                        
                    </View>
                    <TouchableOpacity 
                        style={{flex:1,justifyContent:'flex-end',alignItems:'flex-end'}}
                        onPress={()=> this._topShowModal(!this.state.topShowModal)}
                    >
                        <Image 
                            source={require('../../assets/icons/drawable-xhdpi/filter_btn.png')}
                            resizeMode={'contain'}
                            style={{width:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),height:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)}}
                        />
                    </TouchableOpacity>
                </View>

                <Modal
                     onBackdropPress={this._topCloseModal}
                     animationType="slide"
                     onRequestClose={() => {
                       this.setState({topShowModal: false});
                     }}
                     // useNativeDriver={true}
                     animationInTiming={300}
                     animationOutTiming={300}
                     hideModalContentWhileAnimating
                     isVisible={this.state.topShowModal}
                     style={{justifyContent: 'flex-end', margin: 0}}
                     // hideModalContentWhileAnimating={true}
                     onSwipeComplete={() => this.closeModal()}
                     swipeDirection={['down']}
                     propagateSwipe={true}
                     backdropOpacity={0.1}
                    /*
                    onBackdropPress={this.closeModal}
                    style={{justifyContent: 'flex-end',margin: 0}}
                    useNativeDriver={true}
                    animationInTiming={300}
                    animationOutTiming={300}
                    hideModalContentWhileAnimating
                    swipeDirection={'down'}
                    backdropOpacity={0}
                    isVisible={this.state.showModal}

                    animationType="slide"
                    onRequestClose={() => {
                      this.setState({showModal: false});
                    }}
                    onSwipeComplete={() => this.closeModal()}
                    propagateSwipe={true}
                    */

                >
                    <Animated.View style={[styles.modalContainer2,{ height: this.animatedHeight2 }]}>
                        <View style={{flex:5,paddingHorizontal:20}}>
                        {
                            mockData1.map((data, index) => {  
                                return (
                                <View key={index} style={{width:'100%',marginBottom:15}}>
                                    <View style={{marginBottom:5}}>
                                        <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),color:'#7d7d7d'}}>{data.name}</CustomTextR>
                                    </View>
                                    <View style={{flexDirection:'row',flexWrap:'wrap',justifyContent:'flex-start',alignContent:'space-around'}}>
                                        { data.child.map((data2, index2) => {  
                                            let isIndexOf = this.state.tmpmyFilterItemsTmp.findIndex(
                                                info => info.code === data2.code
                                            );  
                                            return (
                                            <TouchableOpacity 
                                                style={isIndexOf != -1 ? styles.fileterBoxWrap : styles.fileterUnBoxWrap} key={index2}
                                                onPress={()=> this._selectFilter(data2,isIndexOf != -1 ? 'remove' : null)}
                                            >
                                                <CustomTextB style={ isIndexOf != -1 ? styles.filterBoxText : styles.filterUnBoxText}>{data2.name}</CustomTextB>
                                            </TouchableOpacity>
                                            )
                                        })
                                        }
                                    </View>
                                </View>
                                )
                            })
                        }

                        </View>
                        <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end',alignItems:'flex-end',width:'95%',paddingBottom:20}}>
                            <TouchableOpacity                                     
                                onPress={()=> this._topCloseModal()}
                                style={{marginRight:5}}
                            >
                                <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#7d7d7d'}}>CANCEL</CustomTextM>
                            </TouchableOpacity>
                            <TouchableOpacity                                     
                                onPress={()=> this._saveFilter()}
                            >
                                <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#091e4b'}}>FILTER</CustomTextM>
                            </TouchableOpacity>

                        </View>
                    </Animated.View>
                </Modal>
                
           </SafeAreaView>
       )        
    }
}




const styles = StyleSheet.create({
    /**** Modal  *******/
    modalContainer: {   
        elevation : 2,
        zIndex : 9999,
        position :'absolute',
        left:-1,
        //top : BASE_HEIGHY,
        width:SCREEN_WIDTH,
        height: SCREEN_HEIGHT-200,
        paddingTop: 16,
        backgroundColor: '#fff',
        borderBottomColor : '#ccc',
        borderBottomWidth:0.5
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
    Rootcontainer: {
      flex: 1,      
      //justifyContent: 'center',
      //alignItems: 'center',      
      height : 100,
      zIndex : 9999,
      overflow:'hidden',
      width:SCREEN_WIDTH,
      marginLeft: Platform.OS === 'android' ? -15 : 0 ,      
      //backgroundColor:'#ff0000'
    },
    container : {  
        height : 44,
        paddingHorizontal:20,
        paddingVertical:3,
        width:'100%',
        flexDirection:'row'
    },
    inputText: {
        width: '90%',
        //padding: 0,
        //paddingVertical: Platform.OS === 'ios' ? 16 : 10,
        paddingVertical: 5,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),
        letterSpacing: -0.7,
        justifyContent: 'center',
        alignItems: 'center',
        
      },
      boxWrap : {
        width:SCREEN_WIDTH/7,justifyContent:'center',alignItems:'center',
        borderWidth:0.3,borderColor:'#091e4b',borderRadius:3,padding:4
      },

      fileterBoxWrap : {
        width:SCREEN_WIDTH/6,justifyContent:'center',alignItems:'center',
        borderWidth:0.3,borderColor:'#a3a3a3',borderRadius:3,padding:4,backgroundColor:'#a3a3a3',margin:2
      },
      fileterUnBoxWrap : {
        width:SCREEN_WIDTH/6,justifyContent:'center',alignItems:'center',
        borderWidth:0.3,borderColor:'#a3a3a3',borderRadius:3,padding:5,backgroundColor:'#fff',margin:2
      },
      filterUnBoxText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize9),color:'#adadad'
      },
      filterBoxText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize9),color:'#fff'
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
        }
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(CommonHeader);

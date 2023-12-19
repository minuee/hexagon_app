import React, { Component } from 'react';
import {SafeAreaView,Image,View,StyleSheet,PixelRatio,Dimensions,TouchableOpacity,BackHandler} from 'react-native';
import {connect} from 'react-redux';
import {Input,Overlay} from 'react-native-elements';
//공통상수 필요에 의해서 사용
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {CustomTextR,CustomTextL, CustomTextB, CustomTextM, TextRobotoM,TextRobotoR} from '../../Components/CustomText';
import CommonFunction from '../../Utils/CommonFunction';
import CommonUtil from '../../Utils/CommonUtil';
import CustomConfirm from '../../Components/CustomConfirm';


class FindIDScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading : true,            
            formUserID : null,
            testUserID : "123456789",
            isResult : false,
            isResultMsg : ""
            
        }
    }
   

    UNSAFE_componentWillMount() {       
        this.setState({
            formUserID : '123456789'
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

    checkAuthCode = async() => {
        if ( !CommonUtil.isEmpty(this.state.formUserID)) {
            if ( this.state.formUserID ===  this.state.testUserID ) {
                this.nextMove()
            }else{
                this.setState({
                    isResult :  true,
                    isResultMsg : "일치하는 계정이 없습니다"
                })
            }
        }
    }

    nextMove = async() => {
        this.props.navigation.navigate('AuthCheckStack',{
            screenData: {
                formUserID : this.state.formUserID
            }
        });
    }

    render() {
        return(
            <SafeAreaView style={ styles.container }>
               <View style={{height:80,justifyContent:'center',marginHorizontal:40,marginTop:30}}>
                    <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),color:DEFAULT_COLOR.base_color_666}}>
                        계정 검색을 위해 회원님의 사업자등록번호를 입력하세요.
                    </CustomTextR>
                </View>
                <View style={styles.middleWarp}>
                    <View style={styles.middleDataWarp}>
                        <Input   
                            value={this.state.formUserID}
                            placeholder="사업자등록번호 -없이입력하세요"
                            placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                            inputContainerStyle={styles.inputContainerStyle}
                            inputStyle={styles.inputStyle}
                            clearButtonMode={'always'}
                            onChangeText={value => this.setState({formUserID:value,isResult:false})}
                        />
                        {
                            ( this.state.isResult && !CommonUtil.isEmpty(this.state.formUserID)) &&
                            <View style={{paddingHorizontal:10}}>
                                <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),color:'#c53915'}}>{this.state.isResultMsg}</CustomTextR>
                            </View>
                            
                        }
                    </View>
                    <View style={styles.middleDataWarp}>
                        <TouchableOpacity 
                            onPress={()=>this.checkAuthCode()}
                            style={CommonUtil.isEmpty(this.state.formUserID) ? styles.buttonWrapOff : styles.buttonWrapOn }
                        >
                            <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize17),color:'#fff'}}>다음</CustomTextM>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    middleWarp : {
        flex:1,        
        justifyContent:'center',        
        marginHorizontal:30,marginBottom:10
    },
    middleDataWarp : {
        flex:1,
        justifyContent:'flex-start',
    },
    titleWrap : {
        flex:1,justifyContent:'flex-end',paddingLeft:20
    },
    titleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),color:DEFAULT_COLOR.base_color_666
    },
    inputContainerStyle : {
        backgroundColor:'#fff',margin:0,padding:0,height:45
    },
    inputStyle :{ 
        margin:0,paddingLeft: 10,color: DEFAULT_COLOR.base_color_666,fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16)
    },
    buttonWrapOn : {
        backgroundColor:'#0059a9',padding:10,marginHorizontal:15,justifyContent:'center',alignItems:'center',borderRadius:25
    },
    buttonWrapOff : {
        backgroundColor:'#ccc2e6',padding:10,marginHorizontal:15,justifyContent:'center',alignItems:'center',borderRadius:25
    },
    forgetenWrap : {
        flex:1,justifyContent:'flex-start',alignItems:'center',marginHorizontal:30
    },
    forgetenText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),color:'#0059a9'
    }
});


function mapStateToProps(state) {
    return {
        userToken : state.GlabalStatus.userToken
    };
}

export default connect(mapStateToProps,null)(FindIDScreen);

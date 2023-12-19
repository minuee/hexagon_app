import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Alert,Dimensions,RefreshControl, PixelRatio,Image,TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import {CheckBox} from 'react-native-elements';
//공통상수 필요에 의해서 사용
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import CommonStyle from '../../Style/CommonStyle';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {CustomTextR,CustomTextL, CustomTextB, CustomTextM, TextRobotoM,TextRobotoR} from '../../Components/CustomText';

import ToggleSwitch from '../../Components/ToggleSwitch';

class Tabs04Screen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : false,
            switchOn1 : false
        }
    }

    UNSAFE_componentWillMount() {
      
    }

    componentDidMount() {
        setTimeout(
            () => {            
                this.setState({loading:false})
            },500
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

    moveDetail = (nav,item) => {
        this.props.navigation.navigate(nav,{
            screenTitle:item
        })
    }

    logout = () => {
        Alert.alert(
            DEFAULT_CONSTANTS.appName,      
            "정말로 로그아웃하시겠습니까?",
            [
                {text: 'OK', onPress: () => this.logoutAction()},
                {text: 'CANCEL', onPress: () => console.log('Cancle')},
                
            ],
            { cancelable: true }
        ) 
    }

    logoutAction = () => {
        this.props._saveNonUserToken({});
        this.props._saveUserToken({});
        setTimeout(() => {
            this.props.navigation.popToTop();
        }, 500);
       
    }

    fn_onChangeToggle = (bool) => {
        this.setState({switchOn1 : bool})
    }

    render() {
        return(
            <SafeAreaView style={ styles.container }>
                <ScrollView
                    ref={(ref) => {
                        this.ScrollView = ref;
                    }}
                    showsVerticalScrollIndicator={false}
                    indicatorStyle={'white'}
                    scrollEventThrottle={16}
                    keyboardDismissMode={'on-drag'}
                    onScroll={e => this.handleOnScroll(e)}
                    onMomentumScrollEnd = {({nativeEvent}) => { 
                        
                    }}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.loading}
                            onRefresh={this.refreshingData}
                        />
                    }
                    onScrollEndDrag ={({nativeEvent}) => { 
                        
                    }}                        
                    style={{width:'100%'}}
                    
                >
                    <View style={styles.boxWrap}>
                        <CustomTextM style={styles.mainTitleText}>계정</CustomTextM>
                    </View>  
                    <TouchableOpacity style={styles.boxSubWrap} onPress={()=>this.moveDetail('MyIDModifyStack','계정정보편집')}>
                        <View style={styles.boxLeftWrap}>
                            <CustomTextR style={styles.menuTitleText}>계정 정보 편집</CustomTextR>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.boxSubWrap} onPress={()=>this.moveDetail('MyPWModifyStack','비밀번호 변경')}>
                        <View style={styles.boxLeftWrap}>
                            <CustomTextR style={styles.menuTitleText}>비밀번호 변경</CustomTextR>                           
                        </View>
                    </TouchableOpacity>
                    <View style={styles.boxWrap}>
                        <CustomTextM style={styles.mainTitleText}>기타</CustomTextM>
                    </View> 
                    <View style={styles.boxSubWrap}>
                        <View style={styles.boxLeftWrap}>
                            <View style={{flex:5}}>
                                <CustomTextR style={styles.menuTitleText}>푸시 알림</CustomTextR>    
                                <CustomTextR style={styles.menuTitleSubText}>알림받기</CustomTextR>                       
                            </View>
                            <View style={{flex:1,justifyContent:'flex-start',alignItems:'flex-end'}}>
                                <ToggleSwitch
                                    type={0}
                                    containerStyle={styles.ballWarp}
                                    backgroundColorOn='#ccc'
                                    backgroundColorOff='#ccc'
                                    circleStyle={styles.ballStyle}
                                    switchOn={this.state.switchOn1}
                                    onPress={()=> this.fn_onChangeToggle(!this.state.switchOn1)}
                                    circleColorOff={'#f7f7f7'}
                                    circleColorOn={DEFAULT_COLOR.base_color}
                                    duration={500}
                                />

                            </View>
                        </View>
                    </View> 
                    <TouchableOpacity 
                        style={styles.boxWrap}
                        onPress={()=>this.logout()}
                    >
                        <CustomTextM style={styles.mainTitleText}>로그아웃</CustomTextM>
                    </TouchableOpacity>
                </ScrollView>                
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
    mainTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)
    },
    boxWrap : {
        flex:1,
        flexDirection:'row',    
        flexGrow:1,    
        paddingHorizontal:20,paddingVertical:15,
        backgroundColor:'#f5f6f8',
        borderBottomWidth:1,
        borderBottomColor : DEFAULT_COLOR.input_border_color
    },
    boxSubWrap : {
        flex:1,
        flexDirection:'row',    
        flexGrow:1,    
        paddingHorizontal:20,paddingVertical:15,
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
    menuTitleSubText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),paddingRight:10,color:'#666'
    },
    ballWarp : {
        marginTop: 0,width: 50,height: 15,borderRadius: 10,padding:5,borderWidth:0.5,borderColor:'#ebebeb',
        ...Platform.select({
            ios: {
              shadowColor: "#ccc",
              shadowOpacity: 0.5,
              shadowRadius: 2,
              shadowOffset: {
                height: 0,
                width: 0.1
             }
           },
            android: {
              elevation: 5
           }
         })
    },
    ballStyle : {
        width: 24,height: 24,borderRadius: 12,backgroundColor:'#fff',
        
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
        },
        _saveNonUserToken:(str)=> {
            dispatch(ActionCreator.saveNonUserToken(str))
        }
    };
}


export default connect(mapStateToProps,mapDispatchToProps)(Tabs04Screen);
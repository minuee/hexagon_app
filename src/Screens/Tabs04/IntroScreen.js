import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Text,Dimensions,RefreshControl, PixelRatio,Image,TouchableOpacity,Alert} from 'react-native';
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

class IntroScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : false,
        }
    }

    UNSAFE_componentWillMount() {
      
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

    moveDetail = (nav,item) => {
        this.props.navigation.navigate(nav,{
            screenTitle:item
        })
    }

    moveChat = () => {
        this.props.navigation.navigate('ChatListStack')
    }

    logout = () => {
        Alert.alert(
            "헥사곤 로그아웃",      
            "정말로 로그아웃하시겠습니까?",
            [
                {text: '네', onPress: () => this.logoutAction()},
                {text: '아니오', onPress: () => console.log('Cancle')},
                
            ],
            { cancelable: true }
        ) 
    }

    logoutAction = () => {
        this.props._saveUserToken({});
        setTimeout(() => {
            this.props.navigation.popToTop();
        }, 500);
       
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
                        <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)}}>시스템관리</CustomTextM>
                    </View>  
                    <TouchableOpacity style={styles.boxSubWrap} onPress={()=>this.moveDetail('CategoryListStack','상품관리')}>
                        <View style={styles.boxLeftWrap}>
                            <CustomTextR style={styles.menuTitleText}>상품관리</CustomTextR>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.boxSubWrap} onPress={()=>this.moveDetail('MDProductListStack','상품관리(MD추천)')}>
                        <View style={styles.boxLeftWrap}>
                            <CustomTextR style={styles.menuTitleText}>상품관리(MD추천)</CustomTextR>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.boxSubWrap} onPress={()=>this.moveDetail('EventListStack','이벤트관리')}>
                        <View style={styles.boxLeftWrap}>
                            <CustomTextR style={styles.menuTitleText}>이벤트관리</CustomTextR>                           
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.boxSubWrap} onPress={()=>this.moveDetail('PopupAdminStack','팝업관리')}>
                        <View style={styles.boxLeftWrap}>
                            <CustomTextR style={styles.menuTitleText}>팝업관리</CustomTextR>                           
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.boxSubWrap} onPress={()=>this.moveDetail('BannerListStack','배너관리')}>
                        <View style={styles.boxLeftWrap}>
                            <CustomTextR style={styles.menuTitleText}>배너관리</CustomTextR>                           
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.boxSubWrap} onPress={()=>this.moveDetail('CouponListStack','쿠폰관리')}>
                        <View style={styles.boxLeftWrap}>
                            <CustomTextR style={styles.menuTitleText}>쿠폰관리</CustomTextR>                           
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.boxSubWrap} onPress={()=>this.moveDetail('NoticeListStack','공지관리')}>
                        <View style={styles.boxLeftWrap}>
                            <CustomTextR style={styles.menuTitleText}>공지관리</CustomTextR>                           
                        </View>
                        <View style={styles.boxRightWrap}>
                        </View>
                    </TouchableOpacity> 
                    <View style={styles.boxWrap}>
                        <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)}}>사원관리</CustomTextM>
                    </View>  
                    <TouchableOpacity style={styles.boxSubWrap} onPress={()=>this.moveDetail('SalesManListStack','영업사원관리')}>
                        <View style={styles.boxLeftWrap}>
                            <CustomTextR style={styles.menuTitleText}>영업사원관리</CustomTextR>                           
                        </View>
                        <View style={styles.boxRightWrap}>
                        </View>
                    </TouchableOpacity>  
                    <TouchableOpacity style={styles.boxWrap} onPress={()=>this.logout()}>
                        <View style={styles.boxLeftWrap}>
                            <CustomTextR style={styles.menuTitleText}>로그아웃</CustomTextR>                           
                        </View>
                        <View style={styles.boxRightWrap}>
                           
                        </View>
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


export default connect(mapStateToProps,mapDispatchToProps)(IntroScreen);
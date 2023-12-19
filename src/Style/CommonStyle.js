import {StyleSheet, Dimensions,PixelRatio} from 'react-native';

const {width: SCREEN_WIDTH,height : SCREEN_HEIGHT} = Dimensions.get("window");
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;

const CommonStyles = StyleSheet.create({    
    fontDefault : { color : '#222'},
    fontRed : { color : '#ff0000'},
    fontblack : { color : '#000000'},
    fontGray : { color : '#ccc'},
    fontTheme : { color : '#28a5ce'},
    
    fontStrike : {
        textDecorationLine: 'line-through', textDecorationStyle: 'solid'
    },
    //해더 탭스
    headerTapsWrap : {
        marginTop:10,paddingHorizontal:15,flexDirection:'row',width:SCREEN_WIDTH,borderBottomColor:'#ccc',borderBottomWidth:0.5
    },
    headerTabpWidth : {
        flex:1,maxWidth:100,alignItems:'center',paddingVertical:10
    },
    headerTabsBottomLine : {
        position:'absolute',bottom:0,left:0,height:2,width:'100%',backgroundColor:DEFAULT_COLOR.base_color,zIndex:10
    },
    //scroll
    scrollViewDefault : {
        width:'100%',minHeight:SCREEN_HEIGHT-DEFAULT_CONSTANTS.BottomHeight
    },

    //etc 
    checkboxIcon : {
        width : PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize22),height:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize22)
    },
    fullWidthImage : {
        width:'95%',aspectRatio:1
    },
    emptyWrap : {
        flex:1,justifyContent:'center',alignItems:'center',paddingVertical:20,backgroundColor:'#fff',
    },
    //검색폼
    searchFormWrap : {
        //backgroundColor:'#c2c2c2',paddingVertical:10,paddingHorizontal:10,flexDirection:'row',height:65
       paddingVertical:10,paddingHorizontal:10,flexDirection:'row',height:65
    },
    searchinputContainer : {
        borderWidth:1,
        //borderColor:'#808080',
        borderColor:'#ebebeb',
        borderRadius:0,backgroundColor:'#fff',margin:0,padding:0,height:45
    },
    searchinput : {
        margin:0,paddingLeft: 10,color: '#a4a4a4',fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize17)
    },
    searchLeftIcon : {
        paddingLeft:15
    },
    searchrightIconContainer : {
        backgroundColor:'#808080',height:45
    },
    searchrightIconContainerOn : {
        backgroundColor:DEFAULT_COLOR.base_color,height:45
    },
    //테이블
    blankWrap : {
        flex:1,    
        paddingVertical:50,
        justifyContent:'center',
        alignItems:'center'
    },
    nullDataWrap :{ 
        marginHorizontal:15,paddingVertical:25,borderTopWidth:1,borderTopColor:'#ccc',borderBottomWidth:1,borderBottomColor:'#ccc'
    },
    titleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#000'
    },
    dataText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#545454'
    },
    dataText2 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#4780fd'
    },
    priceText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11),color:'#333'
    },
    priceText545454 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11),color:'#545454'
    },
    requiredText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize20),color:'#f64444'
    },
    requiredText2 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#f64444'
    },
    titleWrap : {
        paddingHorizontal:15,paddingVertical:10,marginTop:10,flexDirection:'row'
    },
    //select form
    selectBoxText  : {
        color:DEFAULT_COLOR.base_color_666,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),lineHeight: DEFAULT_TEXT.fontSize20 * 1,
    },
    unSelectedBox : {
        borderRadius:5,borderWidth:1,borderColor:DEFAULT_COLOR.input_border_color,paddingVertical:5,paddingHorizontal:10,backgroundColor:'#fff'
    },
    selecterBoxText : {
        color: DEFAULT_COLOR.base_color_666,
                                            fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14)
    },
    selectBackground : {
        backgroundColor:'#eee'
    },
    defaultBackground : {
        backgroundColor:'#f8f8f8'
    },

    //defautll form
    defaultOneWayForm : {
        height:40 ,width:'100%',paddingLeft: 5,textAlignVertical: 'center',textAlign:'left',fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13)
    },
    defaultOneWayFormAlignRight : {
        height:35,width:'100%',paddingRight: 5,textAlignVertical: 'center',textAlign:'right',fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13)
    },


    blankArea : {
        flex:1,height:100,backgroundColor:'#fff'
    },
    moreWrap : {
        flex:1,paddingVertical:10,alignItems:'center',justifyContent:'center'
    },
    defaultIconImage : {
        width:PixelRatio.roundToNearestPixel(25),height:PixelRatio.roundToNearestPixel(25)
    },
    defaultIconImage20 : {
        width:PixelRatio.roundToNearestPixel(20),height:PixelRatio.roundToNearestPixel(20)
    },
    defaultImage40 : {
        width:PixelRatio.roundToNearestPixel(40),height:PixelRatio.roundToNearestPixel(40)
    },
    defaultIconImage55 : {
        width:PixelRatio.roundToNearestPixel(55),height:PixelRatio.roundToNearestPixel(55)
    },
    defaultIconImage60 : {
        width:PixelRatio.roundToNearestPixel(60),height:PixelRatio.roundToNearestPixel(60)
    },
    defaultImage97 : {
        width:PixelRatio.roundToNearestPixel(97),height:PixelRatio.roundToNearestPixel(97)
    },
    defaultBannerImage : {
        width:SCREEN_WIDTH-100,height:(SCREEN_WIDTH-100)/4*3
    },

    //more button
    moreButtonWrap : {
        flex:1,marginTop:10,justifyContent:'center',alignItems:'center',marginBottom:20
    },
    moreButton : {
        paddingVertical:5,paddingHorizontal:15,justifyContent:'center',alignItems:'center',
        borderWidth:1,borderColor:'#ccc',borderRadius:5,backgroundColor:DEFAULT_COLOR.input_bg_color
    },
 
    moreText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),paddingRight:10
    },
    //screen footer common 
    scrollFooterWrap : {
        position:'absolute',right:0,bottom:0,width:SCREEN_WIDTH,height:DEFAULT_CONSTANTS.BottomHeight,justifyContent:'center',alignItems:'center',flexDirection:'row'
    },
    scrollFooterLeftWrap : {
        flex:1,height:DEFAULT_CONSTANTS.BottomHeight,backgroundColor:DEFAULT_COLOR.base_color,justifyContent:'center',alignItems:'center'
    },
    scrollFooterRightWrap : {
        flex:1,height:DEFAULT_CONSTANTS.BottomHeight,backgroundColor:'#ccc',justifyContent:'center',alignItems:'center'
    },
    scrollFooterText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#fff'
    },
    subHeaderRightWrap : {
        flex:1,flexGrow:1,justifyContent:'center',alignItems:'center',paddingHorizontal:20,zIndex:100
    },
    bottomButtonWrap : {
        position:'absolute',left:0,bottom:0,width:SCREEN_WIDTH,backgroundColor:DEFAULT_COLOR.base_color,justifyContent:'center',alignItems:'center',flexDirection:'row',borderTopWidth:1, borderTopColor:DEFAULT_COLOR.base_color,borderBottomWidth:1, borderBottomColor:DEFAULT_COLOR.base_color
    },
    bottomLeftBox : {
        flex:1,backgroundColor:DEFAULT_COLOR.base_color,justifyContent:'center',alignItems:'center',paddingVertical:20
    },
    bottomRightBox : {
        flex:1,backgroundColor:'#fff',justifyContent:'center',alignItems:'center',paddingVertical:20
    },
    bottomMenuOnText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.base_color
    },
    bottomMenuOffText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#fff'
    },
    //stack form
    backButtonWrap : {
        width: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23), height: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23)
    },
    stackHeaderCenterWrap : {
        flex:1,flexGrow:1,justifyContent:'center',alignItems:'center',
    },
    stackHeaderCenterText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.base_color_000
    },
    stackHeaderLeftWrap : {
        flex:1,flexGrow:1,paddingLeft:25,justifyContent:'center',alignItems:'center'
    },
    stackHeaderRightWrap : {
        flex:1,flexGrow:1,justifyContent:'center',paddingRight:15
    },
})

export default CommonStyles;
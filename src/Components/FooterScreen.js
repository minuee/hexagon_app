import React, {Component} from 'react';
import {StyleSheet, Text, View,PixelRatio,Dimensions, Platform} from 'react-native';
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;

import {CustomTextR,CustomTextL, CustomTextB, CustomTextM, TextRobotoM,TextRobotoR} from '../Components/CustomText';
import CommonUtil from '../Utils/CommonUtil';
import CommonFunction from '../Utils/CommonFunction';

export default class FooterScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            contentHeight : 100,
        }
        
    } 
      
    UNSAFE_componentWillMount() {
        console.log('this.props.contentHeight3',this.props.contentHeight)
        if ( !CommonUtil.isEmpty(this.props.contentHeight) ) {
            if ( this.props.contentHeight < 0 ) {
                this.setState({
                    contentHeight : 100
                })
            }else{
                this.setState({
                    contentHeight : this.props.contentHeight
                })    
            }
        }else{
            //this.setState({contentHeight : 50})
        }
    }
    render() {
        return (
            <View style={[styles.container,CommonUtil.isEmpty(this.state.contentHeight) ? null : {marginTop:this.state.contentHeight}]}>
                 <View style={{flex:1,marginHorizontal:20,paddingVertical:20,alignItems:'center',justifyContent:'center'}}>
                    <CustomTextL style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11),color:'#555'}}>
                        {DEFAULT_CONSTANTS.CompanyInfoTitle}
                    </CustomTextL>
                    <CustomTextL style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11),color:'#555'}}>
                        사업자등록번호 {DEFAULT_CONSTANTS.CompanyInfoRegistCode}
                    </CustomTextL>
                    <CustomTextL style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11),color:'#555'}}>
                        통신판매업신고증 {DEFAULT_CONSTANTS.CompanyInfoRegistCode2}
                    </CustomTextL>
                    <CustomTextL style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11),color:'#555'}}>
                        대표이사 : {DEFAULT_CONSTANTS.CompanyInfoCEO}
                    </CustomTextL>
                    <CustomTextL style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11),color:'#555'}}>
                        주소 : {DEFAULT_CONSTANTS.CompanyInfoAddress}
                        </CustomTextL>
                    <CustomTextL style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11),color:'#555'}}>
                        대표번호 : {DEFAULT_CONSTANTS.CompanyInfoTel}
                    </CustomTextL>                            
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        padding:10,
        backgroundColor:'#efefef',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    linkWrap : {
        flex:1,
        backgroundColor :'transparent',
        flexDirection :'row',
        paddingVertical:10,
        marginBottom:20,
        zIndex:100
    },
    linkText : {
        color:'#fff',
        fontSize:15
    },
    infoText :  {
        color:'#555',fontSize:13,textAlign: 'center',alignItems: 'center'
    },
    paddingh5 : {
        paddingHorizontal : 5
    }
});
import React, { Component } from 'react';
import {SafeAreaView,Image as NativeImage,View,StyleSheet,PixelRatio,Dimensions,TouchableOpacity,ScrollView,Alert,Platform} from 'react-native';
import 'moment/locale/ko'
import  moment  from  "moment";
import Modal from 'react-native-modal';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import ImagePicker from 'react-native-image-picker';
import ImageViewer from 'react-native-image-zoom-viewer';
import {Input,CheckBox} from 'react-native-elements';
import Image from 'react-native-image-progress';
//공통상수 필요에 의해서 사용
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import CommonStyle from '../../Style/CommonStyle';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {CustomTextR,CustomTextL, CustomTextB, CustomTextM, TextRobotoM,TextRobotoR,DropBoxSearchIcon} from '../../Components/CustomText';
import CommonFunction from '../../Utils/CommonFunction';
import CommonUtil from '../../Utils/CommonUtil';
import Loader from '../../Utils/Loader';
import SelectSearch from "../../Utils/SelectSearch";
import { apiObject } from "../Apis";

const RADIOON_OFF = require('../../../assets/icons/check_off.png');
const RADIOON_ON = require('../../../assets/icons/check_on.png');
const currentDate =  moment().unix();

import firestore from '@react-native-firebase/firestore';

class MemberInfoScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : true,
            showModal : false,
            formMemberPk : 0,
            formUserID : '',
            formCeoName : null,
            formCompanyEmail : null,
            formCompanyName : null,
            formCompanyTel : null,
            formBusinessCondition : null,
            formBusinessSector : null,
            formBusinessAddress : null,
            formRecommUserCode : null,
            formSalesManCode : 0,
            formSalesManName : null,
            oldSalesManCode : null,
            TextUserCode : "",
            textRecommCode : "",
            textRecommName : "",
            textUserGrade : "Bronze",
            textRegDate : currentDate,
            formUseYN : false,
            formApproval : 0,
            formIsApproval : false,
            formnowApproval : false,
            formOriginApprovalReject : null,
            formApprovalReject : null,

            thumbnail_img : null,
            newImage : null,
            
            thumbnail_img2 : null,
            newImage2 : null,
            
            thumbnail_img3 : null,
            newImage3 : null,
            
            salesmanList : [],
            
            thisImages : [],
            imageIndex: 0,
            isImageViewVisible: false,
        }
    }

    setSortData = async(arr) => {
        let formSalesManCode = this.state.formSalesManCode
        let newData = [
            {id : 0,member_pk : 1,name : '관리자', code : 'A001',checked : formSalesManCode === 'A001' ? true : false}
        ]
        await arr.forEach(function(element,index,array){     
            newData.push({id : index+1,member_pk : element.member_pk,name : element.name + "(" + element.special_code + ")" , code : element.special_code,checked : formSalesManCode === element.special_code ? true : false})
        }); 
        this.setState({
            salesmanList :  newData
        })
    }
    getSalemanList = async() => {
        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/salesman/list';
            
            const token = this.props.userToken.apiToken;            
            returnCode = await apiObject.API_getDetailDefault(this.props,url,token);
            if ( returnCode.code === '0000'  ) {
                this.setSortData(returnCode.data.salesmanList)
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다1.',1000);
                setTimeout(
                    () => {
                       this.props.navigation.goBack(null);
                    },1000
                )
            }
            this.setState({moreLoading:false,loading:false})
        }catch(e){            
            this.setState({loading:false,moreLoading : false})
            CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다2.',1000);
            setTimeout(
                () => {            
                    this.props.navigation.goBack(null);
                },1000
            )
        }
    }

    getBaseData = async(member_pk) => {
        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/member/view/' + member_pk ;
            const token = this.props.userToken.apiToken;            
            returnCode = await apiObject.API_getDetailDefault(this.props,url,token);
            if ( returnCode.code === '0000'  ) {
                this.setState({
                    formMemberPk : member_pk,
                    formUserID : returnCode.data.userDetail.user_id,
                    formCeoName : returnCode.data.userDetail.company_ceo,
                    formCompanyEmail : CommonFunction.fn_dataDecode(returnCode.data.userDetail.email),
                    formCompanyName : returnCode.data.userDetail.name,
                    formCompanyTel : CommonFunction.fn_dataDecode(returnCode.data.userDetail.phone),
                    formBusinessCondition : returnCode.data.userDetail.company_type,
                    formBusinessSector : returnCode.data.userDetail.company_class,
                    formBusinessAddress : returnCode.data.userDetail.company_address,
                    formSalesManCode : returnCode.data.userDetail.salesman_code,
                    oldSalesManCode: returnCode.data.userDetail.salesman_code,
                    formSalesManName : returnCode.data.userDetail.salesman_name,
                    TextUserCode : returnCode.data.userDetail.special_code,
                    textRecommCode : returnCode.data.userDetail.recomm_code,
                    textRecommName : returnCode.data.userDetail.recomm_name,
                    formUseYN : returnCode.data.userDetail.use_yn,
                    formIsApproval : !CommonUtil.isEmpty(returnCode.data.userDetail.approval_dt) ? true : false,
                    formnowApproval : !CommonUtil.isEmpty(returnCode.data.userDetail.approval_dt) ? true : false,
                    formApprovalReject : returnCode.data.userDetail.approval_reject,
                    formOriginApprovalReject: returnCode.data.userDetail.approval_reject,
                    formApproval : returnCode.data.userDetail.approval_dt,
                    textUserGrade : returnCode.data.userDetail.grade_name,
                    textRegDate : returnCode.data.userDetail.reg_dt,
                    thumbnail_img : returnCode.data.userDetail.img_url,
                    thumbnail_img2 : returnCode.data.userDetail.img2_url,
                    thumbnail_img3 : returnCode.data.userDetail.img3_url,
                    gradeStart : returnCode.data.userDetail.grade_start,
                    gradeEnd : returnCode.data.userDetail.grade_end
                })
               
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다1.',1000);
                setTimeout(
                    () => {            
                       this.props.navigation.goBack(null);
                    },1000
                )
            }
            this.setState({moreLoading:false,loading:false})
        }catch(e){            
            this.setState({loading:false,moreLoading : false})
            CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다2.',1000);
            setTimeout(
                () => {            
                    this.props.navigation.goBack(null);
                },1000
            )
        }
    }
    
    async UNSAFE_componentWillMount() {        
        if ( !CommonUtil.isEmpty(this.props.extraData.params.screenData)) {
            await this.getBaseData(this.props.extraData.params.screenData.member_pk);
            await this.getSalemanList();
        }else{
            CommonFunction.fn_call_toast('잘못된 접근입니다.',1000);
            setTimeout(
                () => {            
                   this.props.navigation.goBack(null);
                },1000
            )
        }
    }

    componentDidMount() {            
    }
    UNSAFE_componentWillUnmount() { 
    }
   
    selectFilter = async(mode,filt) => {
        switch(mode) {           
            case 'salesman' : 
                this.setState({
                    formSalesManCode:this.state.salesmanList[filt.id].code                
                });break;
            default : console.log('');
        }
    }

    localcheckfile = () => {
        const options = {
            noData: true,
            privateDirectory: true,
            title : '이미지 선택',
            takePhotoButtonTitle : '카메라 찍기',
            chooseFromLibraryButtonTitle:'이미지 선택',
            cancelButtonTitle : '취소'
        }
        ImagePicker.showImagePicker(options, response => {
            try {
                if( response.type.indexOf('image') != -1) {
                    if (response.uri) {                        
                        if ( parseInt((response.fileSize)/1024/1024) >= 5 ) {
                            CommonFunction.fn_call_toast('이미지 용량이 5MB를 초과하였습니다',2000)
                            return;
                        }else{
                            let fileName = response.fileName;
                            if ( CommonUtil.isEmpty(fileName)) {
                                let spotCount = response.uri.split('.').length-1;
                                let pathExplode = response.uri.split('.') 
                                fileName = Platform.OS + moment().unix() + '.'+pathExplode[spotCount];
                            }
                            this.setState({
                                thumbnail_img : response.uri,
                                newImage : {
                                    type : response.type === undefined ? 'image/jpeg' :  response.type,
                                    uri : response.uri, 
                                    size:response.fileSize,
                                    name:fileName
                                }
                            })
                        }
                    }
                }else{
                    CommonFunction.fn_call_toast('정상적인 이미지 파일이 아닙니다.',2000)
                    return;
                }
            }catch(e){
                //console.log("eerorr ", e)        
            }
        })
    }

    localcheckfile2 = () => {
        const options = {
            noData: true,
            privateDirectory: true,
            title : '이미지 선택',
            takePhotoButtonTitle : '카메라 찍기',
            chooseFromLibraryButtonTitle:'이미지 선택',
            cancelButtonTitle : '취소'
        }
        ImagePicker.showImagePicker(options, response => {
            try {
                if( response.type.indexOf('image') != -1) {
                    if (response.uri) {                        
                        if ( parseInt((response.fileSize)/1024/1024) >= 5 ) {
                            CommonFunction.fn_call_toast('이미지 용량이 5MB를 초과하였습니다',2000)
                            return;
                        }else{
                            let fileName = response.fileName;
                            if ( CommonUtil.isEmpty(fileName)) {
                                let spotCount = response.uri.split('.').length-1;
                                let pathExplode = response.uri.split('.') 
                                fileName = Platform.OS + moment().unix() + '.'+pathExplode[spotCount];
                            }
                            this.setState({
                                thumbnail_img2 : response.uri,
                                newImage2 : {
                                    type : response.type === undefined ? 'image/jpeg' :  response.type,
                                    uri : response.uri, 
                                    size:response.fileSize,
                                    name:fileName
                                }
                            })
                        }
                    }
                }else{
                    CommonFunction.fn_call_toast('정상적인 이미지 파일이 아닙니다.',2000)
                    return;
                }
            }catch(e){
                //console.log("eerorr ", e)        
            }
        })
    }

    localcheckfile3 = () => {
        const options = {
            noData: true,
            privateDirectory: true,
            title : '이미지 선택',
            takePhotoButtonTitle : '카메라 찍기',
            chooseFromLibraryButtonTitle:'이미지 선택',
            cancelButtonTitle : '취소'
        }
        try {
            ImagePicker.showImagePicker(options, response => {           
                if( response.type.indexOf('image') != -1) {
                    if (response.uri) {                        
                        if ( parseInt((response.fileSize)/1024/1024) >= 5 ) {
                            CommonFunction.fn_call_toast('이미지 용량이 5MB를 초과하였습니다',2000)
                            return;
                        }else{
                            let fileName = response.fileName;
                            if ( CommonUtil.isEmpty(fileName)) {
                                let spotCount = response.uri.split('.').length-1;
                                let pathExplode = response.uri.split('.') 
                                fileName = Platform.OS + moment().unix() + '.'+pathExplode[spotCount];
                            }
                            this.setState({
                                thumbnail_img3 : response.uri,
                                newImage3 : {
                                    type : response.type === undefined ? 'image/jpeg' :  response.type,
                                    uri : response.uri, 
                                    size:response.fileSize,
                                    name:fileName
                                }
                            })
                        }
                    }
                }else{
                    CommonFunction.fn_call_toast('정상적인 이미지 파일이 아닙니다.',2000)
                    return;
                }            
            })
        }catch(e){
            console.log("eerorr ", e)        
        }
    }

    removeMembers = async() => {
        Alert.alert(
            DEFAULT_CONSTANTS.appName,
            "선택하신 회원을 삭제하시겠습니까?",
            [
                {text: '네', onPress: () =>  this.actionRemoveMembers()},
                {text: '아니오', onPress: () => console.log('Cancle')}
            ],
            { cancelable: true }
        )  
    }

    actionRemoveMembers = async() => {

        this.setState({moreLoading:true}) 
        let returnCode = {code:9998};     
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/member/array_remove';         
            const token = this.props.userToken.apiToken;
            let sendData = {
                member_array : [{ member_pk : this.state.formMemberPk }]
            }            
            returnCode = await apiObject.API_updateCommon(this.props,url,token,sendData);
            console.log('returnCode',returnCode)
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
    }

    updateData = () => {        
        if ( CommonUtil.isEmpty(this.state.formBusinessSector)) {
            CommonFunction.fn_call_toast('업종을 입력해주세요',2000);return true;  
        }else if ( CommonUtil.isEmpty(this.state.formBusinessCondition)) {
            CommonFunction.fn_call_toast('업태를 입력해주세요',2000);return true;    
        }else if ( CommonUtil.isEmpty(this.state.formBusinessAddress)) {
            CommonFunction.fn_call_toast('회사주소정보를 입력해주세요',2000);return true;  
        }else if ( CommonUtil.isEmpty(this.state.formCeoName)) {
            CommonFunction.fn_call_toast('대표자명을 입력해주세요',2000);return true;  
        }else if ( CommonUtil.isEmpty(this.state.formCompanyEmail)) {
            CommonFunction.fn_call_toast('이메일를 입력해주세요',2000);return true;  
        }else if ( CommonUtil.isEmpty(this.state.formCompanyTel)) {
            CommonFunction.fn_call_toast('연락처를 입력해주세요',2000);return true;   
        }else if ( this.state.formIsApproval ==  false &&  CommonUtil.isEmpty(this.state.formApprovalReject)) {
            CommonFunction.fn_call_toast('보류 사유를 입력해주세요',2000);return true;        
        }else{
           this.actionOrder()
        }
    }

   
    actionOrder = async() => {
        Alert.alert(
            DEFAULT_CONSTANTS.appName,
            "회원정보를 수정하시겠습니까?",
            [
                {text: '네', onPress: () =>  this.registData()},
                {text: '아니오', onPress: () => console.log('Cancle')}
            ],
            { cancelable: true }
        )  
    }

    registData = async() => {

        this.setState({moreLoading:true})
        
        let  thumbnail_new = {data:null};
        if ( !CommonUtil.isEmpty(this.state.newImage)) {
            try {
                thumbnail_new = await CommonUtil.SingleImageUpload(this.props.userToken.apiToken,this.state.newImage,'etc');
            }catch(e) {
                this.setState({loading:false,moreLoading : false})
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.',2000);
                return;
            }
        }  
        let  thumbnail_new2 = {data:null};
        if ( !CommonUtil.isEmpty(this.state.newImage2)) {
            try {
                thumbnail_new2 = await CommonUtil.SingleImageUpload(this.props.userToken.apiToken,this.state.newImage2,'etc');
            }catch(e) {
                this.setState({loading:false,moreLoading : false})
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.',2000);
                return;
            }
        }  
        let  thumbnail_new3 = {data:null};
        if ( !CommonUtil.isEmpty(this.state.newImage3)) {
            try {
                thumbnail_new3 = await CommonUtil.SingleImageUpload(this.props.userToken.apiToken,this.state.newImage3,'etc');
            }catch(e) {
                this.setState({loading:false,moreLoading : false})
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.',2000);
                return;
            }
        }        
        let returnCode = {code:9998};     
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/member/modify/' + this.state.formMemberPk;         
            const token = this.props.userToken.apiToken;
            let md5Tel = CommonFunction.fn_dataEncode(this.state.formCompanyTel.replace("-",""));
            let md5Email = CommonFunction.fn_dataEncode(this.state.formCompanyEmail);
            let sendData = {
                company_type : this.state.formBusinessCondition,
                company_class : this.state.formBusinessSector,
                company_address : this.state.formBusinessAddress,
                company_zipcode : null,
                company_ceo : this.state.formCeoName,
                company_phone : md5Tel,
                email : md5Email,
                use_yn : this.state.formUseYN,
                is_approval :  this.state.formnowApproval,
                new_approval :  this.state.formIsApproval,
                approval_reject :  this.state.formApprovalReject,
                isnew_approval_reject :  this.state.formOriginApprovalReject != this.state.formApprovalReject ? true : false,
                img_url : !CommonUtil.isEmpty(thumbnail_new.data) ? thumbnail_new.data : this.state.thumbnail_img,
                img2_url : !CommonUtil.isEmpty(thumbnail_new2.data) ? thumbnail_new2.data : this.state.thumbnail_img2,
                img3_url : !CommonUtil.isEmpty(thumbnail_new3.data) ? thumbnail_new3.data : this.state.thumbnail_img3,
                agent_code : this.state.formSalesManCode,
                is_newSalesman : this.state.formSalesManCode != this.state.oldSalesManCode
            }            
            console.log('sendData',sendData)
            returnCode = await apiObject.API_updateCommon(this.props,url,token,sendData);
            console.log('returnCode',returnCode)
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
        
        
    }

    setImages = async(data) => {
        let selectedFilterCodeList = [];   
        await data.forEach(function(element,index,array){            
            selectedFilterCodeList.push({url:element.url,freeHeight:true});
        });

        return selectedFilterCodeList;
    }
    setImageGallery = async( data, idx ) => {
        if ( data.length > 0 ) {
            let returnArray = await this.setImages(data)
            this.setState({
                imageIndex: idx-1,
                thisImages : returnArray
            })
            this.setState({isImageViewVisible: true})
        }
    }

    moveChat = async() => {
       
        const formUserID = this.state.formUserID;
        const roomName = this.state.formCompanyName;       
        if ( !CommonUtil.isEmpty(formUserID) && !CommonUtil.isEmpty(roomName) ) {            
            let checkId = null;
            await firestore().collection('THREADS').where('userId','==', formUserID).get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    if ( !CommonUtil.isEmpty(doc.id)) {
                        checkId =  doc.id;
                    }
                });
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
            if ( !CommonUtil.isEmpty(checkId)) {
                this.props.navigation.navigate('ChatStack', {
                    uid : this.props.userToken.user_id , email : CommonFunction.fn_dataDecode(this.props.userToken.email) ,
                    uname : '관리자',
                    thread : {
                        _id : checkId
                    }
                })
                
            }else{
                if ( checkId !== undefined ) {
                    firestore().collection('THREADS')
                    .add({
                        name: roomName,
                        userId : formUserID,
                        latestMessage: {
                            text: `${roomName}님과의 방이 개설되었습니다.`,
                            createdAt: new Date().getTime()
                        }
                    })
                    .then(docRef => {
                        docRef.collection('MESSAGES').add({
                            text: `${roomName}님과의 방이 개설되었습니다.`,
                            createdAt: new Date().getTime(),
                            system: true
                        });

                        this.props.navigation.navigate('ChatStack', {
                            uid : this.props.userToken.user_id , email : CommonFunction.fn_dataDecode(this.props.userToken.email) ,
                            uname : '관리자',
                            thread : {
                                _id : docRef.id
                            }
                        })
                    });
                }
            }
        }else{
            CommonFunction.fn_call_toast('필수정보[사업자번호,이름]이 없습니다.',2000);
        }
    }

    render() {
        const ImageFooter = ({ imageIndex, imagesCount }) => (
            <View style={styles.footerRoot}>
                <CustomTextL style={styles.footerText}>{`${imageIndex + 1} / ${imagesCount}`}</CustomTextL>
            </View>
        );
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
                    scrollEventThrottle={16}
                    keyboardDismissMode={'on-drag'}      
                    style={{width:'100%'}}
                >
                    <View style={[styles.mainTopWrap,{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}]}>
                        <CustomTextM style={styles.mainTopText}>사업자 정보</CustomTextM>
                        <TouchableOpacity 
                            onPress={()=>this.removeMembers()}
                            style={styles.smallButtonWarp}
                        >   
                            <CustomTextR style={styles.titleText3}>삭제</CustomTextR>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.middleWarp}>
                        <View style={[styles.middleDataWarp,{}]}>                            
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>상호명</CustomTextR>
                            </View>
                            <View style={styles.dataInputWrap}>
                                <Input   
                                    disabled={true}
                                    value={this.state.formCompanyName}
                                    placeholder="상호명을 입력하세요"
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                    inputContainerStyle={[styles.inputContainerStyle]}
                                    inputStyle={styles.inputStyle}
                                />
                            </View>                            
                        </View>
                        <View style={[styles.middleDataWarp,{}]}>                            
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>사업자등록번호</CustomTextR>
                            </View>
                            <View style={styles.dataInputWrap}>
                                <Input   
                                    disabled={true}
                                    value={this.state.formUserID}
                                    placeholder="숫자만입력)"
                                    keyboardType={'number-pad'}
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                    inputContainerStyle={styles.inputContainerStyle}
                                    inputStyle={styles.inputStyle}
                                />
                            </View>                            
                        </View>
                        <View style={styles.middleDataWarp}>
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>업종</CustomTextR>
                            </View>
                            <View style={styles.dataInputWrap}>
                                <Input  
                                    value={this.state.formBusinessSector}
                                    placeholder="사업자등록증을 참고하세요"
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                    inputContainerStyle={styles.inputContainerStyle}
                                    inputStyle={styles.inputStyle}
                                    //clearButtonMode={'always'}
                                    onChangeText={value => this.setState({formBusinessSector:value})}
                                />
                            </View>
                        </View>
                        <View style={styles.middleDataWarp}>
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>업태</CustomTextR>
                            </View>
                            <View style={styles.dataInputWrap}>
                                <Input  
                                    value={this.state.formBusinessCondition}
                                    placeholder="사업자등록증을 참고하세요"
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                    inputContainerStyle={styles.inputContainerStyle}
                                    inputStyle={styles.inputStyle}
                                    onChangeText={value => this.setState({formBusinessCondition:value})}
                                />
                            </View>
                        </View>
                        <View style={styles.middleDataWarp}>
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>주소</CustomTextR>
                            </View>
                            <View style={styles.dataInputWrap}>
                                <Input   
                                    value={this.state.formBusinessAddress}
                                    placeholder="사업장 주소입력"
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                    inputContainerStyle={styles.inputContainerStyle}
                                    inputStyle={styles.inputStyle}
                                    onChangeText={value => this.setState({formBusinessAddress:value})}

                                />
                            </View>
                        </View>                       
                    </View>

                    <View style={styles.mainTopWrap}>
                        <CustomTextM style={styles.mainTopText}>대표자 정보</CustomTextM>
                    </View>
                    <View style={styles.middleWarp}>
                        <View style={[styles.middleDataWarp,{}]}>                            
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>대표자명</CustomTextR>
                            </View>
                            <View style={styles.dataInputWrap}>
                                <Input   
                                    value={this.state.formCeoName}
                                    placeholder="대표자명을 입력하세요"
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                    inputContainerStyle={[styles.inputContainerStyle]}
                                    inputStyle={styles.inputStyle}
                                    onChangeText={value => this.setState({formCeoName:value})}
                                />
                            </View>                            
                        </View>
                        <View style={[styles.middleDataWarp,{}]}>                            
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>전화번호</CustomTextR>
                            </View>
                            <View style={styles.dataInputWrap}>
                                <Input   
                                    value={this.state.formCompanyTel}
                                    placeholder="회원가입 인증전화 받을 전화번호 입력"
                                    keyboardType={'number-pad'}
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                    inputContainerStyle={styles.inputContainerStyle}
                                    inputStyle={styles.inputStyle}
                                    onChangeText={value => this.setState({formCompanyTel:value})}
                                />
                            </View>                            
                        </View>
                        <View style={styles.middleDataWarp}>
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>대표자 E-mail</CustomTextR>
                            </View>
                            <View style={styles.dataInputWrap}>
                                <Input   
                                    keyboardType={'email-address'}
                                    value={this.state.formCompanyEmail}
                                    placeholder="계산서발행 확인용 이메일을 입력하세요"
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                    inputContainerStyle={styles.inputContainerStyle}
                                    inputStyle={styles.inputStyle}   
                                    onChangeText={value => this.setState({formCompanyEmail:value})}
                                />
                            </View>
                        </View>                                        
                    </View>

                    <View style={styles.mainTopWrap}>
                        <CustomTextM style={styles.mainTopText}>유저 정보</CustomTextM>
                    </View>
                    <View style={styles.middleWarp}>
                        <View style={[styles.middleDataWarp,{flexDirection:'row'}]}>                            
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>관리코드</CustomTextR>
                            </View>
                            <View style={styles.dataInputWrap2}>
                                <CustomTextR style={styles.dataText}>{this.state.TextUserCode}</CustomTextR>
                            </View> 
                        </View>  
                        <View style={[styles.middleDataWarp,{flexDirection:'row'}]}>                            
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>추천인코드</CustomTextR>
                            </View>
                            <View style={styles.dataInputWrap2}>
                                {
                                    !CommonUtil.isEmpty(this.state.textRecommName) &&
                                    <CustomTextR style={styles.dataText}>{this.state.textRecommName}({this.state.textRecommCode})</CustomTextR>
                                }
                            </View> 
                        </View> 
                        <View style={[styles.middleDataWarp,{flexDirection:'row'}]}>
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>가입일자</CustomTextR>
                            </View>
                            <View style={styles.dataInputWrap2}>
                                <CustomTextR style={styles.dataText}>
                                {CommonFunction.convertUnixToDate(this.state.textRegDate,"YYYY.MM.DD")}
                                {/*moment.unix(this.state.textRegDate).format("YYYY.MM.DD")}*/}
                            </CustomTextR>
                            </View>  
                        </View> 
                        <View style={[styles.middleDataWarp,{flexDirection:'row'}]}>                         
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>승인</CustomTextR>
                            </View>
                            { 
                                !CommonUtil.isEmpty(this.state.formApproval) ?
                                <View style={styles.dataInputWrap3}>                       
                                    <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#808080'}}>승인 {moment.unix(this.state.formApproval).format("YYYY.MM.DD")}</CustomTextM>
                                </View>
                                :
                                <View style={styles.dataInputWrap3}>
                                    <CheckBox 
                                        containerStyle={{padding:0,margin:0}}   
                                        iconType={'FontAwesome'}
                                        checkedIcon={<NativeImage source={RADIOON_ON} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                        uncheckedIcon={<NativeImage source={RADIOON_OFF} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                        checkedColor={DEFAULT_COLOR.base_color}                          
                                        checked={this.state.formIsApproval}
                                        size={PixelRatio.roundToNearestPixel(15)}                                    
                                        onPress={() => this.setState({formIsApproval:true})}
                                    />                           
                                    <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),color:'#808080'}}>승인</CustomTextM>
                                    <CheckBox 
                                        containerStyle={{padding:0,margin:0}}   
                                        iconType={'FontAwesome'}
                                        checkedIcon={<NativeImage source={RADIOON_ON} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                        uncheckedIcon={<NativeImage source={RADIOON_OFF} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                        checkedColor={DEFAULT_COLOR.base_color}                          
                                        checked={!this.state.formIsApproval}
                                        size={PixelRatio.roundToNearestPixel(15)}                                    
                                        onPress={() => this.setState({formIsApproval:false})}
                                    />                           
                                    <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),color:'#808080'}}>보류</CustomTextM>
                                </View>  
                            }
                        </View> 
                        { 
                            !this.state.formIsApproval &&
                            <View style={[styles.middleDataWarp,{height:45,margin:0,padding:0,marginTop:5}]}>
                               
                                <View style={[styles.dataInputWrap2,{paddingLeft:0}]}>
                                    <Input   
                                        value={this.state.formApprovalReject}
                                        placeholder="보류 사유를을 입력하세요(최대20자)"
                                        maxLength={25}
                                        placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                        inputContainerStyle={[styles.inputContainerStyle,{height:35,marginTop:5}]}
                                        inputStyle={styles.inputStyle}
                                        onChangeText={value => this.setState({formApprovalReject:value.trim()})}
                                    />
                                </View>  
                            </View> 
                        }
                        { 
                            !CommonUtil.isEmpty(this.state.formApproval) &&
                            <View style={[styles.middleDataWarp,{flexDirection:'row'}]}>                        
                                <View style={styles.titleWrap}>
                                    <CustomTextR style={styles.titleText}>상태</CustomTextR>
                                </View>
                                <View style={styles.dataInputWrap3}>   
                                    <CheckBox 
                                        containerStyle={{padding:0,margin:0}}   
                                        iconType={'FontAwesome'}
                                        checkedIcon={<NativeImage source={RADIOON_ON} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                        uncheckedIcon={<NativeImage source={RADIOON_OFF} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                        checkedColor={DEFAULT_COLOR.base_color}                          
                                        checked={this.state.formUseYN}
                                        size={PixelRatio.roundToNearestPixel(15)}                                    
                                        onPress={() => this.setState({formUseYN:!this.state.formUseYN})}
                                    />                           
                                    <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#808080'}}>사용중</CustomTextM>
                                    <CheckBox 
                                        containerStyle={{padding:0,margin:0}}   
                                        iconType={'FontAwesome'}
                                        checkedIcon={<NativeImage source={RADIOON_ON} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                        uncheckedIcon={<NativeImage source={RADIOON_OFF} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                        checkedColor={DEFAULT_COLOR.base_color}                          
                                        checked={!this.state.formUseYN}
                                        size={PixelRatio.roundToNearestPixel(15)}                                    
                                        onPress={() => this.setState({formUseYN:!this.state.formUseYN})}
                                    />                           
                                    <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#808080'}}>사용중지</CustomTextM>
                                </View>  
                            </View>
                        }
                        { 
                            !CommonUtil.isEmpty(this.state.formApproval) && 
                            <View style={[styles.middleDataWarp,{flexDirection:'row',paddingVertical:5}]}>                        
                                <View style={styles.titleWrap}>
                                    <CustomTextR style={styles.titleText}>등급</CustomTextR>
                                </View>
                                <View style={styles.dataInputWrap2}>
                                    <CustomTextR style={CommonStyle.dataText}>{this.state.textUserGrade}</CustomTextR>
                                    <CustomTextR style={CommonStyle.dataText}>기간 ({this.state.gradeStart}~{this.state.gradeEnd})</CustomTextR>
                                </View>  
                            </View>   
                        }                                                       
                    </View>

                    <View style={[styles.middleWarp,{alignItems:'center'}]}>
                        <View style={[styles.middleDataWarp,{borderBottomWidth:0}]}>
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>사업자 등록증</CustomTextR>
                            </View>
                        </View>  
                        {
                            !CommonUtil.isEmpty(this.state.thumbnail_img) ?
                            !CommonUtil.isEmpty(this.state.newImage) ?
                            <View style={styles.middleDataWarp2}>   
                                <Image
                                    source={{uri:this.state.thumbnail_img}}
                                    resizeMode={"contain"}
                                    style={{width:PixelRatio.roundToNearestPixel(100),height:PixelRatio.roundToNearestPixel(145)}}
                                />
                            </View>
                            :
                            <TouchableOpacity
                                onPress={() => this.setImageGallery([{url: DEFAULT_CONSTANTS.defaultImageDomain + this.state.thumbnail_img}], 1)}
                                style={styles.middleDataWarp2}
                            >   
                                <Image
                                    source={{uri: !CommonUtil.isEmpty(this.state.newImage) ? this.state.thumbnail_img : DEFAULT_CONSTANTS.defaultImageDomain + this.state.thumbnail_img}}
                                    resizeMode={"contain"}
                                    style={{width:PixelRatio.roundToNearestPixel(100),height:PixelRatio.roundToNearestPixel(145)}}
                                />
                            </TouchableOpacity>
                            :
                            <View style={styles.middleDataWarp2}> 
                                <NativeImage
                                    source={require('../../../assets/icons/no_image.png')}
                                    resizeMode={"cover"}
                                    style={{width:100,height:95}}
                                />
                            </View>
                        }   
                        <TouchableOpacity 
                            onPress={()=>this.localcheckfile()}
                            style={styles.buttonWarp}
                        >   
                            <CustomTextR style={styles.titleText3}>사업자등록증 수정</CustomTextR>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.middleWarp,{alignItems:'center'}]}>
                        <View style={[styles.middleDataWarp,{borderBottomWidth:0}]}>
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>통장사본</CustomTextR>
                            </View>
                        </View>  
                        {
                            !CommonUtil.isEmpty(this.state.thumbnail_img2) ?
                            !CommonUtil.isEmpty(this.state.newImage2) ?
                            <View style={styles.middleDataWarp2}>   
                                <Image
                                    source={{uri:this.state.thumbnail_img2}}
                                    resizeMode={"contain"}
                                    style={{width:PixelRatio.roundToNearestPixel(100),height:PixelRatio.roundToNearestPixel(145)}}
                                />
                            </View>
                            :
                            <TouchableOpacity
                                onPress={() => this.setImageGallery([{url: DEFAULT_CONSTANTS.defaultImageDomain + this.state.thumbnail_img2}], 1)}
                                style={styles.middleDataWarp2}
                            >   
                                <Image
                                    source={{uri: !CommonUtil.isEmpty(this.state.newImage2) ? this.state.thumbnail_img2 : DEFAULT_CONSTANTS.defaultImageDomain + this.state.thumbnail_img2}}
                                    resizeMode={"contain"}
                                    style={{width:PixelRatio.roundToNearestPixel(100),height:PixelRatio.roundToNearestPixel(145)}}
                                />
                            </TouchableOpacity>
                            :
                            <View style={styles.middleDataWarp2}> 
                                <NativeImage
                                    source={require('../../../assets/icons/no_image.png')}
                                    resizeMode={"cover"}
                                    style={{width:100,height:95}}
                                />
                            </View>
                        }   
                        <TouchableOpacity 
                            onPress={()=>this.localcheckfile2()}
                            style={styles.buttonWarp}
                        >   
                            <CustomTextR style={styles.titleText3}>통장사본 수정</CustomTextR>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.middleWarp,{alignItems:'center'}]}>
                        <View style={[styles.middleDataWarp,{borderBottomWidth:0}]}>
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>신분증</CustomTextR>
                            </View>
                        </View>  
                        {
                            !CommonUtil.isEmpty(this.state.thumbnail_img3) ?
                            !CommonUtil.isEmpty(this.state.newImage3) ?
                            <View style={styles.middleDataWarp2}>   
                                <Image
                                    source={{uri:this.state.thumbnail_img3}}
                                    resizeMode={"contain"}
                                    style={{width:PixelRatio.roundToNearestPixel(100),height:PixelRatio.roundToNearestPixel(145)}}
                                />
                            </View>
                            :
                            <TouchableOpacity
                                onPress={() => this.setImageGallery([{url: DEFAULT_CONSTANTS.defaultImageDomain + this.state.thumbnail_img3}], 1)}
                                style={styles.middleDataWarp2}
                            >   
                                <Image
                                    source={{uri: !CommonUtil.isEmpty(this.state.newImage3) ? this.state.thumbnail_img3 : DEFAULT_CONSTANTS.defaultImageDomain + this.state.thumbnail_img3}}
                                    resizeMode={"contain"}
                                    style={{width:PixelRatio.roundToNearestPixel(100),height:PixelRatio.roundToNearestPixel(145)}}
                                />
                            </TouchableOpacity>
                            :
                            <View style={styles.middleDataWarp2}> 
                                <NativeImage
                                    source={require('../../../assets/icons/no_image.png')}
                                    resizeMode={"cover"}
                                    style={{width:100,height:95}}
                                />
                            </View>
                        }   
                        <TouchableOpacity 
                            onPress={()=>this.localcheckfile2()}
                            style={styles.buttonWarp}
                        >   
                            <CustomTextR style={styles.titleText3}>신분증 수정</CustomTextR>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.mainTopWrap}>
                        <CustomTextM style={styles.titleText}>담당 영업사원</CustomTextM>
                    </View>
                    <View style={styles.middleWarp2}>
                        <View style={styles.middleDataWarp3}>
                            <DropBoxSearchIcon />                           
                            <SelectSearch
                                isSelectSingle
                                showSearchBox={false}
                                searchPlaceHolderText={'영업사원 이름으로 검색하세요'}
                                selectedTitleStyle={styles.selectBoxText}
                                colorTheme={DEFAULT_COLOR.base_color_666}
                                popupTitle="영업사원 선택"
                                title={'담당 영업사원'}
                                cancelButtonText="취소"
                                selectButtonText="선택"
                                data={this.state.salesmanList}
                                onSelect={data => {
                                    this.selectFilter('salesman',data)
                                }}
                                onRemoveItem={data => {
                                    this.state.salesmanList[0].checked = true;
                                }}
                                initHeight={SCREEN_HEIGHT * 0.7}
                            />                           
                        </View>                                             
                    </View>                    
                    <View style={[CommonStyle.blankArea,{backgroundColor:'#f5f6f8'}]}></View>
                    { 
                        this.state.moreLoading &&
                        <View style={CommonStyle.moreWrap}>
                            <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} />
                        </View>
                    }
                </ScrollView>
                <View style={CommonStyle.scrollFooterWrap}>
                    <TouchableOpacity 
                        style={CommonStyle.scrollFooterLeftWrap}
                        onPress={()=>this.updateData()}
                    >
                        <CustomTextB style={CommonStyle.scrollFooterText}>정보 수정</CustomTextB>
                    </TouchableOpacity>
                </View>
                <Modal 
                    visible={this.state.isImageViewVisible} transparent={true}
                    onRequestClose={() => this.setState({ isImageViewVisible: false })}
                    style={{margin:0,padding:0}}
                >
                    <ImageViewer      
                        //glideAlways
                        imageUrls={this.state.thisImages}
                        index={this.state.imageIndex}
                        enableSwipeDown={true}
                        useNativeDriver={true}
                        saveToLocalByLongPress={true}
                        //controls={true}
                        //animationType="fade"
                        //visible={this.state.isImageViewVisible}
                        //renderFooter={this.renderFooter}
                        renderIndicator={this.renderIndicator}
                        onSwipeDown={() => this.setState({ isImageViewVisible: false })}
                        renderFooter={(currentIndex) => (
                            <ImageFooter imageIndex={currentIndex} imagesCount={this.state.thisImages.length} />
                        )}
                    />
                </Modal>
            </SafeAreaView>
        );
        }
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor : "#f5f7fc",
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
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
    mainTopInfoWrap : {
        height:30,justifyContent:'center',alignItems:'center',marginTop:20
    },
    mainTopInfoText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.base_color_666
    },
    mainTopWrap : {
        height:60,justifyContent:'center',marginHorizontal:30
    },
    mainTopText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize20),color:DEFAULT_COLOR.base_color_000
    },
    middleWarp : {
        flex:1,        
        justifyContent:'center',
        marginHorizontal:20,marginBottom:10,
        backgroundColor:'#fff',
        borderColor:DEFAULT_COLOR.input_border_color,borderWidth:1,borderRadius:17
    },
    middleWarp2 : {
        flex:1,        
        justifyContent:'center',
        marginHorizontal:20,marginBottom:10,
        backgroundColor:'#fff'
    },
    middleDataWarp : {
        flex:1,
        justifyContent:'flex-start',
        borderBottomColor:DEFAULT_COLOR.input_border_color,borderBottomWidth:1
    },
    middleDataWarp2 : {
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        paddingVertical:10,paddingHorizontal:30,
        overflow:'hidden'
    },
    noimageWrap : {
        
        justifyContent:'center',
        alignItems:'center',
    },
    buttonWarp : {
        flex:1,
        width:SCREEN_WIDTH*0.5,
        backgroundColor:DEFAULT_COLOR.base_color,
        justifyContent:'center',
        alignItems:'center',
        paddingVertical:10,paddingHorizontal:30,
        marginBottom:20
    },
    middleDataWarp3 : {
        flex:1,
        justifyContent:'center'
    },
    titleWrap : {
        flex:1,justifyContent:'center',height:45,paddingLeft:20
    },
    titleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.base_color_000
    },
    titleText2 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),color:DEFAULT_COLOR.base_color_666
    },
    titleText3 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#fff'
    },
    dataInputWrap : {
        flex:1,height:55
    },
    dataInputWrap2 : {
        flex:3,justifyContent:'center',paddingLeft:20
    },
    dataInputWrap3 : {
        flex:3,flexDirection:'row',alignItems:'center'
    },
    inputContainerStyle : {
        backgroundColor:'#fff',margin:0,padding:0,height:45,borderWidth:1,borderColor:'#fff'
    },
    inputStyle :{ 
        margin:0,paddingLeft: 10,color: DEFAULT_COLOR.base_color_666,fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16)
    },
    smallButtonWarp : {
        backgroundColor:'#0059a9',paddingVertical:3,paddingHorizontal:10,justifyContent:'center',alignItems:'center',borderRadius:5
    },
    buttonWrapOn : {
        backgroundColor:'#0059a9',paddingVertical:10,paddingHorizontal:25,justifyContent:'center',alignItems:'center',borderRadius:25
    },
    buttonWrapOn2 : {
        backgroundColor:'#fff',paddingVertical:5,marginHorizontal:15,justifyContent:'center',alignItems:'center',borderRadius:25,borderWidth:1,borderColor:DEFAULT_COLOR.base_color
    },
    buttonWrapOff : {
        backgroundColor:'#ccc2e6',padding:10,marginHorizontal:15,justifyContent:'center',alignItems:'center',borderRadius:25
    },
    footerWrap : {
        flex:1,marginHorizontal:30,marginBottom:10,
    },
    footerDataWrap : {
        flex:1,justifyContent:'flex-end',flexDirection:'row',paddingLeft:10,marginTop:20
    },
    imageStyle : {
        width:PixelRatio.roundToNearestPixel(100),height:PixelRatio.roundToNearestPixel(200)
    },
    footer: {
        width :SCREEN_WIDTH,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    footerText: {
        fontSize: 16,
        color: '#FFF',
        textAlign: 'center',
    },
    footerRoot: {
        height: 64,
        paddingHorizontal:50,
        backgroundColor: "#00000077",
        alignItems: "center",
        justifyContent: "center"
    },
    footerText: {
        fontSize: 17,
    }
    
});


function mapStateToProps(state) {
    return {
        userToken : state.GlabalStatus.userToken,
    };
}

function mapDispatchToProps(dispatch) {
    return {        
        _saveUserToken:(str)=> {
            dispatch(ActionCreator.saveUserToken(str))
        }
    };
}


export default connect(mapStateToProps,mapDispatchToProps)(MemberInfoScreen);
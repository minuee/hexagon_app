import types from '../types';

const defaultState = {
    userToken: {},
    isDrawerOpen : false,    
    togglecategory : false,
    toggleproduct : false,
    toggleNoticeDetail : false ,
    toggleBannerDetail : false ,
    choiceCategoryArray : [],
    choiceProductArray : [],
    selectCategoryName : null,
    toggleKeyboardFocus : false
}

export default StatusReducer = (state = defaultState, action) => {
    switch (action.type) {
        case types.GLOBAL_STATUS_USER_TOKEN:
            return {     
            ...state,
            userToken : action.return_usertoken
        }; 
        case types.GLOBAL_STATUS_NOW_KEYBOARD_FOCUS:
            return {     
            ...state,
            toggleKeyboardFocus : action.return_toggleKeyboardFocus
        }; 
        case types.GLOBAL_STATUS_DRAWER_OPEN:
            return {     
            ...state,
            isDrawerOpen : action.return_isDrawerOpen
        };  
        case types.GLOBAL_STATUS_NOW_CATEGORYNAME:
            return {     
            ...state,
            selectCategoryName : action.return_selectCategoryName
        }; 
        case types.GLOBAL_STATUS_TOGGLE_CATEGORY:
            return {     
            ...state,
            togglecategory : action.return_togglecategory
        };  
        case types.GLOBAL_STATUS_TOGGLE_PRODUCT:
            return {     
            ...state,
            toggleproduct : action.return_toggleproduct
        }; 
        case types.GLOBAL_STATUS_TOGGLE_NOTICE_DETAIL:
            return {     
            ...state,
            toggleNoticeDetail : action.return_toggleNoticeDetail
        }; 
        case types.GLOBAL_STATUS_TOGGLE_BANNER_DETAIL:
            return {     
            ...state,
            toggleBannerDetail : action.return_toggleBannerDetail
        }; 
        case types.GLOBAL_STATUS_CHOICE_CATEGORY_ARRAY:
            return {     
            ...state,
            choiceCategoryArray : action.return_choiceCategoryArray
        }; 
        case types.GLOBAL_STATUS_CHOICE_PRODUCT_ARRAY:
            return {     
            ...state,
            choiceProductArray : action.return_choiceProductArray
        };         
        default:
            return state;
    }
};

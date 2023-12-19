import types from '../types';

export function saveUserToken(token) {
    return {
        type: types.GLOBAL_STATUS_USER_TOKEN,
        return_usertoken : token,
    };
}

export function fn_UpdateDrawerOpen(bool) {
    return {
        type: types.GLOBAL_STATUS_DRAWER_OPEN,
        return_isDrawerOpen : bool,
    };
}

export function fn_ToggleCategory(bool) {
    return {
        type: types.GLOBAL_STATUS_TOGGLE_CATEGORY,
        return_togglecategory : bool,
    };
}

export function fn_ToggleProduct(bool) {
    return {
        type: types.GLOBAL_STATUS_TOGGLE_PRODUCT,
        return_toggleproduct : bool,
    };
}
export function fn_ToggleNoticeDetail(bool) {
    return {
        type: types.GLOBAL_STATUS_TOGGLE_NOTICE_DETAIL,
        return_toggleNoticeDetail : bool,
    };
}
export function fn_ToggleBannerDetail(bool) {
    return {
        type: types.GLOBAL_STATUS_TOGGLE_BANNER_DETAIL,
        return_toggleBannerDetail : bool,
    };
}
export function fn_ChoiceCategoryArray(arr) {
    return {
        type: types.GLOBAL_STATUS_CHOICE_CATEGORY_ARRAY,
        return_choiceCategoryArray : arr,
    };
}

export function fn_ChoiceProductArray(arr) {
    return {
        type: types.GLOBAL_STATUS_CHOICE_PRODUCT_ARRAY,
        return_choiceProductArray : arr,
    };
}
export function fn_selectCategoryName(str) {
    return {
        type: types.GLOBAL_STATUS_NOW_CATEGORYNAME,
        return_selectCategoryName : str,
    };
}
export function fn_toggleKeyboardFocus(bool) {
    return {
        type: types.GLOBAL_STATUS_NOW_KEYBOARD_FOCUS,
        return_toggleKeyboardFocus : bool,
    };
}

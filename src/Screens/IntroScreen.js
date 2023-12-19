import React from 'react';
import {createStackNavigator,SafeAreaView} from '@react-navigation/stack';
const Stack = createStackNavigator();

import MainScreen from './MainScreen'; 
import SampleScreen from '../Utils/SampleScreen'; 

import { RewardDetailStack,MemberDetailStack,MemberOrderStack,ChatListStack,ChatStack}  from './Tabs03RouteStack'; 
import { MDProductListStack,CategoryListStack, ProductListStack,ProductDetailStack,ProductModifyStack,ProductRegistStack,CategoryListModifyStack,CategoryRegistStack,CategoryModifyStack,ProductListModifyStack,EventListStack,EventRegistStack,EventModifyStack,EventDetailStack  }  from './Tabs04RouteStack'; 
import { NoticeListStack,NoticeDetailStack,NoticeRegistStack,NoticeModifyStack,BannerListStack,BannerRegistStack,BannerModifyStack,BannerListModifyStack,SalesManListStack,SalesManDetailStack,MonthDetailStack,OrderDetailStack,ChargeListStack,MemberInfoStack,SalesManRegistStack,SalesManModifyStack,CouponListStack,CouponRegistStack,CouponDetailStack,CouponModifyStack}  from './Tabs04RouteStack2'; 
import {PopupAdminStack,PopupNoticeDetailStack,PopupEventDetailStack,PopNoticeRegistStack,PopNoticeModifyStack,PopEventRegistStack,PopEventModifyStack}  from './PopupAdminStack';

const MainStack = ({navigation,route}) => {
  return (
    <Stack.Navigator 
        initialRouteName="MainScreen" 
        screenOptions={{headerShown: false}}
    >
        <Stack.Screen name="MainScreen" component={MainScreen} options={{ headerShown: false, }} />
        <Stack.Screen name="SampleScreen" >
          {props => <SampleScreen {...props} extraData={route} />}
        </Stack.Screen>

        <Stack.Screen name="ChatListStack" >
          {props => <ChatListStack {...props} extraData={route} />}
        </Stack.Screen>
        <Stack.Screen name="ChatStack" >
          {props => <ChatStack {...props} extraData={route} />}
        </Stack.Screen>
        <Stack.Screen name="MDProductListStack" >
          {props => <MDProductListStack {...props} extraData={route} />}
        </Stack.Screen> 

        <Stack.Screen name="EventListStack" >
          {props => <EventListStack {...props} extraData={route} />}
        </Stack.Screen> 
        <Stack.Screen name="EventRegistStack" >
          {props => <EventRegistStack {...props} extraData={route} />}
        </Stack.Screen>
        <Stack.Screen name="EventModifyStack" >
          {props => <EventModifyStack {...props} extraData={route} />}
        </Stack.Screen> 
        <Stack.Screen name="EventDetailStack" >
          {props => <EventDetailStack {...props} extraData={route} />}
        </Stack.Screen> 
        <Stack.Screen name="MemberOrderStack" >
          {props => <MemberOrderStack {...props} extraData={route} />}
        </Stack.Screen> 

        <Stack.Screen name="MemberInfoStack" >
          {props => <MemberInfoStack {...props} extraData={route} />}
        </Stack.Screen> 
        <Stack.Screen name="CouponListStack" >
          {props => <CouponListStack {...props} extraData={route} />}
        </Stack.Screen>
        <Stack.Screen name="CouponRegistStack" >
          {props => <CouponRegistStack {...props} extraData={route} />}
        </Stack.Screen>
        <Stack.Screen name="CouponModifyStack" >
          {props => <CouponModifyStack {...props} extraData={route} />}
        </Stack.Screen>
        <Stack.Screen name="CouponDetailStack" >
          {props => <CouponDetailStack {...props} extraData={route} />}
        </Stack.Screen>
        
        <Stack.Screen name="SalesManRegistStack" >
          {props => <SalesManRegistStack {...props} extraData={route} />}
        </Stack.Screen> 
        <Stack.Screen name="SalesManModifyStack" >
          {props => <SalesManModifyStack {...props} extraData={route} />}
        </Stack.Screen> 
        <Stack.Screen name="SalesManListStack" >
          {props => <SalesManListStack {...props} extraData={route} />}
        </Stack.Screen> 
        <Stack.Screen name="SalesManDetailStack" >
          {props => <SalesManDetailStack {...props} extraData={route} />}
        </Stack.Screen> 
        <Stack.Screen name="MonthDetailStack" >
          {props => <MonthDetailStack {...props} extraData={route} />}
        </Stack.Screen> 
        <Stack.Screen name="OrderDetailStack" >
          {props => <OrderDetailStack {...props} extraData={route} />}
        </Stack.Screen> 
        <Stack.Screen name="ChargeListStack" >
          {props => <ChargeListStack {...props} extraData={route} />}
        </Stack.Screen> 

        <Stack.Screen name="RewardDetailStack" >
          {props => <RewardDetailStack {...props} extraData={route} />}
        </Stack.Screen> 
        <Stack.Screen name="MemberDetailStack" >
          {props => <MemberDetailStack {...props} extraData={route} />}
        </Stack.Screen>

        <Stack.Screen name="CategoryListStack" >
          {props => <CategoryListStack {...props} extraData={route} />}
        </Stack.Screen> 
        <Stack.Screen name="ProductListStack" >
          {props => <ProductListStack {...props} extraData={route} />}
        </Stack.Screen> 
        <Stack.Screen name="ProductDetailStack" >
          {props => <ProductDetailStack {...props} extraData={route} />}
        </Stack.Screen> 
        <Stack.Screen name="ProductRegistStack" >
          {props => <ProductRegistStack {...props} extraData={route} />}
        </Stack.Screen> 
        <Stack.Screen name="ProductModifyStack" >
          {props => <ProductModifyStack {...props} extraData={route} />}
        </Stack.Screen> 
        <Stack.Screen name="CategoryListModifyStack" >
          {props => <CategoryListModifyStack {...props} extraData={route} />}
        </Stack.Screen> 
        <Stack.Screen name="CategoryRegistStack" >
          {props => <CategoryRegistStack {...props} extraData={route} />}
        </Stack.Screen>
        <Stack.Screen name="CategoryModifyStack" >
          {props => <CategoryModifyStack {...props} extraData={route} />}
        </Stack.Screen> 
        <Stack.Screen name="ProductListModifyStack" >
          {props => <ProductListModifyStack {...props} extraData={route} />}
        </Stack.Screen> 

        <Stack.Screen name="NoticeListStack" >
          {props => <NoticeListStack {...props} extraData={route} />}
        </Stack.Screen> 
        <Stack.Screen name="NoticeDetailStack" >
          {props => <NoticeDetailStack {...props} extraData={route} />}
        </Stack.Screen> 
        <Stack.Screen name="NoticeRegistStack" >
          {props => <NoticeRegistStack {...props} extraData={route} />}
        </Stack.Screen> 
        <Stack.Screen name="NoticeModifyStack" >
          {props => <NoticeModifyStack {...props} extraData={route} />}
        </Stack.Screen>
        <Stack.Screen name="BannerListStack" >
          {props => <BannerListStack {...props} extraData={route} />}
        </Stack.Screen>
        <Stack.Screen name="BannerListModifyStack" >
          {props => <BannerListModifyStack {...props} extraData={route} />}
        </Stack.Screen>
        <Stack.Screen name="BannerRegistStack" >
          {props => <BannerRegistStack {...props} extraData={route} />}
        </Stack.Screen>
        <Stack.Screen name="BannerModifyStack" >
          {props => <BannerModifyStack {...props} extraData={route} />}
        </Stack.Screen>
        <Stack.Screen name="PopupAdminStack" >
          {props => <PopupAdminStack {...props} extraData={route} />}
        </Stack.Screen>
        <Stack.Screen name="PopupNoticeDetailStack" >
          {props => <PopupNoticeDetailStack {...props} extraData={route} />}
        </Stack.Screen>
        <Stack.Screen name="PopupEventDetailStack" >
          {props => <PopupEventDetailStack {...props} extraData={route} />}
        </Stack.Screen>
        <Stack.Screen name="PopNoticeRegistStack" >
          {props => <PopNoticeRegistStack {...props} extraData={route} />}
        </Stack.Screen>
        <Stack.Screen name="PopNoticeModifyStack" >
          {props => <PopNoticeModifyStack {...props} extraData={route} />}
        </Stack.Screen>
        <Stack.Screen name="PopEventRegistStack" >
          {props => <PopEventRegistStack {...props} extraData={route} />}
        </Stack.Screen>
        <Stack.Screen name="PopEventModifyStack" >
          {props => <PopEventModifyStack {...props} extraData={route} />}
        </Stack.Screen>
    </Stack.Navigator>
  );
};

export default MainStack;

import React from 'react';
import {createStackNavigator,SafeAreaView} from '@react-navigation/stack';
const Stack = createStackNavigator();
import { MyIDModifyStack,MyPWModifyStack}  from './SalesmanApp/BaseStack'; 
import SalesmanMainScreen from './SalesmanMainScreen'; 

import { RewardDetailStack,MemberDetailStack,MemberOrderStack}  from './Tabs03RouteStack'; 
import { OrderDetailStack,MemberInfoStack,SalesManDetailStack,MonthDetailStack,ChargeListStack,SalesManModifyStack}  from './Tabs04RouteStack2'; 

const MainStack = ({navigation,route}) => {
  return (
    <Stack.Navigator 
        initialRouteName="SalesmanMainScreen" 
        screenOptions={{headerShown: false}}
    >
        <Stack.Screen name="SalesmanMainScreen" component={SalesmanMainScreen} options={{ headerShown: false, }} />

        <Stack.Screen name="MyIDModifyStack" >
          {props => <MyIDModifyStack {...props} extraData={route} />}
        </Stack.Screen>
        <Stack.Screen name="MyPWModifyStack" >
          {props => <MyPWModifyStack {...props} extraData={route} />}
        </Stack.Screen>
        <Stack.Screen name="OrderDetailStack" >
          {props => <OrderDetailStack {...props} extraData={route} />}
        </Stack.Screen>
        <Stack.Screen name="MemberInfoStack" >
          {props => <MemberInfoStack {...props} extraData={route} />}
        </Stack.Screen>
        <Stack.Screen name="MemberDetailStack" >
          {props => <MemberDetailStack {...props} extraData={route} />}
        </Stack.Screen>
        <Stack.Screen name="MemberOrderStack" >
          {props => <MemberOrderStack {...props} extraData={route} />}
        </Stack.Screen>
        <Stack.Screen name="RewardDetailStack" >
          {props => <RewardDetailStack {...props} extraData={route} />}
        </Stack.Screen>
        <Stack.Screen name="SalesManDetailStack" >
          {props => <SalesManDetailStack {...props} extraData={route} />}
        </Stack.Screen>

        <Stack.Screen name="MonthDetailStack" >
          {props => <MonthDetailStack {...props} extraData={route} />}
        </Stack.Screen>
        <Stack.Screen name="ChargeListStack" >
          {props => <ChargeListStack {...props} extraData={route} />}
        </Stack.Screen>
        <Stack.Screen name="SalesManModifyStack" >
          {props => <SalesManModifyStack {...props} extraData={route} />}
        </Stack.Screen>

    </Stack.Navigator>

    
  );
};

export default MainStack;

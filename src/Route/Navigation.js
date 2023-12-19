import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {useSelector,useDispatch} from 'react-redux';

//공통상수 필요에 의해서 사용
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonUtil from '../Utils/CommonUtil';
/* 로그인 홈 */
import MainHomeStack from '../Screens/IntroScreen';
import SalsemanHomeStack from '../Screens/SalesmanIntroScreen';
import AuthStack from '../Screens/Auth/IntroScreen';

const Stack = createStackNavigator();


const AuthScreenStack = ({navigation,route}) => {
    return (
        <Stack.Navigator
            initialRouteName="AuthStack"
            screenOptions={{headerShown: false}}
        >
        <Stack.Screen name="AuthStack" >
          {props => <AuthStack {...props} extraData={route} />}
        </Stack.Screen>
      </Stack.Navigator>
    );
};

export default function Navigation(props) {    
    //const {userToken} = useContext(UserTokenContext);
    const dispatch = useDispatch();
    //const userToken = useSelector((store) => store);
    const reduxData = useSelector(state => state);
    const {userToken,nonUserToken} = reduxData.GlabalStatus;
    //console.log('Navigation userToken',userToken)
    if ( CommonUtil.isEmpty(userToken) ) {
        return (      
            <NavigationContainer >
                <AuthScreenStack rootState={props.screenState} />
            </NavigationContainer>
        );
    }else{
        if ( userToken.is_salesman  && !CommonUtil.isEmpty(userToken) ) {
            return (      
                <NavigationContainer >
                    <SalsemanHomeStack />
                </NavigationContainer>
            );
        }else{
            return (      
                <NavigationContainer >
                    <MainHomeStack />
                </NavigationContainer>
            );

        }
    }
}


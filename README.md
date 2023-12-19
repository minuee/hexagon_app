# HexagonAdmin-ReactNative

2020. 12. 02  first commit by noh.seongnam
2020. 12. 03  Base Flatfrom by noh.seongnam
2020. 12. 09  1차UI 마무리 

placeholderTextColor={DEFAULT_COLOR.base_color}

renderWeekDays = (weekDaysNames) => {
    ...
    if ( day === '일') {
        dayStyle = {"color": "#f64444", "marginBottom": 7, "marginTop": 2, "textAlign": "center", "width": 32}
    }
    ...
}

■ code push
1005  yarn global add appcenter-cli
1006  yarn global add code-push-cli
1007  appcenter --version
1008  cd gatheringssports
1009  appcenter login
1010  appcenter apps create -d playerassemble-Android -o Android -p React-Native
1011  appcenter apps create -d playerassemble-iOS -o iOS -p React-Native
1012  code-push app add playerassemble-Android  Android  React-Native
1013  code-push register
1014  code-push app add playerassemble-Android  Android  React-Native
1015  code-push app add playerassemble-iOS  iOS  React-Native
1016  code-push deployment ls playerassemble-Android -k
1017  code-push release-react playerassemble-Android android -d Staging
1018  code-push release-react playerassemble-iOS ios -t "1.0.0" -d Staging 

npm i react-native-responsive-screen
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
 
위에 코드를 추가했다면 아래와 같이 사용가능하다. 

style={{
  width : wp('100%')  // 스크린 가로 크기 100%
  height : hp('50%') // 스크린 세로 크기 50%
  top : hp('30%') // 스크린 세로 크기의 30% 만큼 0에서부터 이동 
}}
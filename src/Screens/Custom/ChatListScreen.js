import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity,PixelRatio } from 'react-native';
import { List, Divider } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import {useSelector,useDispatch} from 'react-redux';
//공통상수 필요에 의해서 사용
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonFunction from '../../Utils/CommonFunction';
import Loader from '../../Utils/Loader';

export default function ChatListScreen({ navigation }) {
    const reduxData = useSelector(state => state);
    const {userToken} = reduxData.GlabalStatus;

    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(true);

    /**
     * Fetch threads from Firestore
     */
    useEffect(() => {
        const unsubscribe = firestore().collection('THREADS')
        .orderBy('latestMessage.createdAt', 'desc')
        .onSnapshot(querySnapshot => {
        const threads = querySnapshot.docs.map(documentSnapshot => {
            return {
                _id: documentSnapshot.id,
                // give defaults
                name: '',
                latestMessage: {
                    text: '',
                    createdAt : ''
                },
                ...documentSnapshot.data()
            };
        });

        setThreads(threads);

        if (loading) {
            setLoading(false);
        }
    });

        /**
         * unsubscribe listener
         */
        return () => unsubscribe();
    }, []);

    if (loading) {
        return <Loader screenState={{isLoading:loading,color:DEFAULT_COLOR.base_color}}/>;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={threads}
                keyExtractor={item => item._id}
                ItemSeparatorComponent={() => <Divider />}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('ChatStack', { 
                            thread: item,
                            uname : '관리자',
                            uid : userToken.user_id,
                            email : CommonFunction.fn_dataDecode(userToken.email) 
                         })}
                    >
                        <List.Item
                            title={item.name}
                            description={"[" + CommonFunction.convertUnixToDate(item.latestMessage.createdAt/1000,"YYYY.MM.DD") + "]"+ item.latestMessage.text}
                            titleNumberOfLines={1}
                            titleStyle={styles.listTitle}
                            descriptionStyle={styles.listDescription}
                            descriptionNumberOfLines={1}
                        />
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1
    },
    listTitle: {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18)
    },
    listDescription: {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13)
    }
});

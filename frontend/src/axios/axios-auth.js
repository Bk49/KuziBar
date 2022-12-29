/*import userSlice from '../redux/slice/userSlice'
import axios from './config'

const TOKEN_URL = '/token';

const getAuth = async (email, password) => {
  try{
    const response = await axios.post(TOKEN_URL,
        JSON.stringify({username: email, password}),
        {
          headers :{ 'Content-Type' : 'application/json'},
          withCredentials: true
        }
    );
    console.log(response.data);
    console.log(JSON.stringify(response));
  } catch (e){
    if(!e?.reponse){
      console.log('No Server Response');
    }
  }
} */


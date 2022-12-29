import userSlice from '../redux/slice/userSlice'
import instance from './config'

const getAuth = async (email, password) => {
  try{
    const response = await instance.post('/token', {
        data: {
            username: email,
            password: password
        }
    });
    console.log(response.data);
  } catch (e){
    console.error(e);
  }
}

export default getAuth;
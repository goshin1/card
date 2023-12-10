import './login.css'
import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react';
import axios from 'axios'

export default function Home(){
    const navigate = useNavigate();
    const [popup, setPopup] = useState(false);

    const login = async () => {
        if(document.getElementById('id').value === ''){
            console.log('id')
            return
        } if(document.getElementById('psw').value === ''){
            console.log('psw')
            return
        }
        axios.post(`${process.env.REACT_APP_CARD_ROUTER_HOST}login`, {
            data : {
                id : document.getElementById('id').value,
                psw : document.getElementById('psw').value
            }
        }).then(res => {
            if(res.data !== 'login fail'){
                navigate('/score', {
                    state : {
                        member : res.data
                    }
                })
            }else{
                setPopup(true);
            }
        });
    }

    return <div id="home">
        <div id='loginPopup' style={{opacity : popup ? '100%' : '0%', zIndex : popup ? '1' : '0'}}>
            아이디또는 비밀번호가 다릅니다.<br/>
            다시 입력해주세요.<br/>
            <input type='button' value='확인' onClick={() => {setPopup(false)}}/>
        </div>

        <div id='logoImg'></div>
        <div className='insertBlock'>
            ID
            <div className='insertBox'>
                <input id='id' name='id' type='text'/>
            </div>
        </div>
        <div className='insertBlock'>
            PSW
            <div className='insertBox'>
                <input id='psw' name='psw' type='password' onKeyDown={(event) => {
                    if(event.key === 'Enter'){
                        login();
                    }
                }}/>
                <input className='typeCh' type='button' onClick={() => {
                    let target = document.getElementById('psw').type;
                    if(target === 'password'){
                        document.getElementById('psw').type = 'text';
                    }else{
                        document.getElementById('psw').type = 'password'
                    }

                }}/>
            </div>
        </div>
        <button className='loginBtn' onClick={login}>로그인</button>
        <Link to='/sign' className='loginBtn'>회원가입</Link>
    </div>
}
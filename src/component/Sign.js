import './sign.css';
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from 'axios';

export default function Sign(){
    const [popup, setPopup] = useState(-1);
    const [idch, setIdch] = useState(false);
    const navigate = useNavigate();

    const popupMsg = [
        'ID를 입력 해주세요',
        'PSW를 입력 해주세요',
        'PSW가 일치하지 않습니다.',
        'E-MAIL을 입력 해주세요',
        'E-MAIL양식이 틀립니다.',
        '이름(닉네임)을 입력해주세요',
        '전화번호를 입력해주세요',
        '회원가입 중 문제가 발생했습니다.다시 해주시기 바랍니다.',
        '이미 있는 아이디입니다.',
        '아이디 중복 확인을 해주세요',
        '가능한 아이디입니다.'
    ];

    const duplic = async () => {
        let id = document.getElementById('id').value;
        axios.post(`${process.env.REACT_APP_CARD_ROUTER_HOST}duplic`, {
            data : {
                id : id
            }
        }).then(res => {
            console.log(res)
            if(res.data !== 'fail'){
                setPopup(10)
                setIdch(true);
            }else{
                setPopup(8);
            }
        });
    }

    const sign = async () => {
        let id = document.getElementById('id').value;
        let psw = document.getElementById('psw').value;
        let pswch = document.getElementById('pswch').value;
        let email = document.getElementById('email').value;
        let phone = document.getElementById('phone').value;
        let name = document.getElementById('name').value;

        if(id === ''){
            setPopup(0)
            return
        } if(psw === ''){
            setPopup(1)
            return
        } if (psw !== pswch){
            setPopup(2)
            return
        } if (email === ''){
            setPopup(3)
            return
        } if (!(email.indexOf('@') + 2 < email.indexOf('.') && email.indexOf('@') > 4)){
            setPopup(4)
            return
        } if(name === ''){
            setPopup(5)
            return
        } if(phone === ''){
            setPopup(6)
            return
        } if(!idch){
            setPopup(9)
            return
        }

        axios.post(`${process.env.REACT_APP_CARD_ROUTER_HOST}sign`, {
            data : {
                id : id,
                psw : psw,
                email : email,
                nickname : name,
                phone : phone
            }
        }).then(res => {
            if(res.data === 'sucess'){
                navigate('/')
            }else{
                setPopup(7);
            }
        });
    }


    return <div id="home">
    <div id='signPopup' style={{opacity : popup !== -1 ? '100%' : '0%'}}>
        {popupMsg[popup]}
        <input type='button' value='확인' onClick={() => {setPopup(-1)}}/>
    </div>

    <div id='logoImg'></div>
    <div className='insertBlock'>
            ID
            <div className='insertBox'>
                <input id='id' name='idch' type='text'/>
                <input className='typeCh' type='button' onClick={duplic}/>
            </div>
    </div>
    <div className='insertBlock'>
        PSW
        <div className='insertBox'>
            <input id='psw' name='psw' type='password'/>
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
    <div className='insertBlock'>
        PCH
        <div className='insertBox'>
            <input id='pswch' name='pswch' type='password'/>
            <input className='typeCh' type='button' onClick={() => {
                let target = document.getElementById('pswch').type;
                if(target === 'password'){
                    document.getElementById('pswch').type = 'text';
                }else{
                    document.getElementById('pswch').type = 'password'
                }

            }}/>
        </div>
    </div>
    <div className='insertBlock'>
        EMAIL 
        <div className='insertBox'>
            <input id='email' name='email' type='text'/>
        </div>
    </div>
    <div className='insertBlock'>
        NAME 
        <div className='insertBox'>
            <input id='name' name='name' type='text'/>
        </div>
    </div>
    <div className='insertBlock'>
        PHONE
        <div className='insertBox'>
            <input id='phone' name='phone' type='text'/>
        </div>
    </div>
    <button className='loginBtn' onClick={sign}>회원가입</button>
</div>
}
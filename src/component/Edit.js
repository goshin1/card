import './edit.css'
import { useState, useRef } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import axios from 'axios';

export default function Edit(){
    const [popup, setPopup] = useState(-1);
    
    const navigate = useNavigate();
    const location = useLocation();
    const profile = location.state.profile;
    const game = location.state.game;
    
    const idRef = useRef();
    const pswRef = useRef();
    const pswChRef = useRef();
    const emailRef = useRef();
    const nameRef = useRef();
    const phoneRef = useRef();


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
        '아이디 중복 확인을 해주세요'
    ];
    console.log(profile)
    const edit = async () => {
        let id = idRef.current.value;
        let psw = pswRef.current.value;
        let pswch = pswChRef.current.value;
        let email = emailRef.current.value;
        let phone = phoneRef.current.value;
        let name = nameRef.current.value;

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
        }

        axios.post(`${process.env.REACT_APP_CARD_ROUTER_HOST}updateProfile`, {
            data : {
                id : id,
                psw : psw,
                email : email,
                nickname : name,
                phone : phone
            }
        }).then(res => {
            if(res.data === 'sucess'){
                navigate('/score', {
                    state : {
                        member : {
                            id : id,
                            nickname : name,
                            levels : game.levels,
                            score : game.score
                        }
                    }
                })
            }else{
                setPopup(7);
            }
        });
    }


    return <div id="home">
        <div id='signPopup' style={{opacity : popup !== -1 ? '100%' : '0%', zIndex : popup !== -1 ? '1' : '0'}}>
            {popupMsg[popup]}<br/>
            다시 입력해주세요.<br/>
            <input type='button' value='확인' onClick={() => {setPopup(-1)}} />
        </div>

        <div id='logoImg'></div>
        <div className='insertBlock'>
                ID
                <div className='insertBox'>
                    <input id='id' name='id' type='text' ref={idRef} defaultValue={profile.id} disabled/>
                </div>
        </div>
        <div className='insertBlock'>
            PSW
            <div className='insertBox'>
                <input id='psw' name='psw' type='password' ref={pswRef} defaultValue={profile.password}/>
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
                <input id='pswch' name='pswch' type='password' ref={pswChRef}/>
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
                <input id='email' name='email' type='text' ref={emailRef} defaultValue={profile.email}/>
            </div>
        </div>
        <div className='insertBlock'>
            NAME
            <div className='insertBox'>
                <input id='name' name='name' type='text' ref={nameRef} defaultValue={profile.nickname}/>
            </div>
        </div>
        <div className='insertBlock'>
            PHONE
            <div className='insertBox'>
                <input id='phone' name='phone' type='text' ref={phoneRef} defaultValue={profile.phone}/>
            </div>
        </div>
        <button className='loginBtn' onClick={edit}>프로필 수정</button>
    </div>
}
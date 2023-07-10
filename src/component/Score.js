import './score.css'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { startGame } from '../cardSlice';
import axios from 'axios';

export default function Score(){
    const location = useLocation();
    const profile = location.state.member;
    const [scores, setScores] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(()=>{
        axios.post(`${process.env.REACT_APP_CARD_ROUTER_HOST}score`)
        .then((res) => {
            let temp = [];
            let length = res.data.length > 10 ? 10 : res.data.length;
            for(let i = 0; i < length; i++){
                temp.push(
                    <div className='scoreBlock' key={`score${i}`}>
                        <div>{i+1}</div>
                        <div>{res.data[i].nickname}</div>
                        <div>{res.data[i].score}</div>
                    </div>
                )
            }
            setScores(temp)
        });
    }, [])

    return <div id='score'>
        <header>
            <div id='profile'>
                <div>{profile.levels}</div>
                <div>{profile.nickname}</div>
            </div>
            <div id='editMove' onClick={async () => {
                axios.post(`${process.env.REACT_APP_CARD_ROUTER_HOST}selectProfile`, {
                    data : {
                        id : profile.id
                    } 
                }).then((res) => {
                    navigate('/edit', {
                        state : {
                            profile : res.data,
                            game : profile
                        }
                    })
                })
            }}>프로필 수정</div>
        </header>
        <div id='listScore'>
            <div id='scoreTitle'>
                Score Board
            </div>
            
            
            <div id='scoreBox'>
                { scores }
            </div>
            <div id='scoreBtn'>
                <input type='button' value='' onClick={()=>{
                    
                    dispatch(startGame())
                    navigate('/play', {
                        state : {
                            profile
                        }
                    })
                }}/>
            </div>
        </div>
    </div>
}
import React, {useEffect} from 'react'
import axios from 'axios';

function LandingPage(props){
    
    // LandingPage에 들어오자마자 이거 실행. 
    // get request를 서버에 보냄 엔드포인트는 /api/hello임, 보낸 다음 서버에서 돌아오는 response를 콘솔창에 보여줌
    useEffect(() => {
        axios.get('/api/hello')
        .then(response => {console.log(response)})
    }, [])

    return (
        <div>
            LandingPage 랜딩!
        </div>
    )
}

export default LandingPage
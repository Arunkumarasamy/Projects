import { useState } from "react";

var QrCode=()=>{
let [Currimg,setUpdateImg]=useState();
// let [loadImg,setLoading]=useState() 
let [qrData,setQrData]=useState() //this generate data from url
let [qrSize,setqrSize]=useState()

async function genQr(){
    // setLoading(true);          //why use try catch mean setUpdateImg will "false"
    try {
        const url =`https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(qrData)}`      
                          // link the api =https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=$"o/p Qr-data"
        setUpdateImg(url)
    } 
    catch (error) {
        console.error("err from generate Qr",error)
    }
    // finally{
    //     setLoading(false)
    // }
}

function downQr(){
    fetch(Currimg).then((res)=>res.blob())
    .then((blobData)=>{
        let link=document.createElement("a")
        link.href=URL.createObjectURL(blobData);
        link.download="QR_CODE.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link)   // remove the <a> tag
    })
}
    return(
        <>
        <div className="app_container">
            <h1>Qr Code</h1>
            {/*  {loadImg && <p>please wait...</p>} */}
            {Currimg &&<img src={Currimg} alt="" className="qr_img" />} 

            <div>
                <label htmlFor="ipData">Data for QR:</label>
                <input type="text" id="ipData" required placeholder="Datas & Url.." value= {qrData}
                onChange={(event)=>setQrData(event.target.value)}/><br />
               
                <label htmlFor="ipSize">QR Size:</label>
                <input type="text" id="ipSize" required placeholder="img size(eg:100)" value={qrSize}
                onChange={(event)=>setqrSize(event.target.value)}/><br />
               
                <button className="gen_btn" onClick={genQr} >Generate QR</button>
                <button className="down_btn" onClick={downQr}>Downloade QR</button>
            </div>
            <hr />            
        </div>
        </>
    )
}
export default QrCode;
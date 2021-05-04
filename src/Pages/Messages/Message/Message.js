import React, {Fragment, useState, useContext, useEffect} from "react";
import PropTypes from "prop-types";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import {AppContext} from "../../../Context";
import { BsFillHeartFill } from "react-icons/bs";
import { BiFullscreen } from "react-icons/bi";
import { Avatar } from "@material-ui/core";

const Message = (props) => {
    const {unsendMessage, notify} = useContext(AppContext);
    const {message, receivedData, user, openSidedrawer} = props;
    const [openOptions, setOpeningOptions] = useState(false);
    const [fullScreenPic, setFullScreenPic] = useState(false);
    const onOptionClick = (type) => {
        setOpeningOptions(false);
        setFullScreenPic(false);
        if (type === "unsend"){
            unsendMessage({ user: user, id: message?.id, type: message?.type, pathname: message?.contentName});
        }else if (type === "copy"){
            const $body = document.getElementsByTagName("body")[0];
            const $tempInput = document.createElement("INPUT");
            $body.appendChild($tempInput);
            $tempInput.setAttribute("value", message?.textMsg);
            $tempInput.select();
            $tempInput.setSelectionRange(0, 99999);
            document.execCommand("copy");
            $body.removeChild($tempInput);
            notify("Copied to Clipboard", "info");
        }
    }
   
    const onImgFullScreen = () => {
      setFullScreenPic(true);
      
    }
    useEffect(() => {
      if(openSidedrawer){
        setFullScreenPic(false);
      }
    },[openSidedrawer]);
    const isSender = message?.uid === receivedData?.uid;
    return (
        <Fragment>  
           {
              fullScreenPic&& 
              <div>
                <div className="backdrop" onClick={() => setFullScreenPic(false)}></div>
                <div className="message--pic--fs--close" onClick={() => setFullScreenPic(false)}>&times;</div>
                <div className="message--pic--fullScreen">
                <div className="message--pic--fs--close mobile-only" onClick={() => setFullScreenPic(false)}>&times;</div>
                  <div className="pic--fullScreen--inner flex-column">
                      <img src={message?.contentUrl} alt={message?.userName} loading="lazy" />
                  </div>
              </div>
               
              </div>
              
            
            } 
          
          <div  id="message" className="flex-row">
              {!isSender &&
              <Avatar className="messsage--sender--img" src={message?.userAvatarUrl} />}
              <div className="message--outer" >
                  {/* {openOptions && <div className="hidden--backdrop" onClick={() => setOpeningOptions(false)}></div> } */}
                                  <div
                                  style={{backgroundColor: (message.type === "text" && isSender) && "#efefef", border: (message.type === "text") && "1px solid #efefef"}}
                                    className={`
                                      ${isSender
                                        ? "sender"
                                        : "receiver"} flex-column`
                                    }
                                  >
                                  
                                    { isSender &&
                                    <div className="message--options">
                                      <div className="message--inner--options">
                                        <HiOutlineDotsHorizontal onClick={() => setOpeningOptions(!openOptions) }/>
                                      {
                                          openOptions &&
                                          <div className="message--option flex-row">
                                                  <span  onClick={() => onOptionClick("unsend")} >unsend</span>
                                                  {message?.type === "text" && <span onClick={()=> onOptionClick("copy")}>copy</span>}
                                          </div>
                                      }
                                      </div>
                                    </div>}
                                    {
                                      message?.type === "text" ?
                                      <div className="message--text">
                                          <span>{message?.textMsg}</span>
                                      </div> :
                                      message?.type === "video" ?
                                      <div className="message--video message--content">
                                        <video src={message?.contentUrl} controls></video>
                                      </div> :
                                      message?.type === "picture" ?
                                      <div className="message--picture message--content">
                                        <img src={message?.contentUrl} loading="lazy" alt={message?.userName} />
                                        <BiFullscreen onClick={() => onImgFullScreen()} className="message--full--screen--ico"/>
                                      </div>
                                      :
                                      message?.type === "like" ? 
                                      <div className="message--like--emoji liked__heart">
                                        <BsFillHeartFill />
                                      </div>
                                      : <p>Error</p>
                                    }                           
                              </div>
                            </div>
          </div>
          
        </Fragment>
    )
}
Message.propTypes ={
    message: PropTypes.object.isRequired,
    receivedData: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    openSidedrawer: PropTypes.bool
}
export default Message;
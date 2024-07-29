import React, { useEffect, useState } from "react";
import { useRef } from "react";

import { useNavigate, useParams } from "react-router-dom";

// icons
import { IoChatboxOutline as ChatIcon } from "react-icons/io5";
import { VscTriangleDown as DownIcon } from "react-icons/vsc";
import { FaUsers as UsersIcon } from "react-icons/fa";
import { FiSend as SendIcon } from "react-icons/fi";
import { FcGoogle as GoogleIcon } from "react-icons/fc";
import { MdCallEnd as CallEndIcon } from "react-icons/md";
import { MdClear as ClearIcon } from "react-icons/md";
import { AiOutlineLink as LinkIcon } from "react-icons/ai";
import { MdOutlineContentCopy as CopyToClipboardIcon } from "react-icons/md";
// import { MdScreenShare as ScreenShareIcon } from "react-icons/md";
import { IoVideocamSharp as VideoOnIcon } from "react-icons/io5";
import { IoVideocamOff as VideoOffIcon } from "react-icons/io5";
import { AiOutlineShareAlt as ShareIcon } from "react-icons/ai";
import { IoMic as MicOnIcon } from "react-icons/io5";
import { IoMicOff as MicOffIcon } from "react-icons/io5";
import { BsPin as PinIcon } from "react-icons/bs";
import { BsPinFill as PinActiveIcon } from "react-icons/bs";

import { QRCode } from "react-qrcode-logo";
import MeetGridCard from "../components/MeetGridCard";

// framer motion
import { motion, AnimatePresence } from "framer-motion";

// importing audios
import joinSFX from "../sounds/join.mp3";
import msgSFX from "../sounds/message.mp3";
import leaveSFX from "../sounds/leave.mp3";

// simple peer
import Peer from "simple-peer";
import { io } from "socket.io-client";
import Loading from "../components/Loading";
import { v4 as uuid } from "uuid";
import randomEmail from "random-email";



const Room = () => {
  const [loading, setLoading] = useState(true);
  const [localStream, setLocalStream] = useState(null);
  const navigate = useNavigate();
  const [micOn, setMicOn] = useState(true);
  const [showChat, setshowChat] = useState(true);
  const [share, setShare] = useState(false);
  const [joinSound] = useState(new Audio(joinSFX));
  const { roomID } = useParams();
  const chatScroll = useRef();
  const [pin, setPin] = useState(false);
  const [peers, setPeers] = useState([]);
  const socket = useRef();
  const peersRef = useRef([]);

  const [videoActive, setVideoActive] = useState(true);

  const [msgs, setMsgs] = useState([]);
  const [msgText, setMsgText] = useState("");
  const localVideo = useRef();

  // user
  // const { user, login } = useAuth();






  const userID = uuid();
  const [user, setUser] = useState({
    uid: userID,
    email: "customer",
    displayName: "customer",
    photoURL: "https://parkridgevet.com.au/wp-content/uploads/2020/11/Profile-300x300.png"
  })

  const [particpentsOpen, setParticpentsOpen] = useState(true);

  const sendMessage = (e) => {
    e.preventDefault();
    if (msgText) {
      socket.current.emit("send message", {
        roomID,
        from: socket.current.id,
        user: {
          id: user.uid,
          name: user?.displayName,
          profilePic: user.photoURL,
        },
        message: msgText.trim(),
      });
    }
    setMsgText("");
  };

  useEffect(() => {
    const connectToRoom = () => {
      socket.current = io.connect(
        process.env.SOCKET_BACKEND_URL || "https://otiavcb-production.up.railway.app/"
      );

      socket.current.on("message", (data) => {
        // Handle incoming messages
      });

      if (user) {
        navigator.mediaDevices
          .getUserMedia({
            video: true,
            audio: true,
          })
          .then((stream) => {
            setLoading(false);
            setLocalStream(stream);
            if (localVideo.current) {
              localVideo.current.srcObject = stream;
            }

            socket.current.emit("join room", {
              roomID,
              user: {
                uid: user.uid,
                email: user.email,
                name: user.displayName,
                photoURL: user.photoURL,
              },
            });

            socket.current.on("all users", (users) => {
              // Handle users in the room
            });

            socket.current.on("user joined", (payload) => {
              // Handle user joining
            });

            socket.current.on("receiving returned signal", (payload) => {
              // Handle receiving returned signal
            });

            socket.current.on("user left", (id) => {
              // Handle user leaving
            });
          });
      }
    };

    connectToRoom();

    // Send roomID to backend API
    const sendRoomIDToAPI = async () => {
      try {
        const response = await fetch("https://your-backend-api-url.com/room", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ roomID }),
        });

        if (!response.ok) {
          throw new Error("Failed to send room ID");
        }

        const data = await response.json();
        console.log("Room ID sent successfully:", data);
      } catch (error) {
        console.error("Error sending room ID:", error);
      }
    };

    sendRoomIDToAPI();
  }, [user, roomID]);

  const createPeer = (userToSignal, callerID, stream) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socket.current.emit("sending signal", {
        userToSignal,
        callerID,
        signal,
        user: {
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
        },
      });
    });

    return peer;
  };

  const addPeer = (incomingSignal, callerID, stream) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socket.current.emit("returning signal", { signal, callerID });
    });

    peer.signal(incomingSignal);
    return peer;
  };

  return (
    <>
      {user ? (
        loading ? (
          <div className="bg-lightGray">
            <Loading />
          </div>
        ) : (
          <div className="flex flex-row bg-darkBlue2 text-white w-full">
            <div className="flex flex-col bg-darkBlue2 justify-between w-full">
              <div className="flex-shrink-0 overflow-y-scroll p-3 flexcent" style={{ height: '100dvh' }}>
                <div>
                  <div className={`relative bg-lightGray rounded-lg aspect-video d-none overflow-hidden`}>
                    <video
                      ref={localVideo}
                      muted
                      autoPlay
                      controls={false}
                      className="h-full w-full object-cover rounded-lg"
                    />
                  </div>
                  {peers.map((peer) => (
                    <MeetGridCard key={peer.peerID} user={peer.user} peer={peer.peer} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      ) : (
        <div className="h-full bg-darkBlue2 flex items-center justify-center">
          {/* Add your login or other content here */}
        </div>
      )}
    </>
  );
};

export default Room;
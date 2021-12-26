import { NextPage } from "next";
import { useEffect } from "react";
import { options, rtc, startBasicCall } from "../utils/AgoraUtils";

const Home: NextPage = () => {
  useEffect(() => {
    startBasicCall();
  }, []);

  const handleJoinClick = async () => {
    const { default: AgoraRTC } = await import("agora-rtc-sdk-ng");

    await rtc.client?.join(
      options.appId,
      options.channel,
      options.token,
      options.uid
    );

    rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
    await rtc.client?.publish([rtc.localAudioTrack, rtc.localVideoTrack]);

    const localPlayerContainer = document.createElement("div");
    localPlayerContainer.id = options.uid.toString();
    localPlayerContainer.textContent = "Local user " + options.uid;
    localPlayerContainer.style.width = "640px";
    localPlayerContainer.style.height = "480px";
    document.body.append(localPlayerContainer);

    rtc.localVideoTrack.play(localPlayerContainer);
    console.log("publish success!");
  };

  const handleLeaveClick = async () => {
    rtc.localAudioTrack?.close();
    rtc.localVideoTrack?.close();

    rtc.client?.remoteUsers.forEach((user) => {
      const playerContainer = document.getElementById(user.uid as string);
      playerContainer?.remove();
    });

    await rtc.client?.leave();
  };

  return (
    <div>
      <h2>Agora Video Web SDK</h2>
      <div className="row">
        <div>
          <button type="button" id="join" onClick={handleJoinClick}>
            JOIN
          </button>
          <button type="button" id="leave" onClick={handleLeaveClick}>
            LEAVE
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;

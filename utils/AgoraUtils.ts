import type {
  IAgoraRTCClient,
  IMicrophoneAudioTrack,
  ICameraVideoTrack,
} from "agora-rtc-sdk-ng";

interface RTC {
  localAudioTrack: IMicrophoneAudioTrack | null;
  localVideoTrack: ICameraVideoTrack | null;
  client: IAgoraRTCClient | null;
}

export let rtc: RTC = {
  localAudioTrack: null,
  localVideoTrack: null,
  client: null,
};

export let options = {
  appId: process.env.NEXT_PUBLIC_APP_ID,
  channel: "test",
  token: process.env.NEXT_PUBLIC_TOKEN,
  uid: Math.floor(Math.random() * 100),
};

export async function startBasicCall() {
  const { default: AgoraRTC } = await import("agora-rtc-sdk-ng");

  rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  rtc.client?.on("user-published", async (user, mediaType) => {
    await rtc.client?.subscribe(user, mediaType);
    console.log("subscribe success");

    if (mediaType === "video") {
      const remoteVideoTrack = user.videoTrack;
      const remotePlayerContainer = document.createElement("div");

      remotePlayerContainer.id = user.uid.toString();
      remotePlayerContainer.textContent = "Remote user " + user.uid.toString();
      remotePlayerContainer.style.width = "640px";
      remotePlayerContainer.style.height = "480px";
      document.body.append(remotePlayerContainer);

      remoteVideoTrack?.play(remotePlayerContainer);
    }

    if (mediaType === "audio") {
      const remoteAudioTrack = user.audioTrack;

      remoteAudioTrack?.play();
    }

    rtc.client?.on("user-unpublished", (user) => {
      const remotePlayerContainer = document.getElementById(user.uid as string);
      remotePlayerContainer?.remove();
    });
  });
}

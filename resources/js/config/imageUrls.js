import esgBackgroundImg from '../../../public/images/esg-faceswap/background.png'
import esgSetLogoImg from '../../../public/images/esg-faceswap/set-logo.png'
import esgSetFutureLogoImg from '../../../public/images/esg-faceswap/set-future-logo.png'
import esgBattlefieldArtImg from '../../../public/images/esg-faceswap/battlefield-art.png'
import esgGenderMaleImg from '../../../public/images/esg-faceswap/gender-male.png'
import esgGenderFemaleImg from '../../../public/images/esg-faceswap/gender-female.png'
import esgBadgeImg from '../../../public/images/esg-faceswap/badge.png'
import esgBackIconImg from '../../../public/images/esg-faceswap/icon_back.png'
import esgCameraFrameImg from '../../../public/images/esg-faceswap/拍攝照片輪廓外框.png'
import esgBackgroundShadowImg from '../../../public/images/esg-faceswap/background_shadow.svg'
import esgMaleButtonDefaultImg from '../../../public/images/esg-faceswap/btn_男生換臉_default.png'
import esgMaleButtonSelectedImg from '../../../public/images/esg-faceswap/btn_男生換臉_selected.png'
import esgFemaleButtonDefaultImg from '../../../public/images/esg-faceswap/btn_女生換臉_default.png'
import esgFemaleButtonSelectedImg from '../../../public/images/esg-faceswap/btn_女生換臉_selected.png'
import esgSelectionNextDisabledImg from '../../../public/images/esg-faceswap/btn_「選擇性別頁」下一步 disabled.png'
import esgPrimaryNextButtonImg from '../../../public/images/esg-faceswap/btn_「選擇性別、拍攝照片頁」下一步 Primary.png'
import esgConfirmPhotoNextButtonImg from '../../../public/images/esg-faceswap/btn_「確認照片頁」下一步.png'
import esgDownloadButtonImg from '../../../public/images/esg-faceswap/btn_下載圖片.png'
import esgCloseButtonImg from '../../../public/images/esg-faceswap/btn_關閉 .png'
import esgLoadingVideo from '../../../public/images/esg-faceswap/loading.mp4'

export const imageUrls = {
  profile: esgBackgroundImg,
  enterprise: {
    background: esgBackgroundImg,
    backgroundShadow: esgBackgroundShadowImg,
    setLogo: esgSetLogoImg,
    setFutureLogo: esgSetFutureLogoImg,
    battlefieldArt: esgBattlefieldArtImg,
    badge: esgBadgeImg,
    backIcon: esgBackIconImg,
    cameraFrame: esgCameraFrameImg,
    loadingVideo: esgLoadingVideo,
    buttons: {
      selectionNextDisabled: esgSelectionNextDisabledImg,
      primaryNext: esgPrimaryNextButtonImg,
      confirmPhotoNext: esgConfirmPhotoNextButtonImg,
      download: esgDownloadButtonImg,
      close: esgCloseButtonImg,
    },
    gender: {
      female: {
        photo: esgGenderFemaleImg,
        default: esgFemaleButtonDefaultImg,
        selected: esgFemaleButtonSelectedImg,
      },
      male: {
        photo: esgGenderMaleImg,
        default: esgMaleButtonDefaultImg,
        selected: esgMaleButtonSelectedImg,
      },
    },
  },
}

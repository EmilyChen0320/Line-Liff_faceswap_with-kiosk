import profileImg from '../../../public/images/profile.png'
import enterpriseBackgroundImg from '../../../public/images/內頁background.png'
import enterpriseFooterImg from '../../../public/images/內頁footer.png'
import enterpriseLogoImg from '../../../public/images/內頁logo.png'
import enterprisePanelImg from '../../../public/images/內頁白底.png'
import enterpriseBackIconImg from '../../../public/images/back icon.png'
import enterpriseBackTextImg from '../../../public/images/back文字.png'
import enterpriseBackToHomeImg from '../../../public/images/backtohome.png'
import enterpriseNextDisabledLargeImg from '../../../public/images/下一步 Disabled_large.png'
import enterpriseNextFocusLargeImg from '../../../public/images/下一步 Focus_large.png'
import enterpriseDownloadButtonImg from '../../../public/images/下載圖片_btn.png'
import enterpriseRestartButtonImg from '../../../public/images/重新開始_btn.png'
import enterpriseRetakeIpButtonImg from '../../../public/images/重選IP.png'
import enterpriseRetakeButtonImg from '../../../public/images/retake.png'
import enterpriseTakePhotoButtonImg from '../../../public/images/開始拍照_btn.png'
import enterpriseCloseButtonImg from '../../../public/images/關閉_btn.png'
import enterpriseGenderFemaleDefaultImg from '../../../public/images/選擇性別(女_Default).png'
import enterpriseGenderFemaleSelectedImg from '../../../public/images/選擇性別(女_Selected).png'
import enterpriseGenderMaleDefaultImg from '../../../public/images/選擇性別(男_Default).png'
import enterpriseGenderMaleSelectedImg from '../../../public/images/選擇性別(男_Selected).png'
import enterpriseSanliFemaleDefaultImg from '../../../public/images/三立電視台(女_Default).png'
import enterpriseSanliFemaleSelectedImg from '../../../public/images/三立電視台(女_Ｓelected).png'
import enterpriseSanliMaleDefaultImg from '../../../public/images/三立電視台(男_Default).png'
import enterpriseSanliMaleSelectedImg from '../../../public/images/三立電視台(男_Ｓelected).png'
import enterpriseChefFemaleDefaultImg from '../../../public/images/型男大主廚(女_Default).png'
import enterpriseChefFemaleSelectedImg from '../../../public/images/型男大主廚(女_Selected).png'
import enterpriseChefMaleDefaultImg from '../../../public/images/型男大主廚(男_Default).png'
import enterpriseChefMaleSelectedImg from '../../../public/images/型男大主廚(男_Selected).png'
import enterpriseOperaFemaleDefaultImg from '../../../public/images/戲說台灣(女_Default).png'
import enterpriseOperaFemaleSelectedImg from '../../../public/images/戲說台灣(女_Selected).png'
import enterpriseOperaMaleDefaultImg from '../../../public/images/戲說台灣(男_Default).png'
import enterpriseOperaMaleSelectedImg from '../../../public/images/戲說台灣(男_Selected).png'
import enterpriseTableFemaleDefaultImg from '../../../public/images/請世界吃桌(女_Default).png'
import enterpriseTableFemaleSelectedImg from '../../../public/images/請世界吃桌(女_Selected).png'
import enterpriseTableMaleDefaultImg from '../../../public/images/請世界吃桌(男_Default).png'
import enterpriseTableMaleSelectedImg from '../../../public/images/請世界吃桌(男_Selected).png'

export const imageUrls = {
  profile: profileImg,
  enterprise: {
    background: enterpriseBackgroundImg,
    footer: enterpriseFooterImg,
    logo: enterpriseLogoImg,
    panel: enterprisePanelImg,
    backIcon: enterpriseBackIconImg,
    backText: enterpriseBackTextImg,
    backToHome: enterpriseBackToHomeImg,
    nextDisabledLarge: enterpriseNextDisabledLargeImg,
    nextFocusLarge: enterpriseNextFocusLargeImg,
    downloadButton: enterpriseDownloadButtonImg,
    restartButton: enterpriseRestartButtonImg,
    retakeIpButton: enterpriseRetakeIpButtonImg,
    retakeButton: enterpriseRetakeButtonImg,
    takePhotoButton: enterpriseTakePhotoButtonImg,
    closeButton: enterpriseCloseButtonImg,
    gender: {
      female: {
        default: enterpriseGenderFemaleDefaultImg,
        selected: enterpriseGenderFemaleSelectedImg,
      },
      male: {
        default: enterpriseGenderMaleDefaultImg,
        selected: enterpriseGenderMaleSelectedImg,
      },
    },
    templates: {
      sanliTv: {
        female: { default: enterpriseSanliFemaleDefaultImg, selected: enterpriseSanliFemaleSelectedImg },
        male: { default: enterpriseSanliMaleDefaultImg, selected: enterpriseSanliMaleSelectedImg },
      },
      chef: {
        female: { default: enterpriseChefFemaleDefaultImg, selected: enterpriseChefFemaleSelectedImg },
        male: { default: enterpriseChefMaleDefaultImg, selected: enterpriseChefMaleSelectedImg },
      },
      taiwanOpera: {
        female: { default: enterpriseOperaFemaleDefaultImg, selected: enterpriseOperaFemaleSelectedImg },
        male: { default: enterpriseOperaMaleDefaultImg, selected: enterpriseOperaMaleSelectedImg },
      },
      table: {
        female: { default: enterpriseTableFemaleDefaultImg, selected: enterpriseTableFemaleSelectedImg },
        male: { default: enterpriseTableMaleDefaultImg, selected: enterpriseTableMaleSelectedImg },
      },
    },
  },
}

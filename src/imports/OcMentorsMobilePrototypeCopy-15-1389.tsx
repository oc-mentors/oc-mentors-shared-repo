import svgPaths from "./svg-cqf9c54bbn";
import imgImageWithFallback from "figma:asset/bae2b9e32f95456a531512097e56886125248d42.png";
import imgImageWithFallback1 from "figma:asset/fb8793821e4226d9f0d16a152549611ddd4ca9f0.png";
import imgImageWithFallback2 from "figma:asset/1a2f07aeea8663dd0f9f1f93a0abb9a59c236866.png";
import imgImageWithFallback3 from "figma:asset/fca588c1d7eadadc9279c835b4beb4c0d35c14aa.png";

function Heading() {
  return (
    <div className="h-[47.989px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[48px] left-0 not-italic text-[#e8edf5] text-[32px] top-[-0.54px] tracking-[0.4063px]">Messages</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[21.002px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[0.13px] not-italic text-[#a8b3cf] text-[14px] top-[0.02px] tracking-[-0.1504px] w-[309px] whitespace-pre-wrap">1 unread conversation</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[7.997px] h-[117.618px] items-start left-0 pb-[0.637px] pt-[19.996px] px-[24.995px] top-[60px] w-[389.998px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.12)] border-b-[0.637px] border-solid inset-0 pointer-events-none" />
      <Heading />
      <Paragraph />
    </div>
  );
}

function TextInput() {
  return (
    <div className="absolute bg-[#2a2f4a] h-[44.992px] left-0 rounded-[12px] top-0 w-[340.007px]" data-name="Text Input">
      <div className="content-stretch flex items-center overflow-clip pl-[45px] pr-[15px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#a8b3cf] text-[14px] tracking-[-0.1504px]">Search conversations...</p>
      </div>
      <div aria-hidden="true" className="absolute border-[0.637px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute left-[15px] size-[17.995px] top-[13px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.9947 17.9947">
        <g id="Icon">
          <path d={svgPaths.p2f5c8570} id="Vector" stroke="var(--stroke-0, #A8B3CF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.49956" />
          <path d={svgPaths.p149c9080} id="Vector_2" stroke="var(--stroke-0, #A8B3CF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.49956" />
        </g>
      </svg>
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute h-[44.992px] left-[25px] top-[192.61px] w-[340.007px]" data-name="Container">
      <TextInput />
      <Icon />
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[24px] relative shrink-0 w-[115.098px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-0 not-italic text-[#e8edf5] text-[16px] top-[-0.45px] tracking-[-0.3125px]">Debra Peterson</p>
      </div>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[17.995px] relative shrink-0 w-[55.926px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[#5b7ceb] text-[12px] top-[0.91px]">10:35 AM</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex items-start justify-between relative size-full">
        <Heading1 />
        <Text />
      </div>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[19.488px] overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-0 not-italic text-[#a8b3cf] text-[13px] top-[0.91px] tracking-[-0.0762px]">University of California, Irvine</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[21.002px] overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#e8edf5] text-[14px] top-[-0.09px] tracking-[-0.1504px] w-[543px] whitespace-pre-wrap">Perfect! I can definitely help with that. When would you like to schedule a session?</p>
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[3.993px] h-[70.475px] items-start left-[99.99px] top-[15px] w-[265.011px]" data-name="Container">
      <Container7 />
      <Paragraph1 />
      <Paragraph2 />
    </div>
  );
}

function ImageWithFallback() {
  return (
    <div className="absolute left-0 rounded-[21385400px] size-[59.999px] top-0" data-name="ImageWithFallback">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[21385400px] size-full" src={imgImageWithFallback} />
    </div>
  );
}

function Container9() {
  return <div className="absolute bg-[#5b7ceb] border-[#1a1d29] border-[1.912px] border-solid left-[46.01px] rounded-[21385400px] size-[13.991px] top-0" data-name="Container" />;
}

function Container8() {
  return (
    <div className="absolute left-[25px] size-[59.999px] top-[15px]" data-name="Container">
      <ImageWithFallback />
      <Container9 />
    </div>
  );
}

function Container5() {
  return (
    <div className="h-[101.107px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.12)] border-b-[0.637px] border-solid inset-0 pointer-events-none" />
      <Container6 />
      <Container8 />
    </div>
  );
}

function ImageWithFallback1() {
  return (
    <div className="relative rounded-[21385400px] shrink-0 size-[59.999px]" data-name="ImageWithFallback">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-cover pointer-events-none rounded-[21385400px] size-full" src={imgImageWithFallback1} />
    </div>
  );
}

function Heading2() {
  return (
    <div className="h-[24px] relative shrink-0 w-[89.705px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-0 not-italic text-[16px] text-[rgba(232,237,245,0.8)] top-[-0.45px] tracking-[-0.3125px]">Adam Smith</p>
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[17.995px] relative shrink-0 w-[55.717px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#a8b3cf] text-[12px] top-[0.91px]">Yesterday</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex h-[24px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Heading2 />
      <Text1 />
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[19.488px] overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-0 not-italic text-[#a8b3cf] text-[13px] top-[0.91px] tracking-[-0.0762px]">University of California, Irvine</p>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="h-[21.002px] overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#a8b3cf] text-[14px] top-[-0.09px] tracking-[-0.1504px] w-[455px] whitespace-pre-wrap">Great session today! Let me know if you need help with the homework.</p>
    </div>
  );
}

function Container11() {
  return (
    <div className="flex-[1_0_0] h-[70.475px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[3.993px] items-start relative size-full">
        <Container12 />
        <Paragraph3 />
        <Paragraph4 />
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[101.107px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.12)] border-b-[0.637px] border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex gap-[14.997px] items-start pb-[0.637px] pt-[14.997px] px-[24.995px] relative size-full">
        <ImageWithFallback1 />
        <Container11 />
      </div>
    </div>
  );
}

function ImageWithFallback2() {
  return (
    <div className="relative rounded-[21385400px] shrink-0 size-[59.999px]" data-name="ImageWithFallback">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-cover pointer-events-none rounded-[21385400px] size-full" src={imgImageWithFallback2} />
    </div>
  );
}

function Heading3() {
  return (
    <div className="h-[24px] relative shrink-0 w-[96.397px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-0 not-italic text-[16px] text-[rgba(232,237,245,0.8)] top-[-0.45px] tracking-[-0.3125px]">Maarya Khan</p>
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[17.995px] relative shrink-0 w-[61.373px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#a8b3cf] text-[12px] top-[0.91px]">2 days ago</p>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex items-start justify-between relative size-full">
        <Heading3 />
        <Text2 />
      </div>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="h-[19.488px] overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-0 not-italic text-[#a8b3cf] text-[13px] top-[0.91px] tracking-[-0.0762px]">University of California, Irvine</p>
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="h-[21.002px] overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#a8b3cf] text-[14px] top-[-0.09px] tracking-[-0.1504px] w-[412px] whitespace-pre-wrap">Thanks for the great review! Looking forward to our next lesson.</p>
    </div>
  );
}

function Container14() {
  return (
    <div className="flex-[1_0_0] h-[70.475px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[3.993px] items-start relative size-full">
        <Container15 />
        <Paragraph5 />
        <Paragraph6 />
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="h-[101.107px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.12)] border-b-[0.637px] border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex gap-[14.997px] items-start pb-[0.637px] pt-[14.997px] px-[24.995px] relative size-full">
        <ImageWithFallback2 />
        <Container14 />
      </div>
    </div>
  );
}

function ImageWithFallback3() {
  return (
    <div className="relative rounded-[21385400px] shrink-0 size-[59.999px]" data-name="ImageWithFallback">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-cover pointer-events-none rounded-[21385400px] size-full" src={imgImageWithFallback3} />
    </div>
  );
}

function Heading4() {
  return (
    <div className="h-[24px] relative shrink-0 w-[100.858px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-0 not-italic text-[16px] text-[rgba(232,237,245,0.8)] top-[-0.45px] tracking-[-0.3125px]">Sara Johnson</p>
      </div>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[17.995px] relative shrink-0 w-[61.652px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#a8b3cf] text-[12px] top-[0.91px]">3 days ago</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex items-start justify-between relative size-full">
        <Heading4 />
        <Text3 />
      </div>
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="h-[19.488px] overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-0 not-italic text-[#a8b3cf] text-[13px] top-[0.91px] tracking-[-0.0762px]">University of California, Irvine</p>
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="h-[21.002px] overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#a8b3cf] text-[14px] top-[-0.09px] tracking-[-0.1504px] w-[449px] whitespace-pre-wrap">Hi! I saw you viewed my profile. Would you like to schedule a session?</p>
    </div>
  );
}

function Container17() {
  return (
    <div className="flex-[1_0_0] h-[70.475px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[3.993px] items-start relative size-full">
        <Container18 />
        <Paragraph7 />
        <Paragraph8 />
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="h-[100.47px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex gap-[14.997px] items-start pt-[14.997px] px-[24.995px] relative size-full">
        <ImageWithFallback3 />
        <Container17 />
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute content-stretch flex flex-col h-[403.79px] items-start left-0 top-[252.6px] w-[389.998px]" data-name="Container">
      <Container5 />
      <Container10 />
      <Container13 />
      <Container16 />
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute h-[843.999px] left-0 overflow-clip top-0 w-[389.998px]" data-name="Container">
      <Container2 />
      <Container3 />
      <Container4 />
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="h-[27.903px] relative shrink-0 w-[35.8px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[27.9px] left-0 not-italic text-[#e8edf5] text-[18.6px] top-[-0.45px] tracking-[-0.4432px]">9:41</p>
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="h-[13.995px] relative shrink-0 w-[20.992px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.9922 13.9948">
        <g clipPath="url(#clip0_15_931)" id="Icon">
          <path d={svgPaths.p14d80100} fill="var(--fill-0, black)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_15_931">
            <rect fill="white" height="13.9948" width="20.9922" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Icon2() {
  return (
    <div className="h-[13.993px] relative shrink-0 w-[18.991px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.9905 13.993">
        <g clipPath="url(#clip0_15_954)" id="Icon">
          <path d={svgPaths.p11fc94b0} fill="var(--fill-0, black)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_15_954">
            <rect fill="white" height="13.993" width="18.9905" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Icon3() {
  return (
    <div className="h-[14.995px] relative shrink-0 w-[30.99px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30.9903 14.9953">
        <g clipPath="url(#clip0_15_949)" id="Icon">
          <path d={svgPaths.p27e36c00} id="Vector" opacity="0.35" stroke="var(--stroke-0, black)" strokeWidth="1.23817" />
          <path d={svgPaths.p1afd7400} fill="var(--fill-0, black)" id="Vector_2" opacity="0.4" />
          <path d={svgPaths.p2d372b00} fill="var(--fill-0, black)" id="Vector_3" />
        </g>
        <defs>
          <clipPath id="clip0_15_949">
            <rect fill="white" height="14.9953" width="30.9903" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container19() {
  return (
    <div className="h-[14.997px] relative shrink-0 w-[86.966px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[7.997px] items-center relative size-full">
        <Icon1 />
        <Icon2 />
        <Icon3 />
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="absolute content-stretch flex h-[59.999px] items-center justify-between left-0 px-[19.996px] top-0 w-[389.998px]" data-name="StatusBar">
      <Paragraph9 />
      <Container19 />
    </div>
  );
}

function ChatInbox() {
  return (
    <div className="bg-[#1a1d29] h-[843.999px] overflow-clip relative shrink-0 w-full" data-name="ChatInbox">
      <Container1 />
      <StatusBar />
    </div>
  );
}

function Container() {
  return (
    <div className="absolute bg-[#1a1d29] content-stretch flex flex-col h-[843.999px] items-start left-[24.88px] overflow-clip rounded-[32px] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.6)] top-[56px] w-[389.998px]" data-name="Container">
      <ChatInbox />
    </div>
  );
}

function App() {
  return (
    <div className="absolute h-[956px] left-0 top-0 w-[439.76px]" data-name="App" style={{ backgroundImage: "linear-gradient(114.702deg, rgb(29, 41, 61) 0%, rgb(15, 23, 43) 50%, rgb(29, 41, 61) 100%)" }}>
      <Container />
    </div>
  );
}

function Text4() {
  return (
    <div className="absolute h-[14.997px] left-[23.28px] top-[50.99px] w-[28.222px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-[14.5px] not-italic text-[#a8b3cf] text-[10px] text-center top-[0.27px] tracking-[0.1172px]">Home</p>
    </div>
  );
}

function Icon4() {
  return (
    <div className="h-[21.998px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-[12.5%] left-[37.5%] right-[37.5%] top-1/2" data-name="Vector">
        <div className="absolute inset-[-11.11%_-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.33316 10.0832">
            <path d={svgPaths.p6964880} id="Vector" stroke="var(--stroke-0, #A8B3CF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83316" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[8.33%_12.5%_12.5%_12.5%]" data-name="Vector">
        <div className="absolute inset-[-5.26%_-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.3316 19.2487">
            <path d={svgPaths.p16bb8e00} id="Vector" stroke="var(--stroke-0, #A8B3CF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83316" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[18.4px] pt-[7.997px] px-[7.997px] rounded-[16px] size-[37.991px] top-[9px]" data-name="Container">
      <Icon4 />
    </div>
  );
}

function Button() {
  return (
    <div className="absolute h-[74.996px] left-[8px] top-0 w-[74.797px]" data-name="Button">
      <Text4 />
      <Container21 />
    </div>
  );
}

function Text5() {
  return (
    <div className="absolute h-[14.997px] left-[22.12px] top-[50.99px] w-[30.562px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-[15.5px] not-italic text-[#a8b3cf] text-[10px] text-center top-[0.27px] tracking-[0.1172px]">Tutors</p>
    </div>
  );
}

function Icon5() {
  return (
    <div className="h-[21.998px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[62.5%_33.33%_12.5%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-16.67%_-7.14%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.6653 7.33265">
            <path d={svgPaths.p2d6be200} id="Vector" stroke="var(--stroke-0, #A8B3CF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83316" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[13.03%_20.85%_54.7%_66.67%]" data-name="Vector">
        <div className="absolute inset-[-12.92%_-33.37%_-12.92%_-33.38%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.5799 8.93227">
            <path d={svgPaths.p10d2600} id="Vector" stroke="var(--stroke-0, #A8B3CF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83316" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[63.04%_8.33%_12.5%_79.17%]" data-name="Vector">
        <div className="absolute inset-[-17.04%_-33.33%_-17.03%_-33.34%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.58339 7.21422">
            <path d={svgPaths.p5e73400} id="Vector" stroke="var(--stroke-0, #A8B3CF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83316" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[12.5%_45.83%_54.16%_20.83%]" data-name="Vector">
        <div className="absolute inset-[-12.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.1665 9.1665">
            <path d={svgPaths.p3e89cd80} id="Vector" stroke="var(--stroke-0, #A8B3CF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83316" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[18.4px] pt-[7.997px] px-[7.997px] rounded-[16px] size-[37.991px] top-[9px]" data-name="Container">
      <Icon5 />
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute h-[74.996px] left-[82.79px] top-0 w-[74.797px]" data-name="Button">
      <Text5 />
      <Container22 />
    </div>
  );
}

function Text6() {
  return (
    <div className="absolute h-[14.997px] left-[15.04px] top-[50.99px] w-[44.723px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-[22.5px] not-italic text-[#a8b3cf] text-[10px] text-center top-[0.27px] tracking-[0.1172px]">Schedule</p>
    </div>
  );
}

function Icon6() {
  return (
    <div className="h-[21.998px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-3/4 left-[33.33%] right-[66.67%] top-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-25%_-0.92px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.83316 5.49983">
            <path d="M0.916582 0.916582V4.58325" id="Vector" stroke="var(--stroke-0, #A8B3CF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83316" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-3/4 left-[66.67%] right-[33.33%] top-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-25%_-0.92px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.83316 5.49983">
            <path d="M0.916582 0.916582V4.58325" id="Vector" stroke="var(--stroke-0, #A8B3CF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83316" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[16.67%_12.5%_8.33%_12.5%]" data-name="Vector">
        <div className="absolute inset-[-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.3316 18.3316">
            <path d={svgPaths.p2e6d6000} id="Vector" stroke="var(--stroke-0, #A8B3CF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83316" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[41.67%_12.5%_58.33%_12.5%]" data-name="Vector">
        <div className="absolute inset-[-0.92px_-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.3316 1.83316">
            <path d="M0.916582 0.916582H17.4151" id="Vector" stroke="var(--stroke-0, #A8B3CF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83316" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[18.4px] pt-[7.997px] px-[7.997px] rounded-[16px] size-[37.991px] top-[9px]" data-name="Container">
      <Icon6 />
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute h-[74.996px] left-[157.59px] top-0 w-[74.797px]" data-name="Button">
      <Text6 />
      <Container23 />
    </div>
  );
}

function Text7() {
  return (
    <div className="absolute h-[14.997px] left-[25.54px] top-[50.99px] w-[23.711px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-[12px] not-italic text-[#5b7ceb] text-[10px] text-center top-[0.27px] tracking-[0.1172px]">Chat</p>
    </div>
  );
}

function Container24() {
  return <div className="absolute h-[3.993px] left-[13.39px] rounded-[21385400px] top-0 w-[47.999px]" data-name="Container" style={{ backgroundImage: "linear-gradient(175.244deg, rgb(67, 97, 217) 0%, rgb(91, 124, 235) 100%)" }} />;
}

function Icon7() {
  return (
    <div className="h-[23.098px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-6.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.6543 21.6544">
            <path d={svgPaths.p6cde380} id="Vector" stroke="var(--stroke-0, #5B7CEB)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.40603" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="absolute bg-[rgba(91,124,235,0.1)] content-stretch flex flex-col items-start left-[17.45px] pt-[8.396px] px-[8.396px] rounded-[16px] size-[39.891px] top-[8.05px]" data-name="Container">
      <Icon7 />
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute h-[74.996px] left-[232.39px] top-0 w-[74.797px]" data-name="Button">
      <Text7 />
      <Container24 />
      <Container25 />
    </div>
  );
}

function Text8() {
  return (
    <div className="absolute h-[14.997px] left-[21.86px] top-[50.99px] w-[31.08px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-[16.5px] not-italic text-[#a8b3cf] text-[10px] text-center top-[0.27px] tracking-[0.1172px]">Profile</p>
    </div>
  );
}

function Icon8() {
  return (
    <div className="h-[21.998px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[62.5%_20.83%_12.5%_20.83%]" data-name="Vector">
        <div className="absolute inset-[-16.67%_-7.14%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.6653 7.33265">
            <path d={svgPaths.p2d6be200} id="Vector" stroke="var(--stroke-0, #A8B3CF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83316" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[12.5%_33.33%_54.16%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-12.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.1665 9.1665">
            <path d={svgPaths.p3e89cd80} id="Vector" stroke="var(--stroke-0, #A8B3CF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83316" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[18.4px] pt-[7.997px] px-[7.997px] rounded-[16px] size-[37.991px] top-[9px]" data-name="Container">
      <Icon8 />
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute h-[74.996px] left-[307.18px] top-0 w-[74.797px]" data-name="Button">
      <Text8 />
      <Container26 />
    </div>
  );
}

function Container20() {
  return (
    <div className="h-[74.996px] relative shrink-0 w-full" data-name="Container">
      <Button />
      <Button1 />
      <Button2 />
      <Button3 />
      <Button4 />
    </div>
  );
}

function BottomNav() {
  return (
    <div className="absolute bg-[rgba(30,33,57,0.8)] content-stretch flex flex-col h-[75.634px] items-start left-0 pl-[24.876px] pr-[24.886px] pt-[0.637px] top-[880.37px] w-[439.76px]" data-name="BottomNav">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.1)] border-solid border-t-[0.637px] inset-0 pointer-events-none" />
      <Container20 />
    </div>
  );
}

export default function OcMentorsMobilePrototypeCopy() {
  return (
    <div className="bg-[#1a1d29] relative size-full" data-name="OC Mentors Mobile Prototype (Copy)">
      <App />
      <BottomNav />
    </div>
  );
}
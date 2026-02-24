import svgPaths from "./svg-7ytfg5hjyn";
import imgImageWithFallback from "figma:asset/bae2b9e32f95456a531512097e56886125248d42.png";

function Paragraph() {
  return (
    <div className="h-[27.903px] relative shrink-0 w-[35.8px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[27.9px] left-0 not-italic text-[#e8edf5] text-[18.6px] top-[-0.45px] tracking-[-0.4432px]">9:41</p>
      </div>
    </div>
  );
}

function Icon() {
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

function Icon1() {
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

function Icon2() {
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

function Container1() {
  return (
    <div className="h-[14.997px] relative shrink-0 w-[86.966px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[7.997px] items-center relative size-full">
        <Icon />
        <Icon1 />
        <Icon2 />
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="absolute content-stretch flex h-[59.999px] items-center justify-between left-0 px-[19.996px] top-0 w-[389.998px]" data-name="StatusBar">
      <Paragraph />
      <Container1 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="h-[24px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-1/4 left-[37.5%] right-[37.5%] top-1/4" data-name="Vector">
        <div className="absolute inset-[-8.33%_-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.99997 14">
            <path d={svgPaths.p23307500} id="Vector" stroke="var(--stroke-0, #E8EDF5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99997" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[15.99px] pt-[7.997px] px-[7.997px] rounded-[10px] size-[39.993px] top-[63.99px]" data-name="Button">
      <Icon3 />
    </div>
  );
}

function ImageWithFallback() {
  return (
    <div className="relative rounded-[21385400px] shrink-0 size-[39.993px]" data-name="ImageWithFallback">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-cover pointer-events-none rounded-[21385400px] size-full" src={imgImageWithFallback} />
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[27.007px] relative shrink-0 w-[130.424px]" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[27px] left-0 not-italic text-[#e8edf5] text-[18px] top-[0.55px] tracking-[-0.4395px]">Debra Peterson</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute content-stretch flex gap-[9.998px] h-[39.993px] items-center left-[56px] top-[60px] w-[180.415px]" data-name="Container">
      <ImageWithFallback />
      <Heading />
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute bg-[#1a1d29] border-[rgba(255,255,255,0.12)] border-b-[0.637px] border-solid h-[99.992px] left-0 top-0 w-[389.998px]" data-name="Container">
      <Button />
      <Container3 />
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[39.993px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[14px] text-white top-[0.27px] tracking-[-0.1504px] w-[205px] whitespace-pre-wrap">Hi! I saw your profile and would love to book a session with you.</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[14.997px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[10px] text-[rgba(255,255,255,0.7)] top-[0.27px] tracking-[0.1172px]">10:30 AM</p>
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4.999px] h-[79.985px] items-start left-[105.01px] pt-[9.998px] px-[14.997px] rounded-[15px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] top-0 w-[244.995px]" data-name="Container" style={{ backgroundImage: "linear-gradient(161.919deg, rgb(67, 97, 217) 0%, rgb(91, 124, 235) 100%)" }}>
      <Paragraph1 />
      <Paragraph2 />
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[39.993px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#e8edf5] text-[14px] top-[0.27px] tracking-[-0.1504px] w-[212px] whitespace-pre-wrap">Hello! That would be great. What subject do you need help with?</p>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="h-[14.997px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#a8b3cf] text-[10px] top-[0.27px] tracking-[0.1172px]">10:32 AM</p>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute bg-[#1e2139] content-stretch flex flex-col gap-[4.999px] h-[79.985px] items-start left-0 pt-[9.998px] px-[14.997px] rounded-[15px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] top-[94.98px] w-[244.995px]" data-name="Container">
      <Paragraph3 />
      <Paragraph4 />
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="h-[59.989px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[14px] text-white top-[0.27px] tracking-[-0.1504px] w-[164px] whitespace-pre-wrap">I need help with Math 2A, specifically matrices and derivatives.</p>
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="h-[14.997px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[10px] text-[rgba(255,255,255,0.7)] top-[0.27px] tracking-[0.1172px]">10:33 AM</p>
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4.999px] h-[99.982px] items-start left-[105.01px] pt-[9.998px] px-[14.997px] rounded-[15px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] top-[189.97px] w-[244.995px]" data-name="Container" style={{ backgroundImage: "linear-gradient(157.8deg, rgb(67, 97, 217) 0%, rgb(91, 124, 235) 100%)" }}>
      <Paragraph5 />
      <Paragraph6 />
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="h-[59.989px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#e8edf5] text-[14px] top-[0.27px] tracking-[-0.1504px] w-[212px] whitespace-pre-wrap">Perfect! I can definitely help with that. When would you like to schedule a session?</p>
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="h-[14.997px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-0 not-italic text-[#a8b3cf] text-[10px] top-[0.27px] tracking-[0.1172px]">10:35 AM</p>
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute bg-[#1e2139] content-stretch flex flex-col gap-[4.999px] h-[99.982px] items-start left-0 pt-[9.998px] px-[14.997px] rounded-[15px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] top-[304.94px] w-[244.995px]" data-name="Container">
      <Paragraph7 />
      <Paragraph8 />
    </div>
  );
}

function Container5() {
  return (
    <div className="h-[404.926px] relative shrink-0 w-full" data-name="Container">
      <Container6 />
      <Container7 />
      <Container8 />
      <Container9 />
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute content-stretch flex flex-col h-[594.015px] items-start left-0 overflow-clip pt-[19.996px] px-[19.996px] top-[99.99px] w-[389.998px]" data-name="Container">
      <Container5 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="absolute left-[110.58px] size-[17.995px] top-[13.49px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.9947 17.9947">
        <g clipPath="url(#clip0_15_1519)" id="Icon">
          <path d="M5.99824 1.49956V4.49868" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.49956" />
          <path d="M11.9965 1.49956V4.49868" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.49956" />
          <path d={svgPaths.p24b87580} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.49956" />
          <path d="M2.24934 7.4978H15.7454" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.49956" />
        </g>
        <defs>
          <clipPath id="clip0_15_1519">
            <rect fill="white" height="17.9947" width="17.9947" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute h-[44.992px] left-[20px] rounded-[10px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] top-[639.02px] w-[350.006px]" data-name="Button" style={{ backgroundImage: "linear-gradient(172.675deg, rgb(67, 97, 217) 0%, rgb(91, 124, 235) 100%)" }}>
      <Icon4 />
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22.5px] left-[188.07px] not-italic text-[15px] text-center text-white top-[10.15px] tracking-[-0.2344px]">Book a Lesson</p>
    </div>
  );
}

function TextInput() {
  return (
    <div className="bg-[#2a2f4a] flex-[1_0_0] h-[44.992px] min-h-px min-w-px relative rounded-[25px]" data-name="Text Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[20px] relative size-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#a8b3cf] text-[14px] tracking-[-0.1504px]">Type a message...</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[0.637px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[25px]" />
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[19.996px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9963 19.9963">
        <g clipPath="url(#clip0_15_1515)" id="Icon">
          <path d={svgPaths.p1181b5c0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66636" />
          <path d={svgPaths.p12efb0a0} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66636" />
        </g>
        <defs>
          <clipPath id="clip0_15_1515">
            <rect fill="white" height="19.9963" width="19.9963" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="relative rounded-[21385400px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] shrink-0 size-[44.992px]" data-name="Button" style={{ backgroundImage: "linear-gradient(135deg, rgb(67, 97, 217) 0%, rgb(91, 124, 235) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon5 />
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute bg-[#1a1d29] content-stretch flex gap-[9.998px] h-[79.995px] items-center left-0 pt-[0.637px] px-[19.996px] top-[694.01px] w-[389.998px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.12)] border-solid border-t-[0.637px] inset-0 pointer-events-none" />
      <TextInput />
      <Button2 />
    </div>
  );
}

function Chat() {
  return (
    <div className="bg-[#1a1d29] h-[843.999px] overflow-clip relative shrink-0 w-full" data-name="Chat">
      <StatusBar />
      <Container2 />
      <Container4 />
      <Button1 />
      <Container10 />
    </div>
  );
}

function Container() {
  return (
    <div className="absolute bg-[#1a1d29] content-stretch flex flex-col h-[843.999px] items-start left-[24.88px] overflow-clip rounded-[32px] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.6)] top-[56px] w-[389.998px]" data-name="Container">
      <Chat />
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

function Text() {
  return (
    <div className="absolute h-[14.997px] left-[23.28px] top-[50.99px] w-[28.222px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-[14.5px] not-italic text-[#a8b3cf] text-[10px] text-center top-[0.27px] tracking-[0.1172px]">Home</p>
    </div>
  );
}

function Icon6() {
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

function Container12() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[18.4px] pt-[7.997px] px-[7.997px] rounded-[16px] size-[37.991px] top-[9px]" data-name="Container">
      <Icon6 />
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute h-[74.996px] left-[8px] top-0 w-[74.797px]" data-name="Button">
      <Text />
      <Container12 />
    </div>
  );
}

function Text1() {
  return (
    <div className="absolute h-[14.997px] left-[22.12px] top-[50.99px] w-[30.562px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-[15.5px] not-italic text-[#a8b3cf] text-[10px] text-center top-[0.27px] tracking-[0.1172px]">Tutors</p>
    </div>
  );
}

function Icon7() {
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

function Container13() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[18.4px] pt-[7.997px] px-[7.997px] rounded-[16px] size-[37.991px] top-[9px]" data-name="Container">
      <Icon7 />
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute h-[74.996px] left-[82.79px] top-0 w-[74.797px]" data-name="Button">
      <Text1 />
      <Container13 />
    </div>
  );
}

function Text2() {
  return (
    <div className="absolute h-[14.997px] left-[15.04px] top-[50.99px] w-[44.723px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-[22.5px] not-italic text-[#a8b3cf] text-[10px] text-center top-[0.27px] tracking-[0.1172px]">Schedule</p>
    </div>
  );
}

function Icon8() {
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

function Container14() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[18.4px] pt-[7.997px] px-[7.997px] rounded-[16px] size-[37.991px] top-[9px]" data-name="Container">
      <Icon8 />
    </div>
  );
}

function Button5() {
  return (
    <div className="absolute h-[74.996px] left-[157.59px] top-0 w-[74.797px]" data-name="Button">
      <Text2 />
      <Container14 />
    </div>
  );
}

function Text3() {
  return (
    <div className="absolute h-[14.997px] left-[25.54px] top-[50.99px] w-[23.711px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-[12px] not-italic text-[#5b7ceb] text-[10px] text-center top-[0.27px] tracking-[0.1172px]">Chat</p>
    </div>
  );
}

function Container15() {
  return <div className="absolute h-[3.993px] left-[13.39px] rounded-[21385400px] top-0 w-[47.999px]" data-name="Container" style={{ backgroundImage: "linear-gradient(175.244deg, rgb(67, 97, 217) 0%, rgb(91, 124, 235) 100%)" }} />;
}

function Icon9() {
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

function Container16() {
  return (
    <div className="absolute bg-[rgba(91,124,235,0.1)] content-stretch flex flex-col items-start left-[17.45px] pt-[8.396px] px-[8.396px] rounded-[16px] size-[39.891px] top-[8.05px]" data-name="Container">
      <Icon9 />
    </div>
  );
}

function Button6() {
  return (
    <div className="absolute h-[74.996px] left-[232.39px] top-0 w-[74.797px]" data-name="Button">
      <Text3 />
      <Container15 />
      <Container16 />
    </div>
  );
}

function Text4() {
  return (
    <div className="absolute h-[14.997px] left-[21.86px] top-[50.99px] w-[31.08px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-[16.5px] not-italic text-[#a8b3cf] text-[10px] text-center top-[0.27px] tracking-[0.1172px]">Profile</p>
    </div>
  );
}

function Icon10() {
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

function Container17() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[18.4px] pt-[7.997px] px-[7.997px] rounded-[16px] size-[37.991px] top-[9px]" data-name="Container">
      <Icon10 />
    </div>
  );
}

function Button7() {
  return (
    <div className="absolute h-[74.996px] left-[307.18px] top-0 w-[74.797px]" data-name="Button">
      <Text4 />
      <Container17 />
    </div>
  );
}

function Container11() {
  return (
    <div className="h-[74.996px] relative shrink-0 w-full" data-name="Container">
      <Button3 />
      <Button4 />
      <Button5 />
      <Button6 />
      <Button7 />
    </div>
  );
}

function BottomNav() {
  return (
    <div className="absolute bg-[rgba(30,33,57,0.8)] content-stretch flex flex-col h-[75.634px] items-start left-0 pl-[24.876px] pr-[24.886px] pt-[0.637px] top-[880.37px] w-[439.76px]" data-name="BottomNav">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.1)] border-solid border-t-[0.637px] inset-0 pointer-events-none" />
      <Container11 />
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
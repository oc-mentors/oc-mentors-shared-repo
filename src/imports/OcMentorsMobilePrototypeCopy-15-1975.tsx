import svgPaths from "./svg-8rsu2rbec9";
import imgImageWithFallback from "figma:asset/f270b68e17a2d97d4bac76f8f8914ed7b695282f.png";
import imgImageWithFallback1 from "figma:asset/bae2b9e32f95456a531512097e56886125248d42.png";

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

function Paragraph1() {
  return (
    <div className="absolute h-[29.994px] left-[27.99px] top-0 w-[51.106px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[30px] left-0 not-italic text-[#4f4f4f] text-[20px] top-[0.19px] tracking-[-0.4492px]">Zoom</p>
    </div>
  );
}

function Icon3() {
  return (
    <div className="absolute h-[5.995px] left-[87.1px] top-[12px] w-[8.992px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.99238 5.99492">
        <g clipPath="url(#clip0_15_1998)" id="Icon">
          <path clipRule="evenodd" d={svgPaths.p38628800} fill="var(--fill-0, #4F4F4F)" fillRule="evenodd" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_15_1998">
            <rect fill="white" height="5.99492" width="8.99238" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Icon4() {
  return (
    <div className="h-[19.996px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[0_4.33%_0.75%_0]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.13 19.8472">
          <path d={svgPaths.p35633ef0} fill="var(--fill-0, #63C454)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[33.47%_24.5%_34.22%_28.14%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.4706 6.46155">
          <path clipRule="evenodd" d={svgPaths.peb5e800} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 size-[19.996px] top-[5px]" data-name="Container">
      <Icon4 />
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute h-[29.994px] left-[121.82px] top-[-1px] w-[96.088px]" data-name="Container">
      <Paragraph1 />
      <Icon3 />
      <Container4 />
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bg-[#cc3b33] h-[35.989px] left-[297.73px] rounded-[6px] top-[-3.99px] w-[74.269px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-[36.99px] not-italic text-[16px] text-center text-white top-[5.54px] tracking-[-0.3125px]">Leave</p>
    </div>
  );
}

function Icon5() {
  return (
    <div className="h-[19.996px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[0_46.47%_3.58%_0]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3803 19.2795">
          <path clipRule="evenodd" d={svgPaths.pca0c400} fill="var(--fill-0, #A8B3CF)" fillRule="evenodd" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute content-stretch flex flex-col h-[19.996px] items-start left-[17.99px] pr-[-0.996px] top-[3.99px] w-[24px]" data-name="Container">
      <Icon5 />
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute bg-[#1a1d29] h-[27.993px] left-0 top-[49.99px] w-[389.998px]" data-name="Container">
      <Container3 />
      <Button />
      <Container5 />
    </div>
  );
}

function ImageWithFallback() {
  return (
    <div className="h-[601.991px] relative shrink-0 w-full" data-name="ImageWithFallback">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageWithFallback} />
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute bg-[#101828] content-stretch flex flex-col h-[601.991px] items-start left-[60.99px] overflow-clip rounded-[8px] top-[96px] w-[267.999px]" data-name="Container">
      <ImageWithFallback />
    </div>
  );
}

function ImageWithFallback1() {
  return (
    <div className="absolute h-[187.993px] left-0 top-0 w-[158.995px]" data-name="ImageWithFallback">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageWithFallback1} />
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="flex-[1_0_0] h-[17.248px] min-h-px min-w-px relative" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[17.25px] left-0 not-italic text-[#4f4f4f] text-[11.5px] top-[-0.09px] tracking-[0.0337px]">Debra</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute bg-white content-stretch flex h-[21.231px] items-center left-[6.99px] px-[4.999px] rounded-[2px] top-[156.76px] w-[42.881px]" data-name="Container">
      <Paragraph2 />
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute bg-[#b3b3b3] h-[187.993px] left-[225.01px] overflow-clip rounded-[4px] top-[519px] w-[158.995px]" data-name="Container">
      <ImageWithFallback1 />
      <Container8 />
    </div>
  );
}

function Icon6() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[16.999px]" data-name="Icon">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <div className="absolute bottom-[8.33%] left-1/2 right-1/2 top-[79.17%]" data-name="Vector">
          <div className="absolute inset-[-22.67%_-0.71px]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.41657 4.541">
              <path d="M0.708286 0.708286V3.83271" id="Vector" stroke="var(--stroke-0, #4F4F4F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.41657" />
            </svg>
          </div>
        </div>
        <div className="absolute inset-[8.41%_37.5%_61.08%_38.83%]" data-name="Vector">
          <div className="absolute inset-[-9.29%_-17.61%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.43984 9.0423">
              <path d={svgPaths.p2e241100} id="Vector" stroke="var(--stroke-0, #4F4F4F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.41657" />
            </svg>
          </div>
        </div>
        <div className="absolute inset-[41.67%_29.37%_20.83%_20.83%]" data-name="Vector">
          <div className="absolute inset-[-7.56%_-8.37%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.88067 10.7904">
              <path d={svgPaths.p98a9300} id="Vector" stroke="var(--stroke-0, #4F4F4F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.41657" />
            </svg>
          </div>
        </div>
        <div className="absolute inset-[41.67%_20.83%_44.88%_78.71%]" data-name="Vector">
          <div className="absolute inset-[-21.06%_-909.09%_-21.06%_-909.18%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.49456 4.78061">
              <path d={svgPaths.p17d22a00} id="Vector" stroke="var(--stroke-0, #4F4F4F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.41657" />
            </svg>
          </div>
        </div>
        <div className="absolute inset-[8.33%]" data-name="Vector">
          <div className="absolute inset-[-3.4%_-5%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.5824 22.2462">
              <path d={svgPaths.p1832f800} id="Vector" stroke="var(--stroke-0, #4F4F4F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.41657" />
            </svg>
          </div>
        </div>
        <div className="absolute inset-[37.5%_41.17%_37.51%_37.5%]" data-name="Vector">
          <div className="absolute inset-[-11.34%_-19.53%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.04307 7.66275">
              <path d={svgPaths.p31942200} id="Vector" stroke="var(--stroke-0, #4F4F4F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.41657" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[16.501px] relative shrink-0 w-[41.088px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] left-[21px] not-italic text-[#4f4f4f] text-[11px] text-center top-[0.27px] tracking-[0.0645px]">Unmute</p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[3.993px] h-[45.49px] items-center left-[40.34px] top-[21.25px] w-[41.088px]" data-name="Button">
      <Icon6 />
      <Paragraph3 />
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="absolute h-[16.501px] left-0 top-[20.99px] w-[29.985px]" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] left-[15.5px] not-italic text-[#4f4f4f] text-[11px] text-center top-[0.27px] tracking-[0.0645px]">Video</p>
    </div>
  );
}

function Icon7() {
  return (
    <div className="absolute left-0 size-[27.993px] top-0" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27.9929 27.9929">
        <g id="Icon">
          <path d={svgPaths.p3f480a80} id="Vector" stroke="var(--stroke-0, #4F4F4F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33274" />
          <path d={svgPaths.p22ad2900} id="Vector_2" stroke="var(--stroke-0, #4F4F4F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33274" />
        </g>
      </svg>
    </div>
  );
}

function Container11() {
  return <div className="absolute bg-[#67d669] border-[#f2f2f2] border-[0.637px] border-solid left-[23.99px] rounded-[21385400px] size-[7.997px] top-[-3.99px]" data-name="Container" />;
}

function Container10() {
  return (
    <div className="absolute h-[16.999px] left-px top-0 w-[27.993px]" data-name="Container">
      <Icon7 />
      <Container11 />
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute h-[37.493px] left-[116.13px] top-[25.24px] w-[29.985px]" data-name="Button">
      <Paragraph4 />
      <Container10 />
    </div>
  );
}

function Icon8() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[26.997px]" data-name="Icon">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <div className="absolute inset-[62.5%_33.33%_12.5%_8.33%]" data-name="Vector">
          <div className="absolute inset-[-22.5%_-7.14%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.998 7.24884">
              <path d={svgPaths.p2265c900} id="Vector" stroke="var(--stroke-0, #4F4F4F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.24975" />
            </svg>
          </div>
        </div>
        <div className="absolute inset-[13.03%_20.85%_54.7%_66.67%]" data-name="Vector">
          <div className="absolute inset-[-17.44%_-33.38%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.62032 8.70232">
              <path d={svgPaths.p27339900} id="Vector" stroke="var(--stroke-0, #4F4F4F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.24975" />
            </svg>
          </div>
        </div>
        <div className="absolute inset-[63.04%_8.33%_12.5%_79.17%]" data-name="Vector">
          <div className="absolute inset-[-23%_-33.33%_-23%_-33.34%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.62459 7.14073">
              <path d={svgPaths.p2a2b9f80} id="Vector" stroke="var(--stroke-0, #4F4F4F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.24975" />
            </svg>
          </div>
        </div>
        <div className="absolute inset-[12.5%_45.83%_54.17%_20.83%]" data-name="Vector">
          <div className="absolute inset-[-16.88%_-12.5%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.2488 8.9152">
              <path d={svgPaths.p11ab4a00} id="Vector" stroke="var(--stroke-0, #4F4F4F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.24975" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="h-[17.995px] relative shrink-0 w-[38.598px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[19.5px] not-italic text-[#4f4f4f] text-[12px] text-center top-[0.91px]">People</p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[3.993px] h-[41.984px] items-center left-[247.52px] top-[23px] w-[38.598px]" data-name="Button">
      <Icon8 />
      <Paragraph5 />
    </div>
  );
}

function Icon9() {
  return (
    <div className="relative shrink-0 size-[22.994px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.9938 22.9938">
        <g id="Icon">
          <path d={svgPaths.p12dba180} id="Vector" stroke="var(--stroke-0, #4F4F4F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.91615" />
          <path d={svgPaths.p30f68e00} id="Vector_2" stroke="var(--stroke-0, #4F4F4F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.91615" />
          <path d={svgPaths.p231cbb00} id="Vector_3" stroke="var(--stroke-0, #4F4F4F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.91615" />
        </g>
      </svg>
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="h-[17.995px] relative shrink-0 w-[28.819px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[14px] not-italic text-[#4f4f4f] text-[12px] text-center top-[0.91px]">More</p>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[15.993px] h-[38.987px] items-center left-[320.83px] top-[24.5px] w-[28.819px]" data-name="Button">
      <Icon9 />
      <Paragraph6 />
    </div>
  );
}

function Icon10() {
  return (
    <div className="absolute left-0 size-[31.996px] top-0" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.9961 31.9961">
        <g id="Icon">
          <path d={svgPaths.pe375180} id="Vector" stroke="var(--stroke-0, #63C454)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99976" />
          <path d="M15.9981 17.3312V9.3322" id="Vector_2" stroke="var(--stroke-0, #63C454)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99976" />
          <path d={svgPaths.p18f66f00} id="Vector_3" stroke="var(--stroke-0, #63C454)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99976" />
          <path d="M15.9981 22.6639V27.9966" id="Vector_4" stroke="var(--stroke-0, #63C454)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99976" />
          <path d="M10.6654 27.9966H21.3307" id="Vector_5" stroke="var(--stroke-0, #63C454)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99976" />
        </g>
      </svg>
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="absolute h-[17.995px] left-[-21.7px] top-[30.99px] w-[75.395px]" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[38px] not-italic text-[#63c454] text-[12px] text-center top-[0.91px]">Share Screen</p>
    </div>
  );
}

function Button5() {
  return (
    <div className="absolute h-[22.994px] left-[180.82px] top-[32.49px] w-[31.996px]" data-name="Button">
      <Icon10 />
      <Paragraph7 />
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute bg-[#f2f2f2] h-[87.992px] left-0 top-[730.02px] w-[389.998px]" data-name="Container">
      <Button1 />
      <Button2 />
      <Button3 />
      <Button4 />
      <Button5 />
    </div>
  );
}

function ZoomMeeting() {
  return (
    <div className="bg-[#1a1d29] h-[843.999px] overflow-clip relative shrink-0 w-full" data-name="ZoomMeeting">
      <StatusBar />
      <Container2 />
      <Container6 />
      <Container7 />
      <Container9 />
    </div>
  );
}

function Container() {
  return (
    <div className="absolute bg-[#1a1d29] content-stretch flex flex-col h-[843.999px] items-start left-[24.88px] overflow-clip rounded-[32px] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.6)] top-[56px] w-[389.998px]" data-name="Container">
      <ZoomMeeting />
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

function Icon11() {
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

function Container13() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[18.4px] pt-[7.997px] px-[7.997px] rounded-[16px] size-[37.991px] top-[9px]" data-name="Container">
      <Icon11 />
    </div>
  );
}

function Button6() {
  return (
    <div className="absolute h-[74.996px] left-[8px] top-0 w-[74.797px]" data-name="Button">
      <Text />
      <Container13 />
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

function Icon12() {
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

function Container14() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[18.4px] pt-[7.997px] px-[7.997px] rounded-[16px] size-[37.991px] top-[9px]" data-name="Container">
      <Icon12 />
    </div>
  );
}

function Button7() {
  return (
    <div className="absolute h-[74.996px] left-[82.79px] top-0 w-[74.797px]" data-name="Button">
      <Text1 />
      <Container14 />
    </div>
  );
}

function Text2() {
  return (
    <div className="absolute h-[14.997px] left-[14.06px] top-[50.99px] w-[46.665px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-[23.5px] not-italic text-[#5b7ceb] text-[10px] text-center top-[0.27px] tracking-[0.1172px]">Schedule</p>
    </div>
  );
}

function Container15() {
  return <div className="absolute h-[3.993px] left-[13.39px] rounded-[21385400px] top-0 w-[47.999px]" data-name="Container" style={{ backgroundImage: "linear-gradient(175.244deg, rgb(67, 97, 217) 0%, rgb(91, 124, 235) 100%)" }} />;
}

function Icon13() {
  return (
    <div className="h-[23.098px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-3/4 left-[33.33%] right-[66.67%] top-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-31.25%_-1.2px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.40603 6.25567">
            <path d="M1.20301 1.20301V5.05265" id="Vector" stroke="var(--stroke-0, #5B7CEB)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.40603" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-3/4 left-[66.67%] right-[33.33%] top-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-31.25%_-1.2px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.40603 6.25567">
            <path d="M1.20301 1.20301V5.05265" id="Vector" stroke="var(--stroke-0, #5B7CEB)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.40603" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[16.67%_12.5%_8.33%_12.5%]" data-name="Vector">
        <div className="absolute inset-[-6.94%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.7294 19.7294">
            <path d={svgPaths.p199da280} id="Vector" stroke="var(--stroke-0, #5B7CEB)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.40603" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[41.67%_12.5%_58.33%_12.5%]" data-name="Vector">
        <div className="absolute inset-[-1.2px_-6.94%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.7294 2.40603">
            <path d="M1.20301 1.20301H18.5264" id="Vector" stroke="var(--stroke-0, #5B7CEB)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.40603" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute bg-[rgba(91,124,235,0.1)] content-stretch flex flex-col items-start left-[17.45px] pt-[8.396px] px-[8.396px] rounded-[16px] size-[39.891px] top-[8.05px]" data-name="Container">
      <Icon13 />
    </div>
  );
}

function Button8() {
  return (
    <div className="absolute h-[74.996px] left-[157.59px] top-0 w-[74.797px]" data-name="Button">
      <Text2 />
      <Container15 />
      <Container16 />
    </div>
  );
}

function Text3() {
  return (
    <div className="absolute h-[14.997px] left-[26.06px] top-[50.99px] w-[22.665px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-[11.5px] not-italic text-[#a8b3cf] text-[10px] text-center top-[0.27px] tracking-[0.1172px]">Chat</p>
    </div>
  );
}

function Icon14() {
  return (
    <div className="h-[21.998px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.34%_8.33%_8.33%_8.34%]" data-name="Vector">
        <div className="absolute inset-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.1648 20.1649">
            <path d={svgPaths.p372f5b80} id="Vector" stroke="var(--stroke-0, #A8B3CF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.83316" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[18.4px] pt-[7.997px] px-[7.997px] rounded-[16px] size-[37.991px] top-[9px]" data-name="Container">
      <Icon14 />
    </div>
  );
}

function Button9() {
  return (
    <div className="absolute h-[74.996px] left-[232.39px] top-0 w-[74.797px]" data-name="Button">
      <Text3 />
      <Container17 />
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

function Icon15() {
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

function Container18() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[18.4px] pt-[7.997px] px-[7.997px] rounded-[16px] size-[37.991px] top-[9px]" data-name="Container">
      <Icon15 />
    </div>
  );
}

function Button10() {
  return (
    <div className="absolute h-[74.996px] left-[307.18px] top-0 w-[74.797px]" data-name="Button">
      <Text4 />
      <Container18 />
    </div>
  );
}

function Container12() {
  return (
    <div className="h-[74.996px] relative shrink-0 w-full" data-name="Container">
      <Button6 />
      <Button7 />
      <Button8 />
      <Button9 />
      <Button10 />
    </div>
  );
}

function BottomNav() {
  return (
    <div className="absolute bg-[rgba(30,33,57,0.8)] content-stretch flex flex-col h-[75.634px] items-start left-0 pl-[24.876px] pr-[24.886px] pt-[0.637px] top-[880.37px] w-[439.76px]" data-name="BottomNav">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.1)] border-solid border-t-[0.637px] inset-0 pointer-events-none" />
      <Container12 />
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
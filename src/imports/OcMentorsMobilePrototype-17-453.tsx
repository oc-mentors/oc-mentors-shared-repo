import svgPaths from "./svg-ncbm4ttepm";
import imgImageWithFallback from "figma:asset/697ee4bad0c9b8dee3820be1652b6dfb55e80227.png";

function Profile1() {
  return (
    <div className="absolute h-[45.002px] left-[65.96px] top-[145.99px] w-[210.061px]" data-name="Profile">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[45px] left-0 not-italic text-[#e8edf5] text-[30px] top-[0.46px] tracking-[0.3955px]">Nora Anderson</p>
    </div>
  );
}

function Profile2() {
  return (
    <div className="absolute h-[21.002px] left-[76.33px] top-[194.98px] w-[189.328px]" data-name="Profile">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#a8b3cf] text-[14px] top-[-0.09px] tracking-[-0.1504px]">University of California, Irvine</p>
    </div>
  );
}

function Profile3() {
  return (
    <div className="absolute h-[19.488px] left-[81.82px] top-[219.98px] w-[178.364px]" data-name="Profile">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-[0.31px] not-italic text-[#a8b3cf] text-[13px] top-[1.27px] tracking-[-0.0762px] w-[195px] whitespace-pre-wrap">Computer Science • 2nd Year</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[16.501px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] left-0 not-italic text-[#a8b3cf] text-[11px] top-[0.27px] tracking-[0.0645px] w-[166px] whitespace-pre-wrap">Member since September 2023</p>
    </div>
  );
}

function Profile4() {
  return (
    <div className="absolute bg-[#2a2f4a] content-stretch flex flex-col h-[28.491px] items-start left-[72.47px] pt-[5.995px] px-[15.993px] rounded-[21385400px] top-[251.47px] w-[197.065px]" data-name="Profile">
      <Paragraph />
    </div>
  );
}

function ImageWithFallback() {
  return (
    <div className="absolute left-0 rounded-[24px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] size-[129.996px] top-0" data-name="ImageWithFallback">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[24px]">
        <div className="absolute bg-[rgba(255,255,255,0)] inset-0 rounded-[24px]" />
        <img alt="" className="absolute max-w-none object-cover rounded-[24px] size-full" src={imgImageWithFallback} />
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="h-[19.996px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.32%]" data-name="Vector">
        <div className="absolute inset-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.334 18.334">
            <path d={svgPaths.p1252e600} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66636" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-3/4 left-[83.33%] right-[16.67%] top-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-25%_-0.83px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.66636 4.99908">
            <path d="M0.833181 0.833181V4.1659" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66636" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[83.33%] left-3/4 right-[8.33%] top-[16.67%]" data-name="Vector">
        <div className="absolute inset-[-0.83px_-25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.99908 1.66636">
            <path d="M4.1659 0.833181H0.833181" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66636" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[8.33%] left-[8.33%] right-3/4 top-3/4" data-name="Vector">
        <div className="absolute inset-[-25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.99908 4.99908">
            <path d={svgPaths.p2b9c0340} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66636" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute bg-gradient-to-b content-stretch flex flex-col from-[#4361d9] items-start left-[102px] pt-[7.997px] px-[7.997px] rounded-[16px] shadow-[0px_4px_24px_0px_rgba(91,124,235,0.25)] size-[35.989px] to-[#7c98f2] top-[102px]" data-name="Container">
      <Icon />
    </div>
  );
}

function Profile5() {
  return (
    <div className="absolute left-[106px] size-[129.996px] top-0" data-name="Profile">
      <ImageWithFallback />
      <Container3 />
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute h-[279.959px] left-[24px] top-[60px] w-[341.999px]" data-name="Container">
      <Profile1 />
      <Profile2 />
      <Profile3 />
      <Profile4 />
      <Profile5 />
    </div>
  );
}

function Text() {
  return (
    <div className="h-[24px] relative shrink-0 w-[18.503px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[24px] left-0 not-italic text-[16px] text-white top-[-0.45px] tracking-[-0.3125px]">16</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[33px] rounded-[16.4px] size-[39.993px] top-[15.99px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(81, 162, 255) 0%, rgb(21, 93, 252) 100%)" }}>
      <Text />
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="absolute h-[33.002px] left-[15.99px] top-[63.98px] w-[74.01px]" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] left-[37.11px] not-italic text-[#a8b3cf] text-[11px] text-center top-[0.27px] tracking-[0.0645px] w-[43px] whitespace-pre-wrap">Lessons Taken</p>
    </div>
  );
}

function Profile6() {
  return (
    <div className="absolute bg-[#1e2139] h-[112.977px] left-0 rounded-[16px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] top-0 w-[105.996px]" data-name="Profile">
      <Container5 />
      <Paragraph1 />
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[24px] relative shrink-0 w-[20.544px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[24px] left-0 not-italic text-[16px] text-white top-[-0.45px] tracking-[-0.3125px]">24</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[33px] pr-[0.01px] rounded-[16.4px] size-[39.993px] top-[15.99px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(194, 122, 255) 0%, rgb(152, 16, 250) 100%)" }}>
      <Text1 />
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="absolute h-[33.002px] left-[15.99px] top-[63.98px] w-[74.01px]" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] left-[37.32px] not-italic text-[#a8b3cf] text-[11px] text-center top-[0.27px] tracking-[0.0645px] w-[41px] whitespace-pre-wrap">Hours Studied</p>
    </div>
  );
}

function Profile7() {
  return (
    <div className="absolute bg-[#1e2139] h-[112.977px] left-[118px] rounded-[16px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] top-0 w-[105.996px]" data-name="Profile">
      <Container6 />
      <Paragraph2 />
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[24px] relative shrink-0 w-[23.83px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[24px] left-0 not-italic text-[16px] text-white top-[-0.45px] tracking-[-0.3125px]">3.7</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[33px] pr-[0.01px] rounded-[16.4px] size-[39.993px] top-[15.99px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(251, 100, 182) 0%, rgb(230, 0, 118) 100%)" }}>
      <Text2 />
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="absolute h-[16.501px] left-[15.99px] top-[63.98px] w-[74.01px]" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] left-[37.89px] not-italic text-[#a8b3cf] text-[11px] text-center top-[0.27px] tracking-[0.0645px]">Current GPA</p>
    </div>
  );
}

function Profile8() {
  return (
    <div className="absolute bg-[#1e2139] h-[112.977px] left-[235.99px] rounded-[16px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] top-0 w-[105.996px]" data-name="Profile">
      <Container7 />
      <Paragraph3 />
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute h-[112.977px] left-[24px] top-[371.95px] w-[341.999px]" data-name="Container">
      <Profile6 />
      <Profile7 />
      <Profile8 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[19.996px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9963 19.9963">
        <g clipPath="url(#clip0_17_474)" id="Icon">
          <path d={svgPaths.pfdc8400} id="Vector" stroke="var(--stroke-0, #2B7FFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66636" />
          <path d={svgPaths.pde5f900} id="Vector_2" stroke="var(--stroke-0, #2B7FFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66636" />
        </g>
        <defs>
          <clipPath id="clip0_17_474">
            <rect fill="white" height="19.9963" width="19.9963" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container9() {
  return (
    <div className="bg-[#2a2f4a] relative rounded-[16.4px] shrink-0 size-[43.996px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon1 />
      </div>
    </div>
  );
}

function Text3() {
  return (
    <div className="flex-[1_0_0] h-[22.496px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[22.5px] left-[53.5px] not-italic text-[#e8edf5] text-[15px] text-center top-[-1.09px] tracking-[-0.2344px]">Track Progress</p>
      </div>
    </div>
  );
}

function Profile9() {
  return (
    <div className="h-[43.996px] relative shrink-0 w-[165.089px]" data-name="Profile">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[15.993px] items-center relative size-full">
        <Container9 />
        <Text3 />
      </div>
    </div>
  );
}

function Profile10() {
  return (
    <div className="h-[29.994px] relative shrink-0 w-[8.255px]" data-name="Profile">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[30px] left-[4px] not-italic text-[#a8b3cf] text-[20px] text-center top-[0.19px] tracking-[-0.4492px]">›</p>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#1e2139] h-[75.982px] relative rounded-[16px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[15.993px] relative size-full">
          <Profile9 />
          <Profile10 />
        </div>
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[19.996px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9963 19.9963">
        <g clipPath="url(#clip0_17_458)" id="Icon">
          <path d={svgPaths.pa29bd80} id="Vector" stroke="var(--stroke-0, #AD46FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66636" />
          <path d={svgPaths.p2576c800} id="Vector_2" stroke="var(--stroke-0, #AD46FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66636" />
          <path d={svgPaths.p3e5e1b40} id="Vector_3" stroke="var(--stroke-0, #AD46FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66636" />
        </g>
        <defs>
          <clipPath id="clip0_17_458">
            <rect fill="white" height="19.9963" width="19.9963" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container10() {
  return (
    <div className="bg-[#2a2f4a] relative rounded-[16.4px] shrink-0 size-[43.996px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon2 />
      </div>
    </div>
  );
}

function Text4() {
  return (
    <div className="flex-[1_0_0] h-[22.496px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[22.5px] left-[86px] not-italic text-[#e8edf5] text-[15px] text-center top-[-1.09px] tracking-[-0.2344px]">Take Learning Style Quiz</p>
      </div>
    </div>
  );
}

function Profile11() {
  return (
    <div className="h-[43.996px] relative shrink-0 w-[232.079px]" data-name="Profile">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[15.993px] items-center relative size-full">
        <Container10 />
        <Text4 />
      </div>
    </div>
  );
}

function Profile12() {
  return (
    <div className="h-[29.994px] relative shrink-0 w-[8.255px]" data-name="Profile">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[30px] left-[4px] not-italic text-[#a8b3cf] text-[20px] text-center top-[0.19px] tracking-[-0.4492px]">›</p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#1e2139] h-[75.982px] relative rounded-[16px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[15.993px] relative size-full">
          <Profile11 />
          <Profile12 />
        </div>
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[19.996px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9963 19.9963">
        <g clipPath="url(#clip0_17_468)" id="Icon">
          <path d={svgPaths.p3b70b980} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66636" />
          <path d={svgPaths.p352ba100} id="Vector_2" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66636" />
        </g>
        <defs>
          <clipPath id="clip0_17_468">
            <rect fill="white" height="19.9963" width="19.9963" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container11() {
  return (
    <div className="bg-[#2a2f4a] relative rounded-[16.4px] shrink-0 size-[43.996px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon3 />
      </div>
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[22.496px] relative shrink-0 w-[58.266px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[22.5px] left-[29px] not-italic text-[#e8edf5] text-[15px] text-center top-[-1.09px] tracking-[-0.2344px]">Settings</p>
      </div>
    </div>
  );
}

function Profile13() {
  return (
    <div className="h-[43.996px] relative shrink-0 w-[118.255px]" data-name="Profile">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[15.993px] items-center relative size-full">
        <Container11 />
        <Text5 />
      </div>
    </div>
  );
}

function Profile14() {
  return (
    <div className="h-[29.994px] relative shrink-0 w-[8.255px]" data-name="Profile">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[30px] left-[4px] not-italic text-[#a8b3cf] text-[20px] text-center top-[0.19px] tracking-[-0.4492px]">›</p>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#1e2139] h-[75.982px] relative rounded-[16px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[15.993px] relative size-full">
          <Profile13 />
          <Profile14 />
        </div>
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[19.996px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9963 19.9963">
        <g clipPath="url(#clip0_17_463)" id="Icon">
          <path d={svgPaths.pa29bd80} id="Vector" stroke="var(--stroke-0, #FF6900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66636" />
          <path d={svgPaths.p240b6f80} id="Vector_2" stroke="var(--stroke-0, #FF6900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66636" />
          <path d="M9.99817 14.1641H10.0065" id="Vector_3" stroke="var(--stroke-0, #FF6900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66636" />
        </g>
        <defs>
          <clipPath id="clip0_17_463">
            <rect fill="white" height="19.9963" width="19.9963" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container12() {
  return (
    <div className="bg-[#2a2f4a] relative rounded-[16.4px] shrink-0 size-[43.996px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon4 />
      </div>
    </div>
  );
}

function Text6() {
  return (
    <div className="h-[22.496px] relative shrink-0 w-[107.391px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[22.5px] left-[54px] not-italic text-[#e8edf5] text-[15px] text-center top-[-1.09px] tracking-[-0.2344px]">{`Help & Support`}</p>
      </div>
    </div>
  );
}

function Profile15() {
  return (
    <div className="h-[43.996px] relative shrink-0 w-[167.38px]" data-name="Profile">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[15.993px] items-center relative size-full">
        <Container12 />
        <Text6 />
      </div>
    </div>
  );
}

function Profile16() {
  return (
    <div className="h-[29.994px] relative shrink-0 w-[8.255px]" data-name="Profile">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[30px] left-[4px] not-italic text-[#a8b3cf] text-[20px] text-center top-[0.19px] tracking-[-0.4492px]">›</p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[#1e2139] h-[75.982px] relative rounded-[16px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[15.993px] relative size-full">
          <Profile15 />
          <Profile16 />
        </div>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] h-[339.928px] items-start left-[24px] top-[508.93px] w-[341.999px]" data-name="Container">
      <Button />
      <Button1 />
      <Button2 />
      <Button3 />
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute border-[1.912px] border-[rgba(255,100,103,0.5)] border-solid h-[53.994px] left-[24px] rounded-[16px] top-[872.86px] w-[341.999px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-[169.3px] not-italic text-[#fb2c36] text-[16px] text-center top-[12.63px] tracking-[-0.3125px]">Log Out</p>
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute h-[926.852px] left-0 top-[-38.24px] w-[389.998px]" data-name="Container">
      <Container2 />
      <Container4 />
      <Container8 />
      <Button4 />
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="h-[27.903px] relative shrink-0 w-[35.8px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[27.9px] left-0 not-italic text-[#e8edf5] text-[18.6px] top-[-0.45px] tracking-[-0.4432px]">9:41</p>
      </div>
    </div>
  );
}

function Icon5() {
  return (
    <div className="h-[13.995px] relative shrink-0 w-[20.992px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.9922 13.9948">
        <g clipPath="url(#clip0_17_235)" id="Icon">
          <path d={svgPaths.p14d80100} fill="var(--fill-0, black)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_17_235">
            <rect fill="white" height="13.9948" width="20.9922" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Icon6() {
  return (
    <div className="h-[13.993px] relative shrink-0 w-[18.991px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.9905 13.993">
        <g clipPath="url(#clip0_17_240)" id="Icon">
          <path d={svgPaths.p11fc94b0} fill="var(--fill-0, black)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_17_240">
            <rect fill="white" height="13.993" width="18.9905" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Icon7() {
  return (
    <div className="h-[14.995px] relative shrink-0 w-[30.99px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30.9903 14.9953">
        <g clipPath="url(#clip0_17_480)" id="Icon">
          <path d={svgPaths.p27e36c00} id="Vector" opacity="0.35" stroke="var(--stroke-0, black)" strokeWidth="1.23817" />
          <path d={svgPaths.p1afd7400} fill="var(--fill-0, black)" id="Vector_2" opacity="0.4" />
          <path d={svgPaths.p2282f900} fill="var(--fill-0, black)" id="Vector_3" />
        </g>
        <defs>
          <clipPath id="clip0_17_480">
            <rect fill="white" height="14.9953" width="30.9903" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container13() {
  return (
    <div className="h-[14.997px] relative shrink-0 w-[86.966px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[7.997px] items-center relative size-full">
        <Icon5 />
        <Icon6 />
        <Icon7 />
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="absolute content-stretch flex h-[59.999px] items-center justify-between left-0 px-[19.996px] top-[-38.24px] w-[389.998px]" data-name="StatusBar">
      <Paragraph4 />
      <Container13 />
    </div>
  );
}

function Profile() {
  return (
    <div className="bg-[#1a1d29] h-[843.999px] overflow-clip relative shrink-0 w-full" data-name="Profile">
      <Container1 />
      <StatusBar />
    </div>
  );
}

function Container() {
  return (
    <div className="absolute bg-[#1a1d29] content-stretch flex flex-col h-[843.999px] items-start left-[24.88px] overflow-clip rounded-[32px] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.6)] top-[56px] w-[389.998px]" data-name="Container">
      <Profile />
    </div>
  );
}

function Text7() {
  return (
    <div className="absolute h-[14.997px] left-[23.28px] top-[50.99px] w-[28.222px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-[14.5px] not-italic text-[#a8b3cf] text-[10px] text-center top-[0.27px] tracking-[0.1172px]">Home</p>
    </div>
  );
}

function Icon8() {
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

function Container15() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[18.4px] pt-[7.997px] px-[7.997px] rounded-[16px] size-[37.991px] top-[9px]" data-name="Container">
      <Icon8 />
    </div>
  );
}

function Button5() {
  return (
    <div className="absolute h-[74.996px] left-[8px] top-0 w-[74.797px]" data-name="Button">
      <Text7 />
      <Container15 />
    </div>
  );
}

function Text8() {
  return (
    <div className="absolute h-[14.997px] left-[22.12px] top-[50.99px] w-[30.562px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-[15.5px] not-italic text-[#a8b3cf] text-[10px] text-center top-[0.27px] tracking-[0.1172px]">Tutors</p>
    </div>
  );
}

function Icon9() {
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

function Container16() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[18.4px] pt-[7.997px] px-[7.997px] rounded-[16px] size-[37.991px] top-[9px]" data-name="Container">
      <Icon9 />
    </div>
  );
}

function Button6() {
  return (
    <div className="absolute h-[74.996px] left-[82.79px] top-0 w-[74.797px]" data-name="Button">
      <Text8 />
      <Container16 />
    </div>
  );
}

function Text9() {
  return (
    <div className="absolute h-[14.997px] left-[15.04px] top-[50.99px] w-[44.723px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-[22.5px] not-italic text-[#a8b3cf] text-[10px] text-center top-[0.27px] tracking-[0.1172px]">Schedule</p>
    </div>
  );
}

function Icon10() {
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

function Container17() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[18.4px] pt-[7.997px] px-[7.997px] rounded-[16px] size-[37.991px] top-[9px]" data-name="Container">
      <Icon10 />
    </div>
  );
}

function Button7() {
  return (
    <div className="absolute h-[74.996px] left-[157.59px] top-0 w-[74.797px]" data-name="Button">
      <Text9 />
      <Container17 />
    </div>
  );
}

function Text10() {
  return (
    <div className="absolute h-[14.997px] left-[26.06px] top-[50.99px] w-[22.665px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-[11.5px] not-italic text-[#a8b3cf] text-[10px] text-center top-[0.27px] tracking-[0.1172px]">Chat</p>
    </div>
  );
}

function Icon11() {
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

function Container18() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[18.4px] pt-[7.997px] px-[7.997px] rounded-[16px] size-[37.991px] top-[9px]" data-name="Container">
      <Icon11 />
    </div>
  );
}

function Button8() {
  return (
    <div className="absolute h-[74.996px] left-[232.39px] top-0 w-[74.797px]" data-name="Button">
      <Text10 />
      <Container18 />
    </div>
  );
}

function Text11() {
  return (
    <div className="absolute h-[14.997px] left-[20.92px] top-[50.99px] w-[32.952px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-[16px] not-italic text-[#5b7ceb] text-[10px] text-center top-[0.27px] tracking-[0.1172px]">Profile</p>
    </div>
  );
}

function Container19() {
  return <div className="absolute h-[3.993px] left-[13.39px] rounded-[21385400px] top-0 w-[47.999px]" data-name="Container" style={{ backgroundImage: "linear-gradient(175.244deg, rgb(67, 97, 217) 0%, rgb(91, 124, 235) 100%)" }} />;
}

function Icon12() {
  return (
    <div className="h-[23.098px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[62.5%_20.83%_12.5%_20.83%]" data-name="Vector">
        <div className="absolute inset-[-20.83%_-8.93%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.8798 8.1805">
            <path d={svgPaths.p2a51fd00} id="Vector" stroke="var(--stroke-0, #5B7CEB)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.40603" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[12.5%_33.33%_54.17%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-15.62%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.1053 10.1053">
            <path d={svgPaths.p360a180} id="Vector" stroke="var(--stroke-0, #5B7CEB)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.40603" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="absolute bg-[rgba(91,124,235,0.1)] content-stretch flex flex-col items-start left-[17.45px] pt-[8.396px] px-[8.396px] rounded-[16px] size-[39.891px] top-[8.05px]" data-name="Container">
      <Icon12 />
    </div>
  );
}

function Button9() {
  return (
    <div className="absolute h-[74.996px] left-[307.18px] top-0 w-[74.797px]" data-name="Button">
      <Text11 />
      <Container19 />
      <Container20 />
    </div>
  );
}

function Container14() {
  return (
    <div className="h-[74.996px] relative shrink-0 w-full" data-name="Container">
      <Button5 />
      <Button6 />
      <Button7 />
      <Button8 />
      <Button9 />
    </div>
  );
}

function BottomNav() {
  return (
    <div className="absolute bg-[rgba(30,33,57,0.8)] content-stretch flex flex-col h-[75.634px] items-start left-[11px] pl-[24.876px] pr-[24.886px] pt-[0.637px] top-[880px] w-[439.76px]" data-name="BottomNav">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.1)] border-solid border-t-[0.637px] inset-0 pointer-events-none" />
      <Container14 />
    </div>
  );
}

function App() {
  return (
    <div className="absolute h-[956px] left-0 top-0 w-[439.76px]" data-name="App" style={{ backgroundImage: "linear-gradient(114.702deg, rgb(29, 41, 61) 0%, rgb(15, 23, 43) 50%, rgb(29, 41, 61) 100%)" }}>
      <Container />
      <BottomNav />
    </div>
  );
}

export default function OcMentorsMobilePrototype() {
  return (
    <div className="bg-[#1a1d29] relative size-full" data-name="OC Mentors Mobile Prototype">
      <App />
    </div>
  );
}
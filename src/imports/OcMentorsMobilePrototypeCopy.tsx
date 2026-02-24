import svgPaths from "./svg-ys9c984j6l";

function Icon() {
  return (
    <div className="absolute left-[8px] size-[24px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d="M15 18L9 12L15 6" id="Vector" stroke="var(--stroke-0, #E8EDF5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99997" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute left-0 rounded-[10px] size-[39.993px] top-0" data-name="Button">
      <Icon />
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[42.004px] relative shrink-0 w-[162.679px]" data-name="Heading 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[42px] left-0 not-italic text-[#e8edf5] text-[28px] top-[0.46px] tracking-[0.3828px]">My Progress</p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="h-[21.002px] relative shrink-0 w-[81.808px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-[41px] not-italic text-[#5b7ceb] text-[14px] text-center top-[-0.09px] tracking-[-0.1504px]">Take Quiz →</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute content-stretch flex h-[42.004px] items-center justify-between left-0 top-[54.99px] w-[330.009px]" data-name="Container">
      <Heading />
      <Button1 />
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute h-[96.994px] left-[29.99px] top-[60px] w-[330.009px]" data-name="Container">
      <Button />
      <Container3 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[27.007px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[27px] left-0 not-italic text-[#e8edf5] text-[18px] top-[0.55px] tracking-[-0.4395px]">Subject Progress</p>
    </div>
  );
}

function Heading2() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-0 not-italic text-[#e8edf5] text-[16px] top-[-0.45px] tracking-[-0.3125px]">Math 2A</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[17.995px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#a8b3cf] text-[12px] top-[0.91px] w-[118px] whitespace-pre-wrap">8 lessons completed</p>
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[43.986px] relative shrink-0 w-[117.04px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[1.992px] items-start relative size-full">
        <Heading2 />
        <Paragraph />
      </div>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[24px] relative shrink-0 w-[35.77px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[24px] left-0 not-italic text-[#5b7ceb] text-[16px] top-[-0.45px] tracking-[-0.3125px] w-[36px] whitespace-pre-wrap">75%</p>
      </div>
    </div>
  );
}

function ProgressTracker1() {
  return (
    <div className="h-[43.986px] relative shrink-0 w-full" data-name="ProgressTracker">
      <div className="content-stretch flex items-start justify-between relative size-full">
        <Container7 />
        <Text />
      </div>
    </div>
  );
}

function Container8() {
  return <div className="h-[7.997px] rounded-[21385400px] shrink-0 w-full" data-name="Container" style={{ backgroundImage: "linear-gradient(177.956deg, rgb(67, 97, 217) 0%, rgb(91, 124, 235) 100%)" }} />;
}

function ProgressTracker2() {
  return (
    <div className="bg-[#2a2f4a] h-[7.997px] relative rounded-[21385400px] shrink-0 w-full" data-name="ProgressTracker">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start pr-[74.688px] relative size-full">
          <Container8 />
        </div>
      </div>
    </div>
  );
}

function ProgressTracker3() {
  return <div className="h-[32px] shrink-0 w-full" data-name="ProgressTracker" />;
}

function Container6() {
  return (
    <div className="bg-[#1e2139] h-[93px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0.637px] border-[rgba(255,255,255,0.12)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]" />
      <div className="content-stretch flex flex-col gap-[7.997px] items-start pb-[0.637px] pt-[15.635px] px-[15.635px] relative size-full">
        <ProgressTracker1 />
        <ProgressTracker2 />
        <ProgressTracker3 />
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-0 not-italic text-[#e8edf5] text-[16px] top-[-0.45px] tracking-[-0.3125px]">Physics</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[17.995px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#a8b3cf] text-[12px] top-[0.91px] w-[117px] whitespace-pre-wrap">5 lessons completed</p>
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[43.986px] relative shrink-0 w-[116.791px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[1.992px] items-start relative size-full">
        <Heading3 />
        <Paragraph1 />
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[24px] relative shrink-0 w-[37.533px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[24px] left-[10.03px] not-italic text-[#5b7ceb] text-[16px] top-[-0.26px] tracking-[-0.3125px] w-[38px] whitespace-pre-wrap">60%</p>
      </div>
    </div>
  );
}

function ProgressTracker4() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-[288px]" data-name="ProgressTracker">
      <Container10 />
      <Text1 />
    </div>
  );
}

function ProgressTracker5() {
  return <div className="h-[17.995px] shrink-0 w-full" data-name="ProgressTracker" />;
}

function Container11() {
  return <div className="h-[7.997px] rounded-[21385400px] shrink-0 w-full" data-name="Container" style={{ backgroundImage: "linear-gradient(177.446deg, rgb(67, 97, 217) 0%, rgb(91, 124, 235) 100%)" }} />;
}

function ProgressTracker6() {
  return (
    <div className="bg-[#2a2f4a] h-[7.997px] relative rounded-[21385400px] shrink-0 w-full" data-name="ProgressTracker">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start pr-[119.5px] relative size-full">
          <Container11 />
        </div>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="bg-[#1e2139] h-[112px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0.637px] border-[rgba(255,255,255,0.12)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]" />
      <div className="content-stretch flex flex-col gap-[7.997px] items-start pb-[0.637px] pt-[15.635px] px-[15.635px] relative size-full">
        <ProgressTracker4 />
        <ProgressTracker5 />
        <ProgressTracker6 />
      </div>
    </div>
  );
}

function Heading4() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-0 not-italic text-[#e8edf5] text-[16px] top-[-0.45px] tracking-[-0.3125px]">Chemistry</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[17.995px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#a8b3cf] text-[12px] top-[0.91px] w-[117px] whitespace-pre-wrap">3 lessons completed</p>
    </div>
  );
}

function Container13() {
  return (
    <div className="h-[43.986px] relative shrink-0 w-[116.901px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[1.992px] items-start relative size-full">
        <Heading4 />
        <Paragraph2 />
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[24px] relative shrink-0 w-[37.583px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[24px] left-0 not-italic text-[#5b7ceb] text-[16px] top-[-0.45px] tracking-[-0.3125px] w-[38px] whitespace-pre-wrap">40%</p>
      </div>
    </div>
  );
}

function ProgressTracker7() {
  return (
    <div className="h-[43.986px] relative shrink-0 w-full" data-name="ProgressTracker">
      <div className="content-stretch flex items-start justify-between relative size-full">
        <Container13 />
        <Text2 />
      </div>
    </div>
  );
}

function ProgressTracker8() {
  return <div className="h-[17.995px] shrink-0 w-full" data-name="ProgressTracker" />;
}

function Container14() {
  return <div className="absolute h-[7.997px] left-0 rounded-[21385400px] top-0 w-[119.49px]" data-name="Container" style={{ backgroundImage: "linear-gradient(176.171deg, rgb(67, 97, 217) 0%, rgb(91, 124, 235) 100%)" }} />;
}

function ProgressTracker9() {
  return (
    <div className="bg-[#2a2f4a] h-[8px] overflow-clip relative rounded-[21385400px] shrink-0 w-[294px]" data-name="ProgressTracker">
      <Container14 />
    </div>
  );
}

function Container12() {
  return (
    <div className="bg-[#1e2139] h-[117.239px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0.637px] border-[rgba(255,255,255,0.12)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]" />
      <div className="content-stretch flex flex-col gap-[7.997px] items-start pb-[0.637px] pt-[15.635px] px-[15.635px] relative size-full">
        <ProgressTracker7 />
        <ProgressTracker8 />
        <ProgressTracker9 />
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col gap-[14.997px] h-[381.713px] items-start relative shrink-0 w-full" data-name="Container">
      <Container6 />
      <Container9 />
      <Container12 />
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[14.997px] h-[423.717px] items-start left-[29.99px] top-[374.97px] w-[330.009px]" data-name="Container">
      <Heading1 />
      <Container5 />
    </div>
  );
}

function Heading5() {
  return (
    <div className="h-[27.007px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[27px] left-0 not-italic text-[#e8edf5] text-[18px] top-[0.55px] tracking-[-0.4395px]">Recent Achievements</p>
    </div>
  );
}

function ProgressTracker10() {
  return (
    <div className="h-[45.002px] relative shrink-0 w-[29.955px]" data-name="ProgressTracker">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[45px] left-0 not-italic text-[#e8edf5] text-[30px] top-[0.46px] tracking-[0.3955px]">🏆</p>
      </div>
    </div>
  );
}

function Heading6() {
  return (
    <div className="absolute h-[22.496px] left-0 top-0 w-[253.788px]" data-name="Heading 3">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[22.5px] left-0 not-italic text-[#e8edf5] text-[15px] top-[-1.09px] tracking-[-0.2344px]">5 Lessons Complete</p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="absolute h-[17.995px] left-0 top-[22.5px] w-[253.788px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#a8b3cf] text-[12px] top-[0.91px]">Nov 8</p>
    </div>
  );
}

function ProgressTracker11() {
  return (
    <div className="flex-[1_0_0] h-[40.491px] min-h-px min-w-px relative" data-name="ProgressTracker">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Heading6 />
        <Paragraph3 />
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="bg-[#1e2139] h-[76.271px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0.637px] border-[rgba(255,255,255,0.12)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[14.997px] items-center px-[15.634px] py-[0.637px] relative size-full">
          <ProgressTracker10 />
          <ProgressTracker11 />
        </div>
      </div>
    </div>
  );
}

function ProgressTracker12() {
  return (
    <div className="h-[45.002px] relative shrink-0 w-[29.955px]" data-name="ProgressTracker">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[45px] left-0 not-italic text-[#e8edf5] text-[30px] top-[0.46px] tracking-[0.3955px]">🔥</p>
      </div>
    </div>
  );
}

function Heading7() {
  return (
    <div className="absolute h-[22.496px] left-0 top-0 w-[253.788px]" data-name="Heading 3">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[22.5px] left-0 not-italic text-[#e8edf5] text-[15px] top-[-1.09px] tracking-[-0.2344px]">7-Day Streak</p>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="absolute h-[17.995px] left-0 top-[22.5px] w-[253.788px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#a8b3cf] text-[12px] top-[0.91px]">Nov 10</p>
    </div>
  );
}

function ProgressTracker13() {
  return (
    <div className="flex-[1_0_0] h-[40.491px] min-h-px min-w-px relative" data-name="ProgressTracker">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Heading7 />
        <Paragraph4 />
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="bg-[#1e2139] h-[76.271px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0.637px] border-[rgba(255,255,255,0.12)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[14.997px] items-center px-[15.634px] py-[0.637px] relative size-full">
          <ProgressTracker12 />
          <ProgressTracker13 />
        </div>
      </div>
    </div>
  );
}

function ProgressTracker14() {
  return (
    <div className="h-[45.002px] relative shrink-0 w-[29.955px]" data-name="ProgressTracker">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[45px] left-0 not-italic text-[#e8edf5] text-[30px] top-[0.46px] tracking-[0.3955px]">⭐</p>
      </div>
    </div>
  );
}

function Heading8() {
  return (
    <div className="absolute h-[22.496px] left-0 top-0 w-[253.788px]" data-name="Heading 3">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[22.5px] left-0 not-italic text-[#e8edf5] text-[15px] top-[-1.09px] tracking-[-0.2344px]">Perfect Score</p>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="absolute h-[17.995px] left-0 top-[22.5px] w-[253.788px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#a8b3cf] text-[12px] top-[0.91px]">Nov 5</p>
    </div>
  );
}

function ProgressTracker15() {
  return (
    <div className="flex-[1_0_0] h-[40.491px] min-h-px min-w-px relative" data-name="ProgressTracker">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Heading8 />
        <Paragraph5 />
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="bg-[#1e2139] h-[76.271px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0.637px] border-[rgba(255,255,255,0.12)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[14.997px] items-center px-[15.634px] py-[0.637px] relative size-full">
          <ProgressTracker14 />
          <ProgressTracker15 />
        </div>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex flex-col gap-[9.998px] h-[248.809px] items-start relative shrink-0 w-full" data-name="Container">
      <Container17 />
      <Container18 />
      <Container19 />
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[14.997px] h-[290.813px] items-start left-[29.99px] top-[828.68px] w-[330.009px]" data-name="Container">
      <Heading5 />
      <Container16 />
    </div>
  );
}

function ProgressTracker16() {
  return <div className="absolute bg-[rgba(255,255,255,0.1)] blur-[64px] left-[202.01px] rounded-[21385400px] size-[127.994px] top-0" data-name="ProgressTracker" />;
}

function ProgressTracker17() {
  return <div className="absolute bg-[rgba(255,255,255,0.1)] blur-[40px] left-0 rounded-[21385400px] size-[95.998px] top-[71.99px]" data-name="ProgressTracker" />;
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d="M12 7V21" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99997" />
          <path d={svgPaths.p38e00000} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99997" />
        </g>
      </svg>
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="h-[24px] opacity-90 relative shrink-0 w-[166.254px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-0 not-italic text-[16px] text-white top-[-0.45px] tracking-[-0.3125px]">Your Learning Journey</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex gap-[7.997px] h-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon1 />
      <Paragraph6 />
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="absolute h-[65.994px] left-0 top-0 w-[127.377px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[66px] left-0 not-italic text-[44px] text-white top-[0.37px] tracking-[0.3652px]">16</p>
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="absolute h-[21.002px] left-0 opacity-90 top-[58px] w-[127.377px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[14px] text-white top-[-0.09px] tracking-[-0.1504px]">Lessons Completed</p>
    </div>
  );
}

function Container23() {
  return (
    <div className="h-[78.999px] relative shrink-0 w-[127.377px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Paragraph7 />
        <Paragraph8 />
      </div>
    </div>
  );
}

function Container24() {
  return <div className="bg-[rgba(255,255,255,0.3)] h-[49.991px] shrink-0 w-[0.996px]" data-name="Container" />;
}

function Paragraph9() {
  return (
    <div className="absolute h-[47.989px] left-0 top-0 w-[101.595px]" data-name="Paragraph">
      <p className="-translate-x-full absolute font-['Inter:Bold',sans-serif] font-bold leading-[48px] left-[102.14px] not-italic text-[32px] text-right text-white top-[-0.54px] tracking-[0.4063px]">24hrs</p>
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="absolute h-[19.488px] left-0 opacity-90 top-[42.99px] w-[101.595px]" data-name="Paragraph">
      <p className="-translate-x-full absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-[102px] not-italic text-[13px] text-right text-white top-[0.91px] tracking-[-0.0762px]">Total Study Time</p>
    </div>
  );
}

function Container25() {
  return (
    <div className="h-[62.479px] relative shrink-0 w-[101.595px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Paragraph9 />
        <Paragraph10 />
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex h-[78.999px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container23 />
      <Container24 />
      <Container25 />
    </div>
  );
}

function ProgressTracker18() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[14.997px] h-[117.996px] items-start left-[25px] top-[25px] w-[280.018px]" data-name="ProgressTracker">
      <Container21 />
      <Container22 />
    </div>
  );
}

function Container20() {
  return (
    <div className="absolute h-[167.987px] left-[29.99px] overflow-clip rounded-[20px] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.6)] top-[181.99px] w-[330.009px]" data-name="Container" style={{ backgroundImage: "linear-gradient(153.022deg, rgb(67, 97, 217) 0%, rgb(91, 124, 235) 100%)" }}>
      <ProgressTracker16 />
      <ProgressTracker17 />
      <ProgressTracker18 />
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute h-[1119.496px] left-0 top-[-108.35px] w-[389.998px]" data-name="Container">
      <Container2 />
      <Container4 />
      <Container15 />
      <Container20 />
    </div>
  );
}

function Paragraph11() {
  return (
    <div className="h-[27.903px] relative shrink-0 w-[35.8px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[27.9px] left-0 not-italic text-[#e8edf5] text-[18.6px] top-[-0.45px] tracking-[-0.4432px]">9:41</p>
      </div>
    </div>
  );
}

function Icon2() {
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

function Icon3() {
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

function Icon4() {
  return (
    <div className="h-[14.995px] relative shrink-0 w-[30.99px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30.9903 14.9953">
        <g clipPath="url(#clip0_15_944)" id="Icon">
          <path d={svgPaths.p27e36c00} id="Vector" opacity="0.35" stroke="var(--stroke-0, black)" strokeWidth="1.23817" />
          <path d={svgPaths.p1afd7400} fill="var(--fill-0, black)" id="Vector_2" opacity="0.4" />
          <path d={svgPaths.p2282f900} fill="var(--fill-0, black)" id="Vector_3" />
        </g>
        <defs>
          <clipPath id="clip0_15_944">
            <rect fill="white" height="14.9953" width="30.9903" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container26() {
  return (
    <div className="h-[14.997px] relative shrink-0 w-[86.966px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[7.997px] items-center relative size-full">
        <Icon2 />
        <Icon3 />
        <Icon4 />
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="absolute content-stretch flex h-[59.999px] items-center justify-between left-0 px-[19.996px] top-[-108.35px] w-[389.998px]" data-name="StatusBar">
      <Paragraph11 />
      <Container26 />
    </div>
  );
}

function ProgressTracker() {
  return (
    <div className="bg-[#1a1d29] h-[843.999px] overflow-clip relative shrink-0 w-full" data-name="ProgressTracker">
      <Container1 />
      <StatusBar />
    </div>
  );
}

function Container() {
  return (
    <div className="absolute bg-[#1a1d29] content-stretch flex flex-col h-[843.999px] items-start left-[24.88px] overflow-clip rounded-[32px] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.6)] top-[56px] w-[389.998px]" data-name="Container">
      <ProgressTracker />
    </div>
  );
}

function Paragraph12() {
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

function Icon6() {
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

function Icon7() {
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

function Container27() {
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

function StatusBar1() {
  return (
    <div className="absolute content-stretch flex h-[53px] items-center justify-between left-[30px] px-[19.996px] top-[4px] w-[387px]" data-name="StatusBar">
      <Paragraph12 />
      <Container27 />
    </div>
  );
}

function App() {
  return (
    <div className="absolute h-[956px] left-0 top-0 w-[439.76px]" data-name="App" style={{ backgroundImage: "linear-gradient(114.702deg, rgb(29, 41, 61) 0%, rgb(15, 23, 43) 50%, rgb(29, 41, 61) 100%)" }}>
      <Container />
      <StatusBar1 />
    </div>
  );
}

function Text3() {
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

function Container29() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[18.4px] pt-[7.997px] px-[7.997px] rounded-[16px] size-[37.991px] top-[9px]" data-name="Container">
      <Icon8 />
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute h-[74.996px] left-[8px] top-0 w-[74.797px]" data-name="Button">
      <Text3 />
      <Container29 />
    </div>
  );
}

function Text4() {
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

function Container30() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[18.4px] pt-[7.997px] px-[7.997px] rounded-[16px] size-[37.991px] top-[9px]" data-name="Container">
      <Icon9 />
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute h-[74.996px] left-[82.79px] top-0 w-[74.797px]" data-name="Button">
      <Text4 />
      <Container30 />
    </div>
  );
}

function Text5() {
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

function Container31() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[18.4px] pt-[7.997px] px-[7.997px] rounded-[16px] size-[37.991px] top-[9px]" data-name="Container">
      <Icon10 />
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute h-[74.996px] left-[157.59px] top-0 w-[74.797px]" data-name="Button">
      <Text5 />
      <Container31 />
    </div>
  );
}

function Text6() {
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

function Container32() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[18.4px] pt-[7.997px] px-[7.997px] rounded-[16px] size-[37.991px] top-[9px]" data-name="Container">
      <Icon11 />
    </div>
  );
}

function Button5() {
  return (
    <div className="absolute h-[74.996px] left-[232.39px] top-0 w-[74.797px]" data-name="Button">
      <Text6 />
      <Container32 />
    </div>
  );
}

function Text7() {
  return (
    <div className="absolute h-[14.997px] left-[20.92px] top-[50.99px] w-[32.952px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-[16px] not-italic text-[#5b7ceb] text-[10px] text-center top-[0.27px] tracking-[0.1172px]">Profile</p>
    </div>
  );
}

function Container33() {
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

function Container34() {
  return (
    <div className="absolute bg-[rgba(91,124,235,0.1)] content-stretch flex flex-col items-start left-[17.45px] pt-[8.396px] px-[8.396px] rounded-[16px] size-[39.891px] top-[8.05px]" data-name="Container">
      <Icon12 />
    </div>
  );
}

function Button6() {
  return (
    <div className="absolute h-[74.996px] left-[307.18px] top-0 w-[74.797px]" data-name="Button">
      <Text7 />
      <Container33 />
      <Container34 />
    </div>
  );
}

function Container28() {
  return (
    <div className="h-[74.996px] relative shrink-0 w-full" data-name="Container">
      <Button2 />
      <Button3 />
      <Button4 />
      <Button5 />
      <Button6 />
    </div>
  );
}

function BottomNav() {
  return (
    <div className="absolute bg-[rgba(30,33,57,0.8)] content-stretch flex flex-col h-[75.634px] items-start left-0 pl-[24.876px] pr-[24.886px] pt-[0.637px] top-[880.37px] w-[439.76px]" data-name="BottomNav">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.1)] border-solid border-t-[0.637px] inset-0 pointer-events-none" />
      <Container28 />
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
import svgPaths from "./svg-8k1behcby5";

function Paragraph() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-[174.68px] not-italic text-[#a8b3cf] text-[16px] text-center top-[-0.45px] tracking-[-0.3125px]">Debra Peterson</p>
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[42.004px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[42px] left-[174.72px] not-italic text-[#e8edf5] text-[28px] text-center top-[0.46px] tracking-[0.3828px]">30 Minute Meeting</p>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[17.995px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.9947 17.9947">
        <g clipPath="url(#clip0_15_1803)" id="Icon">
          <path d={svgPaths.p23620c00} id="Vector" stroke="var(--stroke-0, #A8B3CF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.49956" />
          <path d={svgPaths.p61f2800} id="Vector_2" stroke="var(--stroke-0, #A8B3CF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.49956" />
        </g>
        <defs>
          <clipPath id="clip0_15_1803">
            <rect fill="white" height="17.9947" width="17.9947" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[22.496px] relative shrink-0 w-[47.173px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[22.5px] left-[24px] not-italic text-[#a8b3cf] text-[15px] text-center top-[-1.09px] tracking-[-0.2344px]">30 min</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[22.496px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[7.997px] items-center justify-center relative size-full">
          <Icon />
          <Text />
        </div>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4.999px] h-[103.497px] items-start left-[20px] top-[130px] w-[350.006px]" data-name="Container">
      <Paragraph />
      <Heading />
      <Container3 />
    </div>
  );
}

function Container4() {
  return <div className="absolute bg-[rgba(255,255,255,0.12)] h-[0.996px] left-[20px] top-[258.49px] w-[350.006px]" data-name="Container" />;
}

function Heading1() {
  return (
    <div className="absolute h-[29.994px] left-[20px] top-[284.48px] w-[350.006px]" data-name="Heading 2">
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[30px] left-[175.76px] not-italic text-[#e8edf5] text-[20px] text-center top-[0.19px] tracking-[-0.4492px]">Select a Day</p>
    </div>
  );
}

function HeaderCell() {
  return (
    <div className="h-[19.19px] relative rounded-[6.8px] shrink-0 w-[31.996px]" data-name="Header Cell">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.2px] left-[16.25px] not-italic text-[#a8b3cf] text-[12.8px] text-center top-[-0.09px] tracking-[-0.06px]">Su</p>
      </div>
    </div>
  );
}

function HeaderCell1() {
  return (
    <div className="h-[19.19px] relative rounded-[6.8px] shrink-0 w-[31.996px]" data-name="Header Cell">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.2px] left-[16.18px] not-italic text-[#a8b3cf] text-[12.8px] text-center top-[-0.09px] tracking-[-0.06px]">Mo</p>
      </div>
    </div>
  );
}

function HeaderCell2() {
  return (
    <div className="h-[19.19px] relative rounded-[6.8px] shrink-0 w-[31.996px]" data-name="Header Cell">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.2px] left-[16.23px] not-italic text-[#a8b3cf] text-[12.8px] text-center top-[-0.09px] tracking-[-0.06px]">Tu</p>
      </div>
    </div>
  );
}

function HeaderCell3() {
  return (
    <div className="h-[19.19px] relative rounded-[6.8px] shrink-0 w-[31.996px]" data-name="Header Cell">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.2px] left-[16.01px] not-italic text-[#a8b3cf] text-[12.8px] text-center top-[-0.09px] tracking-[-0.06px]">We</p>
      </div>
    </div>
  );
}

function HeaderCell4() {
  return (
    <div className="h-[19.19px] relative rounded-[6.8px] shrink-0 w-[31.996px]" data-name="Header Cell">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.2px] left-[16.24px] not-italic text-[#a8b3cf] text-[12.8px] text-center top-[-0.09px] tracking-[-0.06px]">Th</p>
      </div>
    </div>
  );
}

function HeaderCell5() {
  return (
    <div className="h-[19.19px] relative rounded-[6.8px] shrink-0 w-[31.996px]" data-name="Header Cell">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.2px] left-[16.46px] not-italic text-[#a8b3cf] text-[12.8px] text-center top-[-0.09px] tracking-[-0.06px]">Fr</p>
      </div>
    </div>
  );
}

function HeaderCell6() {
  return (
    <div className="h-[19.19px] relative rounded-[6.8px] shrink-0 w-[31.996px]" data-name="Header Cell">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.2px] left-[16.44px] not-italic text-[#a8b3cf] text-[12.8px] text-center top-[-0.09px] tracking-[-0.06px]">Sa</p>
      </div>
    </div>
  );
}

function Un() {
  return (
    <div className="absolute content-stretch flex h-[19.19px] items-start left-0 top-0 w-[294.737px]" data-name="Un4">
      <HeaderCell />
      <HeaderCell1 />
      <HeaderCell2 />
      <HeaderCell3 />
      <HeaderCell4 />
      <HeaderCell5 />
      <HeaderCell6 />
    </div>
  );
}

function Zn() {
  return (
    <div className="absolute h-[19.19px] left-0 top-0 w-[294.737px]" data-name="zn4">
      <Un />
    </div>
  );
}

function Button() {
  return (
    <div className="h-[31.996px] opacity-50 relative rounded-[6.8px] shrink-0 w-full" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[16.35px] not-italic text-[#a8b3cf] text-[14px] text-center top-[6.27px] tracking-[-0.1504px]">30</p>
    </div>
  );
}

function TableCell() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 size-[31.996px] top-0" data-name="Table Cell">
      <Button />
    </div>
  );
}

function Button1() {
  return (
    <div className="h-[31.996px] opacity-50 relative rounded-[6.8px] shrink-0 w-full" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[16.33px] not-italic text-[#a8b3cf] text-[14px] text-center top-[6.27px] tracking-[-0.1504px]">1</p>
    </div>
  );
}

function TableCell1() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[32px] size-[31.996px] top-0" data-name="Table Cell">
      <Button1 />
    </div>
  );
}

function Button2() {
  return (
    <div className="h-[31.996px] opacity-50 relative rounded-[6.8px] shrink-0 w-full" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[16.34px] not-italic text-[#a8b3cf] text-[14px] text-center top-[6.27px] tracking-[-0.1504px]">2</p>
    </div>
  );
}

function TableCell2() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[63.99px] size-[31.996px] top-0" data-name="Table Cell">
      <Button2 />
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[#5b7ceb] h-[31.996px] relative rounded-[6.8px] shrink-0 w-full" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[16.18px] not-italic text-[#fafafa] text-[14px] text-center top-[6.27px] tracking-[-0.1504px]">3</p>
    </div>
  );
}

function TableCell3() {
  return (
    <div className="absolute bg-[#f5f5f5] content-stretch flex flex-col items-start left-[95.99px] rounded-[6.8px] size-[31.996px] top-0" data-name="Table Cell">
      <Button3 />
    </div>
  );
}

function Button4() {
  return (
    <div className="h-[31.996px] relative rounded-[6.8px] shrink-0 w-full" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[16.06px] not-italic text-[#e8edf5] text-[14px] text-center top-[6.27px] tracking-[-0.1504px]">4</p>
    </div>
  );
}

function TableCell4() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[127.98px] size-[31.996px] top-0" data-name="Table Cell">
      <Button4 />
    </div>
  );
}

function Button5() {
  return (
    <div className="h-[31.996px] relative rounded-[6.8px] shrink-0 w-full" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[16.24px] not-italic text-[#e8edf5] text-[14px] text-center top-[6.27px] tracking-[-0.1504px]">5</p>
    </div>
  );
}

function TableCell5() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[159.98px] size-[31.996px] top-0" data-name="Table Cell">
      <Button5 />
    </div>
  );
}

function Button6() {
  return (
    <div className="h-[31.996px] relative rounded-[6.8px] shrink-0 w-full" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[16.11px] not-italic text-[#e8edf5] text-[14px] text-center top-[6.27px] tracking-[-0.1504px]">6</p>
    </div>
  );
}

function TableCell6() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[191.98px] size-[31.996px] top-0" data-name="Table Cell">
      <Button6 />
    </div>
  );
}

function Sa() {
  return (
    <div className="absolute h-[31.996px] left-0 top-[8px] w-[294.737px]" data-name="Sa3">
      <TableCell />
      <TableCell1 />
      <TableCell2 />
      <TableCell3 />
      <TableCell4 />
      <TableCell5 />
      <TableCell6 />
    </div>
  );
}

function Button7() {
  return (
    <div className="h-[31.996px] relative rounded-[6.8px] shrink-0 w-full" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[16.08px] not-italic text-[#e8edf5] text-[14px] text-center top-[6.27px] tracking-[-0.1504px]">7</p>
    </div>
  );
}

function TableCell7() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 size-[31.996px] top-0" data-name="Table Cell">
      <Button7 />
    </div>
  );
}

function Button8() {
  return (
    <div className="h-[31.996px] relative rounded-[6.8px] shrink-0 w-full" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[16.1px] not-italic text-[#e8edf5] text-[14px] text-center top-[6.27px] tracking-[-0.1504px]">8</p>
    </div>
  );
}

function TableCell8() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[32px] size-[31.996px] top-0" data-name="Table Cell">
      <Button8 />
    </div>
  );
}

function Button9() {
  return (
    <div className="h-[31.996px] relative rounded-[6.8px] shrink-0 w-full" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[16.11px] not-italic text-[#e8edf5] text-[14px] text-center top-[6.27px] tracking-[-0.1504px]">9</p>
    </div>
  );
}

function TableCell9() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[63.99px] size-[31.996px] top-0" data-name="Table Cell">
      <Button9 />
    </div>
  );
}

function Button10() {
  return (
    <div className="h-[31.996px] relative rounded-[6.8px] shrink-0 w-full" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[16.48px] not-italic text-[#e8edf5] text-[14px] text-center top-[6.27px] tracking-[-0.1504px]">10</p>
    </div>
  );
}

function TableCell10() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[95.99px] size-[31.996px] top-0" data-name="Table Cell">
      <Button10 />
    </div>
  );
}

function Button11() {
  return (
    <div className="h-[31.996px] relative rounded-[6.8px] shrink-0 w-full" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[16.15px] not-italic text-[#e8edf5] text-[14px] text-center top-[6.27px] tracking-[-0.1504px]">11</p>
    </div>
  );
}

function TableCell11() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[127.98px] size-[31.996px] top-0" data-name="Table Cell">
      <Button11 />
    </div>
  );
}

function Button12() {
  return (
    <div className="h-[31.996px] relative rounded-[6.8px] shrink-0 w-full" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[16.17px] not-italic text-[#e8edf5] text-[14px] text-center top-[6.27px] tracking-[-0.1504px]">12</p>
    </div>
  );
}

function TableCell12() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[159.98px] size-[31.996px] top-0" data-name="Table Cell">
      <Button12 />
    </div>
  );
}

function Button13() {
  return (
    <div className="h-[31.996px] relative rounded-[6.8px] shrink-0 w-full" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[15.51px] not-italic text-[#e8edf5] text-[14px] text-center top-[6.27px] tracking-[-0.1504px]">13</p>
    </div>
  );
}

function TableCell13() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[191.98px] size-[31.996px] top-0" data-name="Table Cell">
      <Button13 />
    </div>
  );
}

function Sa1() {
  return (
    <div className="absolute h-[31.996px] left-0 top-[47.99px] w-[294.737px]" data-name="Sa3">
      <TableCell7 />
      <TableCell8 />
      <TableCell9 />
      <TableCell10 />
      <TableCell11 />
      <TableCell12 />
      <TableCell13 />
    </div>
  );
}

function Button14() {
  return (
    <div className="h-[31.996px] relative rounded-[6.8px] shrink-0 w-full" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[16.39px] not-italic text-[#e8edf5] text-[14px] text-center top-[6.27px] tracking-[-0.1504px]">14</p>
    </div>
  );
}

function TableCell14() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 size-[31.996px] top-0" data-name="Table Cell">
      <Button14 />
    </div>
  );
}

function Button15() {
  return (
    <div className="h-[31.996px] relative rounded-[6.8px] shrink-0 w-full" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[16.07px] not-italic text-[#e8edf5] text-[14px] text-center top-[6.27px] tracking-[-0.1504px]">15</p>
    </div>
  );
}

function TableCell15() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[32px] size-[31.996px] top-0" data-name="Table Cell">
      <Button15 />
    </div>
  );
}

function Button16() {
  return (
    <div className="h-[31.996px] relative rounded-[6.8px] shrink-0 w-full" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[16.44px] not-italic text-[#e8edf5] text-[14px] text-center top-[6.27px] tracking-[-0.1504px]">16</p>
    </div>
  );
}

function TableCell16() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[63.99px] size-[31.996px] top-0" data-name="Table Cell">
      <Button16 />
    </div>
  );
}

function Button17() {
  return (
    <div className="h-[31.996px] relative rounded-[6.8px] shrink-0 w-full" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[16.41px] not-italic text-[#e8edf5] text-[14px] text-center top-[6.27px] tracking-[-0.1504px]">17</p>
    </div>
  );
}

function TableCell17() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[95.99px] size-[31.996px] top-0" data-name="Table Cell">
      <Button17 />
    </div>
  );
}

function Button18() {
  return (
    <div className="h-[31.996px] relative rounded-[6.8px] shrink-0 w-full" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[16.92px] not-italic text-[#e8edf5] text-[14px] text-center top-[6.27px] tracking-[-0.1504px]">18</p>
    </div>
  );
}

function TableCell18() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[127.98px] size-[31.996px] top-0" data-name="Table Cell">
      <Button18 />
    </div>
  );
}

function Button19() {
  return (
    <div className="h-[31.996px] relative rounded-[6.8px] shrink-0 w-full" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[16.44px] not-italic text-[#e8edf5] text-[14px] text-center top-[6.27px] tracking-[-0.1504px]">19</p>
    </div>
  );
}

function TableCell19() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[159.98px] size-[31.996px] top-0" data-name="Table Cell">
      <Button19 />
    </div>
  );
}

function Button20() {
  return (
    <div className="h-[31.996px] relative rounded-[6.8px] shrink-0 w-full" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[15.51px] not-italic text-[#e8edf5] text-[14px] text-center top-[6.27px] tracking-[-0.1504px]">20</p>
    </div>
  );
}

function TableCell20() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[191.98px] size-[31.996px] top-0" data-name="Table Cell">
      <Button20 />
    </div>
  );
}

function Sa2() {
  return (
    <div className="absolute h-[31.996px] left-0 top-[87.98px] w-[294.737px]" data-name="Sa3">
      <TableCell14 />
      <TableCell15 />
      <TableCell16 />
      <TableCell17 />
      <TableCell18 />
      <TableCell19 />
      <TableCell20 />
    </div>
  );
}

function Button21() {
  return (
    <div className="h-[31.996px] relative rounded-[6.8px] shrink-0 w-full" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[16.17px] not-italic text-[#e8edf5] text-[14px] text-center top-[6.27px] tracking-[-0.1504px]">21</p>
    </div>
  );
}

function TableCell21() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 size-[31.996px] top-0" data-name="Table Cell">
      <Button21 />
    </div>
  );
}

function Button22() {
  return (
    <div className="h-[31.996px] relative rounded-[6.8px] shrink-0 w-full" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[16.2px] not-italic text-[#e8edf5] text-[14px] text-center top-[6.27px] tracking-[-0.1504px]">22</p>
    </div>
  );
}

function TableCell22() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[32px] size-[31.996px] top-0" data-name="Table Cell">
      <Button22 />
    </div>
  );
}

function Button23() {
  return (
    <div className="h-[31.996px] relative rounded-[6.8px] shrink-0 w-full" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[15.53px] not-italic text-[#e8edf5] text-[14px] text-center top-[6.27px] tracking-[-0.1504px]">23</p>
    </div>
  );
}

function TableCell23() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[63.99px] size-[31.996px] top-0" data-name="Table Cell">
      <Button23 />
    </div>
  );
}

function Button24() {
  return (
    <div className="h-[31.996px] relative rounded-[6.8px] shrink-0 w-full" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[15.52px] not-italic text-[#e8edf5] text-[14px] text-center top-[6.27px] tracking-[-0.1504px]">24</p>
    </div>
  );
}

function TableCell24() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[95.99px] size-[31.996px] top-0" data-name="Table Cell">
      <Button24 />
    </div>
  );
}

function Button25() {
  return (
    <div className="h-[31.996px] relative rounded-[6.8px] shrink-0 w-full" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[16.1px] not-italic text-[#e8edf5] text-[14px] text-center top-[6.27px] tracking-[-0.1504px]">25</p>
    </div>
  );
}

function TableCell25() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[127.98px] size-[31.996px] top-0" data-name="Table Cell">
      <Button25 />
    </div>
  );
}

function Button26() {
  return (
    <div className="h-[31.996px] relative rounded-[6.8px] shrink-0 w-full" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[16.47px] not-italic text-[#e8edf5] text-[14px] text-center top-[6.27px] tracking-[-0.1504px]">26</p>
    </div>
  );
}

function TableCell26() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[159.98px] size-[31.996px] top-0" data-name="Table Cell">
      <Button26 />
    </div>
  );
}

function Button27() {
  return (
    <div className="h-[31.996px] relative rounded-[6.8px] shrink-0 w-full" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[16.44px] not-italic text-[#e8edf5] text-[14px] text-center top-[6.27px] tracking-[-0.1504px]">27</p>
    </div>
  );
}

function TableCell27() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[191.98px] size-[31.996px] top-0" data-name="Table Cell">
      <Button27 />
    </div>
  );
}

function Sa3() {
  return (
    <div className="absolute h-[31.996px] left-0 top-[127.97px] w-[294.737px]" data-name="Sa3">
      <TableCell21 />
      <TableCell22 />
      <TableCell23 />
      <TableCell24 />
      <TableCell25 />
      <TableCell26 />
      <TableCell27 />
    </div>
  );
}

function Button28() {
  return (
    <div className="h-[31.996px] relative rounded-[6.8px] shrink-0 w-full" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[16.95px] not-italic text-[#e8edf5] text-[14px] text-center top-[6.27px] tracking-[-0.1504px]">28</p>
    </div>
  );
}

function TableCell28() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 size-[31.996px] top-0" data-name="Table Cell">
      <Button28 />
    </div>
  );
}

function Button29() {
  return (
    <div className="h-[31.996px] relative rounded-[6.8px] shrink-0 w-full" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[16.47px] not-italic text-[#e8edf5] text-[14px] text-center top-[6.27px] tracking-[-0.1504px]">29</p>
    </div>
  );
}

function TableCell29() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[32px] size-[31.996px] top-0" data-name="Table Cell">
      <Button29 />
    </div>
  );
}

function Button30() {
  return (
    <div className="h-[31.996px] relative rounded-[6.8px] shrink-0 w-full" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[16.35px] not-italic text-[#e8edf5] text-[14px] text-center top-[6.27px] tracking-[-0.1504px]">30</p>
    </div>
  );
}

function TableCell30() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[63.99px] size-[31.996px] top-0" data-name="Table Cell">
      <Button30 />
    </div>
  );
}

function Button31() {
  return (
    <div className="h-[31.996px] relative rounded-[6.8px] shrink-0 w-full" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[15.51px] not-italic text-[#e8edf5] text-[14px] text-center top-[6.27px] tracking-[-0.1504px]">31</p>
    </div>
  );
}

function TableCell31() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[95.99px] size-[31.996px] top-0" data-name="Table Cell">
      <Button31 />
    </div>
  );
}

function Button32() {
  return (
    <div className="h-[31.996px] relative rounded-[6.8px] shrink-0 w-full" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[16.33px] not-italic text-[#a8b3cf] text-[14px] text-center top-[6.27px] tracking-[-0.1504px]">1</p>
    </div>
  );
}

function TableCell32() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[127.98px] size-[31.996px] top-0" data-name="Table Cell">
      <Button32 />
    </div>
  );
}

function Button33() {
  return (
    <div className="h-[31.996px] relative rounded-[6.8px] shrink-0 w-full" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[16.34px] not-italic text-[#a8b3cf] text-[14px] text-center top-[6.27px] tracking-[-0.1504px]">2</p>
    </div>
  );
}

function TableCell33() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[159.98px] size-[31.996px] top-0" data-name="Table Cell">
      <Button33 />
    </div>
  );
}

function Button34() {
  return (
    <div className="h-[31.996px] relative rounded-[6.8px] shrink-0 w-full" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[16.18px] not-italic text-[#a8b3cf] text-[14px] text-center top-[6.27px] tracking-[-0.1504px]">3</p>
    </div>
  );
}

function TableCell34() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[191.98px] size-[31.996px] top-0" data-name="Table Cell">
      <Button34 />
    </div>
  );
}

function Sa4() {
  return (
    <div className="absolute h-[31.996px] left-0 top-[167.97px] w-[294.737px]" data-name="Sa3">
      <TableCell28 />
      <TableCell29 />
      <TableCell30 />
      <TableCell31 />
      <TableCell32 />
      <TableCell33 />
      <TableCell34 />
    </div>
  );
}

function TableBody() {
  return (
    <div className="absolute h-[199.963px] left-0 top-[19.19px] w-[294.737px]" data-name="Table Body">
      <Sa />
      <Sa1 />
      <Sa2 />
      <Sa3 />
      <Sa4 />
    </div>
  );
}

function Wa() {
  return (
    <div className="absolute h-[219.153px] left-0 top-[39.98px] w-[294.737px]" data-name="Wa3">
      <Zn />
      <TableBody />
    </div>
  );
}

function He() {
  return (
    <div className="absolute h-[19.996px] left-[94.11px] top-[3.99px] w-[106.514px]" data-name="He4">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#e8edf5] text-[14px] top-[0.27px] tracking-[-0.1504px]">December 2025</p>
    </div>
  );
}

function Jn() {
  return <div className="absolute left-[200.62px] size-0 top-[13.99px]" data-name="jn4" />;
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[15.993px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9931 15.9931">
        <g id="Icon">
          <path d={svgPaths.p66fb000} id="Vector" stroke="var(--stroke-0, #E8EDF5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33276" />
        </g>
      </svg>
    </div>
  );
}

function Button35() {
  return (
    <div className="absolute bg-[rgba(229,229,229,0.3)] content-stretch flex items-center justify-center left-[3.99px] opacity-50 pl-[0.647px] pr-[0.637px] py-[0.637px] rounded-[6.8px] size-[27.993px] top-0" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0.637px] border-solid inset-0 pointer-events-none rounded-[6.8px]" />
      <Icon1 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[15.993px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9931 15.9931">
        <g id="Icon">
          <path d={svgPaths.p3a918700} id="Vector" stroke="var(--stroke-0, #E8EDF5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33276" />
        </g>
      </svg>
    </div>
  );
}

function Button36() {
  return (
    <div className="absolute bg-[rgba(229,229,229,0.3)] content-stretch flex items-center justify-center left-[262.75px] opacity-50 pl-[0.647px] pr-[0.637px] py-[0.637px] rounded-[6.8px] size-[27.993px] top-0" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0.637px] border-solid inset-0 pointer-events-none rounded-[6.8px]" />
      <Icon2 />
    </div>
  );
}

function Hn() {
  return (
    <div className="absolute h-[23.99px] left-0 top-0 w-[294.737px]" data-name="Hn4">
      <He />
      <Jn />
      <Button35 />
      <Button36 />
    </div>
  );
}

function Ea() {
  return (
    <div className="h-[259.136px] relative shrink-0 w-full" data-name="Ea3">
      <Wa />
      <Hn />
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute bg-[#1e2139] content-stretch flex flex-col h-[314.405px] items-start left-[20px] pb-[0.637px] pt-[27.634px] px-[27.634px] rounded-[12px] top-[334.47px] w-[350.006px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0.637px] border-[rgba(255,255,255,0.12)] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.5)]" />
      <Ea />
    </div>
  );
}

function Heading2() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-0 not-italic text-[#e8edf5] text-[16px] top-[-0.45px] tracking-[-0.3125px]">Available Times</p>
    </div>
  );
}

function Button37() {
  return (
    <div className="absolute bg-[#1e2139] border-[1.912px] border-[rgba(255,255,255,0.12)] border-solid h-[44.992px] left-0 rounded-[8px] top-0 w-[169.003px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[82.85px] not-italic text-[#e8edf5] text-[14px] text-center top-[9.99px] tracking-[-0.1504px]">9:00 AM</p>
    </div>
  );
}

function Button38() {
  return (
    <div className="absolute bg-[#1e2139] border-[1.912px] border-[rgba(255,255,255,0.12)] border-solid h-[44.992px] left-[181px] rounded-[8px] top-0 w-[169.003px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[82.93px] not-italic text-[#e8edf5] text-[14px] text-center top-[9.99px] tracking-[-0.1504px]">9:30 AM</p>
    </div>
  );
}

function Button39() {
  return (
    <div className="absolute bg-[#1e2139] border-[1.912px] border-[rgba(255,255,255,0.12)] border-solid h-[44.992px] left-0 rounded-[8px] top-[56.99px] w-[169.003px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[82.61px] not-italic text-[#e8edf5] text-[14px] text-center top-[9.99px] tracking-[-0.1504px]">10:00 AM</p>
    </div>
  );
}

function Button40() {
  return (
    <div className="absolute bg-[#1e2139] border-[1.912px] border-[rgba(255,255,255,0.12)] border-solid h-[44.992px] left-[181px] rounded-[8px] top-[56.99px] w-[169.003px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[82.68px] not-italic text-[#e8edf5] text-[14px] text-center top-[9.99px] tracking-[-0.1504px]">10:30 AM</p>
    </div>
  );
}

function Button41() {
  return (
    <div className="absolute bg-[#1e2139] border-[1.912px] border-[rgba(255,255,255,0.12)] border-solid h-[44.992px] left-0 rounded-[8px] top-[113.98px] w-[169.003px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[82.76px] not-italic text-[#e8edf5] text-[14px] text-center top-[9.99px] tracking-[-0.1504px]">11:00 AM</p>
    </div>
  );
}

function Button42() {
  return (
    <div className="absolute bg-[#1e2139] border-[1.912px] border-[rgba(255,255,255,0.12)] border-solid h-[44.992px] left-[181px] rounded-[8px] top-[113.98px] w-[169.003px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[82.83px] not-italic text-[#e8edf5] text-[14px] text-center top-[9.99px] tracking-[-0.1504px]">11:30 AM</p>
    </div>
  );
}

function Button43() {
  return (
    <div className="absolute bg-[#1e2139] border-[1.912px] border-[rgba(255,255,255,0.12)] border-solid h-[44.992px] left-0 rounded-[8px] top-[170.97px] w-[169.003px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[83.37px] not-italic text-[#e8edf5] text-[14px] text-center top-[9.99px] tracking-[-0.1504px]">1:00 PM</p>
    </div>
  );
}

function Button44() {
  return (
    <div className="absolute bg-[#1e2139] border-[1.912px] border-[rgba(255,255,255,0.12)] border-solid h-[44.992px] left-[181px] rounded-[8px] top-[170.97px] w-[169.003px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[83.44px] not-italic text-[#e8edf5] text-[14px] text-center top-[9.99px] tracking-[-0.1504px]">1:30 PM</p>
    </div>
  );
}

function Button45() {
  return (
    <div className="absolute bg-[#1e2139] border-[1.912px] border-[rgba(255,255,255,0.12)] border-solid h-[44.992px] left-0 rounded-[8px] top-[227.97px] w-[169.003px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[83.41px] not-italic text-[#e8edf5] text-[14px] text-center top-[9.99px] tracking-[-0.1504px]">2:00 PM</p>
    </div>
  );
}

function Button46() {
  return (
    <div className="absolute bg-[#1e2139] border-[1.912px] border-[rgba(255,255,255,0.12)] border-solid h-[44.992px] left-[181px] rounded-[8px] top-[227.97px] w-[169.003px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[83.48px] not-italic text-[#e8edf5] text-[14px] text-center top-[9.99px] tracking-[-0.1504px]">2:30 PM</p>
    </div>
  );
}

function Button47() {
  return (
    <div className="absolute bg-[#1e2139] border-[1.912px] border-[rgba(255,255,255,0.12)] border-solid h-[44.992px] left-0 rounded-[8px] top-[284.96px] w-[169.003px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[82.74px] not-italic text-[#e8edf5] text-[14px] text-center top-[9.99px] tracking-[-0.1504px]">3:00 PM</p>
    </div>
  );
}

function Button48() {
  return (
    <div className="absolute bg-[#1e2139] border-[1.912px] border-[rgba(255,255,255,0.12)] border-solid h-[44.992px] left-[181px] rounded-[8px] top-[284.96px] w-[169.003px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[82.81px] not-italic text-[#e8edf5] text-[14px] text-center top-[9.99px] tracking-[-0.1504px]">3:30 PM</p>
    </div>
  );
}

function Button49() {
  return (
    <div className="absolute bg-[#1e2139] border-[1.912px] border-[rgba(255,255,255,0.12)] border-solid h-[44.992px] left-0 rounded-[8px] top-[341.95px] w-[169.003px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[82.62px] not-italic text-[#e8edf5] text-[14px] text-center top-[9.99px] tracking-[-0.1504px]">4:00 PM</p>
    </div>
  );
}

function Button50() {
  return (
    <div className="absolute bg-[#1e2139] border-[1.912px] border-[rgba(255,255,255,0.12)] border-solid h-[44.992px] left-[181px] rounded-[8px] top-[341.95px] w-[169.003px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[82.69px] not-italic text-[#e8edf5] text-[14px] text-center top-[9.99px] tracking-[-0.1504px]">4:30 PM</p>
    </div>
  );
}

function Button51() {
  return (
    <div className="absolute bg-[#1e2139] border-[1.912px] border-[rgba(255,255,255,0.12)] border-solid h-[44.992px] left-0 rounded-[8px] top-[398.94px] w-[169.003px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[82.79px] not-italic text-[#e8edf5] text-[14px] text-center top-[9.99px] tracking-[-0.1504px]">5:00 PM</p>
    </div>
  );
}

function Button52() {
  return (
    <div className="absolute bg-[#1e2139] border-[1.912px] border-[rgba(255,255,255,0.12)] border-solid h-[44.992px] left-[181px] rounded-[8px] top-[398.94px] w-[169.003px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[82.86px] not-italic text-[#e8edf5] text-[14px] text-center top-[9.99px] tracking-[-0.1504px]">5:30 PM</p>
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[443.933px] relative shrink-0 w-full" data-name="Container">
      <Button37 />
      <Button38 />
      <Button39 />
      <Button40 />
      <Button41 />
      <Button42 />
      <Button43 />
      <Button44 />
      <Button45 />
      <Button46 />
      <Button47 />
      <Button48 />
      <Button49 />
      <Button50 />
      <Button51 />
      <Button52 />
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[14.997px] h-[482.929px] items-start left-[20px] top-[678.87px] w-[350.006px]" data-name="Container">
      <Heading2 />
      <Container7 />
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute h-[1161.799px] left-0 top-[-127.47px] w-[389.998px]" data-name="Container">
      <Container2 />
      <Container4 />
      <Heading1 />
      <Container5 />
      <Container6 />
    </div>
  );
}

function Button53() {
  return (
    <div className="absolute h-[25.493px] left-[15px] top-[8.93px] w-[41.686px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[25.5px] left-[21px] not-italic text-[#5b7ceb] text-[17px] text-center top-[0.55px] tracking-[-0.4316px]">Done</p>
    </div>
  );
}

function Icon3() {
  return (
    <div className="h-[15px] relative shrink-0 w-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 15">
        <g id="Icon">
          <path d={svgPaths.p2624a500} fill="var(--fill-0, #E8EDF5)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[19.488px] relative shrink-0 w-[88.48px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-0 not-italic text-[#e8edf5] text-[13px] top-[0.91px] tracking-[-0.0762px]">calendrify.com</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute bg-[#2a2f4a] content-stretch flex gap-[7.997px] h-[32.753px] items-center left-[106.64px] pl-[12.637px] pr-[0.637px] py-[0.637px] rounded-[8px] top-[5.3px] w-[133.75px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0.637px] border-[rgba(255,255,255,0.12)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Icon3 />
      <Text1 />
    </div>
  );
}

function Button54() {
  return (
    <div className="absolute h-[25.493px] left-[290.36px] top-[8.93px] w-[19.976px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[25.5px] left-[10.5px] not-italic text-[#5b7ceb] text-[17px] text-center top-[0.55px] tracking-[-0.4316px]">aA</p>
    </div>
  );
}

function Button55() {
  return (
    <div className="absolute h-[35.999px] left-[360.29px] top-[3.67px] w-[14.689px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[36px] left-[7px] not-italic text-[#5b7ceb] text-[24px] text-center top-[-0.18px] tracking-[0.0703px]">×</p>
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute border-[rgba(255,255,255,0.12)] border-b-[0.637px] border-solid h-[43.996px] left-0 top-0 w-[389.998px]" data-name="Container">
      <Button53 />
      <Container10 />
      <Button54 />
      <Button55 />
    </div>
  );
}

function Container11() {
  return (
    <div className="bg-[#2a2f4a] h-[120.418px] relative w-[120.419px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] left-[14.03px] not-italic text-[#a8b3cf] text-[11px] top-[12.63px] tracking-[0.0645px]">Powered by Calendrify</p>
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute bg-[#1e2139] border-[rgba(255,255,255,0.12)] border-b-[0.637px] border-solid h-[119.998px] left-0 top-[-127.47px] w-[389.998px]" data-name="Container">
      <Container9 />
      <div className="absolute flex items-center justify-center left-[164.43px] size-[170.297px] top-[-22.28px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-45">
          <Container11 />
        </div>
      </div>
    </div>
  );
}

function BookLesson() {
  return (
    <div className="bg-[#1a1d29] h-[843.999px] overflow-clip relative shrink-0 w-full" data-name="BookLesson">
      <Container1 />
      <Container8 />
    </div>
  );
}

function Container() {
  return (
    <div className="absolute bg-[#1a1d29] content-stretch flex flex-col h-[843.999px] items-start left-[24.88px] overflow-clip rounded-[32px] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.6)] top-[56px] w-[389.998px]" data-name="Container">
      <BookLesson />
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

function Text2() {
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

function Container13() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[18.4px] pt-[7.997px] px-[7.997px] rounded-[16px] size-[37.991px] top-[9px]" data-name="Container">
      <Icon4 />
    </div>
  );
}

function Button56() {
  return (
    <div className="absolute h-[74.996px] left-[8px] top-0 w-[74.797px]" data-name="Button">
      <Text2 />
      <Container13 />
    </div>
  );
}

function Text3() {
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

function Container14() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[18.4px] pt-[7.997px] px-[7.997px] rounded-[16px] size-[37.991px] top-[9px]" data-name="Container">
      <Icon5 />
    </div>
  );
}

function Button57() {
  return (
    <div className="absolute h-[74.996px] left-[82.79px] top-0 w-[74.797px]" data-name="Button">
      <Text3 />
      <Container14 />
    </div>
  );
}

function Text4() {
  return (
    <div className="absolute h-[14.997px] left-[14.06px] top-[50.99px] w-[46.665px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[15px] left-[23.5px] not-italic text-[#5b7ceb] text-[10px] text-center top-[0.27px] tracking-[0.1172px]">Schedule</p>
    </div>
  );
}

function Container15() {
  return <div className="absolute h-[3.993px] left-[13.39px] rounded-[21385400px] top-0 w-[47.999px]" data-name="Container" style={{ backgroundImage: "linear-gradient(175.244deg, rgb(67, 97, 217) 0%, rgb(91, 124, 235) 100%)" }} />;
}

function Icon6() {
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
      <Icon6 />
    </div>
  );
}

function Button58() {
  return (
    <div className="absolute h-[74.996px] left-[157.59px] top-0 w-[74.797px]" data-name="Button">
      <Text4 />
      <Container15 />
      <Container16 />
    </div>
  );
}

function Text5() {
  return (
    <div className="absolute h-[14.997px] left-[26.06px] top-[50.99px] w-[22.665px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-[11.5px] not-italic text-[#a8b3cf] text-[10px] text-center top-[0.27px] tracking-[0.1172px]">Chat</p>
    </div>
  );
}

function Icon7() {
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
      <Icon7 />
    </div>
  );
}

function Button59() {
  return (
    <div className="absolute h-[74.996px] left-[232.39px] top-0 w-[74.797px]" data-name="Button">
      <Text5 />
      <Container17 />
    </div>
  );
}

function Text6() {
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

function Container18() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[18.4px] pt-[7.997px] px-[7.997px] rounded-[16px] size-[37.991px] top-[9px]" data-name="Container">
      <Icon8 />
    </div>
  );
}

function Button60() {
  return (
    <div className="absolute h-[74.996px] left-[307.18px] top-0 w-[74.797px]" data-name="Button">
      <Text6 />
      <Container18 />
    </div>
  );
}

function Container12() {
  return (
    <div className="h-[74.996px] relative shrink-0 w-full" data-name="Container">
      <Button56 />
      <Button57 />
      <Button58 />
      <Button59 />
      <Button60 />
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
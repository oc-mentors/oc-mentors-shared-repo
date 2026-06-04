import svgPaths from "../../imports/svg-698x0hdriu";

export function SubjectIcon({ type, large = false }: { type: string; large?: boolean }) {
  const sizeClass = large ? "w-11 h-11" : "w-8 h-8";
  switch (type) {
    case "chemistry":
      return (
        <svg className={sizeClass} fill="none" viewBox="0 0 32 32">
          <path d={svgPaths.p348d6100} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d="M8.603 19.998H23.393" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d="M11.332 2.666H20.664" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
        </svg>
      );
    case "math":
      return (
        <svg className={sizeClass} fill="none" viewBox="0 0 32 32">
          <path d={svgPaths.pc719df0} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d="M10.665 7.999H21.331" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d="M21.331 18.664V23.998" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d="M21.331 13.332H21.344" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d="M15.998 13.332H16.011" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d="M10.665 13.332H10.679" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d="M15.998 18.664H16.011" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d="M10.665 18.664H10.679" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d="M15.998 23.997H16.011" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d="M10.665 23.997H10.679" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
        </svg>
      );
    case "physics":
      return (
        <svg className={sizeClass} fill="none" viewBox="0 0 32 32">
          <path d={svgPaths.p1e5ad680} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d={svgPaths.p38050500} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d={svgPaths.p17a90e00} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
        </svg>
      );
    case "writing":
      return (
        <svg className={sizeClass} fill="none" viewBox="0 0 32 32">
          <path d={svgPaths.p2dc07680} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d={svgPaths.p3e24f6c0} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d={svgPaths.p30ef680} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d={svgPaths.p1df66f80} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
        </svg>
      );
    case "biology":
      return (
        <svg className={sizeClass} fill="none" viewBox="0 0 32 32">
          <path d={svgPaths.p337b5b80} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d={svgPaths.p38e6cc00} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d={svgPaths.pdbafac0} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d={svgPaths.p2a477d80} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d={svgPaths.p47451c0} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d={svgPaths.p1aeaf500} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d={svgPaths.p7900e20} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d={svgPaths.p2547b00} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d={svgPaths.p33a21180} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d={svgPaths.pda79840} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d={svgPaths.p25382640} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
        </svg>
      );
    case "history":
      return (
        <svg className={sizeClass} fill="none" viewBox="0 0 32 32">
          <path d={svgPaths.p2dc07680} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
          <path d={svgPaths.p3e24f6c0} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.67" />
        </svg>
      );
    default:
      return null;
  }
}

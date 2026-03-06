import { motion } from "motion/react";
import { Clock } from "lucide-react";
import { useRef, useLayoutEffect, useCallback, useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";

// ── Inject webkit scrollbar-hide CSS once ────────────────────────────────────
if (typeof document !== "undefined") {
  const ID = "wheel-picker-styles";
  if (!document.getElementById(ID)) {
    const s = document.createElement("style");
    s.id = ID;
    s.textContent = `.wheel-col::-webkit-scrollbar { display: none; }`;
    document.head.appendChild(s);
  }
}

// ── Utilities ────────────────────────────────────────────────────────────────

export function minutesToTimeString(minutes: number): string {
  const c = Math.max(0, Math.min(1439, minutes));
  const h = Math.floor(c / 60);
  const m = c % 60;
  const ampm = h < 12 ? "AM" : "PM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

export function timeStringToMinutes(t: string): number {
  if (!t) return 23 * 60 + 59;
  const parts = t.trim().split(" ");
  if (parts.length < 2) return 23 * 60 + 59;
  const [hStr, mStr] = parts[0].split(":");
  const ampm = parts[1].toUpperCase();
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr || "0", 10);
  if (ampm === "AM") { if (h === 12) h = 0; }
  else               { if (h !== 12) h += 12; }
  return h * 60 + m;
}

/** Try to parse user-typed time strings like "11:59 PM", "11pm", "2330" */
function parseTypedTime(raw: string): number | null {
  const s = raw.trim().toLowerCase().replace(/\s+/g, "");

  // "11:59pm" or "11:59am"
  const m1 = s.match(/^(\d{1,2}):(\d{2})(am|pm)$/);
  if (m1) {
    let h = parseInt(m1[1]); const m = parseInt(m1[2]); const pm = m1[3] === "pm";
    if (pm && h !== 12) h += 12; if (!pm && h === 12) h = 0;
    if (h >= 0 && h <= 23 && m >= 0 && m <= 59) return h * 60 + m;
  }
  // "1159pm"
  const m2 = s.match(/^(\d{4})(am|pm)$/);
  if (m2) {
    let h = parseInt(m2[1].slice(0, 2)); const m = parseInt(m2[1].slice(2)); const pm = m2[2] === "pm";
    if (pm && h !== 12) h += 12; if (!pm && h === 12) h = 0;
    if (h >= 0 && h <= 23 && m >= 0 && m <= 59) return h * 60 + m;
  }
  // "11pm" or "8am"
  const m3 = s.match(/^(\d{1,2})(am|pm)$/);
  if (m3) {
    let h = parseInt(m3[1]); const pm = m3[2] === "pm";
    if (pm && h !== 12) h += 12; if (!pm && h === 12) h = 0;
    if (h >= 0 && h <= 23) return h * 60;
  }
  // 24h "23:59" or "2359"
  const m4 = s.match(/^(\d{1,2}):(\d{2})$/);
  if (m4) {
    const h = parseInt(m4[1]); const m = parseInt(m4[2]);
    if (h >= 0 && h <= 23 && m >= 0 && m <= 59) return h * 60 + m;
  }
  const m5 = s.match(/^(\d{4})$/);
  if (m5) {
    const h = parseInt(m5[0].slice(0, 2)); const m = parseInt(m5[0].slice(2));
    if (h >= 0 && h <= 23 && m >= 0 && m <= 59) return h * 60 + m;
  }
  return null;
}

// ── Internal helpers ─────────────────────────────────────────────────────────

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const MONTH_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAY_NAMES_SHORT = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const YEARS = [2025, 2026, 2027, 2028, 2029, 2030];

// Pre-compute the month column width once:
//   widest month name (canvas measurement) + 18 px padding on each side.
// 18 px matches the "0 18px" padding applied to every WheelColumn item.
const MONTH_COL_W = (() => {
  if (typeof document === "undefined") return 126;
  const canvas = document.createElement("canvas");
  const ctx    = canvas.getContext("2d");
  if (!ctx) return 126;
  ctx.font     = '500 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const maxW   = Math.max(...MONTH_NAMES.map(m => ctx.measureText(m).width));
  return Math.ceil(maxW) + 18 * 2; // equal padding both sides
})();

// Day column: widest day label ("31") + standard padding + 8 px extra so it sits
// slightly wider than its slot in the combined deadline picker (as requested).
const DAY_COL_W = (() => {
  if (typeof document === "undefined") return 58;
  const canvas = document.createElement("canvas");
  const ctx    = canvas.getContext("2d");
  if (!ctx) return 58;
  ctx.font     = '500 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const maxW   = Math.max(...Array.from({ length: 31 }, (_, i) => ctx.measureText(String(i + 1)).width));
  return Math.ceil(maxW) + 18 * 2 + 8;
})();

// Year column: widest year string + standard padding — matches the deadline picker exactly.
const YEAR_COL_W = (() => {
  if (typeof document === "undefined") return 70;
  const canvas = document.createElement("canvas");
  const ctx    = canvas.getContext("2d");
  if (!ctx) return 70;
  ctx.font     = '500 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const maxW   = Math.max(...YEARS.map(y => ctx.measureText(String(y)).width));
  return Math.ceil(maxW) + 18 * 2;
})();

// ── WheelColumn (internal) ───────────────────────────────────────────────────

const ITEM_H  = 28;  // px per row — compact to minimise dead space
const HALF    = 1;   // rows above/below center
const VISIBLE = 2 * HALF + 1; // 3 visible rows total

// ── Custom smooth-scroll (rAF ease-in-out cubic, cancellable) ───────────────
// Using a WeakMap so each scroll element independently tracks its in-flight animation.
const _activeRafs = new WeakMap<HTMLElement, number>();

function smoothScrollTo(el: HTMLElement, target: number, duration: number): void {
  // Cancel any in-progress animation on this element
  if (_activeRafs.has(el)) cancelAnimationFrame(_activeRafs.get(el)!);

  const start    = el.scrollTop;
  const distance = target - start;
  if (Math.abs(distance) < 1) { _activeRafs.delete(el); return; }

  // Temporarily disable scroll-snap so the browser doesn't hijack the animation
  el.style.scrollSnapType = "none";

  const startTime = performance.now();
  // Ease-in-out cubic
  const ease = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const tick = (now: number) => {
    const progress = Math.min((now - startTime) / duration, 1);
    el.scrollTop   = start + distance * ease(progress);

    if (progress < 1) {
      _activeRafs.set(el, requestAnimationFrame(tick));
    } else {
      el.scrollTop = target; // Snap to exact final position
      el.style.scrollSnapType = "y mandatory"; // Restore scroll-snap
      _activeRafs.delete(el);
    }
  };

  _activeRafs.set(el, requestAnimationFrame(tick));
}

interface WheelColumnProps {
  items: string[];
  initialIndex: number;
  onChange: (index: number) => void;
  flex?: number;
  /** Fixed pixel width — when set takes priority over flex. */
  widthPx?: number;
  align?: "left" | "center" | "right";
  /** When this value changes the column smoothly scrolls to that index. */
  scrollToIndex?: number;
  /** Fires immediately while scrolling whenever the rounded index changes — no debounce. */
  onLiveChange?: (index: number) => void;
}

function WheelColumn({ items, initialIndex, onChange, flex = 1, widthPx, align = "center", scrollToIndex, onLiveChange }: WheelColumnProps) {
  const { colors } = useTheme();
  const outerRef  = useRef<HTMLDivElement>(null);
  const ref       = useRef<HTMLDivElement>(null);
  const timer     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastIdx   = useRef(initialIndex);
  const isMounted      = useRef(false);
  const lastScrollTime = useRef(0);

  // Keep onLiveChange in a ref so handleScroll never stales
  const onLiveChangeRef = useRef(onLiveChange);
  useEffect(() => { onLiveChangeRef.current = onLiveChange; }, [onLiveChange]);
  // Tracks the last index fired via onLiveChange (prevents duplicate fires)
  const liveIdx = useRef(initialIndex);

  // ── Initial scroll position (instant) ────────────────────────────────────
  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = Math.max(0, Math.min(items.length - 1, initialIndex)) * ITEM_H;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── External smooth-scroll via scrollToIndex prop ────────────────────────
  useEffect(() => {
    if (!isMounted.current) { isMounted.current = true; return; }
    if (scrollToIndex === undefined || !ref.current) return;
    const clamped = Math.max(0, Math.min(items.length - 1, scrollToIndex));
    smoothScrollTo(ref.current, clamped * ITEM_H, 380);
    lastIdx.current = clamped;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollToIndex]);

  // ── Scroll handler: live index + debounced final snap ────────────────────
  const handleScroll = useCallback(() => {
    lastScrollTime.current = Date.now();

    // ── Live: fire immediately when the rounded index changes ──────────────
    if (ref.current) {
      const raw     = Math.round(ref.current.scrollTop / ITEM_H);
      const clamped = Math.max(0, Math.min(items.length - 1, raw));
      if (clamped !== liveIdx.current) {
        liveIdx.current = clamped;
        onLiveChangeRef.current?.(clamped);
      }
    }

    // ── Debounced: commit final snapped index after scrolling settles ──────
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (!ref.current) return;
      const idx     = Math.round(ref.current.scrollTop / ITEM_H);
      const clamped = Math.max(0, Math.min(items.length - 1, idx));
      if (clamped !== lastIdx.current) {
        lastIdx.current = clamped;
        onChange(clamped);
      }
    }, 80);
  }, [items.length, onChange]);

  // ── Adjacent-row tap → smooth scroll ─────────────────────────────────────
  const handleClick = useCallback((e: React.MouseEvent) => {
    if (Date.now() - lastScrollTime.current < 200) return;
    if (!outerRef.current || !ref.current) return;

    const rect = outerRef.current.getBoundingClientRect();
    const y    = e.clientY - rect.top;
    const cur  = lastIdx.current;

    let target: number | null = null;
    if (y < ITEM_H)         target = Math.max(0, cur - 1);
    else if (y >= ITEM_H*2) target = Math.min(items.length - 1, cur + 1);

    if (target === null || target === cur) return;

    smoothScrollTo(ref.current, target * ITEM_H, 240);
    lastIdx.current  = target;
    liveIdx.current  = target;
    onChange(target);
  }, [items.length, onChange]);

  const justifyMap = { left: "flex-start", center: "center", right: "flex-end" } as const;

  return (
    <div
      ref={outerRef}
      onClick={handleClick}
      style={{
        position: "relative",
        ...(widthPx !== undefined
          ? { width: widthPx, flexShrink: 0, flexGrow: 0 }
          : { flex }),
        height: ITEM_H * VISIBLE,
        overflow: "hidden",
        cursor: "pointer",
        maskImage: "linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)",
      }}
    >
      {/* Selection band — z:0 so it sits BEHIND the scroll text */}
      <div
        style={{
          position: "absolute",
          top: HALF * ITEM_H,
          left: 0, right: 0,
          height: ITEM_H,
          backgroundColor: colors.bgTertiary,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* Scrollable list — z:1 so text renders ON TOP of the band */}
      <div
        ref={ref}
        className="wheel-col"
        onScroll={handleScroll}
        style={{
          height: "100%",
          overflowY: "scroll",
          scrollSnapType: "y mandatory",
          scrollbarWidth: "none",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ height: HALF * ITEM_H }} />
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              height: ITEM_H,
              scrollSnapAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: justifyMap[align],
              padding: "0 18px",
              fontSize: 15,
              fontWeight: 500,
              color: colors.textPrimary,
              userSelect: "none",
              WebkitUserSelect: "none",
            }}
          >
            {item}
          </div>
        ))}
        <div style={{ height: HALF * ITEM_H }} />
      </div>

      {/* Hairline top/bottom selection borders — z:2, above scroll */}
      <div style={{ position: "absolute", top: HALF * ITEM_H,            left: 8, right: 8, height: 1, backgroundColor: colors.borderPrimary, zIndex: 2, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: (HALF + 1) * ITEM_H - 1, left: 8, right: 8, height: 1, backgroundColor: colors.borderPrimary, zIndex: 2, pointerEvents: "none" }} />
    </div>
  );
}

// ── DateWheelPicker ──────────────────────────────────────────────────────────

interface DateWheelPickerProps {
  value: Date;
  onChange: (d: Date) => void;
  /** When set, dates before this value are excluded from the wheels. */
  minDate?: Date;
}

export function DateWheelPicker({ value, onChange, minDate }: DateWheelPickerProps) {
  const { colors } = useTheme();

  const [year, setYear] = useState(() => {
    const y = YEARS.includes(value.getFullYear()) ? value.getFullYear() : YEARS[0];
    return minDate ? Math.max(y, minDate.getFullYear()) : y;
  });
  const [month, setMonth] = useState(() => {
    const y  = YEARS.includes(value.getFullYear()) ? value.getFullYear() : YEARS[0];
    const cY = minDate ? Math.max(y, minDate.getFullYear()) : y;
    const minM = (minDate && cY === minDate.getFullYear()) ? minDate.getMonth() : 0;
    return Math.max(value.getMonth(), minM);
  });
  const [day, setDay] = useState(() => {
    const y  = YEARS.includes(value.getFullYear()) ? value.getFullYear() : YEARS[0];
    const cY = minDate ? Math.max(y, minDate.getFullYear()) : y;
    const minM = (minDate && cY === minDate.getFullYear()) ? minDate.getMonth() : 0;
    const cM   = Math.max(value.getMonth(), minM);
    const minD = (minDate && cY === minDate.getFullYear() && cM === minDate.getMonth()) ? minDate.getDate() : 1;
    return Math.max(value.getDate(), minD);
  });

  const emit = (m: number, d: number, y: number) => onChange(new Date(y, m, d));

  const validYears      = minDate ? YEARS.filter(y => y >= minDate.getFullYear()) : YEARS;
  const minMonthForYear = (minDate && year === minDate.getFullYear()) ? minDate.getMonth() : 0;
  const monthItems      = MONTH_NAMES.slice(minMonthForYear);
  const monthWheelIdx   = Math.max(0, month - minMonthForYear);
  const minDayForMonth  = (minDate && year === minDate.getFullYear() && month === minDate.getMonth())
    ? minDate.getDate() : 1;
  const maxDayNum       = daysInMonth(year, month);
  const dayItems        = Array.from({ length: maxDayNum - minDayForMonth + 1 }, (_, i) => String(i + minDayForMonth));
  const dayWheelIdx     = Math.max(0, day - minDayForMonth);

  const handleYear = (wheelIdx: number) => {
    const ny       = validYears[wheelIdx];
    const newMinM  = (minDate && ny === minDate.getFullYear()) ? minDate.getMonth() : 0;
    const newMonth = Math.max(month, newMinM);
    const newMinD  = (minDate && ny === minDate.getFullYear() && newMonth === minDate.getMonth()) ? minDate.getDate() : 1;
    const newDay   = Math.min(Math.max(day, newMinD), daysInMonth(ny, newMonth));
    setYear(ny); setMonth(newMonth); setDay(newDay);
    emit(newMonth, newDay, ny);
  };

  const handleMonth = (wheelIdx: number) => {
    const newMonth = wheelIdx + minMonthForYear;
    const newMinD  = (minDate && year === minDate.getFullYear() && newMonth === minDate.getMonth()) ? minDate.getDate() : 1;
    const newDay   = Math.min(Math.max(day, newMinD), daysInMonth(year, newMonth));
    setMonth(newMonth); setDay(newDay);
    emit(newMonth, newDay, year);
  };

  const handleDay = (wheelIdx: number) => {
    const nd = wheelIdx + minDayForMonth;
    setDay(nd);
    emit(month, nd, year);
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        border: `1.5px solid ${colors.borderPrimary}`,
        backgroundColor: colors.bgSecondary,
        width: "fit-content",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <div className="flex" style={{ height: ITEM_H * VISIBLE }}>
        <WheelColumn
          key={`dw-month-${year}`}
          items={monthItems}
          initialIndex={monthWheelIdx}
          onChange={handleMonth}
          widthPx={MONTH_COL_W}
          align="center"
        />
        <div style={{ width: 1, backgroundColor: colors.borderPrimary, alignSelf: "stretch" }} />
        <WheelColumn
          key={`dw-day-${year}-${month}`}
          items={dayItems}
          initialIndex={dayWheelIdx}
          onChange={handleDay}
          widthPx={DAY_COL_W}
          align="center"
        />
        <div style={{ width: 1, backgroundColor: colors.borderPrimary, alignSelf: "stretch" }} />
        <WheelColumn
          key="dw-year"
          items={validYears.map(String)}
          initialIndex={Math.max(0, validYears.indexOf(year))}
          onChange={handleYear}
          widthPx={YEAR_COL_W}
          align="center"
        />
      </div>
    </div>
  );
}

// ── DateTimeWheelPicker ──────────────────────────────────────────────────────
// Combined date + time wheel: Month | Day | Year  |  Hour : Minute | AM/PM

interface DateTimeWheelPickerProps {
  date: Date;
  time: string;
  onDateChange: (d: Date) => void;
  onTimeChange: (t: string) => void;
  minDate?: Date;
}

export function DateTimeWheelPicker({
  date,
  time,
  onDateChange,
  onTimeChange,
  minDate,
}: DateTimeWheelPickerProps) {
  const { colors } = useTheme();

  const [year, setYear] = useState(() => {
    const y = YEARS.includes(date.getFullYear()) ? date.getFullYear() : YEARS[0];
    return minDate ? Math.max(y, minDate.getFullYear()) : y;
  });
  const [month, setMonth] = useState(() => {
    const y  = YEARS.includes(date.getFullYear()) ? date.getFullYear() : YEARS[0];
    const cY = minDate ? Math.max(y, minDate.getFullYear()) : y;
    const minM = (minDate && cY === minDate.getFullYear()) ? minDate.getMonth() : 0;
    return Math.max(date.getMonth(), minM);
  });
  const [day, setDay] = useState(() => {
    const y  = YEARS.includes(date.getFullYear()) ? date.getFullYear() : YEARS[0];
    const cY = minDate ? Math.max(y, minDate.getFullYear()) : y;
    const minM = (minDate && cY === minDate.getFullYear()) ? minDate.getMonth() : 0;
    const cM   = Math.max(date.getMonth(), minM);
    const minD = (minDate && cY === minDate.getFullYear() && cM === minDate.getMonth()) ? minDate.getDate() : 1;
    return Math.max(date.getDate(), minD);
  });

  const initMins = timeStringToMinutes(time);
  const initH24  = Math.floor(initMins / 60);
  const initMin  = initMins % 60;
  const [hour24, setHour24] = useState(initH24);
  const [minute, setMinute] = useState(initMin);
  const lastLiveAmpm = useRef(initH24 >= 12 ? 1 : 0);
  const [ampmScrollTo, setAmpmScrollTo] = useState<number | undefined>(undefined);
  const [hourScrollTo, setHourScrollTo] = useState<number | undefined>(undefined);
  const ampmIdx = hour24 >= 12 ? 1 : 0;

  const HOUR24_ITEMS = [
    "12","1","2","3","4","5","6","7","8","9","10","11",
    "12","1","2","3","4","5","6","7","8","9","10","11",
  ];
  const MINUTE_ITEMS = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
  const AMPM_ITEMS   = ["AM", "PM"];

  const emitDate = (m: number, d: number, y: number) => onDateChange(new Date(y, m, d));
  const emitTime = (h24: number, min: number) => {
    const h12    = h24 % 12 === 0 ? 12 : h24 % 12;
    const period = h24 >= 12 ? "PM" : "AM";
    onTimeChange(`${h12}:${String(min).padStart(2, "0")} ${period}`);
  };

  const validYears      = minDate ? YEARS.filter(y => y >= minDate.getFullYear()) : YEARS;
  const minMonthForYear = (minDate && year === minDate.getFullYear()) ? minDate.getMonth() : 0;
  const monthItems      = MONTH_NAMES.slice(minMonthForYear);
  const monthWheelIdx   = Math.max(0, month - minMonthForYear);
  const minDayForMonth  = (minDate && year === minDate.getFullYear() && month === minDate.getMonth())
    ? minDate.getDate() : 1;
  const maxDayNum       = daysInMonth(year, month);
  const dayItems        = Array.from({ length: maxDayNum - minDayForMonth + 1 }, (_, i) => String(i + minDayForMonth));
  const dayWheelIdx     = Math.max(0, day - minDayForMonth);

  const handleYear = (wheelIdx: number) => {
    const ny       = validYears[wheelIdx];
    const newMinM  = (minDate && ny === minDate.getFullYear()) ? minDate.getMonth() : 0;
    const newMonth = Math.max(month, newMinM);
    const newMinD  = (minDate && ny === minDate.getFullYear() && newMonth === minDate.getMonth()) ? minDate.getDate() : 1;
    const newDay   = Math.min(Math.max(day, newMinD), daysInMonth(ny, newMonth));
    setYear(ny); setMonth(newMonth); setDay(newDay);
    emitDate(newMonth, newDay, ny);
  };
  const handleMonth = (wheelIdx: number) => {
    const newMonth = wheelIdx + minMonthForYear;
    const newMinD  = (minDate && year === minDate.getFullYear() && newMonth === minDate.getMonth()) ? minDate.getDate() : 1;
    const newDay   = Math.min(Math.max(day, newMinD), daysInMonth(year, newMonth));
    setMonth(newMonth); setDay(newDay);
    emitDate(newMonth, newDay, year);
  };
  const handleDay = (wheelIdx: number) => {
    const nd = wheelIdx + minDayForMonth;
    setDay(nd);
    emitDate(month, nd, year);
  };
  const handleHour24 = (newH24: number) => {
    const newAmpm = newH24 >= 12 ? 1 : 0;
    if (newAmpm !== lastLiveAmpm.current) { lastLiveAmpm.current = newAmpm; setAmpmScrollTo(newAmpm); }
    setHour24(newH24);
    emitTime(newH24, minute);
  };
  const handleMinute = (i: number) => { setMinute(i); emitTime(hour24, i); };
  const handleAmPm = (i: number) => {
    const cur = hour24 >= 12 ? 1 : 0;
    if (i === cur) return;
    const newH24 = i === 1 ? hour24 + 12 : hour24 - 12;
    setHour24(newH24); setHourScrollTo(newH24);
    emitTime(newH24, minute);
  };
  const handleHourLive = useCallback((liveH24: number) => {
    const newAmpm = liveH24 >= 12 ? 1 : 0;
    if (newAmpm !== lastLiveAmpm.current) { lastLiveAmpm.current = newAmpm; setAmpmScrollTo(newAmpm); }
  }, []);

  const totalH = ITEM_H * VISIBLE;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: `1.5px solid ${colors.borderPrimary}`, backgroundColor: colors.bgSecondary }}
    >
      <div className="flex" style={{ height: totalH }}>
        {/* ── Month ── */}
        <WheelColumn
          key={`month-col-${year}`}
          items={monthItems}
          initialIndex={monthWheelIdx}
          onChange={handleMonth}
          widthPx={MONTH_COL_W}
          align="center"
        />
        <div style={{ width: 1, backgroundColor: colors.borderPrimary, alignSelf: "stretch" }} />
        {/* ── Day ── */}
        <WheelColumn
          key={`day-col-${year}-${month}`}
          items={dayItems}
          initialIndex={dayWheelIdx}
          onChange={handleDay}
          flex={1}
          align="center"
        />
        <div style={{ width: 1, backgroundColor: colors.borderPrimary, alignSelf: "stretch" }} />
        {/* ── Year ── */}
        <WheelColumn
          key="year-col"
          items={validYears.map(String)}
          initialIndex={Math.max(0, validYears.indexOf(year))}
          onChange={handleYear}
          flex={1.4}
          align="center"
        />
        {/* ── Thick date/time separator ── */}
        <div style={{ width: 1.5, backgroundColor: colors.borderPrimary, alignSelf: "stretch" }} />
        {/* ── Hour ── */}
        <WheelColumn
          key="hour-col"
          items={HOUR24_ITEMS}
          initialIndex={hour24}
          onChange={handleHour24}
          onLiveChange={handleHourLive}
          scrollToIndex={hourScrollTo}
          flex={0.72}
          align="right"
        />
        {/* ── Colon ── */}
        <div style={{ width: 10, height: totalH, flexShrink: 0, position: "relative" }}>
          <div style={{ position: "absolute", top: HALF * ITEM_H, left: 0, right: 0, height: ITEM_H, backgroundColor: colors.bgTertiary, pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: HALF * ITEM_H,           left: 0, right: 0, height: 1, backgroundColor: colors.borderPrimary, zIndex: 2 }} />
          <div style={{ position: "absolute", top: (HALF + 1) * ITEM_H - 1, left: 0, right: 0, height: 1, backgroundColor: colors.borderPrimary, zIndex: 2 }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: colors.textPrimary, userSelect: "none", zIndex: 3 }}>:</div>
        </div>
        {/* ── Minute ── */}
        <WheelColumn
          key="minute-col"
          items={MINUTE_ITEMS}
          initialIndex={minute}
          onChange={handleMinute}
          flex={0.72}
          align="left"
        />
        <div style={{ width: 1, backgroundColor: colors.borderPrimary, alignSelf: "stretch" }} />
        {/* ── AM/PM ── */}
        <WheelColumn
          key="ampm-col"
          items={AMPM_ITEMS}
          initialIndex={ampmIdx}
          onChange={handleAmPm}
          scrollToIndex={ampmScrollTo}
          flex={0.88}
          align="center"
        />
      </div>
    </div>
  );
}

// ── TimeWheelPicker ──────────────────────────────────────────────────────────
// Standalone time-only wheel: Hour : Minute | AM/PM
// Identical behavior to the time half of DateTimeWheelPicker.

interface TimeWheelPickerProps {
  time: string; // e.g. "2:30 PM"
  onChange: (t: string) => void;
}

export function TimeWheelPicker({ time, onChange }: TimeWheelPickerProps) {
  const { colors } = useTheme();

  const initMins = timeStringToMinutes(time);
  const initH24  = Math.floor(initMins / 60);
  const initMin  = initMins % 60;

  const [hour24, setHour24] = useState(initH24);
  const [minute, setMinute] = useState(initMin);

  const lastLiveAmpm = useRef(initH24 >= 12 ? 1 : 0);
  const [ampmScrollTo, setAmpmScrollTo] = useState<number | undefined>(undefined);
  const [hourScrollTo, setHourScrollTo] = useState<number | undefined>(undefined);

  const ampmIdx = hour24 >= 12 ? 1 : 0;

  const HOUR24_ITEMS = [
    "12","1","2","3","4","5","6","7","8","9","10","11",
    "12","1","2","3","4","5","6","7","8","9","10","11",
  ];
  const MINUTE_ITEMS = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
  const AMPM_ITEMS   = ["AM", "PM"];

  const emitTime = (h24: number, min: number) => {
    const h12    = h24 % 12 === 0 ? 12 : h24 % 12;
    const period = h24 >= 12 ? "PM" : "AM";
    onChange(`${h12}:${String(min).padStart(2, "0")} ${period}`);
  };

  const handleHour24 = (newH24: number) => {
    const newAmpm = newH24 >= 12 ? 1 : 0;
    if (newAmpm !== lastLiveAmpm.current) {
      lastLiveAmpm.current = newAmpm;
      setAmpmScrollTo(newAmpm);
    }
    setHour24(newH24);
    emitTime(newH24, minute);
  };

  const handleMinute = (i: number) => { setMinute(i); emitTime(hour24, i); };

  const handleAmPm = (i: number) => {
    const cur = hour24 >= 12 ? 1 : 0;
    if (i === cur) return;
    const newH24 = i === 1 ? hour24 + 12 : hour24 - 12;
    setHour24(newH24);
    setHourScrollTo(newH24);
    emitTime(newH24, minute);
  };

  const handleHourLive = useCallback((liveH24: number) => {
    const newAmpm = liveH24 >= 12 ? 1 : 0;
    if (newAmpm !== lastLiveAmpm.current) {
      lastLiveAmpm.current = newAmpm;
      setAmpmScrollTo(newAmpm);
    }
  }, []);

  const totalH = ITEM_H * VISIBLE;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: `1.5px solid ${colors.borderPrimary}`, backgroundColor: colors.bgSecondary }}
    >
      <div className="flex" style={{ height: totalH }}>
        <WheelColumn
          key="tw-hour"
          items={HOUR24_ITEMS}
          initialIndex={hour24}
          onChange={handleHour24}
          onLiveChange={handleHourLive}
          scrollToIndex={hourScrollTo}
          flex={0.72}
          align="right"
        />
        {/* Colon — lives inside the selection band */}
        <div style={{ width: 10, height: totalH, flexShrink: 0, position: "relative" }}>
          <div style={{ position: "absolute", top: HALF * ITEM_H, left: 0, right: 0, height: ITEM_H, backgroundColor: colors.bgTertiary, pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: HALF * ITEM_H,           left: 0, right: 0, height: 1, backgroundColor: colors.borderPrimary, zIndex: 2 }} />
          <div style={{ position: "absolute", top: (HALF + 1) * ITEM_H - 1, left: 0, right: 0, height: 1, backgroundColor: colors.borderPrimary, zIndex: 2 }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: colors.textPrimary, userSelect: "none", zIndex: 3 }}>:</div>
        </div>
        <WheelColumn
          key="tw-minute"
          items={MINUTE_ITEMS}
          initialIndex={minute}
          onChange={handleMinute}
          flex={0.72}
          align="left"
        />
        <div style={{ width: 1, backgroundColor: colors.borderPrimary, alignSelf: "stretch" }} />
        <WheelColumn
          key="tw-ampm"
          items={AMPM_ITEMS}
          initialIndex={ampmIdx}
          onChange={handleAmPm}
          scrollToIndex={ampmScrollTo}
          flex={0.88}
          align="center"
        />
      </div>
    </div>
  );
}

// ── RangeSlider (internal) ───────────────────────────────────────────────────

interface RangeSliderProps {
  min: number; max: number; step?: number;
  value: number; onChange: (v: number) => void;
  color: string; trackBg: string;
}

function RangeSlider({ min, max, step = 1, value, onChange, color, trackBg }: RangeSliderProps) {
  const pct = max === min ? 0 : ((value - min) / (max - min)) * 100;
  const thumbLeft = `calc(${pct}% - ${(pct / 100) * 22}px)`;

  return (
    <div style={{ position: "relative", height: 38, display: "flex", alignItems: "center" }}>
      <div style={{ position: "absolute", width: "100%", height: 5, borderRadius: 9999, backgroundColor: trackBg }}>
        <div style={{ position: "absolute", height: "100%", width: `${pct}%`, backgroundColor: color, borderRadius: 9999 }} />
      </div>
      <div style={{
        position: "absolute", left: thumbLeft,
        width: 22, height: 22, borderRadius: "50%",
        backgroundColor: color,
        boxShadow: `0 0 0 5px ${color}30, 0 2px 10px rgba(0,0,0,0.35)`,
        pointerEvents: "none",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.7)" }} />
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ position: "absolute", width: "100%", height: "100%", opacity: 0, cursor: "pointer", zIndex: 10, margin: 0, padding: 0 }}
      />
    </div>
  );
}

// ── TimeSlider ───────────────────────────────────────────────────────────────

const TIME_PERIODS = [
  { label: "Late Night", h: [0,  5]  },
  { label: "Morning",    h: [6,  11] },
  { label: "Afternoon",  h: [12, 16] },
  { label: "Evening",    h: [17, 20] },
  { label: "Night",      h: [21, 23] },
];
function getPeriod(minutes: number): string {
  const h = Math.floor(minutes / 60);
  return TIME_PERIODS.find(p => h >= p.h[0] && h <= p.h[1])?.label ?? "Night";
}

interface TimeSliderProps {
  value: string;   // e.g. "11:59 PM"
  onChange: (t: string) => void;
}

export function TimeSlider({ value, onChange }: TimeSliderProps) {
  const { colors, accentColor } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [inputVal, setInputVal] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const minutes = timeStringToMinutes(value);
  const period  = getPeriod(minutes);

  const startEditing = () => {
    setInputVal(value);
    setIsEditing(true);
    setTimeout(() => { inputRef.current?.focus(); inputRef.current?.select(); }, 30);
  };

  const commitEdit = () => {
    const parsed = parseTypedTime(inputVal);
    if (parsed !== null) {
      const rounded = Math.round(parsed / 5) * 5;
      onChange(minutesToTimeString(Math.min(1439, rounded)));
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") { e.preventDefault(); commitEdit(); }
    if (e.key === "Escape") setIsEditing(false);
  };

  const quickTimes = [
    { label: "8 AM",     m: 8 * 60 },
    { label: "12 PM",    m: 12 * 60 },
    { label: "5 PM",     m: 17 * 60 },
    { label: "11:59 PM", m: 23 * 60 + 59 },
  ];

  return (
    <div
      className="rounded-2xl p-4"
      style={{ backgroundColor: colors.bgSecondary, border: `1.5px solid ${colors.borderPrimary}` }}
    >
      {/* Time display / editable */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 flex-1">
          <Clock className="w-4 h-4 flex-shrink-0" style={{ color: colors.textSecondary }} />
          {isEditing ? (
            <input
              ref={inputRef}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={handleKeyDown}
              placeholder="e.g. 11:59 PM"
              className="rounded-lg px-2 py-0.5 outline-none text-[22px] font-bold tabular-nums tracking-tight"
              style={{
                width: 150,
                backgroundColor: colors.bgTertiary,
                border: `1.5px solid ${accentColor.primary}`,
                color: colors.textPrimary,
              }}
            />
          ) : (
            <button
              type="button"
              onClick={startEditing}
              title="Click to type a time"
              className="text-[22px] font-bold tabular-nums tracking-tight rounded-lg px-2 py-0.5 transition-colors"
              style={{
                color: colors.textPrimary,
                backgroundColor: "transparent",
              }}
            >
              {value}
            </button>
          )}
        </div>
        <span
          className="px-2.5 py-1 rounded-lg text-[11px] font-bold ml-2 flex-shrink-0"
          style={{ backgroundColor: colors.bgTertiary, color: colors.textSecondary }}
        >
          {period}
        </span>
      </div>

      {/* Slider — 5-minute steps, 0–1439 */}
      <RangeSlider
        min={0} max={1439} step={5}
        value={minutes}
        onChange={(v) => onChange(minutesToTimeString(v))}
        color={accentColor.primary}
        trackBg={colors.borderPrimary}
      />

      {/* Edge labels */}
      <div className="flex justify-between mt-1 mb-3">
        <span className="text-[11px] font-semibold" style={{ color: colors.textSecondary }}>12:00 AM</span>
        <span className="text-[11px] font-semibold" style={{ color: colors.textSecondary }}>11:59 PM</span>
      </div>

      {/* Quick-jump pills */}
      <div className="flex gap-2">
        {quickTimes.map((q) => {
          const active = minutes === q.m;
          return (
            <motion.button
              key={q.label}
              type="button"
              whileTap={{ scale: 0.88 }}
              onClick={() => onChange(minutesToTimeString(q.m))}
              className="flex-1 py-1.5 rounded-xl text-[11px] font-bold transition-colors"
              style={{
                backgroundColor: active ? accentColor.primary : colors.bgTertiary,
                color: active ? "white" : colors.textSecondary,
                border: `1px solid ${active ? accentColor.primary : colors.borderPrimary}`,
              }}
            >
              {q.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}